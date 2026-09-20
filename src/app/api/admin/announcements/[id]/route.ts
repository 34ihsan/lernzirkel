import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/announcements/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: "Alınamadı" }, { status: 500 });
  }
}

// PUT /api/admin/announcements/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: body.title,
        message: body.message,
        isActive: body.isActive,
        isCloseable: body.isCloseable,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        targetScope: body.targetScope,
        targetPageSlugs: body.targetPageSlugs ?? [],
        type: body.type,
        position: body.position,
        backgroundColor: body.backgroundColor,
        textColor: body.textColor,
        borderColor: body.borderColor,
        fontSize: body.fontSize,
        fontWeight: body.fontWeight,
        padding: body.padding,
        icon: body.icon,
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}

// DELETE /api/admin/announcements/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}
