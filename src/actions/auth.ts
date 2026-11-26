"use server";

import prisma from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";
import { getClientIp } from "@/lib/client-ip";

export async function loginAdmin(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/admin";

  if (!email || !password) {
    return { success: false, error: "E-posta ve şifre gerekli." };
  }

  // Brute-force koruması: aynı IP'den kısa sürede çok fazla giriş denemesi.
  const ip = getClientIp(await headers());
  const limited = await rateLimit(`admin-login:${ip}`, 8, 600);
  if (!limited.success) {
    await logSecurityEvent("security_rate_limited", { route: "/admin/login", ip, metadata: { email } });
    return { success: false, error: "Çok fazla giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  const member = await prisma.teamMember.findFirst({
    where: { email: { equals: email, mode: "insensitive" }, adminRole: { not: null } },
  });

  if (!member || !member.passwordHash) {
    await logSecurityEvent("security_login_failed", { route: "/admin/login", ip, metadata: { email } });
    return { success: false, error: "E-posta veya şifre hatalı." };
  }

  const valid = await verifyPassword(password, member.passwordHash);
  if (!valid) {
    await logSecurityEvent("security_login_failed", { route: "/admin/login", ip, metadata: { email } });
    return { success: false, error: "E-posta veya şifre hatalı." };
  }

  const token = await createSessionToken({
    teamMemberId: member.id,
    name: member.name,
    adminRole: member.adminRole!,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
