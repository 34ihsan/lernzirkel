"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-server";

interface PageSeoInput {
  title: string;
  slug: string;
  parentTitle?: string | null;
  sections: { type: string; content: unknown }[];
}

// Google SERP'te güvenli kesme noktaları (piksel genişliğine göre değişir ama bu, karakter
// bazlı pratik bir üst sınırdır). Model talimatlara uymasa bile çıktı bu sınırları aşamaz.
const TITLE_HARD_MAX = 60;
const DESCRIPTION_HARD_MAX = 160;

function softTruncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length)}…`;
}

// Sayfanın bölüm tiplerine bakarak "dönüşüm odaklı" (form/fiyat/CTA içeren) mı yoksa
// "bilgilendirici" (SSS, metin, zaman çizelgesi) mi olduğunu belirler — ton kuralı buna göre uyarlanır.
const CONVERSION_SECTION_TYPES = new Set(["FORM", "PRICING", "BANNER"]);

export async function generatePageSeo(input: PageSeoInput) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  const settings = await prisma.siteSettings.findFirst();
  const aiConfig = (settings?.aiConfig as any) || {};
  if (!aiConfig.apiKey || aiConfig.provider !== "gemini") {
    return {
      success: false as const,
      error: "AI henüz yapılandırılmamış. /admin/ai-settings üzerinden bir Gemini API anahtarı ekleyin.",
    };
  }

  // Bölümlerin ham içerik JSON'u modele veriliyor — 17 bölüm tipinin her birinin alan
  // adlarını tek tek eşlemek yerine, Gemini'nin JSON'dan anlamlı metni kendisi çıkarmasına
  // güveniliyor (yeni bölüm tipleri eklendiğinde bu fonksiyonun güncellenmesine gerek kalmaz).
  const rawContent = JSON.stringify(input.sections.map((s) => ({ type: s.type, content: s.content }))).slice(
    0,
    8000
  );

  const isConversionPage = input.sections.some((s) => CONVERSION_SECTION_TYPES.has(s.type));
  const pagePathHint = input.parentTitle
    ? `${input.parentTitle} > ${input.title} (URL: /${input.slug})`
    : `${input.title} (URL: /${input.slug})`;

  try {
    const google = createGoogleGenerativeAI({ apiKey: aiConfig.apiKey });
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      system: `Sen, Lernzirkel Ludwigshafen e.V. (Almanya'da eğitim, danışmanlık ve entegrasyon projeleri yürüten bir dernek) web sitesi için çalışan, teknik SEO kurallarını harfiyen uygulayan bir SEO uzmanısın.

GİRDİ: Sana bir sayfanın başlığı, URL yolu (ve varsa üst sayfası) ile bölümlerinin ham JSON içeriği verilecek. Bu JSON bir sayfa oluşturucunun veri yapısıdır; içindeki url, renk kodu, ikon adı gibi teknik/stil alanlarını yoksay, sadece gerçek metinlere (başlık, açıklama, madde listeleri, SSS vb.) odaklan.

GÖREV: Bu sayfaya özel, Almanca (DE) bir SEO meta başlığı (metaTitle) ve meta açıklaması (metaDescription) üret.

META BAŞLIK (metaTitle) KURALLARI:
1. Uzunluk: 40-${TITLE_HARD_MAX} karakter arası (Google SERP'te kesilmesini önlemek için ${TITLE_HARD_MAX}'ı ASLA aşma).
2. Sayfanın ana konusunu/anahtar kelimesini başlığın BAŞINA yakın yerleştir, sona anlamsız doldurma ekleme.
3. Ana sayfa değilse ve yer varsa, başlığın sonuna " | Lernzirkel Ludwigshafen" ekleyerek marka tanınırlığı sağla — karakter sınırını aşacaksa marka ekini çıkar.
4. BÜYÜK HARFLE YAZMA, tırnak işareti veya özel karakter kullanma, tıklama avlama (clickbait) yapma — başlık sayfanın gerçek içeriğini dürüstçe yansıtmalı.
5. Sayfa URL yolundaki segmentler (örn. "/deutsch-grundbildung/privatkurse") konunun ne olduğuna dair güçlü bir ipucudur, bunu dikkate al.

META AÇIKLAMA (metaDescription) KURALLARI:
1. Uzunluk: 120-${DESCRIPTION_HARD_MAX} karakter arası, bu aralığın ORTASINI (yaklaşık 150) hedefle.
2. Sayfanın SOMUT ve KENDİNE ÖZGÜ içeriğini özetle (örn. hangi kurs, hangi hedef grup, hangi süre/şart) — jenerik, her sayfada aynı kalabilecek kalıp cümleler YASAK. Özellikle şu kalıbı asla üretme: "{başlık} - Lernzirkel Ludwigshafen e.V. Eğitim, danışmanlık ve entegrasyon projelerimizle yanınızdayız." (bu, sistemdeki eski otomatik yedek metindir, senden farklı ve içerik-özel bir metin bekleniyor).
3. ${isConversionPage ? "Bu sayfa bir form, fiyatlandırma veya banner bölümü içeriyor — yani dönüşüm odaklı bir sayfa. Açıklamanın sonuna doğal bir harekete geçirme ifadesi ekle (örn. 'Jetzt informieren und anmelden.', 'Kostenlos beraten lassen.')." : "Bu sayfa ağırlıklı olarak bilgilendirici içerik barındırıyor (SSS, metin, zaman çizelgesi vb.) — sert bir satış/CTA dili kullanma, net ve açıklayıcı bir ton tercih et."}
4. Başlıkta (metaTitle) zaten geçen kelimeleri birebir tekrar etme; başlık ve açıklama birbirini TAMAMLASIN.
5. Emoji, tırnak içinde slogan, veya HTML/özel karakter kullanma.

GENEL TON: Kurumsal, profesyonel, sıcak ve güven veren — yapay zeka tarafından yazıldığı belli olan şablon cümlelerden kaçın. Resmi "Sie" hitabına uygun yazım kurallarını izle.`,
      prompt: `Sayfa: ${pagePathHint}\n\nBölüm İçerikleri (ham JSON):\n${rawContent}`,
      schema: z.object({
        metaTitle: z.string().describe(`SEO meta başlığı, 40-${TITLE_HARD_MAX} karakter arası, Almanca.`),
        metaDescription: z
          .string()
          .describe(`SEO meta açıklaması, 120-${DESCRIPTION_HARD_MAX} karakter arası, Almanca, sayfaya özgü somut bilgi içermeli.`),
      }),
    });

    return {
      success: true as const,
      metaTitle: softTruncate(result.object.metaTitle.trim(), TITLE_HARD_MAX),
      metaDescription: softTruncate(result.object.metaDescription.trim(), DESCRIPTION_HARD_MAX),
    };
  } catch (error) {
    console.error("AI SEO generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `AI isteği başarısız oldu: ${message}` };
  }
}
