import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Sprach Café - Lernzirkel Ludwigshafen e.V.',
  description: 'In entspannter Atmosphäre Deutsch üben und neue Kontakte knüpfen.',
};

export default function SprachCafePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sprach Café</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Gemeinsam Deutsch sprechen – unkompliziert und gesellig
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Sprache lernt man am besten durch Sprechen! In unserem <strong>Sprach Café</strong> bieten wir eine offene und gemütliche Plattform für alle, die ihre Deutschkenntnisse im Alltag anwenden und verbessern möchten.
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Was erwartet Sie?</h2>
            
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div>
                <ul className="list-disc pl-6 space-y-4">
                  <li><strong>Entspannte Atmosphäre:</strong> Bei Kaffee, Tee und Keksen plaudern wir über alltägliche Themen, Hobbys, Kultur und aktuelle Ereignisse.</li>
                  <li><strong>Kein Unterrichtsdruck:</strong> Hier gibt es keine Noten oder Prüfungen. Fehler machen ist erlaubt und wichtig für den Lernprozess.</li>
                  <li><strong>Neue Leute kennenlernen:</strong> Das Sprach Café ist ein Ort der Begegnung. Hier treffen Menschen unterschiedlicher Herkunft aufeinander und tauschen sich aus.</li>
                  <li><strong>Muttersprachliche Begleitung:</strong> Ehrenamtliche Helfer moderieren die Gespräche und helfen bei Wortschatzlücken.</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col justify-center border border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-2">Für wen?</h3>
                <p className="mb-4">
                  Für jeden, der bereits Grundkenntnisse in Deutsch hat (ca. ab Niveau A2) und sicherer beim Sprechen werden möchte. Auch Muttersprachler, die sich gerne unterhalten und helfen möchten, sind herzlich willkommen!
                </p>
                <p className="font-bold">Die Teilnahme ist kostenlos!</p>
              </div>
            </div>

            <p>
              Kommen Sie einfach vorbei, bringen Sie gute Laune mit und sprechen Sie mit uns! Die aktuellen Termine und Zeiten können Sie telefonisch oder per E-Mail erfragen.
            </p>

            <div className="mt-12">
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Termine erfragen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
