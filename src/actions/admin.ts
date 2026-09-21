"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

// Design Settings (Legacy form support)
export async function updateSiteSettings(formData: FormData) {
  const data = {
    siteName: formData.get("siteName") as string,
    description: formData.get("description") as string,
    primaryColor: formData.get("primaryColor") as string,
    primaryLight: formData.get("primaryLight") as string,
    secondaryColor: formData.get("secondaryColor") as string,
    accentColor: formData.get("accentColor") as string,
    backgroundColor: formData.get("backgroundColor") as string,
    foregroundColor: formData.get("foregroundColor") as string,
    mutedColor: formData.get("mutedColor") as string,
  };

  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: data,
    create: {
      id: "global",
      ...data,
    },
  });

  updateTag("site-settings");
  revalidatePath("/", "layout");
}

// Royal Elite Design Studio Action
export async function updateDesignSettings(payload: {
  siteName: string;
  description: string;
  designConfig: any;
}) {
  const { siteName, description, designConfig } = payload;
  const colors = designConfig?.colors || {};

  const data: any = {
    siteName: siteName || "Lernzirkel Ludwigshafen e.V.",
    description: description || "Bildung, Beratung und soziale Projekte",
    designConfig: designConfig,
  };

  if (colors.primary) data.primaryColor = colors.primary;
  if (colors.primaryLight) data.primaryLight = colors.primaryLight;
  if (colors.secondary) data.secondaryColor = colors.secondary;
  if (colors.accent) data.accentColor = colors.accent;
  if (colors.background) data.backgroundColor = colors.background;
  if (colors.foreground) data.foregroundColor = colors.foreground;
  if (colors.muted) data.mutedColor = colors.muted;

  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: data,
    create: {
      id: "global",
      ...data,
    },
  });

  updateTag("site-settings");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateHeaderFooterSettings(headerConfig: any, footerConfig: any) {
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {
      headerConfig,
      footerConfig,
    },
    create: {
      id: "global",
      headerConfig,
      footerConfig,
    },
  });

  updateTag("site-settings");
  revalidatePath("/", "layout");
}

const MODEL_PUBLIC_PATHS: Record<string, string[]> = {
  Course: ['/kurse', '/'],
  News: ['/aktuelles', '/'],
  GalleryImage: ['/galerie', '/'],
  TeamMember: ['/ueber-uns', '/organigramm', '/'],
  Project: ['/projekte', '/wir-sind-vielfalt', '/menschen-staerken', '/future-connect', '/'],
  Department: ['/kontakt', '/'],
};

// Model Delete Utility
export async function deleteModelRecord(modelName: string, id: string) {
  // @ts-ignore
  await prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)].delete({
    where: { id },
  });

  revalidatePath(`/admin/content/${modelName}`);
  revalidatePath('/', 'layout');
  const targetPaths = MODEL_PUBLIC_PATHS[modelName] || [];
  for (const p of targetPaths) {
    revalidatePath(p);
  }
}

// Generic Model Save
export async function saveModelRecord(modelName: string, id: string | null, data: any) {
  const delegate = (prisma as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
  
  if (id) {
    await delegate.update({
      where: { id },
      data
    });
  } else {
    await delegate.create({
      data
    });
  }

  revalidatePath(`/admin/content/${modelName}`);
  revalidatePath('/', 'layout');
  const targetPaths = MODEL_PUBLIC_PATHS[modelName] || [];
  for (const p of targetPaths) {
    revalidatePath(p);
  }
  redirect(`/admin/content/${modelName}`);
}

// ─── Announcement Actions ────────────────────────────────────────────────────

export interface AnnouncementData {
  title: string;
  message: string;
  isActive?: boolean;
  isCloseable?: boolean;
  position?: string;
  type?: string;
  targetScope?: string;
  targetPageSlugs?: string[];
  startDate?: string | null;
  endDate?: string | null;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  icon?: string;
  animation?: string;
  animationSpeed?: string;
  duration?: number;
  isInline?: boolean;
  linkUrl?: string | null;
  linkText?: string | null;
}

function parseAnnouncementData(data: AnnouncementData) {
  return {
    title: data.title,
    message: data.message,
    isActive: data.isActive ?? false,
    isCloseable: data.isCloseable ?? true,
    position: data.position ?? "top",
    type: data.type ?? "banner",
    targetScope: data.targetScope ?? "ALL",
    targetPageSlugs: data.targetPageSlugs ?? [],
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    backgroundColor: data.backgroundColor ?? "#1a6d92",
    textColor: data.textColor ?? "#ffffff",
    borderColor: data.borderColor ?? "transparent",
    fontSize: data.fontSize ?? "14px",
    fontWeight: data.fontWeight ?? "normal",
    padding: data.padding ?? "12px 16px",
    icon: data.icon ?? "none",
    animation: data.animation ?? "none",
    animationSpeed: data.animationSpeed ?? "normal",
    duration: data.duration ?? 7,
    isInline: data.isInline ?? true,
    linkUrl: data.linkUrl || null,
    linkText: data.linkText || null,
  };
}

async function autoTranslate(text: string, from: string, to: string) {
  if (!text) return text;
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch (e) {
    return text;
  }
}

async function generateTranslations(data: AnnouncementData) {
  const translations: any = {};
  const targetLangs = ["de", "tr", "en", "ar"];
  
  for (const lang of targetLangs) {
    translations[lang] = {
      title: await autoTranslate(data.title, 'autodetect', lang),
      message: await autoTranslate(data.message, 'autodetect', lang),
      linkText: data.linkText ? await autoTranslate(data.linkText, 'autodetect', lang) : null
    };
  }
  return translations;
}

export async function createAnnouncement(data: AnnouncementData) {
  const parsedData = parseAnnouncementData(data);
  const translations = await generateTranslations(data);
  await prisma.announcement.create({ data: { ...parsedData, translations } });
  updateTag("site-announcements");
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

export async function updateAnnouncement(id: string, data: AnnouncementData) {
  const parsedData = parseAnnouncementData(data);
  const translations = await generateTranslations(data);
  await prisma.announcement.update({
    where: { id },
    data: { ...parsedData, translations },
  });
  updateTag("site-announcements");
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  updateTag("site-announcements");
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

function findPhysicalPages(dir: string, baseDir: string): string[] {
  let pages: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('[') || entry.name.startsWith('(') && entry.name !== '(site)') {
          continue;
        }
        pages = pages.concat(findPhysicalPages(path.join(dir, entry.name), baseDir));
      } else if (entry.name === 'page.tsx') {
        let relPath = path.relative(baseDir, dir).replace(/\\/g, '/');
        // If it's directly inside (site), relPath is empty. We can skip home or map it.
        // Actually, we only care about real slugs. Let's map empty to 'home'.
        if (!relPath) relPath = 'home';
        pages.push(relPath);
      }
    }
  } catch (err) {
    console.error("Error reading physical pages:", err);
  }
  return pages;
}

export async function syncPhysicalPages() {
  const siteDir = path.join(process.cwd(), 'src', 'app', '(site)');
  const physicalSlugs = findPhysicalPages(siteDir, siteDir);
  
  for (const slug of physicalSlugs) {
    if (slug === 'home') continue; // Usually handled by SYSTEM_PAGES
    
    const existing = await prisma.page.findUnique({
      where: { slug }
    });
    
    if (!existing) {
      // Extract a basic title from the slug (e.g. "beratung/mfd" -> "Mfd")
      const parts = slug.split('/');
      const lastPart = parts[parts.length - 1];
      const title = lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
      
      await prisma.page.create({
        data: {
          slug,
          title: title,
          description: "Otomatik eklenen sayfa",
          isPublished: true,
        }
      });
    }
  }
}

export async function syncSystemPages() {
  const { SYSTEM_PAGES } = await import("@/lib/default-pages-data");
  const { defaultHeaderConfig, defaultFooterConfig } = await import("@/lib/site-defaults");

  // Ensure SiteSettings has the rich header/footer with submenus
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } }).catch(() => null);
    if (!settings) {
      await prisma.siteSettings.create({
        data: {
          id: "global",
          headerConfig: defaultHeaderConfig as any,
          footerConfig: defaultFooterConfig as any,
        }
      });
    } else {
      const headerConfig = settings.headerConfig as any;
      const subCount = headerConfig?.navLinks?.filter((n: any) => n.children && n.children.length > 0).length || 0;
      if (subCount < 3) {
        const defaultLinks = defaultHeaderConfig.navLinks || [];
        const baseLinks = headerConfig?.navLinks?.length ? headerConfig.navLinks : defaultLinks;
        const mergedNavLinks = baseLinks.map((link: any) => {
          if (link.children && link.children.length > 0) return link;
          const match = defaultLinks.find(
            d => d.label.trim().toLowerCase() === link.label.trim().toLowerCase() ||
                 (link.url !== '/' && d.url.trim().toLowerCase() === link.url.trim().toLowerCase())
          );
          if (match?.children && match.children.length > 0) {
            return { ...link, children: match.children };
          }
          return link;
        });

        await prisma.siteSettings.update({
          where: { id: "global" },
          data: {
            headerConfig: {
              ...defaultHeaderConfig,
              ...headerConfig,
              navLinks: mergedNavLinks,
            },
            footerConfig: settings.footerConfig || (defaultFooterConfig as any),
          }
        });
      }
    }
  } catch (err) {
    console.error("Error auto-syncing headerConfig:", err);
  }

  for (const pageDef of SYSTEM_PAGES) {
    let page = await prisma.page.findUnique({
      where: { slug: pageDef.slug },
      include: { sections: true },
    });

    if (!page) {
      await prisma.page.create({
        data: {
          title: pageDef.title,
          slug: pageDef.slug,
          description: pageDef.description,
          isPublished: true,
          sections: {
            create: pageDef.sections.map(s => ({
              type: s.type,
              order: s.order,
              content: s.content,
              design: s.design,
            }))
          }
        }
      });
    } else if (page.sections.length === 0) {
      await prisma.section.createMany({
        data: pageDef.sections.map(s => ({
          pageId: page.id,
          type: s.type,
          order: s.order,
          content: s.content,
          design: s.design,
        }))
      });
    }
  }
  
  // Ekle: Fiziksel (kodlu) sayfaları tarayıp CMS'ye ekleyelim
  await syncPhysicalPages();

  // Auto-sync page hierarchy
  await syncPageHierarchy();

  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
}

// ─── Page Hierarchy Actions ──────────────────────────────────────────────────

/**
 * Auto-heals hierarchy relationships by inspecting page slugs.
 * E.g. 'ueber-uns/hakkimizda' automatically gets linked to parent 'ueber-uns'.
 */
export async function syncPageHierarchy() {
  const allPages = await prisma.page.findMany();
  const slugToIdMap = new Map<string, string>();
  allPages.forEach(p => slugToIdMap.set(p.slug, p.id));

  let updatedCount = 0;

  for (const page of allPages) {
    if (page.slug === 'home') continue;
    
    // 1. Check if slug contains path segments: e.g. "ueber-uns/hakkimizda"
    if (page.slug.includes('/')) {
      const parts = page.slug.split('/');
      const parentSlug = parts.slice(0, -1).join('/');
      const expectedParentId = slugToIdMap.get(parentSlug);

      if (expectedParentId && expectedParentId !== page.id && page.parentId !== expectedParentId) {
        await prisma.page.update({
          where: { id: page.id },
          data: { parentId: expectedParentId }
        });
        updatedCount++;
      }
    }
  }

  // Also synchronize and harmonize Header navigation URLs with database slugs
  const settings = await prisma.siteSettings.findFirst();
  if (settings && settings.headerConfig) {
    const headerConfig = settings.headerConfig as any;
    let headerUpdated = false;

    if (Array.isArray(headerConfig.navLinks)) {
      // 2. Use Nav Menu to heal parent-child relationships for pages without slashes
      for (const navItem of headerConfig.navLinks) {
        if (!navItem.url) continue;
        const parentSlug = navItem.url.replace(/^\/+/, "");
        const parentId = slugToIdMap.get(parentSlug);
        
        if (parentId && Array.isArray(navItem.children)) {
          for (const childItem of navItem.children) {
            if (!childItem.url) continue;
            const childSlug = childItem.url.replace(/^\/+/, "");
            const childPage = allPages.find(p => p.slug === childSlug);
            
            // If the child page exists, and doesn't already have this parent, and doesn't have a slash slug
            if (childPage && childPage.id !== parentId && childPage.parentId !== parentId && !childPage.slug.includes('/')) {
              await prisma.page.update({
                where: { id: childPage.id },
                data: { parentId: parentId }
              });
              updatedCount++;
            }
          }
        }
      }

      const canonicalizeUrl = (rawUrl?: string): string | undefined => {
        if (!rawUrl || rawUrl.startsWith('http') || rawUrl.startsWith('#') || rawUrl === '/') {
          return rawUrl;
        }
        const clean = rawUrl.replace(/^\/+/, '');
        // If already an exact slug of a page, return as is
        if (allPages.some(p => p.slug === clean)) {
          return `/${clean}`;
        }
        // Check if there's a page whose slug ends with /clean or matches clean as leaf
        const candidate = allPages.find(p => p.slug.endsWith(`/${clean}`) || p.slug === clean);
        if (candidate) {
          headerUpdated = true;
          return `/${candidate.slug}`;
        }
        return rawUrl;
      };

      const updatedNavLinks = headerConfig.navLinks.map((item: any) => {
        const newUrl = canonicalizeUrl(item.url);
        const newChildren = Array.isArray(item.children)
          ? item.children.map((child: any) => {
              const childUrl = canonicalizeUrl(child.url);
              return { ...child, url: childUrl };
            })
          : item.children;
        return { ...item, url: newUrl, children: newChildren };
      });

      if (headerUpdated) {
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: {
            headerConfig: {
              ...headerConfig,
              navLinks: updatedNavLinks
            }
          }
        });
      }
    }
  }

  revalidatePath('/admin/pages');
  revalidatePath('/admin/header-footer');
  revalidatePath('/', 'layout');
  return { success: true, updatedCount };
}

/**
 * Reorders a page among its siblings (pages with the same parentId).
 */
export async function reorderPage(pageId: string, direction: 'up' | 'down') {
  const targetPage = await prisma.page.findUnique({
    where: { id: pageId }
  });

  if (!targetPage) throw new Error("Sayfa bulunamadı");

  // Get all siblings with same parentId
  const siblings = await prisma.page.findMany({
    where: { parentId: targetPage.parentId },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
  });

  const currentIndex = siblings.findIndex(s => s.id === pageId);
  if (currentIndex === -1) return { success: false };

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= siblings.length) {
    return { success: false, reason: "Already at bound" };
  }

  const siblingToSwap = siblings[targetIndex];

  // Swap order values or assign normalized indices (0, 1, 2, ...)
  await prisma.$transaction([
    prisma.page.update({
      where: { id: targetPage.id },
      data: { order: targetIndex }
    }),
    prisma.page.update({
      where: { id: siblingToSwap.id },
      data: { order: currentIndex }
    })
  ]);

  revalidatePath('/admin/pages');
  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Updates a page's parent and/or order with cycle prevention.
 */
export async function updatePageHierarchy(pageId: string, parentId: string | null, newOrder?: number) {
  if (parentId === pageId) {
    throw new Error("Bir sayfa kendisinin üst sayfası olamaz.");
  }

  // Prevent circular hierarchy (i.e. parent cannot be one of page's descendants)
  if (parentId) {
    let currentCheckId: string | null = parentId;
    while (currentCheckId) {
      if (currentCheckId === pageId) {
        throw new Error("Döngüsel hiyerarşi engellendi: Kendi alt sayfanızı üst sayfa yapamazsınız.");
      }
      const parentPage: { parentId: string | null } | null = await prisma.page.findUnique({
        where: { id: currentCheckId },
        select: { parentId: true }
      });
      currentCheckId = parentPage ? parentPage.parentId : null;
    }
  }

  const dataToUpdate: any = { parentId: parentId || null };
  if (typeof newOrder === 'number') {
    dataToUpdate.order = newOrder;
  }

  await prisma.page.update({
    where: { id: pageId },
    data: dataToUpdate
  });

  revalidatePath('/admin/pages');
  revalidatePath('/', 'layout');
  return { success: true };
}

