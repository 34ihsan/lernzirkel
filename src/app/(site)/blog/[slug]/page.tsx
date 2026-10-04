import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug }
  }).catch(() => null);

  if (!article) return { title: 'Nicht gefunden' };

  return {
    title: `${article.title} | Lernzirkel Blog`,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: article.author ? [article.author] : [],
    }
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article || (!article.isPublished && process.env.NODE_ENV === 'production')) {
    notFound();
  }

  // Find related articles (same category)
  const relatedArticles = await prisma.article.findMany({
    where: { 
      isPublished: true, 
      category: article.category,
      id: { not: article.id }
    },
    take: 3,
    orderBy: { publishedAt: 'desc' }
  });

  // Basic SEO JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'Lernzirkel Redaktion',
    },
    description: article.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
        {/* Cover Image Header */}
        <div className="w-full h-[40vh] min-h-[300px] max-h-[500px] bg-gray-100 dark:bg-gray-800/50 relative overflow-hidden">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-blue-600 opacity-90" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-gray-900/20 backdrop-blur text-white text-sm font-bold uppercase tracking-wider mb-6">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto drop-shadow-lg">
                {article.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white/90 text-sm font-medium">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 opacity-80" />
                  {new Date(article.publishedAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {article.author && (
                  <div className="flex items-center">
                    <User size={16} className="mr-2 opacity-80" />
                    {article.author}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
            
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors mb-10">
              <ArrowLeft size={16} className="mr-2" /> Zurück zur Übersicht
            </Link>
            
            {/* Lead/Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-medium">
                {article.excerpt}
              </p>
            )}

            {/* Main Content */}
            {/* Note: The 'prose' class is from @tailwindcss/typography plugin, if it's installed. 
                If not, we use raw styling or the CMS standard styling. */}
            <div 
              className="prose prose-lg prose-blue max-w-none text-gray-700 dark:text-gray-300 leading-relaxed
                prose-headings:font-bold prose-headings:text-gray-900 dark:text-gray-100 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl
                prose-a:text-primary prose-a:font-semibold hover:prose-a:text-primary-light
                prose-img:rounded-xl prose-img:shadow-sm dark:shadow-none"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
            
            {/* Tags */}
            {article.tags && (
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-gray-400 mr-2" />
                  {article.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="container mx-auto px-4 max-w-6xl mt-24">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">Ähnliche Artikel</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map(rel => (
                <Link href={`/blog/${rel.slug}`} key={rel.id} className="group block">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-4 overflow-hidden relative">
                    {rel.coverImage ? (
                      <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-primary/10" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2 mb-2">{rel.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(rel.publishedAt).toLocaleDateString('de-DE')}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
