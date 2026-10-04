import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Globe, Sparkles, 
  CheckCircle2, HeartHandshake, ShieldCheck, MapPin, 
  Phone, Mail, BookOpen, ArrowRight, Coffee,
  Clock, Download, MessageSquare, Compass, Award,
  Home, Heart, AlertCircle, Bus, TreePine, Briefcase, GraduationCap
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Sprach Café – Deutsch sprechen, begegnen & austauschen | Lernzirkel Ludwigshafen e.V.',
  description: 'In entspannter Atmosphäre bei Kaffee und Kuchen Deutschkenntnisse üben und neue Leute kennenlernen. Immer montags von 15:00 bis 16:30 Uhr im Lernzirkel Ludwigshafen e.V. Kostenlos!',
};

export default async function SprachCafePage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/sprach-cafe' },
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

  return <StaticSprachCafe />;
}

function StaticSprachCafe() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Sprach Café', url: '/projekte/sprach-cafe', isCurrent: true },
  ];

  const topics = [
    {
      category: 'Land, Leute & Region',
      icon: Compass,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      items: [
        'Ludwigshafen und die Metropolregion – Vom Odenwald in die Pfalz',
        'Geschichtliches, Sehenswürdigkeiten & Ausflugsmöglichkeiten',
        'Besonderheiten von Stadt- und Landleben in der Region',
      ],
    },
    {
      category: 'Politik, Freiheit & Demokratie',
      icon: Globe,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      items: [
        'Einbürgerungstest als Weg, sich mit Deutschland vertraut zu machen',
        'Demokratie, Rechtsstaat und das Wahlsystem verstehen',
        'Philosophische Fragen: „Frei sein oder Frei haben?“',
      ],
    },
    {
      category: 'Familie, Sitten & Bräuche',
      icon: Heart,
      color: 'bg-rose-50 text-rose-800 border-rose-100',
      items: [
        'Feste und Feiertage im Jahreskreis (Weihnachten, Ostern, Advent etc.)',
        'Bedeutung von Bräuchen und wie sie gefeiert werden',
        'Interkultureller Austausch über Traditionen der Herkunftsländer',
      ],
    },
    {
      category: 'Alltagsleben & Soziales Miteinander',
      icon: Users,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      items: [
        'Familie, Kindererziehung und Generationendialog',
        'Freunde, Nachbarschaft & Gemeinschaftsleben in Ludwigshafen',
        'Haustiere und das Zusammenleben im Wohnumfeld',
      ],
    },
    {
      category: 'Rollenbilder: Mann & Frau',
      icon: HeartHandshake,
      color: 'bg-purple-50 text-purple-800 border-purple-100',
      items: [
        'Erwartungen, Hoffnungen und Rollenverständnis im Wandel',
        'Frauen im Alltag und Beruf',
        'Konstruktiver Umgang mit Missverständnissen und Konflikten',
      ],
    },
    {
      category: 'Gesundheit & Versorgung',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-100',
      items: [
        'Das deutsche Gesundheitssystem und Krankenversicherung',
        'Der richtige Ablauf beim Arztbesuch und in der Apotheke',
        'Notfallkontakte, Vorsorgeuntersuchungen und Medikamente',
      ],
    },
    {
      category: 'Wohnen & Mietkultur',
      icon: Home,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100',
      items: [
        'Mietverträge, Rechte und Pflichten als Mieter:in',
        'Hausordnungen, Ruhezeiten und gutes Nachbarschaftsverhältnis',
        'Wohnungssuche, Mülltrennung und Recycling',
      ],
    },
    {
      category: 'Essen & Trinken',
      icon: Coffee,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      items: [
        'Einkäufe: Supermarkt, Wochenmärkte und Hofläden',
        'Regionale Spezialitäten der Pfalz und internationale Küche',
        'Ernährungsgewohnheiten und kulinarischer Austausch',
      ],
    },
    {
      category: 'Kommunikation & Digitale Welt',
      icon: MessageSquare,
      color: 'bg-sky-50 text-sky-800 border-sky-100',
      items: [
        'Umgangsformen, Höflichkeit und alltägliche Sprachgewohnheiten',
        'Digitalisierung im Alltag, Internetnutzung & E-Mails',
        'Datenschutz und sicheres Verhalten im Netz',
      ],
    },
    {
      category: 'Bildung, Kita & Schule',
      icon: GraduationCap,
      color: 'bg-violet-50 text-violet-800 border-violet-100',
      items: [
        'Das Schulsystem in Rheinland-Pfalz und individuelle Förderung',
        'Ausbildungsmöglichkeiten und weiterführende Bildungswege',
        'Kindertagesstätte (Kita), Vorschule und Frühförderung',
      ],
    },
    {
      category: 'Beruf, Arbeitswelt & Karriere',
      icon: Briefcase,
      color: 'bg-cyan-50 text-cyan-800 border-cyan-100',
      items: [
        'Arbeitsmarkt, Berufseinstieg und Arbeitsplatzkultur',
        'Eigene Talente, Begabungen und berufliche Qualifikationen',
        'Karrierechancen, Weiterbildung und Zertifizierungen',
      ],
    },
    {
      category: 'Umwelt, Natur & Mobilität',
      icon: TreePine,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      items: [
        'Mülltrennung, Umweltschutz und Energiesparen im Haushalt',
        'ÖPNV (Bus & Bahn in Ludwigshafen/Mannheim) und Fernreisen',
        'Fahrradfahren, Verkehrsregeln und umweltfreundliche Fortbewegung',
      ],
    },
    {
      category: 'Freizeit, Kultur & Reisen',
      icon: Sparkles,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-800/80',
      items: [
        'Sport, Vereine, Theater, Konzerte, Kino und Ausstellungen',
        'Lokale Feste und Kulturangebote in Ludwigshafen',
        'Reisen, Urlaubsziele und der Austausch schöner Erinnerungen',
      ],
    },
    {
      category: 'Prävention & Sicherheit',
      icon: AlertCircle,
      color: 'bg-red-50 text-red-800 border-red-100',
      items: [
        'Suchtprävention und gesunder Umgang mit Smartphone & Internet',
        'Schutz vor Kostenfallen, Abofallen und Überschuldung',
        'Wichtige Beratungsstellen und Unterstützung in Notlagen',
      ],
    },
  ];

  const benefits = [
    'Lockere, freundliche Atmosphäre bei Kaffee, Tee und Gebäck',
    'Kein Notendruck, keine Prüfungen – freies Sprechen ohne Angst vor Fehlern',
    'Neue Kontakte zu Menschen aus über 25 verschiedenen Nationen',
    'Erweiterung des Alltagswortschatzes und interkulturelle Wissensvermittlung',
    'Erfahrene Moderator:innen leiten die Gesprächsrunden an',
    'Vollständig kostenlos – barrierefreier Zugang für alle',
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
          href="/projekte" 
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-sky-800 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Zurück zur Projektübersicht</span>
        </Link>

        {/* 2-Column Grid: Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article (Left 8 cols) */}
          <main className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-8">
            
            {/* Header Badge & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-full text-xs uppercase tracking-wider">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Offener Begegnungsort</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 font-semibold rounded-full text-xs">
                  <Clock className="w-3.5 h-3.5 text-sky-700" />
                  <span>Montags 15:00 – 16:30 Uhr</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kostenlos</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 font-semibold rounded-full text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Ab Niveau A2</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Sprach Café Ludwigshafen
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Deutschkenntnisse im Alltag vertiefen, neue Leute kennenlernen und Erfahrungen austauschen – bei Kaffee und Kuchen.
              </p>
            </div>

            {/* Featured Hero Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lernzirkel-online.de/wp-content/uploads/2021/11/Design-ohne-Titel-3.png"
                alt="Sprach Café Ludwigshafen e.V. – Gemeinsam Deutsch sprechen"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Text Content */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              
              {/* Termin-Callout Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-base sm:text-lg">
                  <Calendar className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>Das Sprach Café findet immer montags von 15:00 bis 16:30 Uhr statt!</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Sie haben die Möglichkeit, in gemütlicher Runde bei Kaffee und Kuchen neue Menschen aus der Region kennenzulernen und Ihre Deutschkenntnisse aktiv im Alltag zu üben und zu verbessern.
                </p>
              </div>

              {/* Rahmenbedingungen Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Teilnahme</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Vollständig kostenlos</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Ohne Kursgebühren</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Voraussetzung</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Mindestens Niveau A2</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Grundkenntnisse vorhanden</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Teilnahmeform</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Anmeldung erbeten</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Regelmäßigkeit erwünscht</p>
                </div>
              </div>

              {/* Flyer Download Banner */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">Offizieller SprachCafé Flyer</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Alle Informationen und Termine auf einen Blick</p>
                  </div>
                </div>
                <a
                  href="https://lernzirkel-online.de/wp-content/uploads/2024/12/Sprach-Cafe-flyer.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Flyer ansehen / herunterladen</span>
                </a>
              </div>

              {/* Themenschwerpunkte Heading */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Inhalte & Gesprächsthemen
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Vielfältige Themenschwerpunkte im Sprach Café
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  In jeder Sitzung widmen wir uns alltagsnahen, spannenden Themen, die Sie unmittelbar in Ihrem Leben in Deutschland unterstützen:
                </p>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topics.map((t, idx) => {
                  const Icon = t.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-5 rounded-2xl border ${t.color} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200`}
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{t.category}</h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                          {t.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Didaktik & Vorteile */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Warum sich der Besuch im Sprach Café lohnt</span>
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Sprache lernt man am nachhaltigsten durch aktives Sprechen und Zuhören! Im Sprach Café bieten wir Ihnen einen geschützten Raum, in dem Sie frei sprechen können, ohne Angst vor grammatikalischen Fehlern haben zu müssen. Unsere ehrenamtlichen Moderator:innen unterstützen Sie einfühlsam und helfen bei Wortschatzfragen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Callout: Wir freuen uns auf Sie */}
              <div className="p-6 rounded-2xl bg-amber-900 text-white space-y-2 shadow-md dark:shadow-none">
                <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-300" />
                  <span>Wir freuen uns auf Sie!</span>
                </h3>
                <p className="text-sm text-amber-200/90 leading-relaxed">
                  Egal ob Sie neu in Ludwigshafen angekommen sind oder schon länger hier leben und Ihr Deutsch für Alltag und Beruf auffrischen möchten: Bei uns sind Sie herzlich willkommen. Kommen Sie vorbei und bringen Sie gute Laune mit!
                </p>
              </div>

            </div>
          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Facts Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Auf einen Blick</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Sprach Café Details</h3>

              <div className="space-y-3 pt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Wann?</h5>
                    <p className="text-gray-500 dark:text-gray-400">Jeden Montag, 15:00 – 16:30 Uhr</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Kosten</h5>
                    <p className="text-gray-500 dark:text-gray-400">100 % kostenlos</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Sprachniveau</h5>
                    <p className="text-gray-500 dark:text-gray-400">Ab Niveau A2 empfohlen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Ort</h5>
                    <p className="text-gray-500 dark:text-gray-400">Ludwigsplatz 9a, 67059 Ludwigshafen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Registration Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Anmeldung & Fragen</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Machen Sie mit!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Wir bitten um kurze vorherige Anmeldung per E-Mail oder Telefon, damit wir Kaffee und Plätze vorbereiten können.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Treffpunkt:</span>
                    <span>Lernzirkel Ludwigshafen e.V.<br />Ludwigsplatz 9a, 67059 Ludwigshafen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Telefon:</span>
                    <a href="tel:062130737271" className="text-amber-800 hover:underline">0621 30737271</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">E-Mail:</span>
                    <EmailObfuscator 
                      user="info" 
                      domain="lernzirkel-online.de" 
                      showIcon={false}
                      className="text-amber-800 hover:underline font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-xs font-semibold text-white shadow-sm dark:shadow-none transition"
                >
                  <span>Jetzt anmelden / Kontakt aufnehmen</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/future-connect" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>Future Connect</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/menschen-staerken" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>Menschen stärken Menschen</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/konfliktmanagement" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>Stark im Umgang mit Konflikten</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/wir-sind-vielfalt" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>Wir Sind Vielfalt</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/bildungsmesse" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>Bildungsmesse</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/dsee" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-amber-900 transition"
                >
                  <span>DSEE Ehrenamt stärken</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              </nav>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
