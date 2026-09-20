import Link from 'next/link';
import { ArrowRight, CheckCircle2, UserPlus, Users } from 'lucide-react';

export default function PrivatkursePage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card relative overflow-hidden">
          
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Privat & Firmen
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Sprachtraining Deutsch für den Beruf
          </h1>

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Sprachcoaching</h3>
            <p className="leading-relaxed mb-6">
              Im Sprachcoaching liegt der Schwerpunkt auf der Kommunikation und der praktischen Anwendung der deutschen Sprache. Sie werden dabei nicht nur sprachlich, sondern auch inhaltlich und persönlich fit gemacht. 
            </p>
            <p className="leading-relaxed mb-10">
              Der Lernzirkel Ludwigshafen e.V. setzt Sprachcoaches ein, die einen Hochschulabschluss und langjährige Lehrerfahrung im Bereich Deutsch als Zweitsprache besitzen. Die Sprachtrainer gehen auf die individuellen Wünsche und Bedürfnisse der Teilnehmenden ein und unterstützen diese gezielt bei der Erreichung ihrer Lernziele.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-4">
                  <UserPlus className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-bold text-primary mb-3">Einzeltraining</h4>
                <ul className="space-y-2 m-0 p-0 list-none text-sm">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Individuelle Betreuung</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Maßgeschneiderte Inhalte</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Flexible Terminabsprache</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Intensives Sprachtraining</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-bold text-primary mb-3">Gruppentraining</h4>
                <ul className="space-y-2 m-0 p-0 list-none text-sm">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Lernen im Team</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Praxisnahe Konversation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Austausch mit anderen</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Kosteneffizient</li>
                </ul>
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            <h3 className="text-2xl font-bold text-foreground mb-4">Inhalte des Coachings</h3>
            <p className="leading-relaxed mb-6">Wir bereiten Sie gezielt auf Ihren Berufsalltag vor. Mögliche Themengebiete sind:</p>
            
            <ul className="space-y-3 mb-10 ml-2">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Fachvokabular:</strong> Branchenspezifische Begriffe (z.B. für Pflegekräfte, Ingenieure, Kaufleute)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Kommunikation:</strong> Telefonate führen, E-Mails schreiben, Meetings und Präsentationen</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Bewerbungstraining:</strong> Erstellung von Bewerbungsunterlagen und Vorbereitung auf Vorstellungsgespräche</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Interkulturelle Kompetenz:</strong> Umgangsformen und Arbeitskultur in Deutschland</span>
              </li>
            </ul>

            <div className="bg-secondary/30 p-8 rounded-xl border border-secondary text-center mt-12">
              <h4 className="text-xl font-bold text-primary mb-4">Interessiert?</h4>
              <p className="mb-6">Kontaktieren Sie uns für ein unverbindliches Angebot oder einen Beratungstermin.</p>
              <Link href="/kontakt" className="flatsome-button group">
                Angebot anfragen <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
