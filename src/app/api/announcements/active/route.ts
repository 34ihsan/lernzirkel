import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/announcements/active?slug=<page-slug>
 * Belirtilen sayfa için aktif ve tarih aralığında olan duyuruları döndürür.
 * slug parametresi opsiyoneldir; verilmezse "ALL" kapsamındaki duyurular döner.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") ?? "";
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Sayfa bazlı filtreleme
    const filtered = announcements.filter((a) => {
      if (a.targetScope === "ALL") return true;
      if (a.targetScope === "HOME") return slug === "" || slug === "/";
      if (a.targetScope === "SELECTED") {
        return a.targetPageSlugs.includes(slug);
      }
      return false;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Aktif duyurular alınamadı:", error);
    return NextResponse.json([], { status: 200 });
  }
}
