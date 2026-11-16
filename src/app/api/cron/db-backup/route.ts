import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyCronSecret } from '@/lib/cron-auth';

// Bu endpoint seçili içerik tablolarının JSON anlık görüntüsünü döner (hızlı/insan-okunabilir
// bir yedek). VPS üzerindeki asıl veritabanı yedeği deploy/backup.sh'teki pg_dump ile alınır —
// bu route ona ek, birincil yedekleme mekanizması değildir.

export async function GET(req: Request) {
  try {
    const authError = verifyCronSecret(req);
    if (authError) return authError;

    // Export Core Content (Projects, Courses, News, Messages, SiteSettings)
    const [projects, courses, news, messages, settings] = await Promise.all([
      prisma.project.findMany(),
      prisma.course.findMany(),
      prisma.news.findMany(),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1000 // limit to last 1000 to prevent memory issues
      }),
      prisma.siteSettings.findMany()
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        projects: projects.length,
        courses: courses.length,
        news: news.length,
        messages: messages.length
      },
      data: {
        projects,
        courses,
        news,
        messages,
        settings
      }
    };

    // Note: For a production AWS S3 upload, you would normally import `@aws-sdk/client-s3`
    // and stream `backupData` directly to an S3 bucket here.
    // e.g., await s3Client.send(new PutObjectCommand({ Bucket: 'lz-backups', Key: `backup-${Date.now()}.json`, Body: JSON.stringify(backupData) }))
    
    // For now, we return it as a downloadable JSON payload for the cron consumer (which can then save it).
    return new NextResponse(JSON.stringify(backupData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="lernzirkel-db-backup-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('DB Backup Cron Error:', error);
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}
