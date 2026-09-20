import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Link from 'next/link';
import { Target, Users, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export default async function UeberUnsPage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: 'ueber-uns' },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (cmsPage && cmsPage.isPublished && cmsPage.sections.length > 0) {
    return (
      <article className="min-h-screen bg-background">
        {cmsPage.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticUeberUns />;
}

function StaticUeberUns() {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Lernzirkel Ludwigshafen e.V.</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Unser Leitbild</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Gegründet im Januar 2002 als gemeinnütziger Verein in Ludwigshafen am Rhein, bieten wir vielfältige Angebote für Kinder, Jugendliche und Erwachsene an.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 md:p-14 rounded-xl shadow-sm border border-gray-100 flatsome-card">
          
          <div className="prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-primary flex items-center mb-6">
              <Target className="w-6 h-6 mr-3 text-accent" /> Unser Selbstverständnis und unsere Ziele
            </h3>
            <p className="mb-6 leading-relaxed">
              Mit unseren Angeboten wollen wir unserer gesellschaftlichen Verantwortung in Ludwigshafen und in der Region gerecht werden. Denn nur wenn Kindern, Jugendlichen und Erwachsenen ausreichend Möglichkeiten geboten werden, ihre Stärken und Potenziale zu entwickeln und bestehende Defizite abzubauen, können sie aktiv am gesellschaftlichen Leben teilhaben und ihren Beitrag zu einem friedlichen Miteinander leisten.
            </p>
            <p className="mb-10 leading-relaxed">
              Im Bereich der Erwachsenenbildung bieten wir Angebote an, die gezielt die Interessen und Bedürfnisse von Frauen, Jugendlichen, Eltern sowie Bürgerinnen und Bürgern mit und ohne Migrationshintergrund berücksichtigen. Dabei ist uns wichtig, dass der Zugang zu Bildungsangeboten allen Bevölkerungsgruppen, insbesondere auch sozial benachteiligten Teilnehmerinnen und Teilnehmern, ermöglicht wird.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-primary mb-3 flex items-center"><Award className="w-5 h-5 mr-2 text-primary-light" /> Wirtschaftlichkeit & Kundenorientierung</h4>
                <p className="text-sm leading-relaxed">Wirtschaftlichkeit bedeutet für uns, finanzielle Mittel effektiv einzusetzen. Bildungs-, sozial- oder gesellschaftspolitisch wichtige Angebote werden jedoch auch umgesetzt, wenn sie aus rein betriebswirtschaftlicher Sicht keine hohen Erträge erwarten lassen. Wir orientieren uns an den aktuellen Anforderungen des Ausbildungs- und Arbeitsmarktes.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-primary mb-3 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-primary-light" /> Qualitätssicherung</h4>
                <p className="text-sm leading-relaxed">Wir arbeiten nach den Grundsätzen der Qualitätssicherung. Wir verstehen uns als lernende Organisation, die ihr eigenes Handeln regelmäßig durch Evaluationen und Qualitätsaudits reflektiert und ihre Angebote und Prozesse im Interesse der Teilnehmerinnen und Teilnehmer kontinuierlich weiterentwickelt.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-primary flex items-center mb-6 mt-12">
              <Users className="w-6 h-6 mr-3 text-accent" /> Chancengleichheit und Vielfalt
            </h3>
            <p className="mb-6 leading-relaxed">
              Die Angebote des Vereins richten sich an alle Kinder, Jugendlichen und Erwachsenen, unabhängig von Geschlecht, nationaler, ethnischer, religiöser, kultureller oder sozialer Herkunft. Unsere Bildungsangebote stehen grundsätzlich allen geeigneten Teilnehmerinnen und Teilnehmern offen. Bei der Planung von Kursen berücksichtigen wir nach Möglichkeit familienfreundliche Rahmenbedingungen und Kurszeiten für alle Beteiligten.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center mb-6 mt-12">
              <HeartHandshake className="w-6 h-6 mr-3 text-accent" /> Gesellschaftliche Verantwortung
            </h3>
            <p className="mb-6 leading-relaxed">
              Wir sehen unsere Aufgabe nicht nur darin, Menschen bei Bildungsfragen und alltäglichen Herausforderungen zu unterstützen. Darüber hinaus engagieren wir uns im sozialen und gesellschaftlichen Bereich und möchten Menschen dazu ermutigen, Verantwortung für sich selbst und ihre Mitmenschen zu übernehmen.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
            <span>Ludwigshafen am Rhein, seit 2002</span>
            <span>Lernzirkel Ludwigshafen e.V.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
