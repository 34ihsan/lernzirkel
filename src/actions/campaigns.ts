'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';
import { siteConfig } from '@/lib/seo';
import { Platform } from '@/lib/campaign-platforms';

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

export async function createCampaignLink(data: {
  label: string;
  targetUrl: string;
  slug?: string;
  platform?: Platform;
  description?: string;
  showOnBioPage?: boolean;
}) {
  try {
    if (!data.label || !data.targetUrl) {
      return { success: false, error: 'Etiket ve hedef URL zorunludur.' };
    }
    let slug = data.slug ? slugify(data.slug) : slugify(data.label);
    if (!slug) slug = Math.random().toString(36).slice(2, 8);

    const existing = await prisma.campaignLink.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
    }

    await prisma.campaignLink.create({
      data: {
        slug,
        label: data.label,
        targetUrl: data.targetUrl,
        platform: data.platform || 'other',
        description: data.description || null,
        showOnBioPage: Boolean(data.showOnBioPage),
      },
    });

    revalidatePath('/admin/campaigns');
    revalidatePath('/bio');
    return { success: true, slug };
  } catch (error) {
    console.error('Error creating campaign link:', error);
    return { success: false, error: 'Kampanya linki oluşturulurken hata oluştu.' };
  }
}

export async function updateCampaignLinkBioSettings(
  id: string,
  data: { showOnBioPage: boolean; description?: string }
) {
  try {
    await prisma.campaignLink.update({
      where: { id },
      data: { showOnBioPage: data.showOnBioPage, description: data.description || null },
    });
    revalidatePath('/admin/campaigns');
    revalidatePath('/bio');
    return { success: true };
  } catch (error) {
    console.error('Error updating bio settings:', error);
    return { success: false, error: 'Güncellenirken hata oluştu.' };
  }
}

export async function deleteCampaignLink(id: string) {
  try {
    await prisma.campaignLink.delete({ where: { id } });
    revalidatePath('/admin/campaigns');
    return { success: true };
  } catch (error) {
    console.error('Error deleting campaign link:', error);
    return { success: false, error: 'Silinirken hata oluştu.' };
  }
}

export async function toggleCampaignLink(id: string, isActive: boolean) {
  try {
    await prisma.campaignLink.update({ where: { id }, data: { isActive } });
    revalidatePath('/admin/campaigns');
    revalidatePath('/bio');
    return { success: true };
  } catch (error) {
    console.error('Error toggling campaign link:', error);
    return { success: false, error: 'Güncellenirken hata oluştu.' };
  }
}

export async function getCampaignLinksWithStats() {
  const links = await prisma.campaignLink.findMany({ orderBy: { createdAt: 'desc' } });
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  const results = await Promise.all(
    links.map(async (link) => {
      const [registrations, qrDataUrl] = await Promise.all([
        prisma.registration.count({ where: { source: link.slug } }),
        QRCode.toDataURL(`${baseUrl}/go/${link.slug}`, { margin: 1, width: 280 }),
      ]);
      return {
        id: link.id,
        slug: link.slug,
        label: link.label,
        targetUrl: link.targetUrl,
        platform: (link.platform as Platform) || 'other',
        description: link.description,
        showOnBioPage: link.showOnBioPage,
        clicks: link.clicks,
        isActive: link.isActive,
        createdAt: link.createdAt,
        registrations,
        fullUrl: `${baseUrl}/go/${link.slug}`,
        qrDataUrl,
        caption: buildShareCaption(link.label, `${baseUrl}/go/${link.slug}`),
      };
    })
  );

  return results;
}

// Platforma göre gruplanmış toplamlar — "Tüm Instagram paylaşımları: 1200 tıklama" gibi
export async function getCampaignStatsByPlatform() {
  const links = await prisma.campaignLink.findMany();
  const bySlug = Object.fromEntries(links.map((l) => [l.slug, l]));
  const registrationCounts = await prisma.registration.groupBy({
    by: ['source'],
    _count: { source: true },
    where: { source: { not: null } },
  });
  const regMap = Object.fromEntries(registrationCounts.map((r) => [r.source, r._count.source]));

  const totals: Record<Platform, { clicks: number; registrations: number; count: number }> = {
    instagram: { clicks: 0, registrations: 0, count: 0 },
    facebook: { clicks: 0, registrations: 0, count: 0 },
    whatsapp: { clicks: 0, registrations: 0, count: 0 },
    tiktok: { clicks: 0, registrations: 0, count: 0 },
    other: { clicks: 0, registrations: 0, count: 0 },
  };

  for (const link of links) {
    const platform = (link.platform as Platform) || 'other';
    const bucket = totals[platform] || totals.other;
    bucket.clicks += link.clicks;
    bucket.registrations += regMap[link.slug] || 0;
    bucket.count += 1;
  }

  return totals;
}

function buildShareCaption(label: string, url: string) {
  return [
    `📚 ${label}`,
    ``,
    `Lernzirkel Ludwigshafen e.V. bei Bildungsangeboten, Integrationskursen und kostenloser Nachhilfe an Ihrer Seite!`,
    ``,
    `👉 Mehr Infos & Anmeldung: ${url}`,
    ``,
    `#LernzirkelLudwigshafen #Integrationskurs #Deutschkurs #Ludwigshafen #Bildung #Nachhilfe`,
  ].join('\n');
}

// Instagram bio'daki tek linkin yönlendirdiği, aktif kampanyaları kart kart listeleyen
// genel sayfa (/bio) için — public, auth gerektirmez.
export async function getBioPageLinks() {
  const links = await prisma.campaignLink.findMany({
    where: { showOnBioPage: true, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return links.map((link) => ({
    slug: link.slug,
    label: link.label,
    description: link.description,
    platform: (link.platform as Platform) || 'other',
  }));
}
