import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-server";

// GET /api/admin/pages/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { order: "asc" }
        },
        sections: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Sayfa alınamadı", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pages/[id] kaldırıldı — Tier 1 ile birlikte kaydetme/yayınlama akışı
// src/actions/pages.ts'teki saveDraft/publishPage server action'larına taşındı
// (revizyon geçmişi + optimistic-lock + taslak/canlı ayrımı için).

// DELETE /api/admin/pages/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({ where: { id } });

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    if (page.slug === "home") {
      return NextResponse.json({ error: "Ana sayfa silinemez!" }, { status: 400 });
    }

    await prisma.page.delete({ where: { id } });
    revalidatePath("/admin/pages");
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Sayfa silinemedi", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
