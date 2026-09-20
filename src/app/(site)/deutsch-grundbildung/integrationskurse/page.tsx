import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, Languages, ArrowRight } from 'lucide-react';

export default function AllgemeineIntegrationskursePage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back Link */}
        <Link href="/deutsch-grundbildung/sprachkurse" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zu den Sprachkursen
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card">
          
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Integrationskurse
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Allgemeine Integrationskurse
          </h1>

          <div className="prose max-w-none text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-10">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" /> Aufbau des Kurses
              </h3>
              <p className="text-blue-800 m-0">
                Jeder Integrationskurs besteht aus einem Sprachkurs und einem Orientierungskurs. Der allgemeine Integrationskurs dauert <strong>700 Unterrichtseinheiten (UE)</strong>.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-foreground mt-10 mb-4">Einstufungstest</h3>
            <p className="leading-relaxed mb-8">
              Vor Beginn des Integrationskurses führen wir einen <strong>Einstufungstest</strong> durch. Das Ergebnis hilft uns, zu entscheiden, mit welchem Kursabschnitt Sie beginnen sollten und ob ein spezieller Integrationskurs sinnvoll wäre.
            </p>
            
            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
              <Languages className="w-6 h-6 mr-3 text-accent" />
              Sprachkurs (600 UE)
            </h3>
            <p className="leading-relaxed mb-6">
              Der Sprachkurs besteht aus 6 Modulen mit jeweils 100 UE (1 UE = 45 Minuten). Die ersten 3 Module bilden den Basiskurs, die letzten 3 Module den Aufbaukurs.
            </p>
            <p className="mb-4 font-medium">Im Sprachkurs werden wichtige Themen aus dem alltäglichen Leben behandelt, zum Beispiel:</p>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Arbeit und Beruf</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Aus- und Weiterbildung</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Betreuung und Erziehung von Kindern</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Einkaufen / Handel / Konsum</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Freizeit und soziale Kontakte</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Gesundheit und Hygiene</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Medien und Mediennutzung</span></div>
              <div className="flex items-start"><CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" /><span>Wohnen</span></div>
            </div>

            <p className="leading-relaxed mb-6">
              Außerdem lernen Sie, auf Deutsch Briefe und E-Mails zu schreiben, Formulare auszufüllen, zu telefonieren oder sich auf eine Arbeitsstelle zu bewerben.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-medium text-gray-800 mb-10 border border-gray-100">
              Der Sprachkurs schließt mit der telc Prüfung <strong>„Deutsch-Test für Zuwanderer“ (DTZ)</strong> ab.
            </div>

            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-accent" />
              Orientierungskurs (100 UE)
            </h3>
            <p className="leading-relaxed mb-6">
              Im Anschluss an den Sprachkurs besuchen Sie den Orientierungskurs. Er umfasst 100 Unterrichtseinheiten (UE).
            </p>
            
            <p className="mb-4 font-medium">Im Orientierungskurs sprechen Sie zum Beispiel über:</p>
            <ul className="space-y-3 mb-8 ml-2">
              <li className="flex items-start"><span className="text-accent font-bold mr-3">•</span>die deutsche Rechtsordnung, Geschichte und Kultur</li>
              <li className="flex items-start"><span className="text-accent font-bold mr-3">•</span>Rechte und Pflichten in Deutschland</li>
              <li className="flex items-start"><span className="text-accent font-bold mr-3">•</span>Formen des Zusammenlebens in der Gesellschaft</li>
              <li className="flex items-start"><span className="text-accent font-bold mr-3">•</span>Werte, die in Deutschland wichtig sind, zum Beispiel Religionsfreiheit, Toleranz und Gleichberechtigung von Frauen und Männern.</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg font-medium text-gray-800 mb-12 border border-gray-100">
              Den Orientierungskurs schließen Sie mit dem Abschlusstest <strong>„Leben in Deutschland“ (LiD)</strong> ab.
            </div>

            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary text-center">
              <h4 className="text-xl font-bold text-primary mb-4">Möchten Sie sich anmelden?</h4>
              <p className="mb-6">Vereinbaren Sie einen Termin für den Einstufungstest.</p>
              <Link href="/kontakt" className="flatsome-button group">
                Kontakt aufnehmen <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
