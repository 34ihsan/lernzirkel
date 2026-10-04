import Link from 'next/link';
import { CheckCircle2, Users, GraduationCap, CalendarClock, Phone } from 'lucide-react';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import Image from 'next/image';

export default function BlockunterrichtPage() {
  const vorteile = [
    "Bei Bedarf Unterstützung durch das Jobcenter oder Sozialamt (BuT)",
    "6 Monatsvertrag (Kündigungsfrist 1 Monat)",
    "12 Monatsvertrag (Kündigungsfrist 3 Monate)",
    "Kostenloser Probeunterricht und Beratung",
    "Unterricht in Kleingruppen",
    "Möglichkeit von Einzelunterricht",
    "Geschwister-Rabatt",
    "Erfahrene und motivierte Lehrkräfte"
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Nachhilfe
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Erfolg durch Nachhilfe!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Individuelle Betreuung und optimale Lernbedingungen für den schulischen Erfolg.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image (Using the original image from the live site) */}
            <div className="rounded-xl overflow-hidden shadow-sm dark:shadow-none relative h-[300px] md:h-[400px]">
              <Image 
                src="https://lernzirkel-online.de/wp-content/uploads/2016/09/Nachhilfe-Titelbild-e1724420846536-750x458.jpg" 
                alt="Nachhilfe Titelbild"
                fill
                className="object-cover"
                unoptimized // Because it's an external URL and next.config might not allow it yet
              />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none p-8 md:p-12 border border-gray-100 dark:border-gray-800 flatsome-card">
              <h2 className="text-2xl font-bold text-primary mb-6">Unser Unterrichtskonzept</h2>
              
              <div className="prose max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-lg leading-relaxed">
                <p>
                  Um einen hohen Lernerfolg zu erzielen, finden unsere Nachhilfekurse in <strong>kleinen Gruppen</strong> statt. Jeder Schüler genießt auf diese Weise eine intensive Betreuung durch unsere Lehrkräfte. Hat ein Schüler oder eine Schülerin Nachholbedarf in den Grundlagen eines Faches, so können wir zusätzlich einen individuellen Lehrplan erstellen.
                </p>
                <p>
                  Je nach Fach und Klassenstufe werden die Schüler und Schülerinnen in homogene Gruppen aufgeteilt. Ein Unterrichtsblock dauert <strong>90 Minuten (2x45 Min)</strong>.
                </p>
                
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 my-8">
                  <div className="flex items-start">
                    <Users className="w-8 h-8 text-accent mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-primary text-xl mb-2">Einzelunterricht & Zusatztermine</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Auch bieten wir <strong>Einzelunterricht</strong> an, um optimal auf die Bedürfnisse der Schüler und Schülerinnen eingehen zu können. Bei anstehenden Klassenarbeiten können zusätzliche Termine ausgemacht werden.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-primary text-xl mb-3 flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2 text-accent" />
                    Fächerangebot
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Der Schwerpunkt unseres Nachhilfe-Angebots liegt in den Hauptfächern <strong>Deutsch, Mathematik und Englisch</strong>. Nach Bedarf und Anfrage bieten wir außerdem Nachhilfekurse in weiteren Fächern an, wie beispielsweise in Französisch, Latein oder in naturwissenschaftlichen Fächern.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Benefits Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none p-8 border border-gray-100 dark:border-gray-800 flatsome-card">
              <h3 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                Ihre Vorteile
              </h3>
              <ul className="space-y-4">
                {vorteile.map((vorteil, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-snug">{vorteil}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Card */}
            <div className="bg-primary text-white rounded-xl shadow-lg p-8 transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-2">Kontakt</h3>
              <p className="mb-6 text-blue-100 text-sm">
                Bei Interesse können Sie sich bei uns melden. Wir beraten Sie gerne.
              </p>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Ansprechpartnerin</p>
                  <p className="font-medium">Frau Tülay Özcelik</p>
                </div>

                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Telefon</p>
                  <a href="tel:062130737271" className="flex items-center font-bold hover:text-accent transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> 0621 30 73 72 71
                  </a>
                </div>

                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">E-Mail</p>
                  <div className="hover:text-accent transition-colors">
                    <EmailObfuscator user="nachhilfe" domain="lernzirkel-online.de" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Adresse</p>
                  <p className="text-sm">Ludwigsplatz 9a<br />67059 Ludwigshafen</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
