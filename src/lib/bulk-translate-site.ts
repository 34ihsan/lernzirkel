import prisma from "@/lib/prisma";
import { ensureTranslationsForRecord, defaultTargetLanguages } from "@/lib/content-translation";

export interface BulkTranslateResult {
  model: string;
  recordId: string;
  createdLanguages: string[];
}

/**
 * Sitedeki Almanca ana içeriği, eksik olan her dile AI ile çevirip ilgili *Translation
 * tablosuna (veya Announcement'ta Json alanına) yazar. Zaten bir dil için satır/giriş
 * varsa ona dokunulmaz — "bir kere çevrilsin, öyle kalsın" kuralı.
 *
 * NOT: Section (sayfa oluşturucu bölüm) içeriği kasıtlı olarak kapsam dışı — section
 * tipine göre serbest biçimli JSON olduğundan körlemesine AI çevirisi yapıyı bozabilir.
 *
 * NOT: Announcement burada YOK — o modelin kendi, tamamen ayrı ve zaten çalışan bir
 * çeviri hattı var: `createAnnouncement`/`updateAnnouncement` (src/actions/admin.ts)
 * her kayıtta MyMemory API ile otomatik çeviri üretip `translations` Json alanına yazıyor,
 * `AnnouncementBanner.tsx` da `useLanguage()` ile bunu anında (cookie/SSR gerekmeden)
 * okuyup gösteriyor — tam uçtan uca çalışan tek içerik tipi bu. Burada tekrar ele almak
 * iki ayrı sistemi çatıştırır.
 */
export async function bulkTranslateSiteContent(targetLanguages?: string[]): Promise<BulkTranslateResult[]> {
  const langs = targetLanguages && targetLanguages.length > 0 ? targetLanguages : defaultTargetLanguages();
  const results: BulkTranslateResult[] = [];

  const courses = await prisma.course.findMany({ include: { translations: true } });
  for (const c of courses) {
    const { created } = await ensureTranslationsForRecord({
      delegate: prisma.courseTranslation,
      foreignKeyField: "courseId",
      recordId: c.id,
      sourceFields: {
        title: c.title,
        description: c.description,
        targetAudience: c.targetAudience,
        requirements: c.requirements,
        costsInfo: c.costsInfo,
      },
      existingLanguages: c.translations.map((t) => t.language),
      targetLanguages: langs,
    });
    if (created.length) results.push({ model: "Course", recordId: c.id, createdLanguages: created });
  }

  const projects = await prisma.project.findMany({ include: { translations: true } });
  for (const p of projects) {
    const { created } = await ensureTranslationsForRecord({
      delegate: prisma.projectTranslation,
      foreignKeyField: "projectId",
      recordId: p.id,
      sourceFields: {
        title: p.title,
        description: p.description,
        goals: p.goals,
        targetGroup: p.targetGroup,
        results: p.results,
        actionText: p.actionText,
      },
      existingLanguages: p.translations.map((t) => t.language),
      targetLanguages: langs,
    });
    if (created.length) results.push({ model: "Project", recordId: p.id, createdLanguages: created });
  }

  const newsItems = await prisma.news.findMany({ include: { translations: true } });
  for (const n of newsItems) {
    const { created } = await ensureTranslationsForRecord({
      delegate: prisma.newsTranslation,
      foreignKeyField: "newsId",
      recordId: n.id,
      sourceFields: { title: n.title, content: n.content },
      existingLanguages: n.translations.map((t) => t.language),
      targetLanguages: langs,
    });
    if (created.length) results.push({ model: "News", recordId: n.id, createdLanguages: created });
  }

  const articles = await prisma.article.findMany({ include: { translations: true } });
  for (const a of articles) {
    const { created } = await ensureTranslationsForRecord({
      delegate: prisma.articleTranslation,
      foreignKeyField: "articleId",
      recordId: a.id,
      sourceFields: { title: a.title, excerpt: a.excerpt, content: a.content },
      existingLanguages: a.translations.map((t) => t.language),
      targetLanguages: langs,
    });
    if (created.length) results.push({ model: "Article", recordId: a.id, createdLanguages: created });
  }

  const pages = await prisma.page.findMany({ include: { translations: true } });
  for (const pg of pages) {
    const { created } = await ensureTranslationsForRecord({
      delegate: prisma.pageTranslation,
      foreignKeyField: "pageId",
      recordId: pg.id,
      sourceFields: { title: pg.title, description: pg.description },
      existingLanguages: pg.translations.map((t) => t.language),
      targetLanguages: langs,
    });
    if (created.length) results.push({ model: "Page", recordId: pg.id, createdLanguages: created });
  }

  return results;
}
