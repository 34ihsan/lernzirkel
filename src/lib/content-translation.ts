import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

const SOURCE_LANGUAGE = "de";

// Almanca dışındaki tüm desteklenen diller — ru/uk/prs eklendiğinde buraya dokunmaya
// gerek yok, SUPPORTED_LANGUAGES'tan otomatik türetiliyor.
export function defaultTargetLanguages(): string[] {
  return SUPPORTED_LANGUAGES.map((l) => l.code).filter((c) => c !== SOURCE_LANGUAGE);
}

async function getGeminiClient() {
  const settings = await prisma.siteSettings.findFirst();
  const aiConfig = (settings?.aiConfig as any) || {};
  if (!aiConfig.apiKey || aiConfig.provider !== "gemini") return null;
  return createGoogleGenerativeAI({ apiKey: aiConfig.apiKey });
}

/**
 * Alan adı -> Almanca metin haritasını, hedef dillerin her birine çevirir.
 * Dönüş: { [languageCode]: { [fieldName]: translatedText } }
 */
export async function translateFields(
  fields: Record<string, string | null | undefined>,
  targetLanguages: string[]
): Promise<Record<string, Record<string, string>> | null> {
  const validFields = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim().length > 0)
  );
  if (Object.keys(validFields).length === 0 || targetLanguages.length === 0) return null;

  const google = await getGeminiClient();
  if (!google) return null;

  try {
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      system: `You are a professional multi-language translator. You will receive a JSON object containing text or HTML content in German.
      Your task is to translate ALL the fields in the object into the requested target languages.

      CRITICAL RULES:
      1. Preserve ALL HTML tags, attributes, and structure exactly as they are. ONLY translate the text content between tags.
      2. Keep names, specific locations (e.g. Ludwigshafen), and brand names unchanged.
      3. Ensure professional, culturally appropriate translations.
      4. Return a JSON where the root keys are the target language codes (e.g., 'en', 'tr', 'ar'), and the values are objects with the exact same keys as the input fields, but translated.`,
      prompt: `Target Languages: ${targetLanguages.join(", ")}\n\nFields to translate:\n${JSON.stringify(validFields, null, 2)}`,
      schema: z.record(z.string(), z.record(z.string(), z.string())),
    });

    return result.object as Record<string, Record<string, string>>;
  } catch (error) {
    console.error("[content-translation] translateFields failed:", error);
    return null;
  }
}

/**
 * Bir kaydın (Course/Project/News/Page/Article/Section) eksik dillerini, ilgili
 * *Translation tablosuna, AI ile üretip `reviewed: false` olarak yazar. Zaten var olan
 * bir dil satırına ASLA dokunmaz — "bir kere çevrilsin ve öyle devam etsin" kuralı budur;
 * admin elle düzenlediyse veya daha önce üretildiyse üzerine yazılmaz.
 */
export async function ensureTranslationsForRecord(opts: {
  delegate: { create: (args: any) => Promise<any> };
  foreignKeyField: string; // örn. 'courseId'
  recordId: string;
  sourceFields: Record<string, string | null | undefined>;
  existingLanguages: string[];
  targetLanguages?: string[];
}): Promise<{ created: string[] }> {
  const targetLanguages = opts.targetLanguages ?? defaultTargetLanguages();
  const missing = targetLanguages.filter((l) => !opts.existingLanguages.includes(l));
  if (missing.length === 0) return { created: [] };

  const translated = await translateFields(opts.sourceFields, missing);
  if (!translated) return { created: [] };

  const created: string[] = [];
  for (const lang of missing) {
    const fields = translated[lang];
    if (!fields) continue;
    try {
      await opts.delegate.create({
        data: {
          [opts.foreignKeyField]: opts.recordId,
          language: lang,
          reviewed: false,
          ...fields,
        },
      });
      created.push(lang);
    } catch (error) {
      console.error(`[content-translation] failed to persist '${lang}' for ${opts.recordId}:`, error);
    }
  }
  return { created };
}

