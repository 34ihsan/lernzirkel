import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'AÖL-YÖS-Beratung - Lernzirkel Ludwigshafen e.V.',
  description: 'Beratung und Vorbereitung für die YÖS-Prüfung (Studium in der Türkei) und offenes Gymnasium (AÖL).',
};

export default function AolYoesPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AÖL-YÖS-Beratung</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Ihr Weg zum Studium in der Türkei
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p>
              Träumen Sie davon, in der Türkei zu studieren? Wir bieten umfassende Beratung und Vorbereitungskurse für die YÖS-Prüfung (Yabancı Uyruklu Öğrenci Sınavı) sowie Unterstützung für das offene Gymnasium (Açık Öğretim Lisesi - AÖL).
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Was ist YÖS?</h2>
            <p>
              Die YÖS-Prüfung ist die zentrale Aufnahmeprüfung für ausländische Studenten an türkischen Universitäten. Sie prüft vor allem grundlegende Lernfähigkeiten und Mathematik. Eine gezielte Vorbereitung ist der Schlüssel zum Erfolg.
            </p>

            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Unser Angebot</h2>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                <h3 className="text-lg font-bold text-primary mb-2">Umfassende Beratung</h3>
                <p className="text-sm">
                  Welche Universitäten kommen in Frage? Welche Fristen gelten? Wir klären all Ihre Fragen rund um das Studium in der Türkei.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                <h3 className="text-lg font-bold text-primary mb-2">YÖS-Vorbereitungskurse</h3>
                <p className="text-sm">
                  Gezieltes Training in Mathematik und Logik (IQ), basierend auf aktuellen Prüfungsfragen der türkischen Universitäten.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                <h3 className="text-lg font-bold text-primary mb-2">AÖL (Açık Lise)</h3>
                <p className="text-sm">
                  Unterstützung und Nachhilfe für Schüler des türkischen Fern-Gymnasiums (Açık Öğretim Lisesi), um den Schulabschluss erfolgreich zu meistern.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                <h3 className="text-lg font-bold text-primary mb-2">Bewerbungshilfe</h3>
                <p className="text-sm">
                  Wir unterstützen Sie aktiv bei der Anmeldung zur YÖS-Prüfung und bei der späteren Bewerbung an Ihren Wunschuniversitäten.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg my-8 text-center">
              <h3 className="text-xl font-bold mb-2">Starten Sie jetzt Ihre Vorbereitung!</h3>
              <p className="mb-4">
                Ein gutes YÖS-Ergebnis öffnet Ihnen die Türen zu den besten Universitäten der Türkei.
              </p>
              <Link href="/kontakt" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors">
                Beratungstermin vereinbaren
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
