"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export interface RetentionConfig {
  retentionDays: number;
  autoPurgeEnabled: boolean;
}

export async function getRetentionConfig(): Promise<RetentionConfig> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
    select: { securityConfig: true },
  });

  const sec = (settings?.securityConfig as any) || {};
  return {
    retentionDays: sec.retentionDays || 60,
    autoPurgeEnabled: sec.autoPurgeEnabled ?? true,
  };
}

export async function updateRetentionConfig(config: RetentionConfig) {
  try {
    const existing = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { securityConfig: true },
    });

    const currentSec = (existing?.securityConfig as any) || {};

    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        securityConfig: { ...currentSec, ...config },
      },
      create: {
        id: "global",
        securityConfig: config as any,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_RETENTION_POLICY",
        adminUser: "Admin",
        details: {
          retentionDays: config.retentionDays,
          autoPurgeEnabled: config.autoPurgeEnabled,
        },
      },
    }).catch(() => null);

    revalidatePath("/admin/applications");
    revalidatePath("/admin/system-health");
    return { success: true };
  } catch (error) {
    console.error("Error updating retention config:", error);
    return { success: false, error: "Ayarlar kaydedilemedi." };
  }
}

/**
 * Purges a single application and deletes its physical file from server disk.
 * Compliance: DSGVO Art. 17 (Recht auf Vergessenwerden / Löschung)
 */
export async function purgeSingleApplication(id: string) {
  try {
    const lead = await prisma.leadApplication.findUnique({
      where: { id },
    });

    if (!lead) {
      return { success: false, error: "Başvuru bulunamadı." };
    }

    // 1. Delete physical file if present
    if (lead.fileUrl && lead.fileUrl.startsWith("/uploads/documents/")) {
      const relativePath = lead.fileUrl.replace("/uploads/documents/", "");
      const fullPath = path.join(process.cwd(), "public", "uploads", "documents", relativePath);
      try {
        await unlink(fullPath);
      } catch (err: any) {
        // If file was already deleted or missing, log and proceed
        console.warn("File unlink warning (could be already deleted):", err.message);
      }
    }

    // 2. Anonymize/Purge database record
    await prisma.leadApplication.update({
      where: { id },
      data: {
        name: "[DSGVO GEREĞİ İMHA EDİLDİ]",
        email: "geloescht@dsgvo-archiv.de",
        phone: null,
        message: null,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        isPurged: true,
        purgedAt: new Date(),
        status: "REJECTED", // or CLOSED
        adminNote: `DSGVO uyarınca ${new Date().toLocaleDateString("de-DE")} tarihinde kişisel veriler ve dosya kalıcı olarak silindi.`,
      },
    });

    // 3. Audit Log
    await prisma.auditLog.create({
      data: {
        action: "DSGVO_APPLICATION_PURGED",
        adminUser: "Admin",
        details: {
          leadId: id,
          actionType: "RIGHT_TO_ERASURE_ART_17",
        },
      },
    });

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error: any) {
    console.error("Error purging single application:", error);
    return { success: false, error: error.message || "İmha işlemi başarısız oldu." };
  }
}

/**
 * Finds and purges all applications whose retention period has expired.
 * Automatically called via Cron or triggered by Admin in dashboard.
 */
export async function purgeExpiredApplications(daysOverride?: number) {
  try {
    const config = await getRetentionConfig();
    const days = daysOverride || config.retentionDays || 60;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Find all expired, unpurged applications
    const expiredLeads = await prisma.leadApplication.findMany({
      where: {
        isPurged: false,
        createdAt: { lt: cutoffDate },
      },
    });

    let purgedCount = 0;

    for (const lead of expiredLeads) {
      // 1. Delete physical file
      if (lead.fileUrl && lead.fileUrl.startsWith("/uploads/documents/")) {
        const relativePath = lead.fileUrl.replace("/uploads/documents/", "");
        const fullPath = path.join(process.cwd(), "public", "uploads", "documents", relativePath);
        try {
          await unlink(fullPath);
        } catch (e) {
          // File might already be gone
        }
      }

      // 2. Anonymize DB row
      await prisma.leadApplication.update({
        where: { id: lead.id },
        data: {
          name: "[DSGVO SÜRE AŞIMI İMHA EDİLDİ]",
          email: "abgelaufen@dsgvo-archiv.de",
          phone: null,
          message: null,
          fileUrl: null,
          fileName: null,
          fileSize: null,
          isPurged: true,
          purgedAt: new Date(),
          adminNote: `${days} günlük yasal saklama süresi dolduğu için ${new Date().toLocaleDateString("de-DE")} tarihinde otomatik imha edildi.`,
        },
      });

      purgedCount++;
    }

    if (purgedCount > 0) {
      await prisma.auditLog.create({
        data: {
          action: "DSGVO_BATCH_PURGE",
          adminUser: "System / Admin",
          details: {
            purgedCount,
            retentionDays: days,
            cutoffDate: cutoffDate.toISOString(),
          },
        },
      });
    }

    revalidatePath("/admin/applications");
    return { success: true, purgedCount };
  } catch (error: any) {
    console.error("Batch purge error:", error);
    return { success: false, error: error.message };
  }
}
