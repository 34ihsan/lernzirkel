import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const galleryImages = [
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/DSC07796-1024x512.jpg',
    alt: 'Eingang',
    caption: 'Eingang'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/innenhof-1024x768.jpeg',
    alt: 'Eingang durch Bismarckstr.',
    caption: 'Eingang durch Bismarckstr.'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/durchLudwigsplatz2-1024x768.jpeg',
    alt: 'Eingang durch Ludwigsplatz',
    caption: 'Eingang durch Ludwigsplatz'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/durchLudwigsplatz1-1024x768.jpeg',
    alt: 'Eingang durch Ludwigsplatz',
    caption: 'Eingang durch Ludwigsplatz'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/RichtungRathaus-1024x768.jpeg',
    alt: 'Eingang durch Bismarckstr.',
    caption: 'Eingang durch Bismarckstr.'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Bibliothek-1024x768.jpeg',
    alt: 'Bibliothek',
    caption: 'Bibliothek'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Empfang-1024x768.jpeg',
    alt: 'Empfang',
    caption: 'Empfang'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Warteraum_hinten-1024x768.jpeg',
    alt: 'Warteraum hinten',
    caption: 'Warteraum hinten'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Flur_hinten-1024x768.jpeg',
    alt: 'Flur',
    caption: 'Flur'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/signal-2024-09-21-132053_009-1024x683.jpeg',
    alt: 'Lernzirkel Räume',
    caption: ''
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/WhatsApp-Image-2026-09-07-at-17.34.41-1024x768.jpeg',
    alt: 'Projekt: Fit fürs Ehrenamt',
    caption: 'Projekt: Fit fürs Ehrenamt'
  },
  {
    src: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/Freizeitraum-09-2024-1024x768.jpg',
    alt: 'Freizeitraum',
    caption: 'Freizeitraum'
  }
];

export default function RaeumlichkeitenPage() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Link */}
        <Link href="/ueber-uns" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zu Über Uns
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none p-8 md:p-14 border border-gray-100 dark:border-gray-800 flatsome-card">
          
          <div className="flex items-center space-x-3 mb-6">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm uppercase tracking-wider">
              Rundgang
            </span>
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Räumlichkeiten
          </h1>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
            Machen Sie sich ein Bild von unseren Räumlichkeiten. Hier lernen, arbeiten und begegnen sich Menschen jeden Alters in einer einladenden und motivierenden Atmosphäre.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, idx) => (
              <div key={idx} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
