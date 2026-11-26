import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-server';

const ALLOWED_STATUSES = ['UNREAD', 'READ', 'ARCHIVED'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json().catch(() => ({ status: null }));

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
  }

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Mesaj bulunamadı.' }, { status: 404 });
  }
}
