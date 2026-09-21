import React from 'react';
import Link from 'next/link';
import { LifeBuoy, Clock, MapPin, CheckCircle2, Globe, ArrowRight, Languages } from 'lucide-react';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Migrationsfachdienst (MFD) - Lernzirkel Ludwigshafen',
  description: 'Der Migrationsfachdienst bietet individuelle Unterstützung für Migrant*innen und Geflüchtete in Rhein-Pfalzkreis und Ludwigshafen.',
};

export default async function MFDPage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: 'beratung/mfd' },
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

  return <StaticMFDPage />;
}

function StaticMFDPage() {
  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-xl shadow-[var(--shadow-card)] p-8 md:p-14 border border-gray-100 mb-12">
          
          <div className="flex items-center space-x-4 mb-6">
            <LifeBuoy className="w-10 h-10 text-[var(--accent)]" />
            <span className="text-[var(--accent)] font-bold uppercase tracking-wider text-sm">Migrationsberatung Rhein-Pfalzkreis</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6 leading-tight">
            Migrationsfachdienst (MFD)
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
            Der Migrationsfachdienst bietet individuelle Unterstützung für Migrant*innen und Geflüchtete: 
            <strong> Asylsuchende, Geduldete, Menschen ohne Papier (sog. „Illegale“), Zugewanderte.</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center">
                <span className="bg-[var(--primary-light)]/10 p-2 rounded-lg mr-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
                </span>
                Wir beraten und helfen bei:
              </h3>
              <ul className="space-y-4">
                {[
                  'Allgemeinen Fragen zum täglichen Leben in Deutschland',
                  'Fragen zu Kindergarten, Vorschule, Schule und Studium',
                  'Beruf und Arbeit',
                  'Fragen zu medizinischer Versorgung',
                  'Sprachkursvermittlung',
                  'Persönlichen Konflikten und Problemen, z.B. durch Diskriminierung',
                  'Weiterleitung an andere soziale Dienste und Institutionen'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-[var(--primary-light)] mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-6 flex items-center">
                <span className="bg-[var(--primary-light)]/10 p-2 rounded-lg mr-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
                </span>
                Verfahrensberatung & Asylverfahren:
              </h3>
              <ul className="space-y-4">
                {[
                  'Fragen zum Asyl- und Aufenthaltsrecht',
                  'Familienzusammenführung',
                  'Rückkehrberatung'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-[var(--primary-light)] mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-8">
              <div className="bg-[var(--secondary)] p-8 rounded-[var(--radius-card)] border border-gray-200">
                <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-[var(--accent)]" /> 
                  Kontakt & Sprechstunden
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Ansprechpartner/in:</p>
                    <p className="text-gray-600">Frau Günay und Herr Seker</p>
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold mb-1">E-Mail:</p>
                    <a href="mailto:beratung.mfd@lernzirkel-online.de" className="text-[var(--primary)] hover:underline break-all">beratung.mfd@lernzirkel-online.de</a>
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Telefon:</p>
                    <p className="text-gray-600"><a href="tel:+4915733900681" className="hover:underline">+49 157 339 00 681</a></p>
                  </div>

                  <div>
                    <div className="flex items-center text-[var(--foreground)] font-bold mb-2 mt-4">
                      Sprechstunden (NUR MIT TERMIN!):
                    </div>
                    <ul className="text-gray-600 space-y-1">
                      <li>Mo: 9:00 – 15:00 Uhr</li>
                      <li>Di: 9:00 – 15:00 Uhr</li>
                      <li>Mi: 9:00 – 15:00 Uhr</li>
                      <li>Do: 9:00 – 15:00 Uhr</li>
                      <li className="text-[var(--accent)] font-semibold mt-2">Freitags geschlossen!</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center text-[var(--foreground)] font-bold mb-2">
                      <MapPin className="w-5 h-5 mr-2 text-[var(--primary)]" /> Ort
                    </div>
                    <p className="text-gray-600 pl-7 text-sm">
                      Ludwigsplatz 9a<br />
                      67059 Ludwigshafen<br />
                      <a href="tel:062130737271" className="hover:underline">Tel. 0621 307 372 71</a>
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-[var(--foreground)] font-bold mb-2">
                      <Languages className="w-5 h-5 mr-2 text-[var(--primary)]" /> Beratungssprachen
                    </div>
                    <p className="text-gray-600 pl-7 text-sm">
                      Deutsch, Arabisch, Englisch und Türkisch
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[var(--primary)]/10 p-6 rounded-[var(--radius-card)]">
                <h4 className="font-bold text-[var(--primary)] mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" /> Information in other languages
                </h4>
                <div className="space-y-3">
                  <Link href="https://lernzirkel-online.de/we-can-answer-your-questions-and-help-mfd" target="_blank" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 flex items-center justify-between group">
                    <span className="font-medium text-gray-700">🇬🇧 English</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)]" />
                  </Link>
                  <Link href="https://lernzirkel-online.de/nous-vous-aidons-et-repondons-a-vos-questions-dans-les-domaines-suivantes" target="_blank" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 flex items-center justify-between group">
                    <span className="font-medium text-gray-700">🇫🇷 Français</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)]" />
                  </Link>
                  <Link href="https://lernzirkel-online.de/migrationsfachdienst-arabisch" target="_blank" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 flex items-center justify-between group">
                    <span className="font-medium text-gray-700">🇸🇦 Arabic (عربي)</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-10 mt-6">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-6">Strukturelle Integrationsförderung</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Des Weiteren ist es unser Ziel, Strukturen aufzubauen und Hemmnisse abzubauen, um die Lebensbedingungen für Menschen mit Migrationshintergrund in Rheinland-Pfalz zu verbessern (interkulturelle Öffnung).
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Wir beraten andere Einrichtungen, Organisationen und Ehrenamtliche bei Fragen zu Migration, Integration und unterstützen bei der Antidiskriminierungsarbeit vor Ort. Netzwerkarbeit und Austausch sind ein wichtiger Bestandteil unserer Arbeit.
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Für Zugewanderte ab 27 Jahren & Familien</h3>
                <p className="text-gray-600 mb-4 italic">Asylsuchende mit Bleibeperspektive</p>
                <ul className="space-y-3">
                  {[
                    'Begleitung rund um die Integrationskurse',
                    'Förderung der individuellen Integration',
                    'Beratung zu Fragen des Familiennachzuges',
                    'Informationen zur Anerkennung ausländischer Bildungsabschlüsse',
                    'Gruppenangebote und Infoveranstaltungen',
                    'Vermittlung an andere soziale Dienste und Institutionen',
                    'Netzwerkarbeit',
                    'Interkulturelle Öffnungsprozesse'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-[var(--primary)] mr-2 mt-1 font-bold">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Beratung für Personen mit Wohnsitz in:</h3>
                
                <div className="mb-6">
                  <h4 className="font-bold text-[var(--primary)] mb-2">Verbandsgemeinde Rheinauen:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {['Altrip', 'Neuhofen', 'Waldsee', 'Otterstadt', 'Böhl-Iggelheim'].map((city, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <MapPin className="w-3 h-3 mr-2 text-[var(--accent)]" /> {city}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-[var(--primary)] mb-2">Verbandsgemeinde Römerberg-Dudenhofen:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {['Dudenhofen', 'Hanhofen', 'Harthausen', 'Römerberg'].map((city, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <MapPin className="w-3 h-3 mr-2 text-[var(--accent)]" /> {city}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
