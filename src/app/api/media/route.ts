import { NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { requireAdminSession } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

function resolveUploadDir() {
  return process.env.UPLOADS_DIR || join(process.cwd(), 'public', 'uploads');
}

// JSON/metin alanlarının herhangi bir yerinde dosya URL'si geçiyor mu? (iç içe nesne/dizi de dahil)
function containsUrl(value: unknown, fileUrl: string): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.includes(fileUrl);
  if (Array.isArray(value)) return value.some((v) => containsUrl(v, fileUrl));
  if (typeof value === 'object') return Object.values(value).some((v) => containsUrl(v, fileUrl));
  return false;
}

// Bir görsel silinmeden önce: sitede gerçekten kullanılıyor mu? Kullanılıyorsa admin'i
// nerelerde kullanıldığı konusunda uyarmak için insan-okunur bir liste döndürür.
async function findMediaUsages(fileUrl: string): Promise<string[]> {
  const usages: string[] = [];

  const sections = await prisma.section.findMany({
    select: { content: true, design: true, page: { select: { title: true, slug: true } } },
  });
  for (const s of sections) {
    if (containsUrl(s.content, fileUrl) || containsUrl(s.design, fileUrl)) {
      usages.push(`Sayfa bölümü: ${s.page?.title || s.page?.slug || '—'}`);
    }
  }

  const pages = await prisma.page.findMany({ where: { ogImage: { contains: fileUrl } }, select: { title: true } });
  usages.push(...pages.map((p) => `Sayfa SEO görseli: ${p.title}`));

  const courses = await prisma.course.findMany({ select: { title: true, design: true } }).catch(() => []);
  for (const c of courses) if (containsUrl(c.design, fileUrl)) usages.push(`Kurs: ${c.title}`);

  const projects = await prisma.project.findMany({ where: { imageUrl: { contains: fileUrl } }, select: { title: true } }).catch(() => []);
  usages.push(...projects.map((p) => `Proje: ${p.title}`));

  const news = await prisma.news.findMany({ select: { title: true, imageUrl: true, design: true } }).catch(() => []);
  for (const n of news) {
    if ((n.imageUrl && n.imageUrl.includes(fileUrl)) || containsUrl(n.design, fileUrl)) {
      usages.push(`Duyuru/Haber: ${n.title}`);
    }
  }

  const articles = await prisma.article.findMany({ where: { coverImage: { contains: fileUrl } }, select: { title: true } }).catch(() => []);
  usages.push(...articles.map((a) => `Blog Yazısı: ${a.title}`));

  const gallery = await prisma.galleryMedia.findMany({
    where: { OR: [{ imageUrl: { contains: fileUrl } }, { videoUrl: { contains: fileUrl } }, { thumbnailUrl: { contains: fileUrl } }] },
    select: { title: true },
  }).catch(() => []);
  usages.push(...gallery.map((g) => `Galeri: ${g.title}`));

  const team = await prisma.teamMember.findMany({ where: { photoUrl: { contains: fileUrl } }, select: { name: true } }).catch(() => []);
  usages.push(...team.map((t) => `Ekip Üyesi: ${t.name}`));

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } }).catch(() => null);
  if (settings) {
    if (containsUrl(settings.headerConfig, fileUrl)) usages.push('Site Başlığı (Header) Ayarları');
    if (containsUrl(settings.footerConfig, fileUrl)) usages.push('Site Altbilgisi (Footer) Ayarları');
    if (containsUrl(settings.designConfig, fileUrl)) usages.push('Site Tasarım Ayarları');
    if (containsUrl(settings.marketingConfig, fileUrl)) usages.push('Pazarlama Ayarları');
  }

  return usages;
}

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const uploadDir = resolveUploadDir();

    try {
      const files = await readdir(uploadDir);
      
      const mediaFiles = await Promise.all(
        files.map(async (filename) => {
          const filePath = join(uploadDir, filename);
          const fileStat = await stat(filePath);
          
          return {
            name: filename,
            url: `/uploads/${filename}`,
            size: fileStat.size,
            createdAt: fileStat.birthtime,
          };
        })
      );
      
      // Sort by newest first
      mediaFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return NextResponse.json({ files: mediaFiles });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        // Directory doesn't exist yet, return empty list
        return NextResponse.json({ files: [] });
      }
      throw e;
    }
  } catch (error) {
    console.error('Media listing error:', error);
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const name = searchParams.get('name') || '';
  const force = searchParams.get('force') === 'true';

  // Path traversal / directory separator koruması — sadece düz dosya adına izin ver.
  if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  if (!force) {
    try {
      const usages = await findMediaUsages(`/uploads/${name}`);
      if (usages.length > 0) {
        return NextResponse.json({ error: 'in_use', usages }, { status: 409 });
      }
    } catch (error) {
      console.error('Media usage check error:', error);
      // Kullanım kontrolü başarısız olursa, körü körüne silmek yerine durdur.
      return NextResponse.json({ error: 'Kullanım kontrolü başarısız oldu, tekrar deneyin.' }, { status: 500 });
    }
  }

  try {
    const filePath = join(resolveUploadDir(), name);
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 });
    }
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
