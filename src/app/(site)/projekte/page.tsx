import prisma from '@/lib/prisma';
import { getCachedProjects } from '@/lib/cached-content';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Link from 'next/link';
import { ArrowRight, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';
import { Reveal, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { ProjectSkeleton } from '@/components/skeletons/ProjectSkeleton';

export const metadata = {
  title: 'Projekte & Engagement | Lernzirkel',
  description: 'Wir engagieren uns aktiv im sozialen Bereich, um gesellschaftliche Teilhabe nachhaltig zu fördern.',
};

export default async function ProjektePage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: 'projekte' },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  const hasCmsSections = cmsPage && cmsPage.isPublished && cmsPage.sections.length > 0;

  return (
    <article className="min-h-screen bg-background">
      {/* If CMS has sections, render them first */}
      {hasCmsSections && (
        <div className="mb-16">
          {cmsPage.sections.map((section: any) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      )}

      {/* Dynamic Projects Grid */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          
          {!hasCmsSections && (
            <Reveal direction="up" delay={0.1} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Gesellschaftliche Verantwortung</span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Projekte & Engagement</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Wir sehen unsere Aufgabe nicht nur darin, Menschen bei Bildungsfragen zu unterstützen, sondern engagieren uns auch aktiv im sozialen Bereich, um gesellschaftliche Teilhabe nachhaltig zu fördern.
              </p>
            </Reveal>
          )}

          <Suspense fallback={<ProjectSkeleton />}>
            <ProjectGrid />
          </Suspense>
          
        </div>
      </div>
    </article>
  );
}

async function ProjectGrid() {
  const dbProjects = await getCachedProjects();

  if (dbProjects.length === 0) {
    return (
      <FadeIn delay={0.2} className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-400 mb-2">Noch keine Projekte online</h3>
        <p className="text-gray-500 dark:text-gray-400">Neue Projekte werden in Kürze hier veröffentlicht.</p>
      </FadeIn>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {dbProjects.map((p) => (
        <StaggerItem key={p.id} className="h-full">
          <Link href={`/projekte/${p.id}`} className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full">
            <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-800/50 overflow-hidden flex items-center justify-center">
              {p.imageUrl ? (
                <Image 
                  src={p.imageUrl} 
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-primary/30" />
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm dark:shadow-none">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  {p.status}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed line-clamp-3 text-sm">{p.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-50">
                <span className="text-accent font-bold inline-flex items-center group-hover:text-accent/80 transition-colors text-sm tracking-wider uppercase">
                  Mehr erfahren <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
