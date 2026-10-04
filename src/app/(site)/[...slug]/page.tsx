import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import SectionRenderer from "@/components/cms/SectionRenderer";
import Breadcrumbs, { BreadcrumbItem } from "@/components/common/Breadcrumbs";

import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugString = slug.join("/");

  // 1. Exact match lookup
  let page = await prisma.page.findUnique({
    where: { slug: slugString },
    include: {
      parent: true,
      sections: {
        orderBy: { order: "asc" }
      }
    }
  });

  // 2. Fallback lookup: if accessed by leaf slug (e.g. /philosophie instead of /ueber-uns/philosophie)
  if (!page) {
    const leaf = slug[slug.length - 1];
    const candidate = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: { endsWith: `/${slugString}` } },
          { slug: { endsWith: `/${leaf}` } },
          { slug: leaf }
        ],
        isPublished: true
      },
      include: {
        parent: true,
        sections: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (candidate) {
      if (candidate.slug !== slugString) {
        redirect(`/${candidate.slug}`);
      }
      page = candidate;
    }
  }

  if (!page || !page.isPublished) {
    notFound();
  }

  // Resolve breadcrumb trail for child pages
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentParent = page.parent;
  while (currentParent) {
    breadcrumbs.unshift({
      label: currentParent.title,
      url: `/${currentParent.slug}`
    });
    if (currentParent.parentId) {
      currentParent = await prisma.page.findUnique({
        where: { id: currentParent.parentId }
      });
    } else {
      break;
    }
  }

  breadcrumbs.push({
    label: page.title,
    url: `/${page.slug}`,
    isCurrent: true
  });

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs.map(b => ({ name: b.label, url: b.url })))} />
      {page.slug !== 'home' && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      {page.sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </article>
  );
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugString = slug.join("/");

  let page = await prisma.page.findUnique({
    where: { slug: slugString }
  });

  if (!page) {
    const leaf = slug[slug.length - 1];
    page = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: { endsWith: `/${slugString}` } },
          { slug: { endsWith: `/${leaf}` } },
          { slug: leaf }
        ],
        isPublished: true
      }
    });
  }

  if (!page) {
    return constructMetadata({ title: "Seite nicht gefunden", noIndex: true });
  }

  return constructMetadata({
    title: page.title,
    description: page.description || undefined,
    url: `https://www.lernzirkel-ludwigshafen.de/${page.slug}`,
  });
}

