"use server";

import { requireAdminSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { bulkTranslateSiteContent, type BulkTranslateResult } from "@/lib/bulk-translate-site";

export interface TranslateSiteSummary {
  totalCreated: number;
  byModel: Record<string, number>;
  details: BulkTranslateResult[];
}

/**
 * "Sana söyleyeceğim, o zaman tüm siteyi A'dan Z'ye çevireceksin" — bu, o andaki tetikleyici.
 * Her Course/Project/News/Article/Page kaydı için eksik dildeki çeviriyi AI ile üretip
 * `reviewed: false` olarak kaydeder; zaten çevrilmiş olanlara dokunmaz. Section içeriği ve
 * Announcement JSON çevirileri ayrı akışlarla ele alınır (bkz. src/lib/bulk-translate-site.ts).
 */
export async function translateSiteContent(targetLanguages?: string[]): Promise<
  { success: true; summary: TranslateSiteSummary } | { success: false; error: string }
> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const details = await bulkTranslateSiteContent(targetLanguages);

    const byModel: Record<string, number> = {};
    let totalCreated = 0;
    for (const d of details) {
      byModel[d.model] = (byModel[d.model] || 0) + d.createdLanguages.length;
      totalCreated += d.createdLanguages.length;
    }

    revalidatePath("/", "layout");

    return { success: true, summary: { totalCreated, byModel, details } };
  } catch (error) {
    console.error("translateSiteContent error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Toplu çeviri başarısız: ${message}` };
  }
}
