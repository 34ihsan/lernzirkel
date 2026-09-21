"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { AIConfig, DEFAULT_KNOWLEDGE_TOPICS } from "@/lib/ai-config";

export type { AIConfig, KnowledgeTopic } from "@/lib/ai-config";

export async function getAISettings(): Promise<AIConfig> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
    select: { aiConfig: true },
  });

  const config = (settings?.aiConfig as any) || {};
  return {
    aiEnabled: config.aiEnabled ?? true,
    provider: config.provider || "builtin",
    apiKey: config.apiKey || "",
    model: config.model || "gemini-1.5-flash",
    customInstructions: config.customInstructions || "",
    allowedLanguages: config.allowedLanguages || ["de", "tr", "ar", "en"],
    knowledgeTopics: Array.isArray(config.knowledgeTopics) && config.knowledgeTopics.length > 0
      ? config.knowledgeTopics
      : DEFAULT_KNOWLEDGE_TOPICS,
  };
}

export async function updateAISettings(config: AIConfig) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        aiConfig: config as any,
      },
      create: {
        id: "global",
        aiConfig: config as any,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_AI_SETTINGS",
        adminUser: "Admin",
        details: {
          aiEnabled: config.aiEnabled,
          provider: config.provider,
          topicsCount: config.knowledgeTopics?.length || 0,
          hasCustomInstructions: Boolean(config.customInstructions),
        },
      },
    }).catch(() => null);

    updateTag("site-settings");
    revalidatePath("/admin/ai-settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating AI settings:", error);
    return { success: false, error: "AI ayarları kaydedilirken hata oluştu." };
  }
}
