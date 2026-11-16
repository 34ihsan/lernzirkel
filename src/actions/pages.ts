"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-server";

export interface PageSectionInput {
  type: string;
  content: any;
  design: any;
  order: number;
  isHidden?: boolean;
}

export interface PagePayload {
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  order: number;
  isPublished: boolean;
  sections: PageSectionInput[];
  publishAt?: string | null;
  ogImage?: string | null;
  noIndex?: boolean;
}

function parseJsonSafely(val: any) {
  if (!val) return {};
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return { text: val };
    }
  }
  return {};
}

// Taslağı kaydet (autosave + manuel "Taslak Olarak Kaydet") — canlı Section tablolarına dokunmaz.
export async function saveDraft(pageId: string, data: PagePayload) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const now = new Date();
    await prisma.page.update({
      where: { id: pageId },
      data: { draftData: data as any, draftSavedAt: now },
    });
    return { success: true as const, savedAt: now.toISOString() };
  } catch (error) {
    console.error("saveDraft error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Taslak kaydedilemedi: ${message}` };
  }
}

export async function discardDraft(pageId: string) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    await prisma.page.update({
      where: { id: pageId },
      data: { draftData: Prisma.JsonNull, draftSavedAt: null },
    });
    return { success: true as const };
  } catch (error) {
    console.error("discardDraft error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Taslak silinemedi: ${message}` };
  }
}

// Yayınla: çakışma kontrolü + revizyon snapshot'ı + canlı Page/Section tablolarının güncellenmesi.
export async function publishPage(pageId: string, data: PagePayload, expectedVersion: number) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const current = await prisma.page.findUnique({
      where: { id: pageId },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    if (!current) {
      return { success: false as const, error: "Sayfa bulunamadı" };
    }

    // Döngü koruması: bir sayfa kendisinin üst sayfası olamaz.
    if (data.parentId && data.parentId === pageId) {
      return { success: false as const, error: "Bir sayfa kendisinin üst sayfası olamaz." };
    }

    const cleanSlug = data.slug.replace(/^\/+/, "").trim();

    // Slug başka bir sayfada kullanılıyor mu?
    if (cleanSlug !== current.slug) {
      const existing = await prisma.page.findUnique({ where: { slug: cleanSlug } });
      if (existing && existing.id !== pageId) {
        return {
          success: false as const,
          error: `Bu URL adresi (${cleanSlug}) zaten başka bir sayfada kullanılıyor. Lütfen farklı bir adres girin.`,
        };
      }
    }

    // Optimistic-lock: siz düzenlerken başka biri yayınladıysa dur, üzerine yazma.
    if (current.contentVersion !== expectedVersion) {
      return { success: false as const, conflict: true as const, latestVersion: current.contentVersion };
    }

    const oldSlug = current.slug;

    // Zamanlanmış yayın: publishAt gelecekte bir tarihse, admin "Şimdi Yayınla" seçmiş olsa
    // bile isPublished zorla false kalır — /api/cron/publish tarihi gelince kendisi açar.
    const publishAtDate = data.publishAt ? new Date(data.publishAt) : null;
    const isScheduledForFuture = !!publishAtDate && publishAtDate.getTime() > Date.now();
    const effectiveIsPublished = isScheduledForFuture ? false : data.isPublished;

    await prisma.$transaction(async (tx) => {
      // Canlı durumu ezmeden önce ContentRevision'a anlık görüntüsünü al.
      await tx.contentRevision.create({
        data: {
          modelName: "Page",
          recordId: pageId,
          data: {
            title: current.title,
            slug: current.slug,
            description: current.description,
            parentId: current.parentId,
            order: current.order,
            isPublished: current.isPublished,
            ogImage: current.ogImage,
            noIndex: current.noIndex,
            publishAt: current.publishAt ? current.publishAt.toISOString() : null,
            sections: current.sections.map((s) => ({
              type: s.type,
              content: s.content,
              design: s.design,
              order: s.order,
            })),
          } as any,
        },
      });

      await tx.page.update({
        where: { id: pageId },
        data: {
          title: data.title,
          slug: cleanSlug,
          description: data.description,
          parentId: data.parentId || null,
          order: typeof data.order === "number" ? data.order : parseInt(String(data.order)) || 0,
          isPublished: effectiveIsPublished,
          publishAt: publishAtDate,
          ogImage: data.ogImage || null,
          noIndex: !!data.noIndex,
          contentVersion: { increment: 1 },
          draftData: Prisma.JsonNull,
          draftSavedAt: null,
          lastEditedById: session.teamMemberId,
          lastEditedByName: session.name,
          lastEditedAt: new Date(),
        },
      });

      // Slug değiştiyse eski URL'den yeniye otomatik 301/308 yönlendirmesi oluştur.
      // A->B->C zinciri: A->B kaydı varsa update ile A->C'ye çevrilir (upsert).
      if (cleanSlug !== oldSlug) {
        const fromPath = `/${oldSlug}`;
        const toPath = `/${cleanSlug}`;
        if (fromPath !== toPath) {
          await tx.redirect.upsert({
            where: { fromPath },
            create: { fromPath, toPath },
            update: { toPath },
          });
        }
      }

      await tx.section.deleteMany({ where: { pageId } });

      if (data.sections && data.sections.length > 0) {
        await tx.section.createMany({
          data: data.sections.map((s, index) => ({
            pageId,
            type: s.type,
            content: parseJsonSafely(s.content),
            // isHidden client state'inde ayrı bir alan ama DB'de Section'ın kendi kolonu yok —
            // design JSON'una gömülüyor (admin/pages listesi de onu zaten buradan okuyor).
            design: { ...parseJsonSafely(s.design), isHidden: !!s.isHidden },
            order: index,
          })),
        });
      }
    });

    const { syncPageHierarchy } = await import("@/actions/admin");
    await syncPageHierarchy();

    const updated = await prisma.page.findUnique({ where: { id: pageId } });

    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
    if (updated?.slug) revalidatePath(`/${updated.slug}`);
    if (oldSlug !== updated?.slug) revalidatePath(`/${oldSlug}`);

    return { success: true as const, newVersion: updated?.contentVersion ?? expectedVersion + 1 };
  } catch (error) {
    console.error("publishPage error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Sayfa yayınlanamadı: ${message}` };
  }
}

export async function getPageRevisions(pageId: string) {
  try {
    await requireAdminSession();
  } catch {
    return [];
  }

  return prisma.contentRevision.findMany({
    where: { modelName: "Page", recordId: pageId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function restorePageRevision(revisionId: string) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const revision = await prisma.contentRevision.findUnique({ where: { id: revisionId } });
    if (!revision || revision.modelName !== "Page") {
      return { success: false as const, error: "Revizyon bulunamadı." };
    }

    // DB'ye yazmaz — sadece anlık görüntüyü döner, editör bunu kendi state'ine uygular.
    return { success: true as const, data: revision.data as any };
  } catch (error) {
    console.error("restorePageRevision error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Revizyon yüklenemedi: ${message}` };
  }
}

// Mevcut bir sayfayı (bölümleriyle) kopyalar — Tier 2: hızlı şablon/duplicate akışı.
export async function duplicatePage(pageId: string) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const source = await prisma.page.findUnique({
      where: { id: pageId },
      include: { sections: { orderBy: { order: "asc" } } },
    });
    if (!source) {
      return { success: false as const, error: "Kaynak sayfa bulunamadı." };
    }

    // Benzersiz slug bul: deneme-kopya, deneme-kopya-2, deneme-kopya-3, ...
    let candidateSlug = `${source.slug}-kopya`;
    let suffix = 2;
    while (await prisma.page.findUnique({ where: { slug: candidateSlug } })) {
      candidateSlug = `${source.slug}-kopya-${suffix}`;
      suffix++;
    }

    const created = await prisma.page.create({
      data: {
        title: `${source.title} (Kopya)`,
        slug: candidateSlug,
        description: source.description,
        parentId: source.parentId,
        order: source.order,
        isPublished: false,
        ogImage: source.ogImage,
        sections: {
          create: source.sections.map((s, index) => ({
            type: s.type,
            content: JSON.parse(JSON.stringify(s.content)),
            design: JSON.parse(JSON.stringify(s.design)),
            order: index,
          })),
        },
      },
    });

    revalidatePath("/admin/pages");
    return { success: true as const, newId: created.id };
  } catch (error) {
    console.error("duplicatePage error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Sayfa kopyalanamadı: ${message}` };
  }
}

// Toplu yayınla / taslağa al.
export async function bulkSetPublished(ids: string[], isPublished: boolean) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const pages = await prisma.page.findMany({ where: { id: { in: ids } }, select: { slug: true } });
    await prisma.page.updateMany({ where: { id: { in: ids } }, data: { isPublished } });

    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
    for (const p of pages) revalidatePath(`/${p.slug}`);

    return { success: true as const, count: pages.length };
  } catch (error) {
    console.error("bulkSetPublished error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Toplu güncelleme başarısız: ${message}` };
  }
}

// Toplu silme — ana sayfa (slug: 'home') her zaman korunur, listeye dahil edilse de atlanır.
export async function bulkDeletePages(ids: string[]) {
  try {
    await requireAdminSession();
  } catch {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const pages = await prisma.page.findMany({ where: { id: { in: ids } }, select: { id: true, slug: true } });
    const homePage = pages.find((p) => p.slug === "home");
    const deletableIds = pages.filter((p) => p.slug !== "home").map((p) => p.id);

    const result = await prisma.page.deleteMany({ where: { id: { in: deletableIds } } });

    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");

    return { success: true as const, deletedCount: result.count, skippedHome: !!homePage };
  } catch (error) {
    console.error("bulkDeletePages error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false as const, error: `Toplu silme başarısız: ${message}` };
  }
}
