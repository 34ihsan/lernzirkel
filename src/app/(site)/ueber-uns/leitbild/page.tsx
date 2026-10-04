import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Target, HeartHandshake, ShieldCheck, Award, 
  Users, Sparkles, Building2, Phone, Mail, MapPin, 
  Clock, CheckCircle2, ChevronRight, BookOpen, GraduationCap, Compass
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Leitbild des Lernzirkel Ludwigshafen e.V. | Über uns',
  description: 'Leitbild, Werte, Ziele und gesellschaftliche Verantwortung des gemeinnützigen Vereins Lernzirkel Ludwigshafen e.V. seit 2002.',
};

export default async function LeitbildPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'ueber-uns/leitbild' },
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
      <article className="min-h-screen bg-slate-50/50">
        <Breadcrumbs items={breadcrumbs} />
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticLeitbild />;
}

function StaticLeitbild() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Über uns', url: '/ueber-uns' },
    { label: 'Leitbild', url: '/ueber-uns/leitbild', isCurrent: true },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl py-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-6">
        {/* Back Link */}
        <Link 
          href="/ueber-uns" 
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-sky-800 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Zurück zur Übersicht „Über uns“</span>
        </Link>

        {/* 2-Column Grid: Content + Info Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article (Left 8 cols) */}
          <main className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
            {/* Header Badge & Title */}
            <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-100 text-sky-800 font-bold rounded-full text-xs uppercase tracking-wider mb-4">
                <Target className="w-3.5 h-3.5 text-sky-700" />
                <span>Werte & Orientierung</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Leitbild des Lernzirkel Ludwigshafen e.V.
              </h1>
            </div>

            {/* Entry Content (Pristine text from original page) */}
            <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              
              {/* Introduction */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-700" />
                  <span>Leitbild des Lernzirkel</span>
                </h2>
                <p>
                  Der <strong>Lernzirkel Ludwigshafen e.V.</strong> wurde im <strong>Januar 2002</strong> als gemeinnütziger Verein in Ludwigshafen am Rhein gegründet.
                </p>
                <p>
                  Seit seiner Gründung bietet der Verein mit seinen qualifizierten Mitarbeiterinnen und Mitarbeitern vielfältige Angebote für Kinder, Jugendliche und Erwachsene an. Damit begegnen wir der Nachfrage in den Bereichen Kinder- und Jugendarbeit, Elternarbeit, Grundbildung für Erwachsene sowie Erziehungs- und Bildungsarbeit in der Metropolregion Rhein-Neckar.
                </p>
              </div>

              {/* Offers List */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Zu den Angeboten des Lernzirkel Ludwigshafen e.V. gehören insbesondere:
                </h3>

                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  {/* Category 1 */}
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sky-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-sky-700" />
                      <span>1. Kinder- und Jugendarbeit</span>
                    </h4>
                    <ul className="pl-6 space-y-1 list-disc text-gray-600 dark:text-gray-400">
                      <li><strong>a)</strong> Intensive Nachhilfe in kleinen Gruppen oder im Einzelunterricht (alle Fächer von der 2. bis zur 13. Klasse)</li>
                      <li><strong>b)</strong> Gezielte Vorbereitung auf Klassenarbeiten und Prüfungen, wie Mittlere Reife oder Abitur</li>
                      <li><strong>c)</strong> Hausaufgabenbetreuung</li>
                      <li><strong>d)</strong> Freizeitangebote</li>
                      <li><strong>e)</strong> Mentoring und Jugendbetreuung</li>
                      <li><strong>f)</strong> Ferienprogramme</li>
                    </ul>
                  </div>

                  {/* Category 2 */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <h4 className="font-bold text-sky-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-700" />
                      <span>2. Erwachsenenbildung</span>
                    </h4>
                    <ul className="pl-6 space-y-1 list-disc text-gray-600 dark:text-gray-400">
                      <li><strong>a)</strong> BAMF-Integrationskurse</li>
                      <li><strong>b)</strong> Landesgeförderte Sprachkurse</li>
                      <li><strong>c)</strong> ESF-Plus-Alphabetisierungs- und Grundbildungskurse für Erwachsene</li>
                      <li><strong>d)</strong> telc-Prüfungen</li>
                      <li><strong>e)</strong> Intensive Beratung und Betreuung durch den Migrationsfachdienst</li>
                      <li><strong>f)</strong> Projekte im Bereich der Erwachsenenbildung</li>
                    </ul>
                  </div>

                  {/* Category 3 */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <h4 className="font-bold text-sky-900 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-sky-700" />
                      <span>3. Kulturelle und soziale Projekte</span>
                    </h4>
                    <ul className="pl-6 space-y-1 list-disc text-gray-600 dark:text-gray-400">
                      <li><strong>a)</strong> Patenschaftsprojekt „Menschen stärken Menschen“</li>
                      <li><strong>b)</strong> Sprachcafé</li>
                      <li><strong>c)</strong> Verschiedene Projekte für Ehrenamtliche und Interessierte sowie im Bereich der Demokratiebildung</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section: Selbstverständnis */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Unser Selbstverständnis und unsere Ziele</span>
                </h3>
                <p>
                  Mit unseren Angeboten wollen wir unserer gesellschaftlichen Verantwortung in Ludwigshafen und in der Region gerecht werden. Denn nur wenn Kindern, Jugendlichen und Erwachsenen ausreichend Möglichkeiten geboten werden, ihre Stärken und Potenziale zu entwickeln und bestehende Defizite abzubauen, können sie aktiv am gesellschaftlichen Leben teilhaben und ihren Beitrag zu einem friedlichen Miteinander leisten.
                </p>
                <p>
                  Im Bereich der Erwachsenenbildung bieten wir Angebote an, die gezielt die Interessen und Bedürfnisse von Frauen, Jugendlichen, Eltern sowie Bürgerinnen und Bürgern mit und ohne Migrationshintergrund berücksichtigen. Dabei ist uns wichtig, dass der Zugang zu Bildungsangeboten allen Bevölkerungsgruppen, insbesondere auch sozial benachteiligten Teilnehmerinnen und Teilnehmern, ermöglicht wird.
                </p>
                <p>
                  Der Lernzirkel Ludwigshafen e.V. steht Personen und Institutionen in Fragen der Bildung und Weiterbildung beratend zur Verfügung.
                </p>
                <p>
                  Ausgangspunkt unserer Angebote sind aktuelle gesellschaftliche Entwicklungen. Dementsprechend reagieren wir auf politische, soziale, kulturelle sowie bildungs- und arbeitsmarktpolitische Veränderungen. Wir entwickeln und verbessern unser Angebot kontinuierlich weiter und orientieren uns dabei an den Bedarfen und der Nachfrage vor Ort.
                </p>
              </div>

              {/* Section: Wirtschaftlichkeit */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>Wirtschaftlichkeit und Kundenorientierung</span>
                </h3>
                <p>
                  Wirtschaftlichkeit bedeutet für uns, die zur Verfügung stehenden finanziellen Mittel möglichst effektiv und effizient einzusetzen und gleichzeitig neue Aufgabenfelder zu erschließen, die für die Gesellschaft von Bedeutung sind.
                </p>
                <p>
                  Wirtschaftlichkeit bedeutet für uns jedoch nicht, ausschließlich Angebote durchzuführen, die einen wirtschaftlichen Erfolg versprechen. Bildungs-, sozial- oder gesellschaftspolitisch wichtige Angebote können ebenfalls umgesetzt werden, auch wenn sie aus rein betriebswirtschaftlicher Sicht keine hohen Erträge erwarten lassen.
                </p>
                <p>
                  Mit Kundenorientierung und Qualitätsbewusstsein arbeitet der Lernzirkel Ludwigshafen e.V. für Bildung und Weiterbildung in Ludwigshafen und der Metropolregion Rhein-Neckar und leistet damit einen Beitrag zur gesellschaftlichen Teilhabe und Lebensqualität der Bürgerinnen und Bürger.
                </p>
                <p>
                  Insbesondere im Bereich der beruflichen Bildung und Weiterbildung orientiert der Lernzirkel Ludwigshafen e.V. seine Angebote an den aktuellen Anforderungen des Ausbildungs- und Arbeitsmarktes.
                </p>
              </div>

              {/* Section: Qualitätssicherung */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Qualitätssicherung und kontinuierliche Verbesserung</span>
                </h3>
                <p>
                  Wir arbeiten nach den Grundsätzen der Qualitätssicherung. Unser Qualitätsmanagementsystem erstreckt sich insbesondere auf Service, Beratung, Programmplanung, Angebotsentwicklung, Fortbildung sowie regelmäßige Evaluationen.
                </p>
                <p>
                  Wir verstehen uns als lernende Organisation, die ihr eigenes Handeln regelmäßig durch Evaluationen und Qualitätsaudits reflektiert und ihre Angebote und Prozesse im Interesse der Teilnehmerinnen und Teilnehmer kontinuierlich weiterentwickelt.
                </p>
              </div>

              {/* Section: Chancengleichheit */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  <span>Chancengleichheit und Vielfalt</span>
                </h3>
                <p>
                  Die Angebote des Vereins richten sich an alle Kinder, Jugendlichen und Erwachsenen, unabhängig von Geschlecht, nationaler, ethnischer, religiöser, kultureller oder sozialer Herkunft.
                </p>
                <p>
                  Unsere Bildungsangebote stehen grundsätzlich allen geeigneten Teilnehmerinnen und Teilnehmern offen. Eine zielgruppenspezifische Ausrichtung einzelner Angebote ist möglich, wenn dies aufgrund der jeweiligen Konzeption oder Förderbedingungen vorgesehen ist.
                </p>
                <p>
                  Bei der Planung und Durchführung unserer Angebote achten wir auf Chancengleichheit, Vielfalt und einen respektvollen Umgang miteinander.
                </p>
                <p>
                  Bei der Planung von Kursen und Bildungsangeboten berücksichtigen wir nach Möglichkeit familienfreundliche Rahmenbedingungen und Kurszeiten für Teilnehmerinnen und Teilnehmer sowie für unsere Mitarbeiterinnen und Mitarbeiter.
                </p>
              </div>

              {/* Section: Gesellschaftliche Verantwortung */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-600" />
                  <span>Gesellschaftliche Verantwortung</span>
                </h3>
                <p>
                  Wir sehen unsere Aufgabe nicht nur darin, Menschen bei Bildungsfragen und alltäglichen Herausforderungen zu unterstützen. Darüber hinaus engagieren wir uns im sozialen und gesellschaftlichen Bereich und möchten Menschen dazu ermutigen, Verantwortung für sich selbst und ihre Mitmenschen zu übernehmen.
                </p>
                <p>
                  Unser Ziel ist es, durch Bildung, Beratung, Unterstützung und gesellschaftliches Engagement die persönliche Entwicklung, Chancengleichheit und gesellschaftliche Teilhabe der Menschen in Ludwigshafen und der Metropolregion Rhein-Neckar nachhaltig zu fördern.
                </p>
              </div>

              {/* Sign-off */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>Ludwigshafen am Rhein</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Lernzirkel Ludwigshafen e.V.</p>
              </div>

            </div>
          </main>

          {/* Sidebar / Info Card (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Contact Card Widget */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Kontakt & Träger</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Lernzirkel Ludwigshafen e.V.</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gemeinnütziger Verein • Seit 2002</p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Adresse:</span>
                    <span>Ludwigsplatz 9a<br />67059 Ludwigshafen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Telefon:</span>
                    <a href="tel:062130737271" className="text-sky-700 hover:underline">0621 30737271</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">E-Mail:</span>
                    <EmailObfuscator 
                      user="info" 
                      domain="lernzirkel-online.de" 
                      showIcon={false}
                      className="text-sky-700 hover:underline"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                <Link
                  href="/oeffnungszeiten"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-700" />
                    <span>Öffnungszeiten & Ansprechpartner</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-xs font-semibold text-white shadow-sm dark:shadow-none transition"
                >
                  <span>Kontakt aufnehmen</span>
                </Link>
              </div>
            </div>

            {/* Subpages Quick Navigation */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weitere Bereiche</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/ueber-uns/philosophie" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Entstehung und Intention</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/ueber-uns/organigramm" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Organigramm & Team</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/ueber-uns/satzung" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Satzung & Organisation</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/ueber-uns/raeumlichkeiten" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Räumlichkeiten am Ludwigsplatz</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/spenden" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Spenden & Unterstützen</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
              </nav>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
