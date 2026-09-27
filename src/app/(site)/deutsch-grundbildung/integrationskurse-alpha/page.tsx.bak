import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IntegrationskursAlphaPage() {
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
            Spezialkurse
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Integrationskurs mit Alphabetisierung
          </h1>

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Was ist ein Alphabetisierungskurs?</h3>
            <p className="leading-relaxed mb-6">
              Viele Erwachsene in Deutschland hatten nicht das Glück oder die Möglichkeit, Lesen und Schreiben zu lernen. Nicht nur in der deutschen Bevölkerung, sondern auch bei Zugewanderten gibt es Menschen, die nicht ausreichend lesen und schreiben können. Viele von ihnen müssen eine zusätzliche Hürde bewältigen: Sie sollen nicht nur Deutsch sprechen, sondern gleichzeitig in lateinischer Schrift lesen und schreiben lernen. 
            </p>
            <p className="leading-relaxed mb-6">Die Alphabetisierungskurse helfen diesen Menschen dabei.</p>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
              <h4 className="font-bold text-primary mb-4">Wenn Sie jemanden kennen, der...</h4>
              <ul className="space-y-3 ml-2">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span>zum ersten Mal überhaupt lesen und schreiben lernen möchte,</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span>zwar lesen und schreiben kann, aber nicht in ausreichendem Maße,</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span>gleichzeitig auch besser Deutsch sprechen und verstehen möchte und</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span>lernen möchte, wie er sich ohne Angst im deutschen Alltag bewegen kann,</span>
                </li>
              </ul>
              <p className="mt-4 font-bold text-gray-800">
                ...dann könnte ein Alphabetisierungskurs das Richtige für diese Person sein.
              </p>
            </div>

            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4">Aufbau</h3>
            <p className="leading-relaxed mb-10">
              Jeder Integrationskurs besteht aus einem Sprachkurs und einem Orientierungskurs. Der Integrationskurs mit Alphabetisierung dauert <strong>1000 Unterrichtseinheiten (UE)</strong>.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-4">Einstufungstest</h3>
            <p className="leading-relaxed mb-8">
              Vor Beginn des Integrationskurses führen wir einen zweistufigen Einstufungstest (schriftlich und mündlich) durch. Das Ergebnis hilft uns zu entscheiden, mit welchem Kursabschnitt Sie beginnen sollten und ob ein spezieller Alphabetisierungskurs sinnvoll wäre.
            </p>
            
            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary text-center mt-12">
              <h4 className="text-xl font-bold text-primary mb-4">Wir beraten Sie gerne!</h4>
              <p className="mb-6">Kommen Sie zu uns für eine persönliche Beratung oder zur Anmeldung.</p>
              <Link href="/kontakt" className="flatsome-button group">
                Beratungstermin vereinbaren <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
