import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Bildungswege in Ludwigshafen - Lernzirkel Ludwigshafen e.V.',
  description: 'Ein Überblick über die verschiedenen Bildungswege und Schulformen in Ludwigshafen.',
};

export default function BildungswegePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bildungswege in Ludwigshafen</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Orientierungshilfe für Eltern und Schüler im Schulsystem von Rheinland-Pfalz
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Das Schulsystem bietet vielfältige Möglichkeiten. Wir möchten Ihnen helfen, den besten Weg für Ihr Kind zu finden. Auf dieser Seite finden Sie Informationen zu den gängigen Bildungswegen in Ludwigshafen und Umgebung.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Das Schulsystem in Rheinland-Pfalz</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Grundschule</h3>
                <p className="text-sm">
                  Die Basis für die weitere Schullaufbahn. Sie umfasst die Klassen 1 bis 4. Am Ende der Grundschulzeit gibt es eine Empfehlung für die weiterführende Schule.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Realschule plus</h3>
                <p className="text-sm">
                  Führt zur Berufsreife (Hauptschulabschluss) nach Klasse 9 oder zum qualifizierten Sekundarabschluss I (Realschulabschluss) nach Klasse 10.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Integrierte Gesamtschule (IGS)</h3>
                <p className="text-sm">
                  Hier lernen alle Kinder gemeinsam. Alle Abschlüsse bis hin zum Abitur sind möglich.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Gymnasium</h3>
                <p className="text-sm">
                  Führt nach 8 oder 9 Jahren (G8/G9) zur Allgemeinen Hochschulreife (Abitur).
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-secondary mt-12 mb-4">Unterstützung durch den Lernzirkel</h2>
            <p>
              Unabhängig von der gewählten Schulform stehen wir Schülern mit Nachhilfe und Förderkursen zur Seite. Besonders bei Schulwechseln oder dem Übergang in eine höhere Klassenstufe unterstützen wir aktiv.
            </p>

            <div className="mt-8 text-center bg-blue-50 p-8 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold mb-4">Wir beraten Sie gerne!</h3>
              <p className="mb-6">
                Sind Sie unsicher, welcher Bildungsweg der richtige für Ihr Kind ist? Sprechen Sie uns an.
              </p>
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Beratung anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
