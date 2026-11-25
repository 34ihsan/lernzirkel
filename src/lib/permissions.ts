import prisma from "@/lib/prisma";
import { requireAdminSession, getAdminSession } from "@/lib/auth-server";
import type { SessionPayload } from "@/lib/auth";

export type PermissionArea = "pages" | "news" | "courses" | "team" | "gallery" | "projects" | "design";

export interface AreaPermission {
  view?: boolean;
  edit?: boolean;
}

export type PermissionsJson = Partial<Record<PermissionArea, AreaPermission>> & {
  depotDownload?: boolean;
  depotUpload?: boolean;
};

export class PermissionError extends Error {
  constructor(area: PermissionArea, action: "view" | "edit") {
    super(`Bu işlem için yetkiniz yok: ${area} (${action}).`);
  }
}

// ADMIN rolü her zaman her şeyi yapabilir — checkbox'lar ne derse desin (yanlışlıkla
// kendini kilitlememesi için de bu bypass gerekli). Diğer roller için: permissions
// hiç ayarlanmamışsa (null, eski kayıtlar) veya bu alan hiç belirtilmemişse varsayılan
// olarak İZİN VERİLİR — var olan davranışı aniden kısıtlamamak için (bkz. Depo'daki
// aynı felsefe, requireDepotAccess).
export async function requireAreaPermission(
  area: PermissionArea,
  action: "view" | "edit" = "edit"
): Promise<SessionPayload> {
  const session = await requireAdminSession();

  if (session.adminRole === "ADMIN") return session;

  const member = await prisma.teamMember.findUnique({
    where: { id: session.teamMemberId },
    select: { permissions: true },
  });

  const permissions = member?.permissions as PermissionsJson | null;
  if (!permissions) return session;

  const areaPerm = permissions[area];
  if (areaPerm === undefined) return session;

  // edit yetkisi view yetkisini de kapsar (bir şeyi düzenleyebilen zaten görebilir de)
  const allowed = action === "view" ? areaPerm.view !== false || areaPerm.edit === true : areaPerm.edit === true;

  if (!allowed) {
    throw new PermissionError(area, action);
  }

  return session;
}

// Server Component'lerde (sayfa yetki kontrolü) kullanılır — throw etmez, sonucu döner.
export async function getAreaAccess(area: PermissionArea): Promise<{ canView: boolean; canEdit: boolean; session: SessionPayload | null }> {
  const session = await getAdminSession();
  if (!session) return { canView: false, canEdit: false, session: null };

  if (session.adminRole === "ADMIN") return { canView: true, canEdit: true, session };

  const member = await prisma.teamMember.findUnique({
    where: { id: session.teamMemberId },
    select: { permissions: true },
  });
  const permissions = member?.permissions as PermissionsJson | null;
  if (!permissions) return { canView: true, canEdit: true, session };

  const areaPerm = permissions[area];
  if (areaPerm === undefined) return { canView: true, canEdit: true, session };

  const canEdit = areaPerm.edit === true;
  const canView = areaPerm.view !== false || canEdit;
  return { canView, canEdit, session };
}

export const MODEL_TO_AREA: Record<string, PermissionArea> = {
  Course: "courses",
  Project: "projects",
  News: "news",
  TeamMember: "team",
  GalleryMedia: "gallery",
};
