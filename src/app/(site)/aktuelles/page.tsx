import React from 'react';
import { getCachedNews } from '@/lib/cached-content';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Aktuelles | Lernzirkel Ludwigshafen e.V.',
  description: 'Aktuelle Nachrichten, Ankündigungen und Neuigkeiten aus unserem Verein.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AktuellesPage() {
  const newsList = await getCachedNews();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-primary mb-6">
            <Newspaper size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">Aktuelles</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Neuigkeiten, wichtige Ankündigungen und Einblicke in die Arbeit des Lernzirkel Ludwigshafen e.V.
          </p>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Derzeit gibt es keine neuen Meldungen.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block font-medium">Zurück zur Startseite</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news: any) => (
              <Link href={`/aktuelles/${news.id}`} key={news.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 hover:border-primary/20">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {news.imageUrl ? (
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/10 text-primary/30">
                      <Newspaper size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-gray-400 mb-3 font-medium">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(news.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h2>
                  <div className="mt-auto pt-4 flex items-center text-primary font-semibold text-sm">
                    Mehr lesen <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
