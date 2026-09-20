import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Kostenlose Lernförderung (BuT) - Lernzirkel Ludwigshafen e.V.',
  description: 'Informationen zur kostenlosen Lernförderung über das Bildungs- und Teilhabepaket (BuT).',
};

export default function KostenloseLernfoerderungPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Kostenlose Lernförderung</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Nachhilfe über das Bildungs- und Teilhabepaket (BuT)
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Jedes Kind hat das Recht auf gute Bildung. Über das <strong>Bildungs- und Teilhabepaket (BuT)</strong> der Bundesregierung können Familien mit geringem Einkommen finanzielle Unterstützung für die Nachhilfe ihrer Kinder erhalten. 
            </p>
            
            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Wer hat Anspruch?</h2>
            <p>
              Anspruchsberechtigt sind in der Regel Familien, die folgende Leistungen beziehen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bürgergeld (früher ALG II / Hartz IV)</li>
              <li>Sozialhilfe</li>
              <li>Kinderzuschlag</li>
              <li>Wohngeld</li>
              <li>Asylbewerberleistungen</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary mt-8 mb-4">Wie funktioniert das?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
              <ol className="list-decimal pl-6 space-y-4">
                <li><strong>Beratung bei uns:</strong> Kommen Sie mit den aktuellen Zeugnissen Ihres Kindes zu uns.</li>
                <li><strong>Bestätigung der Schule:</strong> Die Schule muss den Förderbedarf auf einem speziellen Formular bestätigen.</li>
                <li><strong>Antrag stellen:</strong> Den ausgefüllten Antrag reichen Sie beim zuständigen Amt (z.B. Jobcenter oder Sozialamt) ein.</li>
                <li><strong>Lernen starten:</strong> Sobald die Bewilligung vorliegt, kann die kostenlose Nachhilfe bei uns beginnen!</li>
              </ol>
            </div>

            <p>
              Wir helfen Ihnen gerne bei der Antragstellung und beantworten all Ihre Fragen zum Thema BuT-Lernförderung.
            </p>

            <div className="mt-8 text-center">
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
