import Link from 'next/link';
import { BookOpen, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

export default function LandeskursePage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card">
          
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Sprachkurse
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Landeskurse „Sprachziel: Deutsch“
          </h1>

          <div className="prose max-w-none text-gray-700">
            <p className="leading-relaxed mb-6 text-lg">
              Das Land Rheinland-Pfalz gewährt seit 2002 eine Förderung zur Durchführung von <strong>Sprachkursen</strong> zur sprachlichen, persönlichen, kulturellen, beruflichen und sozialen Integration für Migrantinnen und Migranten.
            </p>
            <p className="leading-relaxed mb-10">
              Teilnehmen können alle erwachsenen Menschen mit Migrationshintergrund, unabhängig von Herkunft, rechtlichem Status oder bisheriger Aufenthaltsdauer.
            </p>

            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 mb-10">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Zielgruppe</h3>
              <p className="text-blue-800 mb-4">
                Sie richten sich insbesondere an diejenigen, die keinen Zugang zum Integrationskurs des Bundesamtes für Migration und Flüchtlinge (BAMF) haben:
              </p>
              <ul className="space-y-3 ml-2">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-900">Menschen, die noch nicht oder nicht mehr berechtigt sind, am BAMF-Integrationskurs teilzunehmen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-900">Asylbegehrende aus nicht-sicheren Herkunftsländern</span>
                </li>
              </ul>
            </div>

            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4">Kursdetails</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-primary mb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-accent" /> Umfang & Dauer
                </h4>
                <p className="text-sm m-0">Die Kurse umfassen in der Regel 300 Unterrichtsstunden und enden mit dem Niveau A1 oder A2.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-primary mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-accent" /> Kinderbetreuung
                </h4>
                <p className="text-sm m-0">In Rheinland-Pfalz wird bei diesen Kursen eine Kinderbetreuung angeboten und finanziert, die den Familien die Teilnahme ermöglicht.</p>
              </div>
            </div>

            <p className="leading-relaxed mb-10">
              Dieses flexible Angebot des Landes schließt Lücken, die nach wie vor bei der Berechtigung für die BAMF-Kurse bestehen, und leistet so einen wichtigen Beitrag zur sprachlichen und gesellschaftlichen Integration vor Ort.
            </p>

            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary text-center mt-12">
              <h4 className="text-xl font-bold text-primary mb-4">Möchten Sie sich für einen Landeskurs anmelden?</h4>
              <p className="mb-6">Kommen Sie zu uns für eine persönliche Beratung oder zur Anmeldung.</p>
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
