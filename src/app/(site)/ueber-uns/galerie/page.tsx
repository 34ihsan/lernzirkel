import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export default async function GaleriePage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'ueber-uns/galerie' },
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
      <article className="min-h-screen bg-gray-50">
        <Breadcrumbs items={breadcrumbs} />
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticGalerie />;
}

function StaticGalerie() {
  // Demo-Bilder für die Galerie (Unsplash Platzhalter)
  // Später können diese durch Bilder aus der Datenbank/CMS ersetzt werden
  const images = [
    { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', alt: 'Unterricht in kleinen Gruppen', category: 'Lernumgebung' },
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', alt: 'Unsere Dozenten im Einsatz', category: 'Team' },
    { src: 'https://images.unsplash.com/photo-1427504494785-319ce224a180?auto=format&fit=crop&q=80&w=800', alt: 'Projektarbeit', category: 'Projekte' },
    { src: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800', alt: 'Lernküche & gemeinsames Essen', category: 'Lernküche' },
    { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800', alt: 'Beratungsgespräch MFD', category: 'Beratung' },
    { src: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800', alt: 'Sprachcafé Treffen', category: 'Sprachcafé' },
  ];

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Einblicke</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Bildergalerie</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Machen Sie sich ein Bild von unserer täglichen Arbeit, unseren Räumlichkeiten und unseren gemeinsamen Projekten.
          </p>
        </div>

        {/* Gallery Grid (Flatsome Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {images.map((img, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl shadow-sm cursor-pointer bg-white aspect-[4/3] flatsome-card">
              
              {/* Image with zoom effect */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.src} 
                alt={img.alt} 
                className="object-cover w-full h-full transform transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex flex-col items-center justify-center p-4">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center text-center">
                  <span className="text-white font-bold text-lg mb-2 drop-shadow-md">
                    {img.alt}
                  </span>
                  <span className="text-white/80 text-sm font-medium uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">
                    {img.category}
                  </span>
                </div>
              </div>
              
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-6">Möchten Sie unsere Räumlichkeiten persönlich kennenlernen?</p>
          <Link href="/kontakt" className="flatsome-button">
            Besuchen Sie uns
          </Link>
        </div>

      </div>
    </div>
  );
}
