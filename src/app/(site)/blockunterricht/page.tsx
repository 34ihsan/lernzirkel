import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Erfolg durch Nachhilfe! (Blockunterricht) - Lernzirkel Ludwigshafen e.V.',
  description: 'Wir bieten flexible Nachhilfe und Blockunterricht für alle Klassenstufen und Fächer an.',
};

export default function BlockunterrichtPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Erfolg durch Nachhilfe!</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Individueller Blockunterricht für nachhaltigen Lernerfolg.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Gute Noten fallen nicht vom Himmel, aber sie sind für jeden erreichbar. Mit unserem gezielten Blockunterricht und individueller Nachhilfe unterstützen wir Schülerinnen und Schüler aller Klassenstufen dabei, ihre schulischen Ziele zu erreichen.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Unser Angebot</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nachhilfe in allen gängigen Schulfächern (Mathe, Deutsch, Englisch, etc.)</li>
              <li>Prüfungsvorbereitung für Hauptschulabschluss, Realschulabschluss und Abitur</li>
              <li>Intensive Ferienkurse und Blockunterricht</li>
              <li>Individuelle Förderung in Kleingruppen oder im Einzelunterricht</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-accent p-6 my-8">
              <h3 className="text-xl font-bold mb-2">Warum Lernzirkel?</h3>
              <p>
                Unsere erfahrenen Lehrkräfte gehen auf die individuellen Bedürfnisse jedes Kindes ein. Wir vermitteln nicht nur Fachwissen, sondern auch Lernmethoden, die langfristig zum Erfolg führen.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Jetzt informieren</h2>
            <p>
              Vereinbaren Sie noch heute ein unverbindliches Beratungsgespräch. Wir finden gemeinsam die passende Unterstützung für Ihr Kind.
            </p>
            
            <div className="mt-8 text-center">
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
