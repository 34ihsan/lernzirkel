'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { BadgePartnerItem } from '@/lib/site-defaults';

export default function TrustBanner({
  title,
  partners,
}: {
  title?: string;
  partners?: BadgePartnerItem[];
}) {
  const [activePartner, setActivePartner] = useState<BadgePartnerItem | null>(null);

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
                className="object-contain max-h-10 w-auto"
                style={{ maxWidth: `${p.width || 120}px`, maxHeight: `${p.height || 40}px`, height: 'auto' }}
              />
            ) : (
              <div className="h-10 px-4 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs rounded-md whitespace-nowrap">
                {p.name}
              </div>
            );

            return (
              <div key={p.id || idx} className="flex items-center justify-center">
                {p.description ? (
                  <button
                    type="button"
                    onClick={() => setActivePartner(p)}
                    title={p.name}
                    className="cursor-pointer"
                  >
                    {content}
                  </button>
                ) : p.url ? (
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

      {/* Açıklama Modalı */}
      {activePartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePartner(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePartner(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:bg-gray-800 transition-colors"
              title="Kapat"
            >
              <X size={18} className="text-gray-500" />
            </button>

            {activePartner.logoUrl && (
              <Image
                src={activePartner.logoUrl}
                alt={activePartner.name}
                width={activePartner.width || 120}
                height={activePartner.height || 40}
                className="object-contain mb-5"
                style={{ maxWidth: `${Math.max(activePartner.width || 120, 140)}px`, height: 'auto' }}
              />
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{activePartner.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {activePartner.description}
            </p>
            {activePartner.url && (
              <a
                href={activePartner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Mehr erfahren <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
