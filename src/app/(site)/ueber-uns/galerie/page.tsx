import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { getCachedPageBySlug, getCachedPageById, getCachedGalleryMedia } from '@/lib/cached-content';
import { constructMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export async function generateMetadata() {
  const page = await getCachedPageBySlug('ueber-uns/galerie');
  if (page?.title) {
    return constructMetadata({
      title: page.title,
      description: page.description || undefined,
      image: page.ogImage || undefined,
      noIndex: page.noIndex,
    });
  }
  return constructMetadata({
    title: 'Bildergalerie',
    description: 'Einblicke in die tägliche Arbeit, die Räumlichkeiten und die gemeinsamen Projekte des Lernzirkel Ludwigshafen e.V.',
  });
}

export default async function GaleriePage() {
  const page = await getCachedPageBySlug('ueber-uns/galerie');

  if (page && page.isPublished && page.sections.length > 0) {
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentParent = page.parent;
    while (currentParent) {
      breadcrumbs.unshift({
        label: currentParent.title,
        url: `/${currentParent.slug}`
      });
      if (currentParent.parentId) {
        currentParent = await getCachedPageById(currentParent.parentId);
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

  return <DbGalerie />;
}

async function DbGalerie() {
  const items = await getCachedGalleryMedia();

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Einblicke</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Bildergalerie</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Machen Sie sich ein Bild von unserer täglichen Arbeit, unseren Räumlichkeiten und unseren gemeinsamen Projekten.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Demnächst finden Sie hier Fotos und Videos aus unserer Arbeit.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-sm dark:shadow-none bg-white dark:bg-gray-900 aspect-[4/3] flatsome-card">
                {item.type === 'VIDEO' && item.videoUrl ? (
                  <>
                    <video
                      src={item.videoUrl}
                      poster={item.thumbnailUrl || undefined}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <PlayCircle className="absolute top-3 right-3 text-white/90 drop-shadow pointer-events-none" size={22} />
                  </>
                ) : item.imageUrl ? (
                  <>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex flex-col items-center justify-center p-4 pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center text-center">
                        <span className="text-white font-bold text-lg mb-2 drop-shadow-md dark:shadow-none">
                          {item.title}
                        </span>
                        {item.category && (
                          <span className="text-white/80 text-sm font-medium uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Möchten Sie unsere Räumlichkeiten persönlich kennenlernen?</p>
          <Link href="/kontakt" className="flatsome-button">
            Besuchen Sie uns
          </Link>
        </div>

      </div>
    </div>
  );
}
