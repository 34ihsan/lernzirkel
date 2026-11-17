import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Kampanya/afiş/QR linkleri için: tıklamayı sayar, kaynağı 30 gün süreyle çerezde taşır
// (kayıt formuna kadar), ve hedef adrese yönlendirir.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const link = await prisma.campaignLink.findUnique({ where: { slug } });

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL('/kurse', req.url));
  }

  prisma.campaignLink
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch((err) => console.error('Campaign click increment failed:', err));

  const response = NextResponse.redirect(new URL(link.targetUrl, req.url));
  response.cookies.set('lz_ref', slug, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}
