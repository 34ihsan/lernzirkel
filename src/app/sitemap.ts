import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes = [
    '',
    '/ueber-uns',
    '/ueber-uns/leitbild',
    '/leitbild',
    '/kontakt',
    '/spenden',
    '/kurse',
    '/projekte',
    '/projekte/future-connect',
    '/projekte/menschen-staerken',
    '/projekte/konfliktmanagement',
    '/projekte/sprach-cafe',
    '/projekte/wettbewerbe',
    '/projekte/wettbewerbe/wir-sind-vielfalt',
    '/projekte/wettbewerbe/bildungsmesse',
    '/galerie',
    '/philosophie',
    '/satzung',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic Pages
    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const dynamicPages = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Dynamic Courses
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    const dynamicCourses = courses.map((course) => ({
      url: `${baseUrl}/kurse/${course.id}`, // Assuming this route exists or will exist
      lastModified: course.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic Projects
    const projects = await prisma.project.findMany({
      where: { status: 'AKTIV' },
      select: { id: true, updatedAt: true },
    });

    const dynamicProjects = projects.map((project) => ({
      url: `${baseUrl}/projekte/${project.id}`, // Assuming this route exists or will exist
      lastModified: project.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // News/Articles
    const news = await prisma.news.findMany({
      select: { id: true, updatedAt: true },
    });

    const dynamicNews = news.map((article) => ({
      url: `${baseUrl}/news/${article.id}`, // Assuming this route exists or will exist
      lastModified: article.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...dynamicPages,
      ...dynamicCourses,
      ...dynamicProjects,
      ...dynamicNews,
    ];
  } catch (error) {
    console.error('Sitemap generation failed to fetch DB records:', error);
    // If DB fails, at least return static routes
    return staticRoutes;
  }
}
