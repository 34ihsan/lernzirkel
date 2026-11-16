import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyCronSecret } from "@/lib/cron-auth";

// Faz B: publishAt tarihi geçmiş ama henüz yayına alınmamış Page/Article kayıtlarını yayınlar.
// News modeli zaten publishDate alanıyla kendi zamanlamasını yapıyor, bu route'a dahil değil.
export async function GET(req: Request) {
  try {
    const authError = verifyCronSecret(req);
    if (authError) return authError;

    const now = new Date();

    const duePages = await prisma.page.updateMany({
      where: { isPublished: false, publishAt: { lte: now } },
      data: { isPublished: true },
    });

    const dueArticles = await prisma.article.updateMany({
      where: { isPublished: false, publishAt: { lte: now } },
      data: { isPublished: true },
    });

    if (duePages.count > 0 || dueArticles.count > 0) {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      status: "success",
      timestamp: now.toISOString(),
      publishedPages: duePages.count,
      publishedArticles: dueArticles.count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
