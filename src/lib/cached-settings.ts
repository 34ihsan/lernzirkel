import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { defaultHeaderConfig, defaultFooterConfig, HeaderConfig, FooterConfig } from '@/lib/site-defaults';

const getCachedSiteSettingsInternal = unstable_cache(
  async () => {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: 'global' },
      });
      return settings;
    } catch (err) {
      console.error('Failed to load cached siteSettings:', err);
      return null;
    }
  },
  ['site-global-settings'],
  {
    revalidate: 3600, // Background revalidation every hour
    tags: ['site-settings'],
  }
);

export const getCachedSiteSettings = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      return await prisma.siteSettings.findUnique({
        where: { id: 'global' },
      });
    } catch (err) {
      console.error('Failed to load siteSettings in dev:', err);
      return null;
    }
  }
  return getCachedSiteSettingsInternal();
};

export const getCachedAnnouncements = unstable_cache(
  async () => {
    try {
      const now = new Date();
      const announcements = await prisma.announcement.findMany({
        where: {
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: now } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      return announcements.map(a => ({
        ...a,
        startDate: a.startDate?.toISOString() || null,
        endDate: a.endDate?.toISOString() || null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }));
    } catch (err) {
      return [];
    }
  },
  ['site-active-announcements'],
  {
    revalidate: 300, // 5 minutes cache for announcements
    tags: ['site-announcements'],
  }
);
