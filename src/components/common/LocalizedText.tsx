'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

type TranslationRow = { language: string } & Record<string, unknown>;

/**
 * Almanca ana metin + *Translation satırları verilince, ziyaretçinin o anki dilini
 * (LanguageContext, localStorage tabanlı) baz alıp doğru metni seçer. Seçili dilde
 * çeviri yoksa (örn. henüz "Tüm Siteyi Çevir" çalıştırılmadı) sessizce Almancaya düşer —
 * asla boş/kırık görünmez.
 */
export function useLocalizedValue(
  base: string | null | undefined,
  translations: TranslationRow[] | null | undefined,
  field: string
): string {
  const { language } = useLanguage();
  const fallback = base || '';
  if (language === 'de' || !translations || translations.length === 0) return fallback;

  const match = translations.find((t) => t.language === language);
  const value = match?.[field];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

interface LocalizedTextProps {
  base: string | null | undefined;
  translations: TranslationRow[] | null | undefined;
  field: string;
  as?: React.ElementType;
  className?: string;
  /** true: value dangerouslySetInnerHTML ile (zengin metin/HTML alanları için) basılır. */
  html?: boolean;
}

export function LocalizedText({ base, translations, field, as, className, html }: LocalizedTextProps) {
  const Tag = (as || 'span') as React.ElementType;
  const value = useLocalizedValue(base, translations, field);

  if (html) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />;
  }
  return <Tag className={className}>{value}</Tag>;
}
