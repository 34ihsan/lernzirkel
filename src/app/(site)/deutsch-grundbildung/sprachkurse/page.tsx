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
              Das Land Rheinland-Pfalz gewährt seit 2002 eine Förderung zur Durchführung von <strong>Sprachkursen</strong> zur sprachlichen, persönlichen, kulturellen, beruflichen und sozialen Integration für Migrantinnen und Migranten. Teilnehmen können alle erwachsenen Menschen mit Migrationshintergrund, unabhängig von Herkunft, rechtlichem Status oder bisheriger Aufenthaltsdauer.
            </p>
            <p className="leading-relaxed mb-10">
              Sie richten sich insbesondere an diejenige, die keinen Zugang zum Integrationskurs des Bundesamtes für Migration und Flüchtlinge (BAMF) haben und stehen auch Flüchtlingen und Asylsuchenden offen.
            </p>

            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 mb-10">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Förderung & Landeszuwendungen</h3>
              <p className="text-blue-800 mb-4">
                Die Landeszuwendungen für die Kurse werden vom Ministerium für Familie, Frauen, Kultur und Integration (MFFKI) durch die Aufsichts- und Dienstleistungsdirektion (ADD) gewährt. Auf folgendes wird hingewiesen:
              </p>
              <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-900 m-0">
                  Personen mit einer Teilnahmeberechtigung für einen Bundeskurs (Bestätigung nach dem Zuwanderungsgesetz) dürfen auch ergänzend an vom Land geförderten Kursen teilnehmen. Die Anzahl dieser Personen darf maximal die Hälfte der Kursteilnehmer und nicht mehr als 8 Personen pro Kurs umfassen.
                </p>
                <a href="https://add.rlp.de/de/themen/foerderungen/im-sozialen-bereich/integrations-und-migrationsfoerderung/landeskurse-sprachziel-deutsch/" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 inline-block">
                  Weitere Informationen bei der ADD
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-primary mb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-accent" /> Niveaustufen
                </h4>
                <p className="text-sm m-0">Angeboten werden Kurse in den Niveaustufen <strong>A1, A2, B1, B2</strong>.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-primary mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-accent" /> Zusatzangebote
                </h4>
                <p className="text-sm m-0">Neben den Kursen haben die Teilnehmer auch die Chance auf eine <strong>kostenlose sozialpädagogische Beratung</strong>.</p>
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4">Voraussetzungen</h3>
            <ul className="space-y-4 mb-10 ml-0 pl-0 list-none">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Die Landeskurse werden vom Land Rheinland-Pfalz gefördert. Die Kurse sind daher vorrangig für Teilnehmern mit <strong>Wohnsitz in Rheinland-Pfalz</strong>.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Teilnehmer die einen A2, B1 oder B2 Kurs besuchen möchten, müssen entweder ein <strong>Zertifikat des Vorgänger Kurses</strong> vorzeigen oder einen <strong>Einstufungstest</strong> ablegen.</span>
              </li>
            </ul>

            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary text-center mt-12">
              <h4 className="text-xl font-bold text-primary mb-4">Aktuelle Deutschkurse A1-B2</h4>
              <p className="mb-6">Informieren Sie sich über unsere aktuell laufenden und geplanten Kurse.</p>
              <Link href="/deutschkurse-a1-b2" className="flatsome-button group">
                Zu den aktuellen Kursen <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
