"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/admin";

  if (!email || !password) {
    return { success: false, error: "E-posta ve şifre gerekli." };
  }

  const member = await prisma.teamMember.findFirst({
    where: { email: { equals: email, mode: "insensitive" }, adminRole: { not: null } },
  });

  if (!member || !member.passwordHash) {
    return { success: false, error: "E-posta veya şifre hatalı." };
  }

  const valid = await verifyPassword(password, member.passwordHash);
  if (!valid) {
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
