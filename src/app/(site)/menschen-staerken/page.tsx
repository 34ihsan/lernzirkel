import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Menschen stärken Menschen - Lernzirkel Ludwigshafen e.V.',
  description: 'Unser Mentoring-Programm: Menschen stärken Menschen.',
};

export default function MenschenStaerkenPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Menschen stärken Menschen</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Patenschaften und Mentoring, die Perspektiven schaffen
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Unter dem Motto <strong>„Menschen stärken Menschen“</strong> (ein Förderprogramm des Bundesministeriums für Familie, Senioren, Frauen und Jugend) bringen wir engagierte Patinnen und Paten mit Kindern, Jugendlichen oder Familien zusammen, die Unterstützung benötigen.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-secondary mb-3">Wie funktioniert eine Patenschaft?</h3>
                <p className="text-sm">
                  Ein ehrenamtlicher Mentor (Pate) begleitet ein Kind oder einen Jugendlichen (Menti) über einen bestimmten Zeitraum. Sie treffen sich regelmäßig für gemeinsame Aktivitäten, Hausaufgabenhilfe oder einfach zum Reden.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-secondary mb-3">Wer kann mitmachen?</h3>
                <p className="text-sm">
                  Jeder, der Zeit und Lebenserfahrung teilen möchte, kann Pate werden. Auf der anderen Seite können sich Familien melden, die für ihre Kinder eine zusätzliche Bezugsperson und Förderung wünschen.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Vorteile des Programms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Für Mentees:</strong> Förderung der persönlichen Entwicklung, Hilfe bei schulischen Problemen, Stärkung des Selbstvertrauens und neue Perspektiven.</li>
              <li><strong>Für Paten:</strong> Eine sinnvolle ehrenamtliche Tätigkeit, wertvolle zwischenmenschliche Begegnungen und die Möglichkeit, die Gesellschaft aktiv mitzugestalten.</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-primary p-6 my-8">
              <h3 className="text-xl font-bold mb-2">Werden Sie Teil der Initiative!</h3>
              <p>
                Wir suchen stets engagierte Menschen, die Verantwortung übernehmen möchten. Wir bereiten Sie auf Ihre Aufgabe vor und begleiten Sie während der gesamten Patenschaft.
              </p>
            </div>

            <div className="mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors">
                Pate werden
              </Link>
              <Link href="/kontakt" className="inline-block bg-white text-primary border-2 border-primary font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors">
                Patenschaft anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
