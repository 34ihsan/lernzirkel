import prisma from '@/lib/prisma';
import { getCachedCourses } from '@/lib/cached-content';
import SectionRenderer from '@/components/cms/SectionRenderer';
import AdvancedCourseExplorer from '@/components/courses/AdvancedCourseExplorer';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Alle Kurse & Bildungsangebote | Lernzirkel e.V. Ludwigshafen',
  description: 'Entdecken und filtern Sie alle BAMF-Integrationskurse, ESF+ Alpha Grundbildung, kostenlose BuT-Nachhilfe, telc Sprachprüfungen und Privatkurse beim Lernzirkel e.V. in Ludwigshafen.',
};

export default async function KursePage() {
  const [cmsPage, dbCourses] = await Promise.all([
    prisma.page.findUnique({
      where: { slug: 'kurse' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    }).catch(() => null),
    getCachedCourses().catch(() => [])
  ]);

  if (cmsPage && cmsPage.isPublished && cmsPage.sections.length > 0) {
    return (
      <article className="min-h-screen bg-background">
        {cmsPage.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
        {/* Enhanced course explorer below CMS sections */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <span className="text-accent font-bold uppercase tracking-wider text-xs md:text-sm mb-2 block">
                Kurskatalog & Suche
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
                Finden Sie das passende Programm
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Nutzen Sie die Volltextsuche und die Filter nach Sprachniveau, Förderung und Zeitformat.
              </p>
            </div>
            <AdvancedCourseExplorer initialCourses={dbCourses} />
          </div>
        </section>
      </article>
    );
  }

  return (
    <div className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800/40 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-accent font-bold uppercase tracking-wider text-xs md:text-sm mb-3 block">
            Integrationskurse • Grundbildung • Schülerförderung • telc
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-5 leading-tight tracking-tight">
            Alle Kurse & Bildungsangebote
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Als vom BAMF anerkannter Träger und offizielles telc Prüfungszentrum bieten wir ein vielfältiges Spektrum an Deutschkursen, kostenloser Schülerförderung (BuT) und Grundbildung in Ludwigshafen.
          </p>
        </div>

        {/* Advanced Course Explorer Component */}
        <AdvancedCourseExplorer initialCourses={dbCourses} />

        {/* Info Box: Förderung & Anerkennung */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-xs mb-2 block">
                Staatliche & Europäische Förderung
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Förderung & Kostenübernahme</h2>
              <p className="text-blue-100 text-base md:text-lg mb-6 leading-relaxed">
                Viele unserer Kurse und Nachhilfeangebote können zu 100% kostenlos besucht werden. Wir unterstützen Sie gerne Schritt für Schritt bei allen Anträgen.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'BAMF-Zulassung für Integrationskurse (Kostenbefreiung bei Bürgergeld / AsylbLG)',
                  'Kostenlose Schüler-Lernförderung über das Bildungs- und Teilhabepaket (BuT)',
                  'ESF+ EU-Förderung für Alpha- und Grundbildungskurse',
                  'Kostenübernahme durch Jobcenter oder Agentur für Arbeit möglich'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-blue-100 text-sm md:text-base">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-secondary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/kontakt" 
                className="flatsome-button bg-accent hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm dark:shadow-none inline-flex items-center gap-2"
              >
                <span>Persönliches Beratungsgespräch vereinbaren</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-900/10 rounded-2xl p-8 text-center border border-white/15">
              <GraduationCap className="w-20 h-20 mx-auto mb-4 text-white opacity-90" />
              <h3 className="text-2xl font-bold mb-2">BAMF anerkannt & telc Zentrum</h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Offiziell anerkannter Träger für Integrationskurse sowie lizenziertes telc Prüfungszentrum in Ludwigshafen am Rhein seit vielen Jahren.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
