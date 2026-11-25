import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { requireAdminSession } from '@/lib/auth-server';

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB — paylaşımlı VPS depolamasını korumak için sınırlı

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Geçersiz video formatı. Sadece MP4 ve WebM kabul edilir.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Video çok büyük (maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB).` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // UPLOADS_DIR ile aynı kalıcı-diske-yazma mantığı (bkz. /api/upload) — videolar da
    // aynı public/uploads kökü altında, ayrı bir "videos" alt klasöründe tutuluyor.
    const uploadDir = process.env.UPLOADS_DIR || join(process.cwd(), 'public', 'uploads');
    const videoDir = join(uploadDir, 'videos');

    await mkdir(videoDir, { recursive: true }).catch(() => {});

    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizedOriginalName}`;
    const filePath = join(videoDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/videos/${filename}` });
  } catch (error) {
    console.error('Gallery video upload error:', error);
    return NextResponse.json({ error: 'Video yüklenemedi.' }, { status: 500 });
  }
}
