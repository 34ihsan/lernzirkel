import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageBuilder from "@/components/admin/PageBuilder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [page, allPages] = await Promise.all([
    prisma.page.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { order: 'asc' }
        },
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    }),
    prisma.page.findMany({
      where: {
        id: { not: id }, // Cannot be its own parent
        slug: { not: 'home' } // Subpages under home don't make sense
      },
      select: {
        id: true,
        title: true,
        slug: true,
        parentId: true
      },
      orderBy: [{ order: 'asc' }, { title: 'asc' }]
    })
  ]);

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sayfa Düzenleyici</h1>
          <p className="text-sm text-gray-500">Blokları sürükleyip bırakarak sayfanızı tasarlayın, hiyerarşik üst sayfasını belirleyin.</p>
        </div>
      </div>
      
      {/* Client Component */}
      <PageBuilder page={page} initialSections={page.sections} availableParents={allPages} />
    </div>
  );
}
