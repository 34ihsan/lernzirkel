import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-server";
import type { SessionPayload } from "@/lib/auth";

export class DepotPermissionError extends Error {
  constructor(action: "upload" | "download") {
    super(action === "upload" ? "Depo'ya yükleme yetkiniz yok." : "Depo'dan indirme yetkiniz yok.");
  }
}

// Depo'ya giriş admin oturumunun kendisidir — ayrı bir şifre yok. `permissions.depotUpload`/
// `depotDownload` henüz hiç ayarlanmamışsa (eski kayıtlar, permissions: null) varsayılan
// olarak İZİN VERİLİR; admin bu alanı TeamMemberForm'dan açıkça false yaparsa kısıtlanır.
export async function requireDepotAccess(action: "upload" | "download" = "download"): Promise<SessionPayload> {
  const session = await requireAdminSession();

  const member = await prisma.teamMember.findUnique({
    where: { id: session.teamMemberId },
    select: { permissions: true },
  });

  const permissions = member?.permissions as Record<string, boolean> | null;
  const key = action === "upload" ? "depotUpload" : "depotDownload";

  if (permissions && permissions[key] === false) {
    throw new DepotPermissionError(action);
  }

  return session;
}
