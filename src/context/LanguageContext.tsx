'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, UI_TRANSLATIONS, LanguageMeta } from '@/lib/i18n/languages';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentMeta: LanguageMeta;
  languages: LanguageMeta[];
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  t: (key: string, defaultText?: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'lernzirkel_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('de');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved language from localStorage on client mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === 'de' || saved === 'tr' || saved === 'en' || saved === 'ar')) {
        setLanguageState(saved);
      } else if (typeof navigator !== 'undefined') {
        // Auto-detect language if no saved preference
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('tr')) setLanguageState('tr');
        else if (browserLang.startsWith('ar')) setLanguageState('ar');
        else if (browserLang.startsWith('en')) setLanguageState('en');
        else setLanguageState('de');
      }
    } catch {
      // Ignore localStorage errors in private mode
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const currentMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const dir = currentMeta.dir;
  const isRTL = dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (isRTL) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  }, [language, dir, isRTL]);

  const t = (key: string, defaultText?: string, params?: Record<string, string>): string => {
    const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.de;
    let translation = dict[key] || UI_TRANSLATIONS.de[key] || defaultText || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramVal);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentMeta,
        languages: SUPPORTED_LANGUAGES,
        dir,
        isRTL,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside Provider
    return {
      language: 'de' as SupportedLanguage,
      setLanguage: () => {},
      currentMeta: SUPPORTED_LANGUAGES[0],
      languages: SUPPORTED_LANGUAGES,
      dir: 'ltr' as 'ltr' | 'rtl',
      isRTL: false,
      t: (key: string, defaultText?: string) => defaultText || key
    };
  }
  return context;
}
