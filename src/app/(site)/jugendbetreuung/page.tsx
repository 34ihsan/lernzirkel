import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Jugendbetreuung - Lernzirkel Ludwigshafen e.V.',
  description: 'Unsere Angebote zur Jugendbetreuung, Freizeitgestaltung und sozialen Entwicklung.',
};

export default function JugendbetreuungPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Jugendbetreuung</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Gemeinsam wachsen, lernen und Freizeit sinnvoll gestalten
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p>
              Jugendbetreuung bedeutet für uns mehr als nur eine Aufsicht nach der Schule. Es geht um die Schaffung eines sicheren Raums, in dem sich Jugendliche entfalten, soziale Kompetenzen stärken und ihre Freizeit sinnvoll verbringen können.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div>
                <h3 className="text-xl font-bold text-secondary mb-3">Pädagogische Begleitung</h3>
                <p className="text-sm">
                  Unsere erfahrenen Pädagogen und Betreuer stehen den Jugendlichen als Ansprechpartner bei alltäglichen Herausforderungen zur Seite. Wir hören zu und unterstützen.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-3">Gemeinsame Aktivitäten</h3>
                <p className="text-sm">
                  Ob Ausflüge, kreative Workshops oder sportliche Aktivitäten – wir fördern den Teamgeist und bieten spannende Alternativen zum Medienkonsum.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-accent p-6 my-8">
              <h3 className="text-xl font-bold mb-2">Unsere Ziele</h3>
              <ul className="list-disc pl-6 space-y-2 mb-0">
                <li>Stärkung des Selbstbewusstseins</li>
                <li>Förderung sozialer Kompetenzen und Toleranz</li>
                <li>Sinnvolle Freizeitgestaltung</li>
                <li>Gewaltprävention</li>
              </ul>
            </div>

            <p>
              Interesse an unseren Jugendangeboten? Wir freuen uns über jede neue Teilnehmerin und jeden neuen Teilnehmer!
            </p>

            <div className="mt-8">
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
