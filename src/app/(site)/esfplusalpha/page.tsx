import Image from 'next/image';
import Link from 'next/link';
import { Download, Users, Calendar, ArrowRight } from 'lucide-react';

export default function EsfPlusAlphaPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Kurse & Angebote
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            ESF+ Alpha Kursen
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kostenlose Alpha- und Grundbildungskurse für Anfänger und Fortgeschrittene.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="md:flex">
            {/* Image / Graphic Side */}
            <div className="md:w-2/5 relative h-64 md:h-auto bg-blue-50/50">
              <Image 
                src="https://lernzirkel-online.de/wp-content/uploads/2016/09/pexels-ivan-samkov-8962373-scaled.jpg" 
                alt="ESF+ Alpha"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Content Side */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-primary mb-6">Einsteigen leicht gemacht</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Der Lernzirkel Ludwigshafen e.V. bietet im Jahr 2026 Alpha-und Grundbildungskurse für Anfänger und Fortgeschrittene an. 
                </p>
                
                <div className="bg-accent/5 p-6 rounded-xl border border-accent/10">
                  <div className="flex items-start mb-4">
                    <Calendar className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary">Jederzeit einsteigen</h4>
                      <p className="text-sm">Die Kurse sind <strong>kostenlos</strong> und ein Einstieg ist <strong>jederzeit</strong> möglich.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link 
                    href="/kontakt"
                    className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
                  >
                    Jetzt anmelden
                  </Link>
                  <Link 
                    href="/stellenausschreibung-esf-alphabetisierungskurse"
                    className="inline-flex items-center justify-center bg-white text-primary border border-gray-200 hover:border-accent hover:text-accent font-bold py-3 px-8 rounded-lg transition-colors shadow-sm"
                  >
                    Wir suchen Lehrkräfte!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners and Funding */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-primary mb-4">Förderung und Partner</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Die Alpha- und Grundbildungskurse des Europäischen Sozialfonds Plus (ESF+) werden kofinanziert durch das Ministerium für Arbeit, Soziales, Transformation und Digitalisierung Rheinland-Pfalz.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <a href="https://ec.europa.eu/european-social-fund-plus/de" target="_blank" rel="noreferrer noopener" className="hover:opacity-80 transition-opacity">
              <Image 
                src="https://andereslernen.de/wp-content/uploads/2023/01/DE_V_Kofinanziert_von_der_Europaeischen_Union_POS_klein.png" 
                alt="Kofinanziert von der Europäischen Union" 
                width={164} 
                height={166}
                unoptimized
              />
            </a>
            <a href="https://masffj.rlp.de/" target="_blank" rel="noreferrer noopener" className="hover:opacity-80 transition-opacity">
              <Image 
                src="https://lernzirkel-online.de/wp-content/uploads/2022/02/RP_farbig_MASFFJ-300x188.jpg" 
                alt="Rheinland-Pfalz Ministerium" 
                width={300} 
                height={188}
                unoptimized
              />
            </a>
          </div>
        </div>

        {/* Downloads */}
        <div className="bg-primary text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Informationsmaterial herunterladen</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Laden Sie sich unser aktuelles Eindruckplakat für das Jahr 2026 herunter, um alle wichtigen Informationen kompakt zusammengefasst zu haben.
            </p>
            <a 
              href="https://lernzirkel-online.de/wp-content/uploads/2022/02/Eindruckplakat-2026-final-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
            >
              <Download className="w-5 h-5 mr-2" />
              Eindruckplakat 2026 (PDF)
            </a>
          </div>
          
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
