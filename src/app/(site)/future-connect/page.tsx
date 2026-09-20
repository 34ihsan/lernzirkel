import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Future Connect - Lernzirkel Ludwigshafen e.V.',
  description: 'Das Projekt Future Connect zur Förderung der digitalen Kompetenz und Berufsorientierung.',
};

export default function FutureConnectPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Future Connect</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Digitale Kompetenzen für die Zukunft stärken
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Die digitale Welt entwickelt sich rasant weiter. Mit dem Projekt <strong>„Future Connect“</strong> machen wir Jugendliche fit für die Herausforderungen der digitalen Zukunft und unterstützen sie bei der beruflichen Orientierung.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Schwerpunkte des Projekts</h2>
            
            <ul className="list-disc pl-6 space-y-4 my-8">
              <li>
                <strong>Medienkompetenz:</strong> Kritischer Umgang mit sozialen Medien, Fake News erkennen und Datenschutz im Internet verstehen.
              </li>
              <li>
                <strong>Digitale Werkzeuge:</strong> Grundlagen der Textverarbeitung, Präsentationserstellung und sicherer Umgang mit dem PC für Schule und Beruf.
              </li>
              <li>
                <strong>Bewerbungstraining 2.0:</strong> Erstellung professioneller digitaler Bewerbungsunterlagen und Vorbereitung auf Online-Vorstellungsgespräche.
              </li>
              <li>
                <strong>Berufsorientierung:</strong> Einblicke in digitale Berufe und die Arbeitswelt der Zukunft.
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-8">
              <h3 className="text-xl font-bold text-primary mb-3">Ziele von Future Connect</h3>
              <p>
                Wir möchten sicherstellen, dass kein Jugendlicher aufgrund mangelnder digitaler Kenntnisse benachteiligt wird. Future Connect schlägt eine Brücke zwischen der Lebenswelt der Jugendlichen und den Anforderungen des modernen Arbeitsmarktes.
              </p>
            </div>

            <p>
              Das Projekt wird in Zusammenarbeit mit verschiedenen Förderpartnern und Unternehmen aus der Region durchgeführt.
            </p>

            <div className="mt-12">
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
