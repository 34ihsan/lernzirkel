'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/lib/i18n/languages';
import CountryFlag from './CountryFlag';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'pills';
  className?: string;
  theme?: 'dark' | 'light';
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
  theme = 'dark'
}: LanguageSwitcherProps) {
  const { language, setLanguage, languages, currentMeta } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // If pills variant (ideal for mobile menu drawer)
  if (variant === 'pills') {
    return (
      <div className={`grid grid-cols-4 gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800/50/90 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
        {languages.map((l) => {
          const isActive = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm dark:shadow-none scale-[1.02]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:bg-gray-900 hover:text-blue-700'
              }`}
              title={l.name}
            >
              <CountryFlag code={l.code} size="xs" shape="circle" />
              <span>{l.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (ideal for Header Top Bar)
  const isDark = theme === 'dark';
  const activeMeta = mounted ? currentMeta : (languages.find(l => l.code === 'de') || currentMeta);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all border ${
          isDark
            ? 'bg-white dark:bg-gray-900/10 hover:bg-white dark:bg-gray-900/20 text-white border-white/20'
            : 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
        }`}
        aria-expanded={isOpen}
        aria-label="Dil Seçimi / Select Language"
      >
        <CountryFlag code={activeMeta.code} size="xs" shape="circle" />
        <span className="font-bold">{activeMeta.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-[100] animate-in fade-in zoom-in-95 duration-150"
          style={{ transformOrigin: 'top right' }}
        >
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-500" />
              Sprache / Dil Seçin
            </span>
            <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
              4 Diller
            </span>
          </div>

          <div className="space-y-1">
            {languages.map((item) => {
              const active = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'hover:bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CountryFlag code={item.code} size="md" shape="circle" />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{item.nativeName}</span>
                        <span className="text-[10px] text-gray-400 font-normal">({item.code.toUpperCase()})</span>
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {active && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
