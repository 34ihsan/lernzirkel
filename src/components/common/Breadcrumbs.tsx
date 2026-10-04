import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url: string;
  isCurrent?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: Props) {
  if (!items || items.length === 0) return null;

  // JSON-LD structured data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: 'https://lernzirkel-online.de/'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.url.startsWith('http') ? item.url : `https://lernzirkel-online.de${item.url}`
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={`py-3 px-4 bg-gray-100 dark:bg-gray-800/50/70 border-b border-gray-200 dark:border-gray-700/80 text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${className}`}>
        <div className="container mx-auto max-w-6xl">
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <li>
              <Link 
                href="/" 
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-medium"
                title="Zur Startseite"
              >
                <Home size={14} className="text-primary/70" />
                <span className="sr-only sm:not-sr-only">Startseite</span>
              </Link>
            </li>

            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="flex items-center gap-1.5 sm:gap-2">
                  <ChevronRight size={13} className="text-gray-400 shrink-0" />
                  {isLast || item.isCurrent ? (
                    <span 
                      aria-current="page" 
                      className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      href={item.url} 
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors hover:underline truncate max-w-[150px] sm:max-w-none"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
