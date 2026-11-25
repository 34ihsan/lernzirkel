import { NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { requireAdminSession } from '@/lib/auth-server';

function resolveUploadDir() {
  return process.env.UPLOADS_DIR || join(process.cwd(), 'public', 'uploads');
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

  const name = new URL(request.url).searchParams.get('name') || '';

  // Path traversal / directory separator koruması — sadece düz dosya adına izin ver.
  if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
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
