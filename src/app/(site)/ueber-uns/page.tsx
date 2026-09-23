import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Target, Users, ShieldCheck, HeartHandshake, Award, 
  Lightbulb, Globe, GraduationCap, FileText, Scale, 
  Camera, Image as ImageIcon, Heart, ArrowRight, 
  MapPin, Clock, Phone, Sparkles, Building2, CheckCircle2, ChevronRight
} from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export const metadata = {
  title: 'Über uns | Lernzirkel Ludwigshafen e.V.',
  description: 'Erfahren Sie alles über das Leitbild, die Entstehungsgeschichte seit 2002, die Satzung, Räumlichkeiten und Spendenmöglichkeiten des Lernzirkel Ludwigshafen e.V.',
};

export default function UeberUnsPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Über uns', url: '/ueber-uns', isCurrent: true },
  ];

  // Curated preview images for the rooms & gallery
  const previewImages = [
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/DSC07796-1024x512.jpg',
      alt: 'Haupteingang Lernzirkel Ludwigsplatz',
      title: 'Haupteingang & Empfang',
      subtitle: 'Ludwigsplatz 9a, 67059 Ludwigshafen',
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/durchLudwigsplatz2-1024x768.jpeg',
      alt: 'Zentrale Lage am Ludwigsplatz',
      title: 'Zentrale Innenstadtlage',
      subtitle: 'Beste Erreichbarkeit mit Bus & Bahn',
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Bibliothek-1024x768.jpeg',
      alt: 'Bibliothek und Lernbereich',
      title: 'Bibliothek & Selbstlernbereich',
      subtitle: 'Ruhiger Raum für Recherche & Vertiefung',
    },
    {
      src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Empfang-1024x768.jpeg',
      alt: 'Empfangsbereich & Beratung',
      title: 'Beratung & Kundenbereich',
      subtitle: 'Persönliche Einstufung & Betreuung',
    },
  ];

  const subPages = [
    {
      id: 'leitbild',
      title: 'Unser Leitbild & Profil',
      badge: 'Werte & Vision',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      description: 'Werte, Vision, Chancengleichheit und soziale Verantwortung seit 2002 im Dienst der Menschen in Ludwigshafen.',
      icon: Target,
      link: '#leitbild',
      ctaText: 'Leitbild lesen',
      isInternalAnchor: true,
    },
    {
      id: 'philosophie',
      title: 'Entstehung und Intention',
      badge: 'Geschichte seit 2002',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Von der Eltern- und Bürgerinitiative zum anerkannten Bildungsträger mit 12 Räumen und Menschen aus über 25 Nationen.',
      icon: Lightbulb,
      link: '/ueber-uns/philosophie',
      ctaText: 'Geschichte entdecken',
      isInternalAnchor: false,
    },
    {
      id: 'satzung',
      title: 'Satzung & Organisation',
      badge: 'Rechtliche Grundlagen',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Gemeinnützigkeit nach § 52 AO, Vereinsregister beim Amtsgericht Ludwigshafen und transparente Vereinsstruktur.',
      icon: FileText,
      link: '/ueber-uns/satzung',
      ctaText: 'Satzung aufrufen',
      isInternalAnchor: false,
    },
    {
      id: 'galerie',
      title: 'Bildergalerie & Räumlichkeiten',
      badge: 'Einblicke vor Ort',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Erkunden Sie unsere 12 modernen Unterrichtsräume, die Bibliothek und den zentralen Standort am Ludwigsplatz 9a.',
      icon: Camera,
      link: '/galerie',
      ctaText: 'Zur Fotogalerie',
      isInternalAnchor: false,
    },
    {
      id: 'spenden',
      title: 'Spenden & Unterstützen',
      badge: 'Zukunft schenken',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'Helfen Sie mit, Bildungschancen für benachteiligte Kinder zu sichern. Werden Sie Fördermitglied oder spenden Sie gezielt.',
      icon: Heart,
      link: '/spenden',
      ctaText: 'Jetzt unterstützen',
      isInternalAnchor: false,
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 max-w-6xl py-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-[#0F4761] to-[#0A3347] text-white py-16 md:py-24">
        {/* Subtle Background Ornament */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider text-sky-200 mb-6">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Lernzirkel Ludwigshafen e.V. • Seit 2002</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Über uns – Bildung, Integration & gesellschaftliche Verantwortung
          </h1>

          <p className="text-base sm:text-xl text-sky-100/90 leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            Seit über zwei Jahrzehnten engagieren wir uns im Herzen von Ludwigshafen für Chancengleichheit, 
            qualifizierte Sprachausbildung (BAMF & telc), gezielte Lernförderung (BuT) und ein solidarisches Miteinander aller Kulturen.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/15">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-3xl font-extrabold text-amber-300 mb-1">2002</div>
              <div className="text-xs text-sky-200 font-medium">Gegründet als gemeinnütziger Verein</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-3xl font-extrabold text-emerald-300 mb-1">25+</div>
              <div className="text-xs text-sky-200 font-medium">Nationen & Kulturen vereint</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-3xl font-extrabold text-sky-300 mb-1">12</div>
              <div className="text-xs text-sky-200 font-medium">Moderne Räume auf 2 Etagen</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-3xl font-extrabold text-rose-300 mb-1">100%</div>
              <div className="text-xs text-sky-200 font-medium">Gemeinnützig & unabhängig</div>
            </div>
          </div>
        </div>
      </section>

      {/* SUB-PAGES OVERVIEW HUB GRID */}
      <section className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-100 mb-8">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                Bereiche & Themen im Überblick
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Unsere Angebote & Struktur zu „Über uns“
              </h2>
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto">
              5 Hauptbereiche
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subPages.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-6 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-white to-slate-50/50 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors duration-200 shadow-2xs">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <Link
                      href={item.link}
                      className="inline-flex items-center text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-1 transition-all"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Bonus Card: Organigramm */}
            <div className="flex flex-col justify-between p-6 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-white to-slate-50/50 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors duration-200 shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                    Team & Struktur
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-800 transition-colors">
                    Organigramm & Team
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Die organisatorische Aufteilung unseres Vereins in Geschäftsführung, Pädagogik, Sprachbereich und Verwaltung.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100">
                <Link
                  href="/ueber-uns/organigramm"
                  className="inline-flex items-center text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-1 transition-all"
                >
                  <span>Organigramm ansehen</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT SECTIONS */}
      <div className="container mx-auto px-4 max-w-6xl py-16 space-y-16">

        {/* SECTION 1: UNSER LEITBILD & PROFIL */}
        <section id="leitbild" className="scroll-mt-24 bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-200">
          <div className="max-w-3xl mb-8">
            <span className="inline-block px-3.5 py-1 bg-sky-100 text-sky-800 font-bold rounded-full text-xs uppercase tracking-wider mb-3">
              Unser Profil & Werte
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Unser Leitbild – Chancengleichheit und Vielfalt als Auftrag
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-3 leading-relaxed">
              Mit unseren Angeboten wollen wir unserer gesellschaftlichen Verantwortung in Ludwigshafen und in der Region gerecht werden. 
              Denn nur wenn Menschen ausreichend Möglichkeiten geboten werden, ihre Stärken und Potenziale zu entfalten, 
              können sie aktiv am gesellschaftlichen Leben teilhaben.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Chancengleichheit & Vielfalt</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Unsere Angebote stehen grundsätzlich allen Kindern, Jugendlichen und Erwachsenen offen – unabhängig von Herkunft, Religion, Status oder Vorbildung.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Qualitätssicherung</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Als lernende Organisation reflektieren wir unser Handeln fortlaufend durch Qualitätsaudits, Evaluationen und Feedback unserer Kursteilnehmer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Wirtschaftlichkeit</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Effektiver Einsatz von Fördermitteln. Gemeinnützige Angebote werden umgesetzt, auch wenn sie betriebswirtschaftlich keine hohen Erträge erwarten lassen.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-sky-900">
              <CheckCircle2 className="w-5 h-5 text-sky-700 shrink-0" />
              <span>Anerkannter Träger für BAMF-Integrationskurse und lizenziertes telc Sprachprüfungszentrum.</span>
            </div>
            <Link
              href="/kontakt"
              className="text-xs font-semibold px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-xl transition shrink-0"
            >
              Beratungstermin vereinbaren
            </Link>
          </div>
        </section>

        {/* SECTION 2: ENTSTEHUNG UND INTENTION (PHILOSOPHIE) */}
        <section className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-xs uppercase tracking-wider">
                Unsere Geschichte & Philosophie
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Entstehung und Intention des Lernzirkel e.V.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Entstanden im <strong>Januar 2002</strong> aus einer Privatinitiative engagierter Eltern, Pädagogen, 
                Studenten und Sozialarbeiter hat sich der Verein rasch zu einem unverzichtbaren Knotenpunkt 
                für Bildung und Integration in Ludwigshafen entwickelt.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nach dem Umzug im Januar 2011 an den Ludwigsplatz 9a wurden aus ursprünglich 3 kleinen Räumen 
                mittlerweile <strong>12 voll ausgestattete Unterrichtsräume</strong>. Im Jahr 2022 konnte eine komplette zweite Etage angemietet werden, 
                um den steigenden Bedarf in der Erwachsenenbildung und bei telc Sprachprüfungen abzudecken.
              </p>

              <div className="pt-2">
                <Link
                  href="/ueber-uns/philosophie"
                  className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                >
                  <span>Vollständige Entstehungsgeschichte lesen</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-sky-50 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-4">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-700" />
                <span>Menschen aus über 25 Ländern</span>
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Unser Team aus qualifizierten Dozenten, Lehrkräften, ehrenamtlichen Helfern und Beratern begleitet 
                Teilnehmende vom Analphabetismus bis zum universitären telc C1 Hochschule Zertifikat.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-xs text-gray-600 font-medium space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Jugendarbeit & kostenlose Nachhilfe (BuT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>BAMF-Integrationskurse & Alphabetisierung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Interkulturelle Projekte & Frauenförderung</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SATZUNG & ORGANISATION */}
        <section className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50 to-sky-50 p-6 sm:p-8 rounded-3xl border border-indigo-100 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Rechtliche Grundlagen & Gemeinnützigkeit</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Der Verein verfolgt ausschließlich und unmittelbar steuerbegünstigte, gemeinnützige Zwecke im Sinne der Abgabenordnung (§§ 51 ff. AO).
              </p>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                Amtsgericht Ludwigshafen am Rhein • VR 2748
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3.5 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-full text-xs uppercase tracking-wider">
                Satzung & Struktur
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Satzung und Vereinsorganisation
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Der Vereinszweck (§ 2) ist nicht auf wirtschaftlichen Geschäftsbetrieb ausgerichtet. 
                Wir unterstützen Schüler und Eltern bei Bildungs-, Erziehungs- und Integrationsfragen und setzen uns für den Abbau von Vorurteilen ein.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Die Vereinsorgane bestehen aus der Mitgliederversammlung und dem ehrenamtlichen Vorstand, 
                unterstützt durch zwei gewählte Kassenprüfer zur Sicherstellung höchster Transparenz bei der Verwendung von Mitteln.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/ueber-uns/satzung"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Satzung (§§ 1–10) im Detail ansehen</span>
                </Link>

                <Link
                  href="/ueber-uns/organigramm"
                  className="inline-flex items-center justify-center px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
                >
                  <span>Organigramm ansehen</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BILDERGALERIE & RÄUMLICHKEITEN */}
        <section className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs uppercase tracking-wider mb-2">
                Einblicke vor Ort
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Bildergalerie & Räumlichkeiten
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Zentral am Ludwigsplatz 9a gelegen – moderne Ausstattung für eine angenehme Lernatmosphäre.
              </p>
            </div>

            <Link
              href="/galerie"
              className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 self-start sm:self-auto shrink-0 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition"
            >
              <span>Alle Fotos in der Galerie</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Image Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {previewImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xs hover:shadow-md transition duration-200 bg-slate-100"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                  <h5 className="font-bold text-xs">{img.title}</h5>
                  <p className="text-[11px] text-slate-200 mt-0.5">{img.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Ludwigsplatz 9a, 67059 Ludwigshafen am Rhein (Eingang Ludwigsplatz & Bismarckstraße)</span>
            </div>
            <Link
              href="/ueber-uns/raeumlichkeiten"
              className="text-sky-700 font-semibold hover:underline"
            >
              Detaillierte Raumübersicht & Anfahrt →
            </Link>
          </div>
        </section>

        {/* SECTION 5: SPENDEN & UNTERSTÜTZEN */}
        <section className="bg-gradient-to-br from-rose-900 via-[#8A1C29] to-rose-950 text-white rounded-3xl p-8 md:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl relative z-10 space-y-5">
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md text-white font-bold rounded-full text-xs uppercase tracking-wider">
              Bildungschancen für alle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Spenden & Unterstützen – Werden Sie Teil unserer Mission
            </h2>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              Bildung darf keine Frage der sozialen Herkunft sein. Als gemeinnütziger Träger setzen wir Spenden 
              und Mitgliedsbeiträge gezielt dafür ein, Kindern und Familien aus Ludwigshafen kostenlose Lernförderung, 
              Prüfungsgebühren und Unterrichtsmaterialien zu ermöglichen.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/spenden"
                className="px-6 py-3 bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs rounded-xl shadow-md transition"
              >
                Jetzt Spenden & Fördermitglied werden
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-medium text-xs rounded-xl transition"
              >
                Kontakt für Kooperationen
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT / VISIT FOOTER BANNER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-gray-900 text-base">Haben Sie Fragen zu unseren Angeboten oder unserem Verein?</h4>
            <p className="text-xs text-gray-500">
              Besuchen Sie uns persönlich am Ludwigsplatz 9a oder rufen Sie uns direkt an (Mo–Fr: 09:00–17:00 Uhr).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:062130737271"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-sky-700" />
              <span>0621 30737271</span>
            </a>

            <Link
              href="/kontakt"
              className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Kontaktformular
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
