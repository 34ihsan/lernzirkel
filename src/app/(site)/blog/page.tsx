import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & Wissen | Lernzirkel Ludwigshafen e.V.',
  description: 'Aktuelle Artikel, Ratgeber und Neuigkeiten rund um Bildung, Integration und den Migrationsfachdienst.',
};

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const currentCategory = searchParams.category || 'ALL';
  
  const whereClause = currentCategory === 'ALL' 
    ? { isPublished: true } 
    : { isPublished: true, category: currentCategory };

  const articles = await prisma.article.findMany({
    where: whereClause,
    orderBy: { publishedAt: 'desc' }
  }).catch(() => []);

  // Get distinct categories that actually have articles
  const allArticles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { category: true }
  }).catch(() => []);
  const activeCategories = Array.from(new Set(allArticles.map(a => a.category)));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-primary mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">Blog & Ratgeber</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Wissenswertes, Tipps und Neuigkeiten zu MFD, Integration, Nachhilfe und vielen weiteren spannenden Themen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link 
            href="/blog" 
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${currentCategory === 'ALL' ? 'bg-primary text-white shadow-md dark:shadow-none' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'}`}
          >
            Alle Themen
          </Link>
          {activeCategories.map(cat => (
            <Link 
              key={cat}
              href={`/blog?category=${cat}`} 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${currentCategory === cat ? 'bg-primary text-white shadow-md dark:shadow-none' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Keine Artikel in dieser Kategorie gefunden.</p>
            <Link href="/blog" className="text-primary hover:underline mt-4 inline-block font-medium">Zurück zur Übersicht</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 hover:border-primary/20">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/10 text-primary/30">
                      <BookOpen size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-900/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm dark:shadow-none">
                    {article.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-gray-400 mb-3 font-medium">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(article.publishedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-primary font-semibold text-sm">
                    Weiterlesen <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
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
