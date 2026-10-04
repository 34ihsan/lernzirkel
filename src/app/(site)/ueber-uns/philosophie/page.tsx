import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Users, GraduationCap, Globe } from 'lucide-react';

export default async function PhilosophiePage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'ueber-uns/philosophie' },
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

  return <StaticPhilosophie />;
}

function StaticPhilosophie() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back Link */}
        <Link href="/ueber-uns" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zu Über Uns
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none p-8 md:p-14 border border-gray-100 dark:border-gray-800 flatsome-card">
          
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Unsere Geschichte
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Entstehung und Intension des Lernzirkel Ludwigshafen e.V.
          </h1>
          
          <div className="prose max-w-none text-gray-700 dark:text-gray-300">
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-accent" />
              Der gemeinnützige Verein
            </h3>
            <p className="text-lg leading-relaxed mb-8">
              Entstanden aus einer Privatinitiative engagierter Eltern, Studenten, Pädagogen sowie Sozialarbeitern und ehrenamtlichen Bürgern der Stadt im <strong>Januar 2002</strong> hat sich „der Lernzirkel“ (wie er mittlerweile von allen gekürzt bezeichnet wird) schnell zu einem Knotenpunkt für bildungsnahe, als auch bildungsferne Bürger entwickelt.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-accent" />
              Ein Ort des Lernens und interkulturellen Austausches
            </h3>
            <p className="leading-relaxed mb-6">
              Sowohl in der Jugendarbeit als auch in der Erwachsenenbildung hat er sich von Jahr zu Jahr weiter entwickelt. Nach dem Umzug des Vereins im Januar 2011 sind aus ehemals 3 nun mittlerweile 12 Unterrichtsräume geworden. Im Jahr 2022 konnte zu den bestehenden Räumlichkeiten eine vollständige zweite Etage angemietet werden. Diese dienen vor allem dem Ausbau der Erwachsenenbildung.
            </p>

            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary my-10">
              <h4 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                Wir betreuen Menschen aus über 25 Ländern
              </h4>
              <p className="mb-0">
                Unser Team bestehend aus ehrenamtlichen Helfern, Pädagogen, Dozenten und Studenten gibt jeden Tag sein Bestes, um den Menschen, die unsere Hilfe suchen, ein Weiterkommen zu sichern. Das Angebot ist offen und richtet sich an alle Menschen, die wir auf ihrem Weg in eine bessere Zukunft verhelfen wollen.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-accent" />
              Die Schwerpunkte unserer Arbeit
            </h3>
            <p className="leading-relaxed mb-8">
              Die Schwerpunkte unserer Arbeit bestehen heute in der <strong>Jugendarbeit, Erwachsenenbildung und in sozialen Projekten</strong>. Sowohl im Bereich der Nachhilfe als auch in der Sprachausbildung ist der Lernzirkel eine wichtige Stütze des Ludwigshafener Bildungswesens geworden.
            </p>
            <p className="leading-relaxed">
              Auch das Engagement innerhalb verschiedenster kultureller und sozialer Projekte zeigt den hohen Stellenwert, den sich der Verein nach nun fast zwanzigjährigem Bestehen erarbeitet hat.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

