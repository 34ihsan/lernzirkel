import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-server';
import { getDepotDir } from '@/lib/depot-storage';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  const attachmentInfo = (msg?.details as any)?.attachmentInfo;

  if (!msg || !attachmentInfo?.storedFileName) {
    return NextResponse.json({ error: 'Ek bulunamadı.' }, { status: 404 });
  }

  try {
    const filePath = join(getDepotDir(), attachmentInfo.storedFileName);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': attachmentInfo.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(attachmentInfo.name || 'anhang')}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Contact attachment download error:', error);
    return NextResponse.json({ error: 'Dosya okunamadı.' }, { status: 500 });
  }
}
