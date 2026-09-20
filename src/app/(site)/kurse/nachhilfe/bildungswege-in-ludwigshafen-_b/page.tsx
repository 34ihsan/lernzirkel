import Link from 'next/link';
import { Download, Info, Map, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function BildungswegePage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Bildungsberatung
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Bildungswege in Rheinland-Pfalz
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Viele Wege führen zum Ziel. Wir helfen Ihnen, den richtigen für Ihr Kind zu finden.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flatsome-card relative overflow-hidden mb-12">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                <Map className="w-6 h-6 mr-3 text-accent" />
                Welche Schule ist die richtige?
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  An welcher Schule kann mein Kind welchen Abschluss erreichen? Den richtigen Weg zu finden, ist oft nicht leicht. 
                </p>
                <p>
                  Die Grafik zeigt Ihnen alle Schularten, Abschlüsse und Übergangsmöglichkeiten in Rheinland-Pfalz. Damit erhalten Sie einen klaren Überblick über die vielfältigen Möglichkeiten im Bildungssystem.
                </p>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 p-2">
              <div className="relative aspect-[4/3] w-full">
                <Image 
                  src="https://lernzirkel-online.de/wp-content/uploads/2016/08/Bildungswege-in-RP.jpg"
                  alt="Bildungswege in Rheinland-Pfalz Übersicht"
                  fill
                  className="object-contain rounded-lg"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Downloads & Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-blue-50/50 rounded-xl p-8 border border-blue-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-accent" />
              Ausführliche Broschüre
            </h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Eine ausführliche Darstellung des Bildungssystems finden Sie in der Broschüre vom Ministerium für Bildung, Wissenschaft, Weiterbildung und Kultur – Rheinland-Pfalz.
            </p>
            <a 
              href="https://bm.rlp.de/fileadmin/mbwjk/service/publikationen/Bildung/Bildungswege_in_Rheinland-Pfalz.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Broschüre herunterladen
            </a>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 flex flex-col h-full">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Info className="w-6 h-6 mr-3 text-accent" />
              Infos für Ludwigshafen
            </h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Informationen zur Anmeldung und Aufnahme an weiterführenden Schulen direkt in Ludwigshafen finden Sie auf der offiziellen Website der Stadt.
            </p>
            <a 
              href="https://www.ludwigshafen.de/lebenswert/bildung/schulen/anmeldung-weiterfuehrende-schulen/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowRightIcon className="w-5 h-5 mr-2" />
              Zur Stadt Ludwigshafen
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
