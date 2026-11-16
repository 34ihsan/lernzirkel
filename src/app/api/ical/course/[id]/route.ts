import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateICS } from '@/lib/ical';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course || !course.startDate) {
    return NextResponse.json({ error: 'Kurs oder Startdatum nicht gefunden.' }, { status: 404 });
  }

  const design = (course.design as { location?: string } | null) || {};

  const ics = generateICS({
    uid: course.id,
    title: course.title,
    description: course.description,
    start: course.startDate,
    end: course.endDate || undefined,
    location: design.location || 'Lernzirkel Ludwigshafen e.V., Ludwigsplatz 9',
    url: `https://lernzirkel-online.de/kurse/${course.id}`,
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${course.id}.ics"`,
    },
  });
}
