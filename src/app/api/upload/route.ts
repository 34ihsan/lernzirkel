import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { requireAdminSession } from '@/lib/auth-server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Ungültiges Dateiformat. Erlaubt sind nur JPEG, PNG, WebP, GIF und SVG.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Datei ist zu groß (maximal 10 MB erlaubt).' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kalıcı yükleme dizini: VPS'te standalone build cwd'den bağımsız, sabit bir yola
    // yazar (UPLOADS_DIR) — aksi halde her deploy'da yeniden kopyalanan public/ klasörü
    // önceki yüklenen dosyaları silebilir. Tanımlı değilse yerel geliştirme davranışı korunur.
    const uploadDir = process.env.UPLOADS_DIR || join(process.cwd(), 'public', 'uploads');

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Dizin varsa hata fırlatabilir, yoksayabiliriz
    }

    // Dosya adı path traversal veya özel karakterlere karşı temizleniyor
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizedOriginalName}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Erişilebilir URL döndür
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
