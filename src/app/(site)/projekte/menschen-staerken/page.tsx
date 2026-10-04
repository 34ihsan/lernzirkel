import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Globe, Sparkles, 
  CheckCircle2, HeartHandshake, ShieldCheck, MapPin, 
  Phone, Mail, Briefcase, BookOpen, Smile, Award, ArrowRight,
  Compass, Ticket
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Patenschaft „MENSCHEN STÄRKEN MENSCHEN“ | Lernzirkel Ludwigshafen e.V.',
  description: 'Das Patenschaftsprogramm „Menschen stärken Menschen“ beim Lernzirkel Ludwigshafen e.V. begleitet Menschen mit Flucht- und Migrationshintergrund bei Arbeit, Bildung und gesellschaftlicher Teilhabe.',
};

export default async function MenschenStaerkenPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/menschen-staerken' },
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

  return <StaticMenschenStaerken />;
}

function StaticMenschenStaerken() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Menschen stärken Menschen', url: '/projekte/menschen-staerken', isCurrent: true },
  ];

  const focusAreas = [
    {
      title: 'Suche nach Arbeit',
      desc: 'Praktische Orientierung auf dem Arbeitsmarkt, Hilfe bei Bewerbungsunterlagen und Vorbereitung auf Vorstellungsgespräche.',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'Gesellschaftliche Teilhabe',
      desc: 'Teilhabe am städtischen Leben durch gemeinsame Freizeit-, Kultur- und Sportaktivitäten in Ludwigshafen und der Region.',
      icon: Compass,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      title: 'Kulturelle Umgangsformen',
      desc: 'Kennenlernen von Gepflogenheiten, Alltagskultur und behördlichen Abläufen in einer offenen und respektvollen Atmosphäre.',
      icon: Globe,
      color: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      title: 'Freundschaften knüpfen',
      desc: 'Begegnungen auf Augenhöhe, offener Erfahrungsaustausch und das Entstehen stabiler, bereichernder persönlicher Kontakte.',
      icon: HeartHandshake,
      color: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    {
      title: 'Gemeinsam lernen',
      desc: 'Unterstützung beim Deutschlernen, in der Schule oder in Ausbildungsfragen für dauerhaften Bildungserfolg.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
  ];

  const benefits = [
    'Bildung von individuellen Paten-Pärchen passend zu Interessen und Bedürfnissen',
    'Kostenlose gemeinsame Ausflüge und Veranstaltungen (z. B. Holiday Park, Kino, Museum etc.)',
    'Feste Begleitung und Ansprechpartner durch das erfahrene Team des Lernzirkel Ludwigshafen e.V.',
    'Persönlicher Gewinn und Horizonterweiterung für Pat:innen wie auch Mentees',
    '100 % kostenlose Teilnahme für alle Beteiligten',
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
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Patenschaftsprogramm</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 font-semibold rounded-full text-xs">
                  <Calendar className="w-3.5 h-3.5 text-sky-700" />
                  <span>Bundesprogramm & Fortlaufend</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 font-semibold rounded-full text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Kostenlos</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Patenschaft „MENSCHEN STÄRKEN MENSCHEN“
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Gemeinsam Perspektiven schaffen: Miteinander lernen, Kultur erleben und verlässliche Partnerschaften aufbauen.
              </p>
            </div>

            {/* Featured Hero Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lernzirkel-online.de/wp-content/uploads/2016/09/Slide_Integration.jpg"
                alt="Patenschaft Menschen stärken Menschen – Integration und Zusammenhalt"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Text Content */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              
              {/* Lead Motto Block */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100 text-slate-800 shadow-2xs">
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  <strong>„Mit Unterstützung schafft man alles. Deshalb spielt das Miteinander eine große Rolle.“</strong>
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Das bundesweite Programm <strong>„Menschen stärken Menschen“</strong> bringt Menschen mit 
                  Flucht- und Migrationshintergrund mit engagierten Bürgerinnen und Bürgern zusammen, um individuelle 
                  Patenschaften auf Augenhöhe zu stiften.
                </p>
              </div>

              {/* Schwerpunkte Heading */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Worin unterstützt das Programm?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Eine Patenschaft orientiert sich ganz flexibel an den konkreten Lebensbedürfnissen der Geflüchteten und Neuzugewanderten:
                </p>
              </div>

              {/* 5 Focus Areas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {focusAreas.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border ${item.color} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200`}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{item.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Tandem-Modell Explanation */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-700" />
                  <span>Wie funktioniert das Tandem-Modell?</span>
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Hierbei bilden wir als <strong>Lernzirkel Ludwigshafen e.V.</strong> passgenaue Paten-Pärchen 
                  und führen Pat(inn)en und Menschen mit Flucht- und Migrationshintergrund zusammen. 
                  Gemeinsam bestimmen die Tandems, wie oft sie sich treffen und welche Ziele sie verfolgen möchten – 
                  ob Unterstützung bei Behördengängen, das gemeinsame Üben der deutschen Sprache oder 
                  die Begleitung bei schulischen und beruflichen Fragen.
                </p>
              </div>

              {/* Excursions & Activities Box */}
              <div className="bg-amber-50/70 rounded-2xl p-6 sm:p-8 border border-amber-200/80 space-y-3">
                <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-700" />
                  <span>Kostenlose Veranstaltungen & Freizeitangebote</span>
                </h3>
                <p className="text-sm text-amber-950/90 leading-relaxed">
                  Die Tandems können im Rahmen des Programms regelmäßige gemeinsame Ausflüge und Freizeitaktivitäten unternehmen – 
                  vollkommen kostenlos! Dazu gehören beispielsweise gemeinsame Besuche im 
                  <strong> Holiday Park, Kinonachmittage, Museumsbesuche</strong> und weitere kulturelle Unternehmungen.
                </p>
              </div>

              {/* Feedback Callout Quote */}
              <div className="p-6 rounded-2xl bg-sky-900 text-white space-y-3 shadow-md dark:shadow-none">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                  Erfahrungen & Wirkung
                </span>
                <blockquote className="text-sm sm:text-base italic leading-relaxed text-sky-100">
                  „Wir erhalten sowohl von den Pat(inn)en als auch von den Mentees eine tolle Rückmeldung. 
                  Viele von ihnen erzählten von den vielen positiven Auswirkungen der Patenschaft auf ihr Leben und ihren Alltag.“
                </blockquote>
                <p className="text-xs text-sky-300 font-medium">
                  — Lernzirkel Ludwigshafen e.V. Begleitteam
                </p>
              </div>

              {/* Advantages / Checkmarks List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Ihre Vorteile auf einen Blick
                </h3>
                <div className="space-y-2.5">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Costs */}
              <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-sm space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Kosten & Voraussetzungen</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Für die offizielle Teilnahme muss lediglich eine standardisierte <strong>Patenschaftsvereinbarung</strong> ausgefüllt werden. 
                  Das gesamte Programm ist <strong>vollständig kostenlos</strong> für alle Teilnehmenden.
                </p>
              </div>

              {/* Förderer Logos & Institutional Backing */}
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                    Förderung & Unterstützung
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Dieses Projekt wird unterstützt und gefördert durch
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Der Paritätische */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center gap-4 shadow-2xs hover:shadow-sm dark:shadow-none transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://lernzirkel-online.de/wp-content/uploads/2020/01/der-paritaetische-v2_LOGO-300x150.jpg" 
                      alt="Der Paritätische Wohlfahrtsverband" 
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">Der Paritätische Wohlfahrtsverband</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Spitzenverband der Freien Wohlfahrtspflege</p>
                    </div>
                  </div>

                  {/* BAFzA */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center gap-4 shadow-2xs hover:shadow-sm dark:shadow-none transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://lernzirkel-online.de/wp-content/uploads/2020/04/Bafza-300x124.png" 
                      alt="Bundesamt für Familie und zivilgesellschaftliche Aufgaben (BAFzA)" 
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">Bundesamt für Familie und zivilgesellschaftliche Aufgaben (BAFzA)</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Bundesministerium für Familie, Senioren, Frauen und Jugend</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Facts Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Programmdetails</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Steckbrief Patenschaft</h3>

              <div className="space-y-3 pt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Kosten</h5>
                    <p className="text-gray-500 dark:text-gray-400">100 % kostenlos (gefördert)</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Zielgruppe</h5>
                    <p className="text-gray-500 dark:text-gray-400">Geflüchtete, Zuwanderer & ehrenamtliche Pat:innen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Standort</h5>
                    <p className="text-gray-500 dark:text-gray-400">Ludwigsplatz 9a, Ludwigshafen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Ticket className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Aktivitäten</h5>
                    <p className="text-gray-500 dark:text-gray-400">Lernen, Freizeit, Ausflüge (Freizeitpark, Kino u.v.m.)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Registration Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Mitmachen & Anfragen</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Interesse an einer Patenschaft?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Wenn Sie Unterstützung brauchen oder selbst Pate bzw. Patin werden möchten, freuen wir uns auf Ihre Nachricht oder Ihren Anruf!
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Adresse:</span>
                    <span>Lernzirkel Ludwigshafen e.V.<br />Ludwigsplatz 9a, 67059 Ludwigshafen</span>
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

              <div className="pt-2">
                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-xs font-semibold text-white shadow-sm dark:shadow-none transition"
                >
                  <span>Jetzt Patenschaft anfragen / Pate werden</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/future-connect" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Future Connect</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/sprach-cafe" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Sprach-Café</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/konfliktmanagement" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Konfliktmanagement</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/wir-sind-vielfalt" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Wir Sind Vielfalt</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/bildungsmesse" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Bildungsmesse</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/dsee" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
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
