'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Type, Contrast, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function A11yPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [easyLanguage, setEasyLanguage] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedContrast = localStorage.getItem('a11y-contrast') === 'true';
    const savedTextSize = (localStorage.getItem('a11y-textsize') as 'normal' | 'large' | 'xlarge') || 'normal';
    const savedEasyLang = localStorage.getItem('a11y-easylanguage') === 'true';

    if (savedContrast) setHighContrast(true);
    if (savedTextSize !== 'normal') setTextSize(savedTextSize);
    if (savedEasyLang) setEasyLanguage(true);
  }, []);

  // Apply High Contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('a11y-contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('a11y-contrast', 'false');
    }
  }, [highContrast]);

  // Apply Text Size
  useEffect(() => {
    document.documentElement.classList.remove('text-large', 'text-xlarge');
    if (textSize === 'large') {
      document.documentElement.classList.add('text-large');
    } else if (textSize === 'xlarge') {
      document.documentElement.classList.add('text-xlarge');
    }
    localStorage.setItem('a11y-textsize', textSize);
  }, [textSize]);

  // Apply Easy Language Preference
  useEffect(() => {
    localStorage.setItem('a11y-easylanguage', easyLanguage.toString());
    // Future integration: This could dispatch an event or use a Context to tell 
    // the content layer to show simplified text variants.
  }, [easyLanguage]);

  return (
    <div className="fixed bottom-20 left-4 lg:bottom-8 lg:left-8 z-50">
      {/* Trigger Button */}
      <Button
        variant="default"
        size="icon"
        className="h-14 w-14 rounded-full shadow-royal bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Erişilebilirlik Seçenekleri (Barrierefreiheit)"
      >
        <Accessibility className="h-7 w-7" />
      </Button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-0 mb-4 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-floating border border-slate-100 overflow-hidden"
          >
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Barrierefreiheit
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Text Size Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Type className="h-4 w-4 text-primary" />
                  Textgröße (Metin Boyutu)
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant={textSize === 'normal' ? 'default' : 'outline'} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTextSize('normal')}
                  >
                    A
                  </Button>
                  <Button 
                    variant={textSize === 'large' ? 'default' : 'outline'} 
                    size="sm" 
                    className="flex-1 text-lg"
                    onClick={() => setTextSize('large')}
                  >
                    A
                  </Button>
                  <Button 
                    variant={textSize === 'xlarge' ? 'default' : 'outline'} 
                    size="sm" 
                    className="flex-1 text-xl"
                    onClick={() => setTextSize('xlarge')}
                  >
                    A
                  </Button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Contrast className="h-4 w-4 text-primary" />
                  Kontrast (Yüksek Kontrast)
                </label>
                <Button 
                  variant={highContrast ? 'default' : 'outline'} 
                  className="w-full justify-between"
                  onClick={() => setHighContrast(!highContrast)}
                >
                  Hoher Kontrast
                  {highContrast && <Check className="h-4 w-4" />}
                </Button>
              </div>

              {/* Easy Language (Leichte Sprache) Toggle */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">🗣️</span>
                  Sprache (Dil Seçeneği)
                </label>
                <Button 
                  variant={easyLanguage ? 'default' : 'outline'} 
                  className={`w-full justify-between ${easyLanguage ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  onClick={() => setEasyLanguage(!easyLanguage)}
                >
                  Leichte Sprache
                  {easyLanguage && <Check className="h-4 w-4" />}
                </Button>
                <p className="text-xs text-slate-500 mt-1">
                  Aktiviert vereinfachte Texte für bessere Verständlichkeit.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
