import React from 'react';
import { getCachedNewsById } from '@/lib/cached-content';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const news = await getCachedNewsById(resolvedParams.id);

  if (!news) {
    return { title: 'Nicht gefunden | Lernzirkel Ludwigshafen' };
  }

  // Strip HTML tags roughly for description
  const cleanContent = news.content.replace(/<[^>]+>/g, '');
  const description = cleanContent.substring(0, 160) + (cleanContent.length > 160 ? '...' : '');

  // Use dynamic OG endpoint or fallback to news image
  const ogImageUrl = news.imageUrl || `/api/og?title=${encodeURIComponent(news.title)}&description=${encodeURIComponent(description.substring(0, 100))}&badge=Aktuelles`;

  return {
    title: `${news.title} | Lernzirkel Ludwigshafen e.V.`,
    description,
    openGraph: {
      title: news.title,
      description: description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        }
      ],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const news = await getCachedNewsById(resolvedParams.id);

  if (!news) {
    notFound();
  }

  // Extract clean text for description
  const cleanContent = news.content.replace(/<[^>]+>/g, '');
  const description = cleanContent.substring(0, 160) + (cleanContent.length > 160 ? '...' : '');

  // Generate JSON-LD Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": description,
    "image": news.imageUrl ? [news.imageUrl] : [],
    "datePublished": news.publishDate.toISOString(),
    "dateModified": news.updatedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Lernzirkel Ludwigshafen e.V.",
      "url": "https://lernzirkel-online.de"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lernzirkel Ludwigshafen e.V.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lernzirkel-online.de/images/logo.png"
      }
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-24">
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/aktuelles" className="inline-flex items-center text-primary hover:underline font-medium mb-8">
          <ArrowLeft size={16} className="mr-2" /> Zurück zur Übersicht
        </Link>
        
        <article>
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
              <Calendar size={16} className="mr-2" />
              {new Date(news.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              {news.title}
            </h1>
          </header>

          {news.imageUrl && (
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-md dark:shadow-none relative">
              <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div 
            className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {news.design && typeof news.design === 'object' && (news.design as Record<string, any>).linkUrl && (
            <div className="mt-12 text-center md:text-left">
              <a 
                href={(news.design as Record<string, any>).linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary/90 transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
              >
                {(news.design as Record<string, any>).linkText || 'Mehr erfahren'}
              </a>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
