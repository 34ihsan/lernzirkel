import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

// Helper to determine if we are in development mode to bypass cache
const isDev = process.env.NODE_ENV === 'development';

// ---------------------------
// 1. PROJECTS
// ---------------------------
const getCachedProjectsInternal = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        where: { status: 'AKTIV' },
        orderBy: { createdAt: 'desc' },
        include: { translations: true },
      });
    } catch (err) {
      console.error('Failed to load cached projects:', err);
      return [];
    }
  },
  ['site-projects'],
  { revalidate: 3600, tags: ['site-projects'] }
);

export const getCachedProjects = async () => {
  if (isDev) {
    return await prisma.project.findMany({
      where: { status: 'AKTIV' },
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    });
  }
  return getCachedProjectsInternal();
};

const getCachedProjectBySlugInternal = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.project.findUnique({
        where: { id: slug },
        include: { contactPerson: true, translations: true }
      });
    } catch (err) {
      return null;
    }
  },
  ['site-project-by-slug'],
  { revalidate: 3600, tags: ['site-projects'] }
);

export const getCachedProjectBySlug = async (slug: string) => {
  if (isDev) {
    return await prisma.project.findUnique({ where: { id: slug }, include: { contactPerson: true, translations: true } });
  }
  return getCachedProjectBySlugInternal(slug);
};

// ---------------------------
// 2. COURSES
// ---------------------------
// Kontenjan rozetleri için: reddedilmemiş ve bekleme listesinde olmayan kayıt sayısı
const coursesWithRegistrationCount = {
  where: { isActive: true },
  orderBy: { createdAt: 'desc' as const },
  include: {
    _count: {
      select: {
        registrations: { where: { status: { not: 'REJECTED' }, isWaitlisted: false } },
      },
    },
    translations: true,
  },
};

const getCachedCoursesInternal = unstable_cache(
  async () => {
    try {
      return await prisma.course.findMany(coursesWithRegistrationCount);
    } catch (err) {
      console.error('Failed to load cached courses:', err);
      return [];
    }
  },
  ['site-courses'],
  { revalidate: 3600, tags: ['site-courses'] }
);

export const getCachedCourses = async () => {
  if (isDev) {
    return await prisma.course.findMany(coursesWithRegistrationCount);
  }
  return getCachedCoursesInternal();
};

// Kurs kartlarındaki link `design.slug` (örn. "c1") kullanıyor, gerçek `id` (UUID) değil —
// bu yüzden önce id ile, bulunamazsa design.slug ile aranıyor. Sadece id ile arayan önceki
// hali, slug tabanlı linklerin her zaman "sayfa bulunamadı" vermesine sebep oluyordu.
async function findCourseBySlugOrId(slugOrId: string) {
  try {
    const byId = await prisma.course.findUnique({ where: { id: slugOrId }, include: { translations: true } });
    if (byId) return byId;
  } catch {
    // slugOrId bir UUID değilse Prisma hata fırlatabilir, slug aramasına geç
  }
  return prisma.course.findFirst({
    where: { design: { path: ['slug'], equals: slugOrId } },
    include: { translations: true },
  });
}

const getCachedCourseByIdInternal = unstable_cache(
  async (id: string) => {
    try {
      return await findCourseBySlugOrId(id);
    } catch (err) {
      return null;
    }
  },
  ['site-course-by-id'],
  { revalidate: 3600, tags: ['site-courses'] }
);

export const getCachedCourseById = async (id: string) => {
  if (isDev) {
    return findCourseBySlugOrId(id);
  }
  return getCachedCourseByIdInternal(id);
};

// ---------------------------
// 3. NEWS (AKTUELLES)
// ---------------------------
const getCachedNewsInternal = unstable_cache(
  async () => {
    try {
      const now = new Date();
      return await prisma.news.findMany({
        where: {
          publishDate: { lte: now },
          OR: [
            { archiveDate: null },
            { archiveDate: { gt: now } }
          ]
        },
        orderBy: { publishDate: 'desc' },
        include: { translations: true },
      });
    } catch (err) {
      console.error('Failed to load cached news:', err);
      return [];
    }
  },
  ['site-news'],
  { revalidate: 3600, tags: ['site-news'] }
);

export const getCachedNews = async () => {
  if (isDev) {
    const now = new Date();
    return await prisma.news.findMany({
      where: {
        publishDate: { lte: now },
        OR: [
          { archiveDate: null },
          { archiveDate: { gt: now } }
        ]
      },
      orderBy: { publishDate: 'desc' },
      include: { translations: true },
    });
  }
  return getCachedNewsInternal();
};

const getCachedNewsByIdInternal = unstable_cache(
  async (id: string) => {
    try {
      return await prisma.news.findUnique({
        where: { id },
        include: { translations: true },
      });
    } catch (err) {
      return null;
    }
  },
  ['site-news-by-id'],
  { revalidate: 3600, tags: ['site-news'] }
);

export const getCachedNewsById = async (id: string) => {
  if (isDev) {
    return await prisma.news.findUnique({ where: { id }, include: { translations: true } });
  }
  return getCachedNewsByIdInternal(id);
};

// ---------------------------
// 4. PAGES (CMS sayfaları — force-dynamic kalıyor, build-time DB erişimi yok;
//    bu sadece request-time Prisma çağrılarını RAM'den karşılamak için)
// ---------------------------
const pageWithSectionsInclude = {
  parent: true,
  sections: { orderBy: { order: 'asc' as const } },
};

const getCachedPageBySlugInternal = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.page.findUnique({ where: { slug }, include: pageWithSectionsInclude });
    } catch (err) {
      console.error('Failed to load cached page:', err);
      return null;
    }
  },
  ['site-page-by-slug'],
  { revalidate: 3600, tags: ['site-pages'] }
);

export const getCachedPageBySlug = async (slug: string) => {
  if (isDev) {
    return prisma.page.findUnique({ where: { slug }, include: pageWithSectionsInclude }).catch(() => null);
  }
  return getCachedPageBySlugInternal(slug);
};

// Breadcrumb ata-zinciri yürüyüşü için — hafif, include yok.
const getCachedPageByIdInternal = unstable_cache(
  async (id: string) => {
    try {
      return await prisma.page.findUnique({ where: { id } });
    } catch {
      return null;
    }
  },
  ['site-page-by-id'],
  { revalidate: 3600, tags: ['site-pages'] }
);

export const getCachedPageById = async (id: string) => {
  if (isDev) {
    return prisma.page.findUnique({ where: { id } }).catch(() => null);
  }
  return getCachedPageByIdInternal(id);
};

// [...slug]/page.tsx yaprak-slug fallback araması (örn. /philosophie -> /ueber-uns/philosophie).
const getCachedPageFallbackInternal = unstable_cache(
  async (slugString: string, leaf: string) => {
    try {
      return await prisma.page.findFirst({
        where: {
          OR: [
            { slug: { endsWith: `/${slugString}` } },
            { slug: { endsWith: `/${leaf}` } },
            { slug: leaf },
          ],
          isPublished: true,
        },
        include: pageWithSectionsInclude,
      });
    } catch {
      return null;
    }
  },
  ['site-page-fallback'],
  { revalidate: 3600, tags: ['site-pages'] }
);

// ---------------------------
// 5. GALERİ (Foto & Video) — public "/ueber-uns/galerie" sayfasını besler
// ---------------------------
const getCachedGalleryMediaInternal = unstable_cache(
  async () => {
    try {
      return await prisma.galleryMedia.findMany({
        where: { isPublished: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });
    } catch (err) {
      console.error('Failed to load cached gallery media:', err);
      return [];
    }
  },
  ['site-gallery-media'],
  { revalidate: 3600, tags: ['site-gallery'] }
);

export const getCachedGalleryMedia = async () => {
  if (isDev) {
    return prisma.galleryMedia.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }).catch(() => []);
  }
  return getCachedGalleryMediaInternal();
};

export const getCachedPageFallback = async (slugString: string, leaf: string) => {
  if (isDev) {
    return prisma.page.findFirst({
      where: {
        OR: [
          { slug: { endsWith: `/${slugString}` } },
          { slug: { endsWith: `/${leaf}` } },
          { slug: leaf },
        ],
        isPublished: true,
      },
      include: pageWithSectionsInclude,
    }).catch(() => null);
  }
  return getCachedPageFallbackInternal(slugString, leaf);
};
