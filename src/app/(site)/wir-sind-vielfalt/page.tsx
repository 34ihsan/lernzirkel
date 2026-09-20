import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Wir sind Vielfalt - Lernzirkel Ludwigshafen e.V.',
  description: 'Projekte, Wettbewerbe und Initiativen zur Förderung von Diversität und Inklusion.',
};

export default function WirSindVielfaltPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Wir sind Vielfalt</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Gemeinsam für Toleranz, Akzeptanz und ein buntes Miteinander
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Diversität ist eine Bereicherung für unsere Gesellschaft. Unter dem Dach <strong>„Wir sind Vielfalt“</strong> fassen wir verschiedene Initiativen, Wettbewerbe und Bildungsangebote zusammen, die sich für Toleranz, interkulturellen Austausch und gegen Diskriminierung einsetzen.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Bildungsmesse & Wettbewerbe</h2>
            <p>
              Regelmäßig organisieren wir Bildungsmessen und Kreativ-Wettbewerbe für Jugendliche, um Talente zu fördern und kulturelle Vielfalt sichtbar zu machen.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Bildungsmessen</h3>
                <p className="text-sm">
                  Auf unseren Bildungsmessen bringen wir Schüler, Eltern, Unternehmen und Bildungseinrichtungen zusammen. Der Fokus liegt dabei auf Chancengleichheit und der Förderung von Jugendlichen mit Migrationshintergrund beim Übergang von der Schule in den Beruf.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Kreativ-Wettbewerbe</h3>
                <p className="text-sm">
                  Ob Kunst, Literatur oder digitale Medien – in unseren Wettbewerben können Jugendliche ihre Perspektiven zum Thema Vielfalt und Identität kreativ ausdrücken und einer breiten Öffentlichkeit präsentieren.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 my-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Unsere Philosophie</h3>
              <p>
                Wir glauben, dass Bildung der Schlüssel zur Integration und zum Abbau von Vorurteilen ist. Jeder Mensch, unabhängig von Herkunft, Sprache oder Religion, verdient die gleichen Chancen auf gesellschaftliche Teilhabe.
              </p>
            </div>

            <p>
              Möchten Sie sich an unseren Projekten beteiligen, als Sponsor auftreten oder haben Sie Ideen für eine Kooperation? Sprechen Sie uns an!
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
