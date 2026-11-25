'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { BadgePartnerItem } from '@/lib/site-defaults';

export default function FooterBadges({
  title,
  items,
  partners,
  showTitle,
}: {
  title?: string;
  items?: string[];
  partners?: BadgePartnerItem[];
  showTitle?: boolean;
}) {
  const [activePartner, setActivePartner] = useState<BadgePartnerItem | null>(null);

  if (!((partners && partners.length > 0) || (items && items.length > 0))) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-6 md:space-y-0 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200">
      {showTitle !== false && (
        <p className="font-bold uppercase tracking-wider text-center md:text-left text-gray-700 dark:text-gray-300 text-xs sm:text-sm shrink-0">
          {title || "Zertifiziert & Gefördert durch:"}
        </p>
      )}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        {partners && partners.length > 0 ? (
          partners.map((partner, idx) => {
            const content = partner.logoUrl ? (
              <div className="flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/90 hover:bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name || "Partner Logo"}
                  width={partner.width || 120}
                  height={partner.height || 40}
                  className="object-contain max-h-12 w-auto transition-transform hover:scale-105"
                  style={{
                    maxWidth: partner.width ? `${partner.width}px` : '140px',
                    maxHeight: partner.height ? `${partner.height}px` : '48px',
                    height: 'auto'
                  }}
                />
              </div>
            ) : (
              <div className="h-10 px-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-md shadow-xs hover:bg-gray-200 transition-colors">
                {partner.name}
              </div>
            );

            if (partner.description) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePartner(partner)}
                  title={partner.name}
                  className="inline-block transition-opacity hover:opacity-90 cursor-pointer"
                >
                  {content}
                </button>
              );
            }

            return partner.url ? (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
                className="inline-block transition-opacity hover:opacity-90"
              >
                {content}
              </a>
            ) : (
              <div key={idx}>{content}</div>
            );
          })
        ) : (
          items?.map((badge, idx) => (
            <div key={idx} className="h-10 px-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-md shadow-xs">
              {badge}
            </div>
          ))
        )}
      </div>

      {activePartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePartner(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 text-left"
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
