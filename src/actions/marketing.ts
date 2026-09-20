"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export interface MarketingConfig {
  trackingEnabled: boolean;
  metaPixelId?: string;
  metaCapiToken?: string;
  gaMeasurementId?: string;
  gaApiSecret?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
}

export async function getMarketingSettings(): Promise<MarketingConfig> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
    select: { marketingConfig: true },
  });

  const config = (settings?.marketingConfig as any) || {};
  return {
    trackingEnabled: Boolean(config.trackingEnabled),
    metaPixelId: config.metaPixelId || "",
    metaCapiToken: config.metaCapiToken || "",
    gaMeasurementId: config.gaMeasurementId || "",
    gaApiSecret: config.gaApiSecret || "",
    googleAdsConversionId: config.googleAdsConversionId || "",
    googleAdsConversionLabel: config.googleAdsConversionLabel || "",
  };
}

export async function updateMarketingSettings(config: MarketingConfig) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        marketingConfig: config as any,
      },
      create: {
        id: "global",
        marketingConfig: config as any,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_MARKETING_SETTINGS",
        adminUser: "Admin",
        details: {
          trackingEnabled: config.trackingEnabled,
          hasMetaCapi: Boolean(config.metaCapiToken),
          hasGA4: Boolean(config.gaMeasurementId),
        },
      },
    }).catch(() => null);

    updateTag("site-settings");
    revalidatePath("/admin/marketing");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating marketing settings:", error);
    return { success: false, error: "Ayarlar kaydedilirken hata oluştu." };
  }
}

export async function getMarketingEventMetrics() {
  const [
    totalEvents,
    whatsappClicks,
    phoneCalls,
    wizardCompletes,
    recentEvents,
  ] = await Promise.all([
    prisma.eventLog.count(),
    prisma.eventLog.count({ where: { eventName: "whatsapp_click" } }),
    prisma.eventLog.count({ where: { eventName: "phone_call" } }),
    prisma.eventLog.count({ where: { eventName: "grant_wizard_complete" } }),
    prisma.eventLog.findMany({
      take: 25,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    totalEvents,
    whatsappClicks,
    phoneCalls,
    wizardCompletes,
    recentEvents,
  };
}
