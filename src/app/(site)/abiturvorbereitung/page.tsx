import { BookOpen, Clock, Presentation, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AbiturvorbereitungPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-accent" />,
      title: "Prüfungsrelevanter Lehrstoff",
      description: "Wir wiederholen und erarbeiten gezielt die Themen, die für das Abitur wichtig sind, und lösen Prüfungsaufgaben der vergangenen Jahre."
    },
    {
      icon: <Clock className="w-8 h-8 text-accent" />,
      title: "Umgang mit Zeitdruck",
      description: "Die SchülerInnen lernen in unseren Kursen, mit der Prüfungssituation souverän umzugehen und unter Zeitdruck konzentriert zu arbeiten."
    },
    {
      icon: <Presentation className="w-8 h-8 text-accent" />,
      title: "Mündliche Prüfungen",
      description: "Wir bereiten die angehenden AbiturientInnen auf einen selbstsicheren und souveränen Auftritt in ihren mündlichen Prüfungen vor."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-accent" />,
      title: "Studien- & Berufswahl",
      description: "Durch Seminare, Vorträge und Universitätsbesichtigungen bieten wir einen Überblick über Studiermöglichkeiten und helfen bei der Berufswahl."
    }
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Crashkurse
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Abiturvorbereitung
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Die allgemeine Hochschulreife ist erforderlich, um den universitären Bildungsweg einschlagen zu können. Wir unterstützen Sie auf diesem Weg!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px]">
            <Image 
              src="https://lernzirkel-online.de/wp-content/uploads/2016/08/Abiturvorbereitung.jpg" 
              alt="Abiturvorbereitung"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
              <div className="p-8">
                <p className="text-white font-bold text-2xl mb-2">Erfolgreich zum Abitur</p>
                <p className="text-white/90">Mit unserer gezielten Vorbereitung ins Studium starten.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Auf dem Weg zur allgemeinen Hochschulreife unterstützen wir unsere Schüler und Schülerinnen mit maßgeschneiderten Abiturvorbereitungskursen.
            </p>
            <p>
              In den Kursen werden prüfungsrelevante Lehrstoffe intensiv wiederholt und erarbeitet. Anhand von Prüfungsaufgaben der vergangenen Jahre simulieren wir den Ernstfall.
            </p>
            <p>
              Darüber hinaus bieten wir Informationsveranstaltungen an, die den angehenden AbiturientInnen zu einem Überblick über Studiermöglichkeiten und Berufswahl verhelfen sollen. Dies findet in Form von Seminaren, Vorträgen und Universitätsbesichtigungen statt.
            </p>
            
            <div className="pt-6">
              <Link 
                href="/kontakt"
                className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
              >
                Jetzt anmelden
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 flatsome-card hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
