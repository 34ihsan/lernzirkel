'use server';

import prisma from '@/lib/prisma';

export async function searchContent(query: string) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  try {
    // Search across courses
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: lowerQuery, mode: 'insensitive' } },
          { description: { contains: lowerQuery, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: 5,
    });

    // Search across projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: lowerQuery, mode: 'insensitive' } },
          { description: { contains: lowerQuery, mode: 'insensitive' } },
        ],
        status: 'AKTIV',
      },
      take: 5,
    });

    // Search across pages
    const pages = await prisma.page.findMany({
      where: {
        OR: [
          { title: { contains: lowerQuery, mode: 'insensitive' } },
          { description: { contains: lowerQuery, mode: 'insensitive' } },
        ],
        isPublished: true,
      },
      take: 5,
    });

    // Normalize results for the frontend
    const results = [
      ...courses.map(c => ({ id: c.id, title: c.title, type: 'Kurs', url: `/kurse/${c.id}` })),
      ...projects.map(p => ({ id: p.id, title: p.title, type: 'Projekt', url: `/projekte/${p.id}` })),
      ...pages.map(p => ({ id: p.id, title: p.title, type: 'Seite', url: `/${p.slug}` })),
    ];

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
