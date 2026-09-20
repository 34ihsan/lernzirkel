import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export default async function GaleriePage() {
  const page = await prisma.page.findFirst({
    where: {
      OR: [
        { slug: 'galerie' },
        { slug: 'ueber-uns/galerie' }
      ],
      isPublished: true
    },
    include: {
      parent: true,
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (page && page.sections.length > 0) {
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
  // Placeholder images for the gallery. 
  // You can replace these URLs with your actual image paths from public/ or a CMS.
  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop', alt: 'Schüler lernen gemeinsam' },
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop', alt: 'Unterricht' },
    { src: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop', alt: 'Seminare' },
    { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop', alt: 'Sprachkurs' },
    { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop', alt: 'Bücher und Lernen' },
    { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop', alt: 'Gruppenarbeit' },
    { src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/pexels-ivan-samkov-8962373-scaled.jpg', alt: 'Projekt Alpha' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop', alt: 'Projekt' },
    { src: 'https://lernzirkel-online.de/wp-content/uploads/2016/08/Abiturvorbereitung.jpg', alt: 'Abitur' },
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 mr-2" />
            Einblicke
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Unsere Bildergalerie
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Machen Sie sich ein Bild von unserer Arbeit, unseren Räumlichkeiten und unseren erfolgreichen Projekten.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative h-64 md:h-80 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Image 
                src={image.src} 
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6">
                  <p className="text-white font-bold text-lg">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">Möchten Sie mehr über unsere Arbeit erfahren?</p>
          <a 
            href="/kontakt"
            className="inline-flex items-center justify-center bg-primary text-white hover:bg-primary/90 font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Kontaktieren Sie uns
          </a>
        </div>

      </div>
    </div>
  );
}
