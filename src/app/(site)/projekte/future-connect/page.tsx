import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Globe, Sparkles, 
  CheckCircle2, HeartHandshake, ShieldCheck, MapPin, 
  Phone, Mail, Clock, ArrowRight, Award, ExternalLink
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Future Connect – Generationen vernetzen für morgen | Lernzirkel Ludwigshafen e.V.',
  description: 'Ein generationenübergreifender Lern- und Begegnungsraum in Ludwigshafen: Jugendliche und Senior:innen lernen gemeinsam digitale Alltagsthemen.',
};

export default async function FutureConnectPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/future-connect' },
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

  return <StaticFutureConnect />;
}

function StaticFutureConnect() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Future Connect', url: '/projekte/future-connect', isCurrent: true },
  ];

  const galleryImages = [
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2026/05/GNS_5599-Gruppe-246x246.jpg',
      alt: 'Future Connect Gruppenfoto',
      title: 'Tandem-Gruppe',
      caption: 'Gemeinsames Lernen im Workshop'
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2026/05/GNS_5603-Gruppe-Jubel-246x246.jpg',
      alt: 'Teilnehmende feiern Projekterfolg',
      title: 'Erfolgreicher Abschluss',
      caption: 'Begeisterung über digitale Fortschritte'
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2026/05/MS26_32_-Premierungsveranstaltung-246x246.jpg',
      alt: 'Prämierungsveranstaltung Future Connect',
      title: 'Prämierungsveranstaltung',
      caption: 'Anerkennung und feierliche Übergabe'
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2026/05/MS26_Workshop_73-246x246.jpg',
      alt: 'Digitaler Workshop in Kleingruppen',
      title: 'Digital-Workshop',
      caption: 'Smartphone- & Tableteinweisung'
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2026/05/MS26_Workshop_74-246x246.jpg',
      alt: 'Praxisnaher Austausch auf Augenhöhe',
      title: 'Austausch auf Augenhöhe',
      caption: 'Jugendliche begleiten Senior:innen'
    },
  ];

  const partners = [
    { name: 'Lernzirkel Ludwigshafen e.V.', role: 'Projektträger & Koordination' },
    { name: 'Ela Frauennetzwerk e.V.', role: 'Kooperationspartner' },
    { name: 'Fontäne Kulturzentrum e.V.', role: 'Kooperationspartner' },
    { name: 'Seniorenrat Ludwigshafen', role: 'Kooperationspartner' },
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
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-100 text-sky-800 font-bold rounded-full text-xs uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-sky-700" />
                  <span>Gesellschaftliches Projekt</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 font-semibold rounded-full text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Laufzeit: 2026</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Future Connect – Generationen vernetzen für morgen
              </h1>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lernzirkel-online.de/wp-content/uploads/2026/05/KI-generiert-750x458.jpg"
                alt="Future Connect – Generationen vernetzen für morgen"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Text Content */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              
              <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                Mit <strong>„Future Connect – Generationen vernetzen für morgen“</strong> schaffen der Lernzirkel Ludwigshafen e.V., 
                Ela Frauennetzwerk e.V., Fontäne Kulturzentrum e.V. sowie der Seniorenrat Ludwigshafen einen 
                generationenübergreifenden Lern- und Begegnungsraum in Ludwigshafen.
              </p>

              <p>
                Die Projektidee entstand aus Gesprächen mit Jugendlichen und Studierenden, die ihr digitales Wissen nicht nur privat nutzen, 
                sondern aktiv gesellschaftlich einbringen möchten – als Beitrag zu Solidarität, Nachbarschaft und einer zukunftsfähigen Stadtgesellschaft.
              </p>

              {/* Highlight Box: Tandem-Workshops */}
              <div className="bg-sky-50/70 rounded-2xl p-6 border border-sky-100 space-y-3">
                <h3 className="text-base font-bold text-sky-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-700" />
                  <span>Lernen auf Augenhöhe in Tandem-Workshops</span>
                </h3>
                <p className="text-sm text-sky-950/90 leading-relaxed">
                  Im Mittelpunkt des Projekts stehen regelmäßige Tandem-Workshops in Kleingruppen. Jugendliche und junge Erwachsene 
                  unterstützen Senior:innen praxisnah bei digitalen Alltagsthemen wie Smartphone-Nutzung, Online-Kommunikation, 
                  digitalen Anwendungen und Sicherheit im Internet. Gleichzeitig bringen ältere Teilnehmende ihre Lebens-, 
                  Berufs- und Alltagserfahrungen ein. Dadurch entsteht ein gegenseitiges Lernen auf Augenhöhe.
                </p>
              </div>

              <p>
                „Future Connect“ greift zudem ein aktuelles gesellschaftliches Thema auf: die zunehmende Einsamkeit sowohl älterer als auch 
                jüngerer Menschen. Durch regelmäßige Begegnungen, gemeinsame Lernprozesse und persönliche Gespräche entstehen neue soziale 
                Kontakte und langfristige Verbindungen.
              </p>

              <p>
                Ein weiterer Schwerpunkt des Projekts ist die <strong>interkulturelle Öffnung</strong>. Viele beteiligte junge Menschen sind mehrsprachig 
                und bringen unterschiedliche kulturelle Hintergründe mit. Dadurch entstehen neue Perspektiven, gegenseitiges Verständnis und ein 
                respektvoller Dialog zwischen Generationen und Kulturen.
              </p>

              {/* Maßnahmen Box */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Unsere Maßnahmen</span>
                </h3>
                
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Vorbereitung und Qualifizierung junger Lernbegleiter:innen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Gewinnung und Begleitung der Senior:innen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Regelmäßige Tandem-Workshops zu digitalen Alltagsthemen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Reflexions- und Austauschrunden</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Öffentlicher „Zukunftstag der Generationen“ in Ludwigshafen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0"></span>
                    <span>Evaluation, Dokumentation und nachhaltige Weiterentwicklung des Projekts</span>
                  </li>
                </ul>
              </div>

              {/* Projektdauer & Ziel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Projektdauer</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Das Projekt findet im Laufe des Jahres 2026 statt.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Ziel</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Digitale Teilhabe stärken, gesellschaftlichen Zusammenhalt fördern und nachhaltige Begegnungsräume schaffen.
                  </p>
                </div>
              </div>

              {/* Förderer BASF */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                  Förderung & Unterstützung
                </span>
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Gefördert mit freundlicher Unterstützung durch die BASF</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Gemeinsam für digitale Bildung, interkulturellen Dialog und gesellschaftliche Teilhabe in Ludwigshafen.
                    </p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://lernzirkel-online.de/wp-content/uploads/2026/05/BASF-Logo-300x78.png" 
                    alt="BASF Logo" 
                    className="h-10 w-auto object-contain shrink-0"
                  />
                </div>
              </div>

              {/* Photo Gallery Grid */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">
                    Bilder & Eindrücke
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Impressionen aus den Future Connect Workshops</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xs hover:shadow-md dark:shadow-none transition duration-200 bg-slate-100"
                    >
                      <div className="aspect-square relative w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.src} 
                          alt={img.alt} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-white text-[11px] font-medium leading-tight">{img.caption}</p>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-gray-900 text-center">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{img.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Project Partners Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Kooperationspartner</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Gemeinsam für Ludwigshafen</h3>

              <div className="space-y-3 pt-2">
                {partners.map((partner, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 dark:text-gray-100">{partner.name}</h5>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{partner.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Ansprechpartner */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Mitmachen & Fragen</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Interesse an Future Connect?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ob als junger Lernbegleiter oder als teilnehmender Senior – wir freuen uns über Ihre Kontaktaufnahme!
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">Ort der Workshops:</span>
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
                  <span>Jetzt anmelden / Kontakt aufnehmen</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/menschen-staerken" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-sky-900 transition"
                >
                  <span>Menschen stärken Menschen</span>
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
