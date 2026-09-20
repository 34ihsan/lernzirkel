import Link from 'next/link';
import { FileText, CalendarCheck, CheckCircle2, Info, ArrowRight, Euro } from 'lucide-react';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import Image from 'next/image';

export default function KostenloseLernfoerderungPage() {
  const anforderungen = [
    "Lernförderung für Schülerinnen und Schüler, die das Lernziel nicht erreichen",
    "Unterstützung, wenn die Versetzung gefährdet ist",
    "Die Kursgebühr wird vollständig übernommen, wenn die Lehrkraft den Bedarf bestätigt"
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Bildung und Teilhabe
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Kostenlose Lernförderung
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sie möchten, dass Ihr Kind gezielt unterstützt wird? Wir helfen Ihnen Schritt für Schritt!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flatsome-card relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-bold text-primary mb-8 relative z-10">So funktioniert es:</h2>
              
              <div className="space-y-8 relative z-10">
                {/* Step 1 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-accent" />
                      Beratung & Antrag
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Kommen Sie zu uns, und wir unterstützen Sie beim Ausfüllen des Antrags für die Lernförderung. Gemeinsam mit der Lehrkraft stellen wir sicher, dass alles korrekt eingereicht wird.
                    </p>
                  </div>
                </div>

                {/* Arrow connecting steps */}
                <div className="hidden md:block pl-7 my-2">
                  <div className="h-8 w-0.5 bg-gray-200"></div>
                </div>

                {/* Step 2 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <CalendarCheck className="w-5 h-5 mr-2 text-primary" />
                      Passendes Angebot
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sobald der Antrag bestätigt ist, erstellen wir ein individuelles Lernförderungsangebot für Ihr Kind – <strong className="text-accent">komplett kostenfrei</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Block */}
            <div className="bg-blue-50/50 rounded-xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Info className="w-6 h-6 mr-3 text-accent" />
                Was wird gefördert?
              </h3>
              <ul className="space-y-4 mt-6">
                {anforderungen.map((item, index) => (
                  <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Eligibility Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 flatsome-card">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <Euro className="w-6 h-6 text-accent mr-3" />
                <h3 className="text-xl font-bold text-primary">Wer ist berechtigt?</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Kinder und Jugendliche aus Familien, die eine der folgenden Leistungen beziehen:
              </p>
              <ul className="space-y-2 text-sm font-medium text-gray-700">
                <li className="flex items-center bg-gray-50 px-3 py-2 rounded"><ArrowRight className="w-4 h-4 mr-2 text-accent" /> Bürgergeld</li>
                <li className="flex items-center bg-gray-50 px-3 py-2 rounded"><ArrowRight className="w-4 h-4 mr-2 text-accent" /> Sozialgeld</li>
                <li className="flex items-center bg-gray-50 px-3 py-2 rounded"><ArrowRight className="w-4 h-4 mr-2 text-accent" /> Sozialhilfe</li>
                <li className="flex items-center bg-gray-50 px-3 py-2 rounded"><ArrowRight className="w-4 h-4 mr-2 text-accent" /> Kinderzuschlag</li>
                <li className="flex items-center bg-gray-50 px-3 py-2 rounded"><ArrowRight className="w-4 h-4 mr-2 text-accent" /> Wohngeld</li>
              </ul>
            </div>

            {/* Image Card */}
            <div className="rounded-xl overflow-hidden shadow-sm relative h-[250px]">
              <Image 
                src="https://lernzirkel-online.de/wp-content/uploads/2016/09/Bildung-Teilhabe-300x229-e1549366692373.jpg" 
                alt="Bildung und Teilhabe"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <p className="text-white font-bold text-lg">Zukunft fördern</p>
                  <p className="text-white/80 text-sm">Chancengleichheit für alle Kinder</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary text-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Jetzt Termin vereinbaren</h3>
              <p className="mb-6 text-blue-100 text-sm">
                Sichern Sie sich jetzt die kostenfreie Lernförderung für Ihr Kind!
              </p>
              <Link 
                href="/kontakt"
                className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
              >
                Zum Kontaktformular
              </Link>
              <div className="text-center">
                <span className="text-sm text-blue-200">Oder per E-Mail:</span>
                <div className="font-bold mt-1 text-white hover:text-accent transition-colors">
                  <EmailObfuscator user="nachhilfe" domain="lernzirkel-online.de" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
