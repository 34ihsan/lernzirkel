"use server";

import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { requireDepotAccess } from "@/lib/depot-auth";
import { getDepotDir } from "@/lib/depot-storage";

export async function listDepotDocuments() {
  await requireDepotAccess("download");
  return prisma.depotDocument.findMany({ orderBy: { createdAt: "desc" } });
}

export async function deleteDepotDocument(id: string) {
  try {
    await requireDepotAccess("upload");
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Yetkisiz işlem" };
  }

  try {
    const doc = await prisma.depotDocument.findUnique({ where: { id } });
    if (!doc) {
      return { success: false as const, error: "Doküman bulunamadı." };
    }

    await prisma.depotDocument.delete({ where: { id } });
    await unlink(join(getDepotDir(), doc.storedFileName)).catch(() => {
      // Dosya diskte yoksa (örn. elle silinmiş) DB kaydının silinmesini engellemeyelim.
    });

    revalidatePath("/admin/depo");
    return { success: true as const };
  } catch (error) {
    console.error("deleteDepotDocument error:", error);
    return { success: false as const, error: "Doküman silinemedi." };
  }
}
