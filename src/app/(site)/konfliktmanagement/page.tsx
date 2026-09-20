import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Stark im Umgang mit Konflikten - Lernzirkel Ludwigshafen e.V.',
  description: 'Unser Projekt für Konfliktmanagement und Gewaltprävention für Jugendliche.',
};

export default function KonfliktmanagementPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Stark im Umgang mit Konflikten</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Gewaltprävention und Konfliktmanagement für Jugendliche
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Konflikte gehören zum Alltag – entscheidend ist jedoch, wie wir mit ihnen umgehen. Mit unserem Projekt <strong>„Stark im Umgang mit Konflikten“</strong> möchten wir Jugendliche dabei unterstützen, Streitigkeiten gewaltfrei zu lösen und ein respektvolles Miteinander zu fördern.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Projektinhalte</h2>
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-accent">
                <h3 className="text-lg font-bold mb-2">Konfliktanalyse</h3>
                <p className="text-sm">
                  Die Jugendlichen lernen, wie Konflikte entstehen, welche Eskalationsstufen es gibt und wie sie frühzeitig deeskalierend wirken können.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-accent">
                <h3 className="text-lg font-bold mb-2">Kommunikationstraining</h3>
                <p className="text-sm">
                  Aktives Zuhören, Ich-Botschaften und gewaltfreie Kommunikation bilden die Grundlage für eine erfolgreiche Konfliktlösung.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-accent">
                <h3 className="text-lg font-bold mb-2">Empathieförderung</h3>
                <p className="text-sm">
                  Durch Rollenspiele und Perspektivenwechsel wird das Verständnis für die Gefühle und Bedürfnisse anderer gestärkt.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-accent">
                <h3 className="text-lg font-bold mb-2">Selbstbehauptung</h3>
                <p className="text-sm">
                  Grenzen setzen und „Nein“ sagen können, ohne dabei aggressiv zu werden.
                </p>
              </div>
            </div>

            <p>
              Das Projekt richtet sich an Schulen, Jugendzentren und andere pädagogische Einrichtungen. In interaktiven Workshops arbeiten unsere erfahrenen Trainer intensiv mit den Jugendlichen.
            </p>

            <div className="mt-12 text-center bg-gray-100 p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Interesse an einem Workshop?</h3>
              <p className="mb-6">
                Kontaktieren Sie uns für weitere Informationen und individuelle Angebote.
              </p>
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Anfrage senden
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
