import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/announcements — tüm duyuruları listele
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Duyurular alınamadı" }, { status: 500 });
  }
}

// POST /api/admin/announcements — yeni duyuru oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        message: body.message,
        isActive: body.isActive ?? true,
        isCloseable: body.isCloseable ?? true,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        targetScope: body.targetScope ?? "ALL",
        targetPageSlugs: body.targetPageSlugs ?? [],
        type: body.type ?? "banner",
        position: body.position ?? "top",
        backgroundColor: body.backgroundColor ?? "#1a6d92",
        textColor: body.textColor ?? "#ffffff",
        borderColor: body.borderColor ?? "transparent",
        fontSize: body.fontSize ?? "14px",
        fontWeight: body.fontWeight ?? "normal",
        padding: body.padding ?? "12px 16px",
        icon: body.icon ?? "none",
      },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Duyuru oluşturulamadı:", error);
    return NextResponse.json({ error: "Duyuru oluşturulamadı" }, { status: 500 });
  }
}
