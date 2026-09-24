import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Globe, Sparkles, 
  CheckCircle2, HeartHandshake, ShieldCheck, MapPin, 
  Phone, Mail, BookOpen, ArrowRight, ShieldAlert,
  Clock, Award, MessageCircle, Heart, Zap
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Projekt: „Stark im Umgang mit Konflikten und Krisen – Kompetenzen für Engagierte“ | Lernzirkel Ludwigshafen e.V.',
  description: 'Qualifizierungsworkshops in Ludwigshafen: Resilienz, Gewaltfreie Kommunikation, Deeskalation und Krisenkompetenz für ehrenamtlich Engagierte – gefördert durch die Deutsche Postcode Lotterie.',
};

export default async function KonfliktmanagementPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'projekte/konfliktmanagement' },
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

  return <StaticKonfliktmanagement />;
}

function StaticKonfliktmanagement() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Projekte', url: '/projekte' },
    { label: 'Stark im Umgang mit Konflikten', url: '/projekte/konfliktmanagement', isCurrent: true },
  ];

  const modules = [
    {
      nr: 'Modul 1',
      date: '05.09.2026',
      time: '12:00 – 15:30 Uhr',
      title: 'Konflikte verstehen & konstruktiv lösen',
      desc: 'Konfliktdynamiken analysieren, Ursachen und Eskalationsstufen frühzeitig erkennen sowie deeskalierende Handlungsmethoden erarbeiten.',
      icon: ShieldAlert,
      color: 'border-l-sky-500 bg-sky-50/40 text-sky-900',
    },
    {
      nr: 'Modul 2',
      date: '18.09.2026',
      time: '16:00 – 19:30 Uhr',
      title: 'Resilienz & Selbstfürsorge stärken',
      desc: 'Wahrnehmung eigener Belastungsgrenzen, Burnout-Prävention, emotionale Stabilität und gesunde Grenzziehung im anspruchsvollen Ehrenamt.',
      icon: Heart,
      color: 'border-l-rose-500 bg-rose-50/40 text-rose-900',
    },
    {
      nr: 'Modul 3',
      date: '26.09.2026',
      time: '12:00 – 15:30 Uhr',
      title: 'Gewaltfreie Kommunikation (GFK)',
      desc: 'Bedürfnisorientierte Gesprächsführung nach Marshall Rosenberg: Beobachten ohne zu bewerten, Gefühle klären und lösungsorientierte Bitten formulieren.',
      icon: MessageCircle,
      color: 'border-l-emerald-500 bg-emerald-50/40 text-emerald-900',
    },
    {
      nr: 'Modul 4',
      date: '10.10.2026',
      time: '12:00 – 15:30 Uhr',
      title: 'Krisenbewältigung & Handlungssicherheit',
      desc: 'Souveränes, klares Handeln in akuten Not- und Krisensituationen, emotionale Erste Hilfe und Kooperation mit professionellen Unterstützungsstrukturen.',
      icon: ShieldCheck,
      color: 'border-l-amber-500 bg-amber-50/40 text-amber-900',
    },
    {
      nr: 'Modul 5',
      date: '17.10.2026',
      time: '12:00 – 15:30 Uhr',
      title: 'Praxisorientiertes Lernen durch Interaktion',
      desc: 'Praxisnahe Rollenspiele, Simulation realer Alltagssituationen und die Bearbeitung konkreter Fallbeispiele direkt aus dem Engagement der Teilnehmenden.',
      icon: Zap,
      color: 'border-l-indigo-500 bg-indigo-50/40 text-indigo-900',
    },
    {
      nr: 'Modul 6',
      date: '24.10.2026',
      time: '12:00 – 15:30 Uhr',
      title: 'Peer-Coaching, Vernetzung & Engagement',
      desc: 'Kollegiale Beratung unter Engagierten, nachhaltiger Netzwerkaufbau zwischen Initiativen und Weitergabe von Kompetenzen als Multiplikator:innen.',
      icon: Users,
      color: 'border-l-purple-500 bg-purple-50/40 text-purple-900',
    },
  ];

  const highlights = [
    'Praxisnahe Workshops statt trockener Theorie (Rollenspiele, Fallbeispiele & Reflexion)',
    'Vermittlung konkreter Deeskalations- und Kommunikationsstrategien',
    'Stärkung der mentalen Widerstandskraft und Burnout-Prävention im Ehrenamt',
    'Interkultureller Austausch auf Augenhöhe zwischen Aktiven unterschiedlicher Initiativen',
    'Nachhaltiger Multiplikationseffekt durch kollegiales Peer-Coaching',
    'Vollständig kostenlose Teilnahme durch die Förderung der Postcode Lotterie',
  ];

  const partners = [
    { name: 'Lernzirkel Ludwigshafen e.V.', role: 'Projektträger & Koordination' },
    { name: 'Ela Frauennetzwerk e.V.', role: 'Kooperationspartner' },
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
          
          {/* Main Article (Left 8 cols) */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm border border-gray-200 space-y-8">
            
            {/* Header Badge & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-full text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>Qualifizierung & Resilienz</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 font-semibold rounded-full text-xs">
                  <Calendar className="w-3.5 h-3.5 text-sky-700" />
                  <span>Workshop-Reihe Herbst 2026</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kostenlos</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Projekt: „Stark im Umgang mit Konflikten und Krisen – Kompetenzen für Engagierte“
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Psychosoziale Kompetenzen, Deeskalation und Resilienz für ehrenamtlich Engagierte in Ludwigshafen.
              </p>
            </div>

            {/* Featured Hero Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lernzirkel-online.de/wp-content/uploads/2026/05/KI-generiertes-Symbolbild-750x458.jpg"
                alt="Projekt Stark im Umgang mit Konflikten und Krisen – Kompetenzen für Engagierte"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Text Content */}
            <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
              
              {/* Lead Motto Block */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-sky-50 border border-purple-100 text-slate-800 shadow-2xs">
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  Der <strong>Lernzirkel Ludwigshafen e.V.</strong> setzt gemeinsam mit dem <strong>Ela Frauennetzwerk e.V.</strong> das 
                  Projekt <em>„Stark im Umgang mit Konflikten und Krisen – Kompetenzen für Engagierte“</em> um.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Das Projekt richtet sich an ehrenamtlich engagierte Menschen, die sich aktiv für Integration, Bildung, 
                  gesellschaftliche Teilhabe und sozialen Zusammenhalt einsetzen – insbesondere an Menschen mit eigener 
                  Migrationsgeschichte in Vereinen, Initiativen und Nachbarschaftsprojekten.
                </p>
              </div>

              {/* Problemstellung & Hintergrund */}
              <div className="space-y-3.5">
                <h2 className="text-xl font-bold text-gray-900">
                  Herausforderungen im ehrenamtlichen Alltag begegnen
                </h2>
                <p>
                  Ehrenamtliches Engagement ist eine tragende Säule unserer Gesellschaft. Viele engagierte Menschen unterstützen 
                  Geflüchtete, begleiten Kinder und Jugendliche, organisieren Bildungsangebote oder schaffen Begegnungsräume für 
                  unterschiedliche Kulturen und Generationen. Gleichzeitig steigen die Herausforderungen im sozialen Alltag stetig an. 
                  Konflikte innerhalb von Gruppen, emotionale Belastungen, Kommunikationsprobleme oder der Umgang mit Menschen in 
                  Krisensituationen gehören mittlerweile häufig zum Alltag vieler Engagierter.
                </p>
                <p>
                  Gerade Menschen, die sich langfristig ehrenamtlich einsetzen, stoßen dabei oft an persönliche Grenzen. Fehlende 
                  Strategien im Umgang mit Konflikten, Stress oder psychischer Belastung führen nicht selten zu Überforderung, 
                  Unsicherheit oder Rückzug aus dem Engagement. Das Projekt möchte deshalb gezielt psychosoziale Kompetenzen stärken 
                  und ehrenamtlich Engagierte nachhaltig unterstützen.
                </p>
              </div>

              {/* 6 Module Section */}
              <div className="pt-2 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block mb-1">
                    Qualifizierungsprogramm
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    6 interaktive Module unter fachkundiger Leitung
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    In 6 praxisnahen Workshops lernen Sie, Konflikte frühzeitig zu erkennen, Gelassenheit in Krisen zu bewahren und Ihre persönliche Resilienz zu stärken:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {modules.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div 
                        key={idx}
                        className={`p-5 rounded-2xl border border-l-4 ${m.color} transition-all duration-200 hover:shadow-xs`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white shadow-2xs">
                              {m.nr}
                            </span>
                            <h4 className="font-bold text-base text-gray-900">{m.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{m.date}</span>
                            <span className="text-gray-300">•</span>
                            <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{m.time}</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">
                          {m.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Didaktik & Praxisnähe */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Praxisorientiertes Lernen statt trockener Theorie</span>
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Die Workshops orientieren sich stark an den Erfahrungen und Herausforderungen der Teilnehmenden. Statt rein theoretischer 
                  Wissensvermittlung setzt das Projekt bewusst auf interaktive Methoden: Durch Rollenspiele, Gruppenarbeiten, 
                  reale Fallbeispiele und gemeinsame Reflexionsphasen werden alltägliche Situationen bearbeitet und konkrete Handlungsoptionen entwickelt.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Ein besonderer Schwerpunkt liegt auf der Förderung einer <strong>wertschätzenden Kommunikationskultur</strong> und der Stärkung 
                  sozialer Handlungssicherheit. Die Teilnehmenden lernen, Konflikte frühzeitig zu erkennen, Eskalationen vorzubeugen und schwierige 
                  Gespräche respektvoll und lösungsorientiert zu führen.
                </p>
              </div>

              {/* Nachhaltigkeit & Peer-Coaching */}
              <div className="p-6 rounded-2xl bg-sky-900 text-white space-y-3 shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                  Nachhaltiger Ansatz & Multiplikation
                </span>
                <p className="text-sm sm:text-base leading-relaxed text-sky-100">
                  Die Teilnehmenden sollen die erworbenen Kompetenzen nicht nur für sich persönlich nutzen, sondern diese auch in ihre Vereine, 
                  Initiativen und Netzwerke weitertragen. Durch den Aufbau von <strong>Peer-Coaching-Strukturen</strong> und regelmäßigen Austauschformaten 
                  entsteht ein nachhaltiger Multiplikationseffekt, der weit über die eigentliche Projektlaufzeit hinauswirkt.
                </p>
              </div>

              {/* Highlights Checkliste */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Ziele und Nutzen für Teilnehmende
                </h3>
                <div className="space-y-2.5">
                  {highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Förderer Deutsche Postcode Lotterie */}
              <div className="pt-8 border-t border-gray-100 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Förderung & Unterstützung
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Diese Maßnahme wird mit Unterstützung der Deutschen Postcode Lotterie durchgeführt
                  </h3>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs hover:shadow-sm transition">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-sm text-gray-900">Deutsche Postcode Lotterie</h4>
                    <p className="text-xs text-gray-500 max-w-md">
                      Förderung von sozialem Zusammenhalt, Chancengleichheit, Demokratieförderung und interkulturellem Dialog.
                    </p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://lernzirkel-online.de/wp-content/uploads/2026/05/PL_Foerderlogo_rot-1024x337.png" 
                    alt="Förderlogo Deutsche Postcode Lotterie" 
                    className="h-14 sm:h-16 w-auto object-contain shrink-0"
                  />
                </div>
              </div>

            </div>
          </main>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Facts Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Eckdaten</span>
              <h3 className="text-base font-bold text-gray-900">Workshop-Details</h3>

              <div className="space-y-3 pt-2 text-xs text-gray-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900">Kosten</h5>
                    <p className="text-gray-500">100 % kostenlos (vollständig gefördert)</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900">Umfang & Zeitraum</h5>
                    <p className="text-gray-500">6 Module von September bis Oktober 2026</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900">Veranstaltungsort</h5>
                    <p className="text-gray-500">Bad-Aussee-Straße 51, 67069 Oppau / Ludwigshafen</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900">Zielgruppe</h5>
                    <p className="text-gray-500">Ehrenamtlich Engagierte, Multiplikatoren & Aktive</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kooperationspartner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Kooperationspartner</span>
              <h3 className="text-base font-bold text-gray-900">Projektträger & Partner</h3>

              <div className="space-y-3 pt-2">
                {partners.map((partner, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900">{partner.name}</h5>
                      <p className="text-[11px] text-gray-500">{partner.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration & Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Anmeldung & Kontakt</span>
                <h3 className="text-base font-bold text-gray-900">Jetzt Platz sichern</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Da die Teilnehmerzahl in den interaktiven Modulen begrenzt ist, bitten wir um vorherige Anmeldung per E-Mail oder Kontaktformular.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Workshop-Ort:</span>
                    <span>Bad-Aussee-Straße 51<br />67069 Oppau / Ludwigshafen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Projekt-E-Mail:</span>
                    <EmailObfuscator 
                      user="projekt" 
                      domain="lernzirkel-online.de" 
                      showIcon={false}
                      className="text-purple-700 hover:underline font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Zentrale:</span>
                    <a href="tel:062130737271" className="text-purple-700 hover:underline">0621 30737271</a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/kontakt"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-xs font-semibold text-white shadow-sm transition"
                >
                  <span>Zur Anmeldung / Kontakt</span>
                </Link>
              </div>
            </div>

            {/* Other Projects Quick Nav */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Weitere Projekte</h4>
              <nav className="space-y-1 text-xs font-medium">
                <Link 
                  href="/projekte/future-connect" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
                >
                  <span>Future Connect</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/menschen-staerken" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
                >
                  <span>Menschen stärken Menschen</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/sprach-cafe" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
                >
                  <span>Sprach-Café</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/wir-sind-vielfalt" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
                >
                  <span>Wir Sind Vielfalt</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/wettbewerbe/bildungsmesse" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
                >
                  <span>Bildungsmesse</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link 
                  href="/projekte/dsee" 
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-purple-900 transition"
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
