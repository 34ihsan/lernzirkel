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
    });
  }
  return getCachedProjectsInternal();
};

const getCachedProjectBySlugInternal = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.project.findUnique({
        where: { id: slug },
        include: { contactPerson: true }
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
    return await prisma.project.findUnique({ where: { id: slug }, include: { contactPerson: true } });
  }
  return getCachedProjectBySlugInternal(slug);
};

// ---------------------------
// 2. COURSES
// ---------------------------
const getCachedCoursesInternal = unstable_cache(
  async () => {
    try {
      return await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
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
    return await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  return getCachedCoursesInternal();
};

// Kurs kartlarındaki link `design.slug` (örn. "c1") kullanıyor, gerçek `id` (UUID) değil —
// bu yüzden önce id ile, bulunamazsa design.slug ile aranıyor. Sadece id ile arayan önceki
// hali, slug tabanlı linklerin her zaman "sayfa bulunamadı" vermesine sebep oluyordu.
async function findCourseBySlugOrId(slugOrId: string) {
  try {
    const byId = await prisma.course.findUnique({ where: { id: slugOrId } });
    if (byId) return byId;
  } catch {
    // slugOrId bir UUID değilse Prisma hata fırlatabilir, slug aramasına geç
  }
  return prisma.course.findFirst({
    where: { design: { path: ['slug'], equals: slugOrId } },
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
        orderBy: { publishDate: 'desc' }
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
      orderBy: { publishDate: 'desc' }
    });
  }
  return getCachedNewsInternal();
};

const getCachedNewsByIdInternal = unstable_cache(
  async (id: string) => {
    try {
      return await prisma.news.findUnique({
        where: { id },
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
    return await prisma.news.findUnique({ where: { id } });
  }
  return getCachedNewsByIdInternal(id);
};
