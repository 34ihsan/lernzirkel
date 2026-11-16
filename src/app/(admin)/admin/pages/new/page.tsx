import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewPageForm from "@/components/admin/NewPageForm";

export const dynamic = "force-dynamic";

export default async function NewPage({
  searchParams
}: {
  searchParams?: Promise<{ parentId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialParentId = resolvedSearchParams.parentId;

  // Fetch available parent pages
  const parentPages = await prisma.page.findMany({
    where: {
      slug: { not: 'home' }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      parentId: true
    },
    orderBy: [
      { order: 'asc' },
      { title: 'asc' }
    ]
  });

  // "Mevcut bir sayfayı kopyala" seçeneği için tüm sayfalar (ana sayfa dahil, o da kopyalanabilir).
  const allPages = await prisma.page.findMany({
    select: { id: true, title: true, slug: true, parentId: true },
    orderBy: [{ order: 'asc' }, { title: 'asc' }]
  });

  async function createPage(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const rawSlug = formData.get("slug") as string;
    let description = formData.get("description") as string;
    const parentId = (formData.get("parentId") as string) || null;
    const order = parseInt(formData.get("order") as string) || 0;
    const copyFromPageId = (formData.get("copyFromPageId") as string) || null;

    if (!title || !rawSlug) return;

    // Otomatik SEO oluşturma (Eğer boş bırakıldıysa)
    if (!description || description.trim() === "") {
      description = `${title} - Lernzirkel Ludwigshafen e.V. Eğitim, danışmanlık ve entegrasyon projelerimizle yanınızdayız. Detaylı bilgi için sayfamızı inceleyin.`;
    }

    // Clean raw slug
    const cleanRawSlug = rawSlug.replace(/^\/+|\/+$/g, '').trim();

    let fullSlug = cleanRawSlug;
    if (parentId) {
      const parent = await prisma.page.findUnique({
        where: { id: parentId },
        select: { slug: true }
      });
      if (parent && !cleanRawSlug.startsWith(parent.slug + '/')) {
        fullSlug = `${parent.slug}/${cleanRawSlug}`;
      }
    }

    // Kopyalama modu: kaynak sayfanın bölümlerini (içerik/tasarım) yeni sayfaya klonla.
    const sourceSections = copyFromPageId
      ? await prisma.section.findMany({ where: { pageId: copyFromPageId }, orderBy: { order: 'asc' } })
      : [];

    const page = await prisma.page.create({
      data: {
        title,
        slug: fullSlug,
        description,
        parentId: parentId || null,
        order,
        isPublished: false, // start as draft
        ...(sourceSections.length > 0 && {
          sections: {
            create: sourceSections.map((s, index) => ({
              type: s.type,
              content: JSON.parse(JSON.stringify(s.content)),
              design: JSON.parse(JSON.stringify(s.design)),
              order: index,
            })),
          },
        }),
      }
    });

    redirect(`/admin/pages/${page.id}`);
  }

  return (
    <NewPageForm
      parentPages={parentPages}
      allPages={allPages}
      initialParentId={initialParentId}
      onSubmitAction={createPage}
    />
  );
}
