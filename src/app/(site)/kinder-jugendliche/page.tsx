import Link from 'next/link';
import { Pencil, Trophy, Puzzle, BrainCircuit, ArrowRight } from 'lucide-react';

export default function KinderJugendlichePage() {
  const angebote = [
    {
      title: 'Intensive Nachhilfe',
      desc: 'In kleinen Gruppen oder im Einzelunterricht. Für alle Fächer von der 2. bis zur 13. Klasse. Individuelle Förderung für bessere Noten.',
      icon: <Pencil className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Prüfungsvorbereitung',
      desc: 'Gezielte und intensive Vorbereitung auf Klassenarbeiten, die Mittlere Reife oder das Abitur. Angstfrei in die Prüfung gehen.',
      icon: <Trophy className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Hausaufgabenbetreuung',
      desc: 'Ruhige Atmosphäre und pädagogische Betreuung, damit die Hausaufgaben vollständig und richtig erledigt werden.',
      icon: <Puzzle className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Mentoring & Freizeit',
      desc: 'Jugendbetreuung, Mentoring-Programme sowie abwechslungsreiche Ferienprogramme und Freizeitangebote.',
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Für die Zukunft</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Kinder- & Jugendarbeit</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            Wir unterstützen Schülerinnen und Schüler auf ihrem Bildungsweg. Mit gezielter Förderung, Geduld und modernen Lehrmethoden helfen wir dabei, schulische Defizite abzubauen und neue Potenziale zu wecken.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {angebote.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 flex items-start">
              <div className="bg-secondary p-4 rounded-lg mr-6 shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Block */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center max-w-4xl mx-auto flatsome-card">
          <h3 className="text-2xl font-bold text-primary mb-4">Kostenlose Förderung möglich (BuT)</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Wussten Sie schon? Über das Bildungs- und Teilhabepaket (BuT) können die Kosten für Nachhilfe unter bestimmten Voraussetzungen zu 100% übernommen werden. Wir beraten Sie gerne bei der Antragstellung!
          </p>
          <Link href="/kontakt" className="flatsome-button">
            Jetzt Platz sichern
          </Link>
        </div>

      </div>
    </div>
  );
}
