import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function parseJsonSafely(val: any) {
  if (!val) return {};
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return { text: val };
    }
  }
  return {};
}

// GET /api/admin/pages/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

// PUT /api/admin/pages/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { sections, title, slug, description, isPublished, parentId, order } = body;

    // Prevent cycle where page is its own parent
    if (parentId && parentId === id) {
      return NextResponse.json({ error: "Bir sayfa kendisinin üst sayfası olamaz." }, { status: 400 });
    }
    
    await prisma.$transaction(async (tx) => {
      // update page metadata if provided
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug.replace(/^\/+/, "").trim();
      if (description !== undefined) updateData.description = description;
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (parentId !== undefined) updateData.parentId = parentId || null;
      if (order !== undefined) updateData.order = typeof order === 'number' ? order : parseInt(order) || 0;

      if (Object.keys(updateData).length > 0) {
        await tx.page.update({
          where: { id },
          data: updateData
        });
      }

      // delete existing sections
      await tx.section.deleteMany({
        where: { pageId: id }
      });
      
      // create new sections
      if (sections && sections.length > 0) {
        const createData = sections.map((s: any, index: number) => ({
          pageId: id,
          type: s.type,
          content: parseJsonSafely(s.content),
          design: parseJsonSafely(s.design),
          order: index
        }));
        
        await tx.section.createMany({
          data: createData
        });
      }
    });

    const updated = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" }
        }
      }
    });

    revalidatePath("/", "layout");
    if (updated?.slug) {
      revalidatePath(`/${updated.slug}`);
    }

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    console.error("Error saving page:", error);
    return NextResponse.json(
      { error: "Sayfa kaydedilemedi", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
