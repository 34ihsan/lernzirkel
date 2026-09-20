import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb, Users, Handshake, Heart, ArrowLeft, Target } from 'lucide-react';

export default function DSEEProjectPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Link */}
        <Link href="/projekte" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zur Projektübersicht
        </Link>
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Aktuelles Projekt
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            DSEE Projekt: Ehrenamt stärken
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ein neues Projekt in Kooperation mit der Deutschen Stiftung für Engagement und Ehrenamt zur Stärkung lokaler Ehrenamtsstrukturen.
          </p>
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-16">
          <Image 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
            alt="DSEE Projekt"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
            <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4 drop-shadow-md">
              Gemeinsam stark für die Gesellschaft
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-6 text-lg text-gray-600 leading-relaxed">
            <h3 className="text-2xl font-bold text-primary mb-4">Über das Projekt</h3>
            <p>
              Im Rahmen unseres Projekts, gefördert durch die <strong>Deutsche Stiftung für Engagement und Ehrenamt (DSEE)</strong>, 
              setzen wir uns aktiv für den Aufbau und die Stärkung lokaler Ehrenamtsstrukturen in Ludwigshafen ein.
            </p>
            <p>
              Ohne das Engagement von Freiwilligen wären viele unserer Angebote nicht möglich. Wir suchen stetig nach motivierten Menschen, 
              die sich im Rahmen des DSEE-Projekts bei uns einbringen möchten – sei es als Mentor, im Sprachcafé oder bei der Nachhilfe.
            </p>

            <h3 className="text-2xl font-bold text-primary mt-12 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-accent" />
              Unsere Ziele
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
                <h4 className="font-bold text-primary mb-3">Strukturen schaffen</h4>
                <p className="text-sm leading-relaxed text-gray-600">Aufbau von nachhaltigen Netzwerken zwischen Freiwilligen und Hilfesuchenden im Bildungsbereich.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
                <h4 className="font-bold text-primary mb-3">Qualifizierung</h4>
                <p className="text-sm leading-relaxed text-gray-600">Begleitung, Schulung und Weiterbildung der ehrenamtlichen Helferinnen und Helfer.</p>
              </div>
            </div>
            
            <div className="bg-accent/5 p-8 rounded-xl shadow-sm border border-accent/10 mt-8">
              <h4 className="font-bold text-primary text-xl mb-4">Schwerpunkte:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-accent mr-3 font-bold">✓</span>
                  Stärkung ehrenamtlicher Strukturen
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 font-bold">✓</span>
                  Förderung von Integration und Teilhabe
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 font-bold">✓</span>
                  Qualifizierung von Engagierten
                </li>
              </ul>
            </div>
          </div>
          
          {/* Sidebar / Info Box */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-accent sticky top-8">
              <h3 className="text-xl font-bold text-primary mb-6">Projekt-Infos</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-accent mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Zielgruppe</p>
                    <p className="font-medium text-gray-700">Ehrenamtliche & Engagierte</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Handshake className="w-6 h-6 text-accent mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Förderer</p>
                    <p className="font-medium text-gray-700">DSEE</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Lightbulb className="w-6 h-6 text-accent mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Status</p>
                    <p className="font-medium text-green-600">Aktiv</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-6 text-center font-medium">
                  Interesse geweckt? Kontaktieren Sie uns unverbindlich für weitere Informationen zur Mitarbeit.
                </p>
                <Link 
                  href="/kontakt"
                  className="flex items-center justify-center w-full bg-accent text-white hover:bg-accent/90 font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Jetzt engagieren
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
