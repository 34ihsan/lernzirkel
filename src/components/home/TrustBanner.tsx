import React from 'react';
import Image from 'next/image';
import { BadgePartnerItem } from '@/lib/site-defaults';

export default function TrustBanner({
  title,
  partners,
}: {
  title?: string;
  partners?: BadgePartnerItem[];
}) {
  if (!partners || partners.length === 0) return null;

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">
          {title || 'Zertifiziert & Gefördert durch:'}
        </span>
        <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((p, idx) => {
            const content = p.logoUrl ? (
              <Image
                src={p.logoUrl}
                alt={p.name}
                width={p.width || 120}
                height={p.height || 40}
                className="object-contain h-10 w-auto"
                style={{ maxWidth: `${p.width || 120}px`, maxHeight: `${p.height || 40}px` }}
              />
            ) : (
              <div className="h-10 px-4 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs rounded-md whitespace-nowrap">
                {p.name}
              </div>
            );

            return (
              <div key={p.id || idx} className="flex items-center justify-center">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" title={p.name}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
