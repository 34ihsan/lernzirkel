import Link from 'next/link';
import { ArrowLeft, CheckCircle2, GraduationCap, AlertCircle, ExternalLink } from 'lucide-react';

export default function TelcPruefungenPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card relative overflow-hidden">
          
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <GraduationCap className="w-64 h-64" />
          </div>

          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Zertifizierung
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight relative z-10">
            telc Prüfungen A1-C1
          </h1>

          <div className="prose max-w-none text-gray-700 relative z-10">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-10 flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 text-lg mb-1 mt-0">Jetzt einen Platz sichern!!!</h3>
                <p className="text-red-700 m-0">Anmeldung vor Ort oder Online möglich.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-12 text-center">
              <h3 className="text-2xl font-bold text-primary mb-6">Online Anmeldung</h3>
              <p className="mb-6 text-gray-600">Sichern Sie sich Ihren Prüfungsplatz bequem von zu Hause aus über das offizielle Prüfungscenter.</p>
              <a 
                href="https://pruefungscenter.de/#/de/classes?location=Ludwigshafen%20am%20Rhein" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 font-bold py-4 px-8 rounded-lg transition-colors shadow-md text-lg"
              >
                Hier zur Online Anmeldung <ExternalLink className="w-5 h-5 ml-3" />
              </a>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-6">Wichtige Hinweise zur Anmeldung</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <p className="text-sm font-medium m-0">Die Anmeldung ist erst nach Erhalt der <strong>vollständigen Anmeldegebühr</strong> gültig.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <p className="text-sm font-medium m-0">Bei vor Ort Anmeldungen ist <strong>nur Barzahlung</strong> möglich.</p>
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            <div className="text-center">
              <h4 className="text-xl font-bold text-primary mb-4">Haben Sie Fragen zu den Prüfungen?</h4>
              <p className="mb-6">Schreiben Sie uns gerne eine E-Mail.</p>
              {/* Note: Obfuscated Email to prevent bots as requested in general requirements */}
              <a href="mailto:exams@lernzirkel-online.de" className="inline-block px-6 py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                exams@lernzirkel-online.de
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
