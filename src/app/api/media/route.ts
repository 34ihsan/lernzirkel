import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
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
