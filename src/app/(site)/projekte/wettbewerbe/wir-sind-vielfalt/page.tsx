import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Globe, Sparkles, 
  CheckCircle2, HeartHandshake, ShieldCheck, MapPin, 
  Phone, Mail, BookOpen, ArrowRight, Award,
  Palette, MessageSquare, Lightbulb, Heart, Compass
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Wir sind Vielfalt – Jährlicher Wettbewerb für Schüler & Jugendliche | Lernzirkel Ludwigshafen e.V.',
  description: 'Der Schüler- und Jugendwettbewerb „Wir sind Vielfalt“ stärkt Toleranz, gegenseitige Achtung und soziales Miteinander in Ludwigshafen und der Region. Jährlich mit wechselnden Mottos und feierlicher Preisverleihung.',
};

export default async function WirSindVielfaltPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/wettbewerbe/wir-sind-vielfalt' },
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

  return <StaticWirSindVielfalt />;
}

function StaticWirSindVielfalt() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Wettbewerbe', url: '/projekte/wettbewerbe' },
    { label: 'Wir sind Vielfalt', url: '/projekte/wettbewerbe/wir-sind-vielfalt', isCurrent: true },
  ];

  const coreValues = [
    {
      title: 'Toleranz & Akzeptanz',
      desc: 'Vorurteile abbauen, unterschiedliche Lebensentwürfe und kulturelle Hintergründe wertschätzend als Bereicherung verstehen.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-800 border-rose-100',
    },
    {
      title: 'Gegenseitiges Verständnis',
      desc: 'Perspektiven wechseln, einander aufmerksam zuhören und das Verbindende über das Trennende stellen.',
      icon: Compass,
      color: 'bg-sky-50 text-sky-800 border-sky-100',
    },
    {
      title: 'Gegenseitige Achtung',
      desc: 'Die unantastbare Würde jedes Einzelnen als festes Fundament eines respektvollen und friedlichen Miteinanders.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    },
    {
      title: 'Soziale Verantwortung',
      desc: 'Zivilcourage im Alltag zeigen, Mitverantwortung für die Gemeinschaft übernehmen und schwächere Mitschüler:innen stärken.',
      icon: Users,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
    },
  ];

  const formats = [
    {
      title: 'Kreativ & Bildende Kunst',
      desc: 'Zeichnungen, Gemälde, Skulpturen, Collagen oder Fotoreihen zu den jeweiligen Jahresthemen.',
      icon: Palette,
    },
    {
      title: 'Wort & Text',
      desc: 'Gedichte, Essays, Poetry Slam Texte, Kurzgeschichten oder Reportagen.',
      icon: BookOpen,
    },
    {
      title: 'Digitale Medien & Film',
      desc: 'Kurzfilme, Podcasts, Video-Interviews, Social-Media-Kampagnen oder Web-Projekte.',
      icon: Lightbulb,
    },
    {
      title: 'Aktionen & Projekte',
      desc: 'Gemeinsame Schulhof-Initiativen, interkulturelle Begegnungstage und Solidaritätsaktionen.',
      icon: HeartHandshake,
    },
  ];

  const highlights = [
    'Jährlich wechselndes Motto unter direkter Mitbestimmung der Jugendlichen',
    'Offen für alle Schulformen, Jugendgruppen und Altersstufen',
    'Feierliche Prämierungsveranstaltung mit öffentlicher Auszeichnung und Urkunden',
    'Stärkung demokratischer Werte und Förderung des interkulturellen Dialogs',
    'Kostenlose Teilnahme für alle teilnehmenden Schüler:innen',
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
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-100 text-rose-900 font-bold rounded-full text-xs uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-rose-700" />
                  <span>Wettbewerb & Jugendinitiative</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-semibold rounded-full text-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Jährliche Auszeichnung</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kostenlos</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Wir sind Vielfalt
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Der Wettbewerb für Schüler:innen und Jugendliche zur Förderung von Toleranz, sozialer Verantwortung und Zusammenleben in Vielfalt.
              </p>
            </div>

            {/* Featured Hero Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lernzirkel-online.de/wp-content/uploads/2016/08/Beitragsbild.jpg"
                alt="Wir sind Vielfalt – Schüler- und Jugendwettbewerb"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Text Content */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              
              {/* Lead Motto Block */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 text-slate-800 shadow-2xs space-y-2">
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  Der Wettbewerb unter dem Titel <strong>„Wir sind Vielfalt“</strong> richtet sich an Schüler und Jugendliche. Er wird jährlich ausgetragen.
                </p>
                <p className="text-sm text-slate-600">
                  Die Wettbewerbsreihe zielt darauf ab, sowohl das pluralistische Verständnis als auch das Gemeinsame in der Gesellschaft weiter zu fördern.
                </p>
              </div>

              {/* Leitgedanke & Werte */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Werte für ein gelebtes Miteinander
                </h2>
                <p>
                  Dazu sollen Werte, die wichtig für das Miteinander der Bürger sind und dem Zusammenleben in Vielfalt dienen, vermittelt bzw. gestärkt werden – wie z.B. <strong>Toleranz, Verständnis, gegenseitige Achtung und soziale Verantwortung</strong>.
                </p>
              </div>

              {/* 4 Core Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-5 rounded-2xl border ${v.color} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200`}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{v.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Jährliches Motto & Partizipation */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span>Partizipatives Konzept & Jährlich wechselndes Motto</span>
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Der Name <strong>„Wir sind Vielfalt“</strong> stellt den verlässlichen Rahmen für ein sich jährlich änderndes Wettbewerbsthema bzw. Motto dar.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Besonderer Wert wird auf Partizipation gelegt: <strong>Die Themen werden unter aktiver Beteiligung der Schüler und Jugendlichen festgelegt</strong>, sodass Fragen verhandelt werden, die junge Menschen in ihrem Alltag und Lebensumfeld wirklich bewegen.
                </p>
              </div>

              {/* Regionale Verankerung & Öffentliche Ehrung */}
              <div className="p-6 rounded-2xl bg-sky-900 text-white space-y-3 shadow-md dark:shadow-none">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                  Anerkennung & Festliche Prämierung
                </span>
                <p className="text-sm sm:text-base leading-relaxed text-sky-100">
                  Dieser Wettbewerb soll mit der Beteiligung insbesondere der jugendlichen Bürger ein fester Bestandteil der Kultur- und Bildungslandschaft in der Region Ludwigshafen, Mainz und Umgebung sein. <strong>Die Teilnehmer werden im Rahmen einer festlichen Prämierungsveranstaltung öffentlich für ihre Bemühungen geehrt.</strong>
                </p>
              </div>

              {/* Mögliche Beitragsformen */}
              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Mögliche Beitragsformate
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Jugendliche können ihre Ideen in den unterschiedlichsten Formen einreichen:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {formats.map((f, idx) => {
                    const Icon = f.icon;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-start gap-3 shadow-2xs">
                        <div className="p-2 rounded-lg bg-slate-50 text-sky-700 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">{f.title}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Highlights Checkmarks */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Der Wettbewerb auf einen Blick
                </h3>
                <div className="space-y-2.5">
                  {highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Facts Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Eckdaten</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Wettbewerbs-Steckbrief</h3>

              <div className="space-y-3 pt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Zielgruppe</h5>
                    <p className="text-gray-500 dark:text-gray-400">Schüler:innen & Jugendliche aller Schulformen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Turnus</h5>
                    <p className="text-gray-500 dark:text-gray-400">Jährlich mit wechselnden Schwerpunktthemen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Auszeichnung</h5>
                    <p className="text-gray-500 dark:text-gray-400">Öffentliche Prämierungsveranstaltung & Urkunden</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-gray-100">Teilnahme</h5>
                    <p className="text-gray-500 dark:text-gray-400">100 % kostenlos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Registration Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Mitmachen & Einreichen</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Fragen zum Wettbewerb?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ob als teilnehmende Gruppe, Lehrkraft oder Schule – wenden Sie sich gerne jederzeit an unser Organisationsteam.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Kontaktstelle:</span>
                    <span>Lernzirkel Ludwigshafen e.V.<br />Ludwigsplatz 9a, 67059 Ludwigshafen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Telefon:</span>
                    <a href="tel:062130737271" className="text-rose-700 hover:underline">0621 30737271</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">E-Mail:</span>
                    <EmailObfuscator 
                      user="info" 
                      domain="lernzirkel-online.de" 
                      showIcon={false}
                      className="text-rose-700 hover:underline font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-xs font-semibold text-white shadow-sm dark:shadow-none transition"
                >
                  <span>Kontakt aufnehmen / Anfragen</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/wettbewerbe/bildungsmesse" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
                >
                  <span>Bildungsmesse</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/future-connect" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
                >
                  <span>Future Connect</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/menschen-staerken" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
                >
                  <span>Menschen stärken Menschen</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/konfliktmanagement" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
                >
                  <span>Stark im Umgang mit Konflikten</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/sprach-cafe" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
                >
                  <span>Sprach-Café</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/dsee" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-900 transition"
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
