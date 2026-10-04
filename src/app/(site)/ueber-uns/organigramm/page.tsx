import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowLeft, Network } from 'lucide-react';
import Image from 'next/image';

export default async function OrganigrammPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'ueber-uns/organigramm' },
    include: {
      parent: true,
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (page && page.isPublished && page.sections.length > 0) {
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
        <Breadcrumbs items={breadcrumbs} />
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticOrganigramm />;
}

function StaticOrganigramm() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Back Link */}
        <Link href="/ueber-uns" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zu Über Uns
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none p-8 md:p-14 border border-gray-100 dark:border-gray-800 flatsome-card">
          
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Struktur
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight flex items-center">
            Organigramm des Lernzirkel Ludwigshafen e.V.
          </h1>
          
          <div className="prose max-w-none text-gray-700 dark:text-gray-300 mt-10">
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none bg-white dark:bg-gray-900 p-4">
               {/* Using standard img for now since we are hot-linking to WP uploads. 
                   We will configure next/image domains later if needed, or download the image. */}
               <img 
                 src="https://lernzirkel-online.de/wp-content/uploads/2022/02/Organigramm-..png" 
                 alt="Organigramm des Lernzirkel Ludwigshafen e.V."
                 className="w-full h-auto object-contain"
               />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

