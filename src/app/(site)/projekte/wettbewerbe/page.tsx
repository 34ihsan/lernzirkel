import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Sparkles, 
  CheckCircle2, ShieldCheck, MapPin, 
  Phone, Mail, ArrowRight, Award,
  Trophy, Heart, Beaker, Lightbulb, Compass,
  Layers, ExternalLink
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Wettbewerbe & Schülerinitiativen | Lernzirkel Ludwigshafen e.V.',
  description: 'Entdecken Sie die Wettbewerbe des Lernzirkel Ludwigshafen e.V.: „Wir sind Vielfalt“ zur Stärkung von Toleranz und die jährliche „Bildungsmesse“ für Forschergeist und Experimentierfreude.',
};

export default async function WettbewerbeOverviewPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/wettbewerbe' },
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

  return <StaticWettbewerbeHub />;
}

function StaticWettbewerbeHub() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Wettbewerbe', url: '/projekte/wettbewerbe', isCurrent: true },
  ];

  const subpages = [
    {
      id: 'wir-sind-vielfalt',
      title: 'Wir sind Vielfalt',
      tagline: 'Schüler- und Jugendwettbewerb für Toleranz & gesellschaftlichen Zusammenhalt',
      description: 'Ein jährlicher Wettbewerb für Jugendliche in Ludwigshafen und der Metropolregion. Zu einem partizipativ festgelegten Motto reichen junge Menschen Kunstwerke, Texte, Filme oder Schulhof-Aktionen ein. Die feierliche Prämierungsveranstaltung ehrt engagierte Beiträge öffentlich.',
      image: 'https://lernzirkel-online.de/wp-content/uploads/2016/08/Beitragsbild.jpg',
      url: '/projekte/wettbewerbe/wir-sind-vielfalt',
      badge: 'Demokratie & Vielfalt',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-50',
      highlights: [
        'Jährlich wechselndes Motto unter Mitbestimmung der Jugendlichen',
        'Beiträge in Bildender Kunst, Text & Wort, Film & Social Media',
        'Feierliche Prämierungsveranstaltung mit Urkunden & Preisen',
      ],
      ctaText: 'Zum Wettbewerb „Wir sind Vielfalt“',
    },
    {
      id: 'bildungsmesse',
      title: 'Bildungsmesse',
      tagline: 'Lernen, Forschen & Experimentieren: Schülerteams an eigenen Messeständen',
      description: 'Unsere Bildungsmesse findet einmal im Jahr statt. Ziel ist es, die Freude am Lernen und Forschen praktisch zu entfachen. Schülerinnen und Schüler bereiten in Kleingruppen Experimente vor, präsentieren sie an eigenen Ständen und das beste Projekt wird zum Sieger gekürt.',
      image: 'https://lernzirkel-online.de/wp-content/uploads/2016/08/Download-2-1.jpg',
      url: '/projekte/wettbewerbe/bildungsmesse',
      badge: 'MINT & Forschergeist',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-200',
      icon: Beaker,
      iconColor: 'text-amber-600 bg-amber-50',
      highlights: [
        'Einmal im Jahr mit interaktiven Messeständen und Live-Versuchen',
        'Praktisches Experimentieren in Naturwissenschaft & Technik',
        'Jurybewertung mit feierlicher Kür des Gewinnerteams',
      ],
      ctaText: 'Zur Projektseite „Bildungsmesse“',
    },
  ];

  const commonValues = [
    {
      title: 'Begeisterung & Motivation',
      desc: 'Lernen macht Spaß, wenn junge Menschen selbst aktiv gestalten, forschen und ihre eigenen Ideen verwirklichen dürfen.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
    },
    {
      title: 'Chancengleichheit',
      desc: 'Offen für alle Schulformen, Altersstufen und Hintergründe – 100 % kostenlose Teilnahme ohne finanzielle Barrieren.',
      icon: Compass,
      color: 'bg-sky-50 text-sky-800 border-sky-100',
    },
    {
      title: 'Teamgeist & Verantwortung',
      desc: 'In Kleingruppen gemeinsam an einem Ziel arbeiten, Aufgaben verteilen und soziale Verantwortung im Miteinander lernen.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    },
    {
      title: 'Öffentliche Wertschätzung',
      desc: 'Große Abschlussveranstaltungen mit Auszeichnungen, Urkunden und öffentlicher Sichtbarkeit für das Engagement.',
      icon: Award,
      color: 'bg-purple-50 text-purple-800 border-purple-100',
    },
  ];

  const comparisonRows = [
    {
      feature: 'Zielgruppe',
      vielfalt: 'Schüler:innen & Jugendliche aller Schulformen',
      messe: 'Schüler:innen & Teams in Kleingruppen',
    },
    {
      feature: 'Schwerpunkte',
      vielfalt: 'Toleranz, gegenseitige Achtung, Zivilcourage, Vielfalt',
      messe: 'Experimentieren, MINT, Naturwissenschaft & Technik',
    },
    {
      feature: 'Format',
      vielfalt: 'Kunst, Text, Video, Medien & Schulaktionen',
      messe: 'Eigene Messestände mit Live-Experimenten',
    },
    {
      feature: 'Turnus',
      vielfalt: 'Jährlich mit partizipativem Motto',
      messe: 'Einmal im Jahr (Jährliche Bildungsmesse)',
    },
    {
      feature: 'Prämierung',
      vielfalt: 'Öffentliche Auszeichnungsfeier & Urkunden',
      messe: 'Jurybewertung & Kür des besten Projekts',
    },
    {
      feature: 'Kosten',
      vielfalt: '100 % kostenfrei',
      messe: '100 % kostenfrei',
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-white">
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
          
          {/* Main Content (Left 8 cols) */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-950 font-bold rounded-full text-xs uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Wettbewerbe & Schülerinitiativen</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-950 font-semibold rounded-full text-xs">
                  <Calendar className="w-3.5 h-3.5 text-sky-700" />
                  <span>Jährliche Highlights</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kostenfreie Teilnahme</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Wettbewerbe beim Lernzirkel
              </h1>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Der Lernzirkel Ludwigshafen e.V. initiiert und begleitet jedes Jahr zwei herausragende Wettbewerbsformate für junge Menschen: den gesellschaftlichen Kreativwettbewerb <strong>„Wir sind Vielfalt“</strong> und die naturwissenschaftliche <strong>„Bildungsmesse“</strong>.
              </p>

              {/* Lead Alert */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Zwei Wege, ein Ziel:</strong> Jugendliche stärken, Talente sichtbar machen und den Dialog in Ludwigshafen und der Metropolregion Rhein-Neckar fördern.
                </div>
              </div>
            </div>

            {/* The 2 Sub-Pages Summary Cards */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-sky-700" />
                <span>Unsere beiden Wettbewerbsformate im Überblick</span>
              </h2>

              <div className="space-y-6">
                {subpages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article 
                      key={item.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 space-y-6"
                    >
                      {/* Top Bar with Icon & Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${item.iconColor} shadow-2xs`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor} mb-1`}>
                              {item.badge}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <Link
                          href={item.url}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 transition-colors self-start sm:self-auto"
                        >
                          <span>Direkt zur Einzelseite</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Image & Description Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-5 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                            {item.tagline}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Highlights */}
                          <div className="space-y-1.5 pt-1">
                            {item.highlights.map((h, hIdx) => (
                              <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[11px] text-gray-500">
                          Offizielle Unterseite mit allen Teilnahmebedingungen & Eckdaten
                        </span>
                        <Link
                          href={item.url}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-900 text-white text-xs font-semibold shadow-sm transition"
                        >
                          <span>{item.ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Gemeinsame Werte / Pädagogischer Leitgedanke */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Warum Wettbewerbe beim Lernzirkel?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Wettbewerbe sind bei uns keine Ausgrenzung, sondern eine Plattform für gemeinsame Spitzenleistungen und gelebte Wertschätzung.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {commonValues.map((val, idx) => {
                  const Icon = val.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-5 rounded-2xl border ${val.color} space-y-2`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white shadow-2xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-gray-900">{val.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direkter Vergleich / Steckbrief */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Die Formate im direkten Vergleich
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Auf einen Blick: Welches Format passt zu Ihrer Klasse oder Jugendgruppe?
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-gray-900 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Kriterium</th>
                      <th className="p-3.5 text-rose-950 bg-rose-50/60">Wir sind Vielfalt</th>
                      <th className="p-3.5 text-amber-950 bg-amber-50/60">Bildungsmesse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-gray-900">{row.feature}</td>
                        <td className="p-3.5 bg-rose-50/20">{row.vielfalt}</td>
                        <td className="p-3.5 bg-amber-50/20">{row.messe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Navigation Card to Subpages */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Übersicht</span>
              <h3 className="text-base font-bold text-gray-900">Wettbewerbe Unterseiten</h3>
              <p className="text-xs text-gray-500">
                Wählen Sie einen Wettbewerb für detaillierte Informationen:
              </p>

              <div className="space-y-2 pt-1">
                <Link
                  href="/projekte/wettbewerbe/wir-sind-vielfalt"
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 hover:bg-rose-100/70 text-rose-950 transition border border-rose-100 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Wir sind Vielfalt</div>
                      <div className="text-[11px] text-gray-500">Toleranz & Miteinander</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/projekte/wettbewerbe/bildungsmesse"
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 text-amber-950 transition border border-amber-100 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Beaker className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Bildungsmesse</div>
                      <div className="text-[11px] text-gray-500">Experimente & Forschung</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Mitmachen & Teilnehmen</span>
                <h3 className="text-base font-bold text-gray-900">Fragen zu den Wettbewerben?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ob Schule, Jugendtreff oder Schülerteam – unser Koordinationsteam beantwortet gerne Ihre Fragen.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Kontaktstelle:</span>
                    <span>Lernzirkel Ludwigshafen e.V.<br />Ludwigsplatz 9a, 67059 Ludwigshafen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Telefon:</span>
                    <a href="tel:062130737271" className="text-sky-700 hover:underline">0621 30737271</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 block">E-Mail:</span>
                    <EmailObfuscator 
                      user="info" 
                      domain="lernzirkel-online.de" 
                      showIcon={false}
                      className="text-sky-700 hover:underline font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-xs font-semibold text-white shadow-sm transition"
                >
                  <span>Kontakt aufnehmen / Anfragen</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/future-connect" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Future Connect</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/menschen-staerken" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Menschen stärken Menschen</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/konfliktmanagement" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Stark im Umgang mit Konflikten</span>
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
