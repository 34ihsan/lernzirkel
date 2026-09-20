import Link from 'next/link';
import { BookOpen, GraduationCap, Users, Briefcase, ArrowRight } from 'lucide-react';

export default function DeutschGrundbildungPage() {
  const angebote = [
    {
      title: 'Integrationskurse',
      desc: 'Allgemeine Integrationskurse sowie Kurse mit Alphabetisierung, gefördert durch das BAMF. Der Fokus liegt auf Sprache und Orientierung in Deutschland.',
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      link: '/kontakt'
    },
    {
      title: 'ESF+ Alphabetisierung',
      desc: 'Grundbildung und Alphabetisierung für Erwachsene, die Lesen und Schreiben neu erlernen möchten. Kostenfreie Teilnahme möglich.',
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      link: '/esfplusalpha'
    },
    {
      title: 'Landesgeförderte Sprachkurse',
      desc: 'Berufsbezogene Deutschkurse und Förderprogramme des Landes Rheinland-Pfalz für spezifische Zielgruppen.',
      icon: <Users className="w-8 h-8 text-primary" />,
      link: '/kontakt'
    },
    {
      title: 'Privat- und Firmenkurse',
      desc: 'Maßgeschneiderte Sprachkurse für Unternehmen oder Einzelpersonen. Flexible Zeiten und individuelle Lehrpläne.',
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      link: '/kontakt'
    }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-16 border-l-4 border-accent pl-6 lg:pl-8">
          <span className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2 block">Erwachsenenbildung</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Deutsch & Grundbildung</h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed font-light">
            Bildung ist der Schlüssel zur gesellschaftlichen Teilhabe. Wir bieten maßgeschneiderte Kurse für Anfänger und Fortgeschrittene – zertifiziert, praxisnah und flexibel.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {angebote.map((item, i) => (
            <div key={i} className="flatsome-card p-10 border border-gray-100 flex flex-col group bg-white">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{item.desc}</p>
              <div className="mt-auto pt-4 border-t border-gray-50">
                <Link href={item.link} className="text-primary font-bold flex items-center group-hover:text-accent transition-colors">
                  Weitere Informationen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-primary rounded-2xl p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          
          <div className="max-w-2xl mb-8 md:mb-0 relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">Welcher Kurs ist der richtige für Sie?</h3>
            <p className="text-primary-light text-lg">
              Lassen Sie sich unverbindlich von unserem Team beraten. Wir helfen Ihnen auch bei der Beantragung von Fördermitteln (z.B. BAMF).
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link href="/kontakt" className="flatsome-button bg-accent hover:bg-red-700 text-white shadow-lg border-none text-lg px-8 py-4">
              Beratungstermin vereinbaren
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
