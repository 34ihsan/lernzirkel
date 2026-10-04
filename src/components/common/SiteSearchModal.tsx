'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, X, ExternalLink, ArrowRight, CornerDownLeft, 
  GraduationCap, BookOpen, Languages, Sparkles, LifeBuoy, 
  FileText, HandHeart, Phone, Clock, Loader2, Command
} from 'lucide-react';
import { SearchResultItem } from '@/app/api/search/route';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteSearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      // Fetch initial suggestions
      fetch('/api/search?q=')
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setSuggestions(data.suggestions || []);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 2) {
      if (query.trim().length === 0) {
        fetch('/api/search?q=')
          .then(res => res.json())
          .then(data => {
            setResults(data.results || []);
          })
          .catch(() => {});
      }
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setSelectedIndex(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) {
          e.preventDefault();
          handleNavigate(results[selectedIndex].url);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleNavigate = (url: string) => {
    onClose();
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'Languages': return <Languages className="w-4 h-4 text-emerald-600" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'LifeBuoy': return <LifeBuoy className="w-4 h-4 text-cyan-600" />;
      case 'HandHeart': return <HandHeart className="w-4 h-4 text-red-500" />;
      case 'Phone': return <Phone className="w-4 h-4 text-green-600" />;
      case 'Clock': return <Clock className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/80 overflow-hidden z-10 flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 shrink-0 mr-3">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Sitede arayın... (Örn: Kurs, Integrationskurs, telc, Nachhilfe, Adresse)"
            className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200/60 transition-colors mr-1"
              title="Aramayı temizle"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xs hover:bg-gray-50 dark:bg-gray-800 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && suggestions.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50/60 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-gray-400 font-medium mr-1 shrink-0">Hızlı Arama:</span>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQuery(sug)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-all shrink-0 font-medium"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-gray-50 max-h-[50vh]">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => handleNavigate(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer flex items-start gap-3 transition-all duration-150 ${
                    isSelected 
                      ? 'bg-blue-50/80 border border-blue-200/80 shadow-xs' 
                      : 'hover:bg-gray-50 dark:bg-gray-800 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-white dark:bg-gray-900 shadow-xs' : 'bg-gray-100 dark:bg-gray-800/50/80'}`}>
                    {renderIcon(item.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-blue-900' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100/80 text-blue-800 shrink-0">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 ml-auto shrink-0 font-mono hidden sm:inline">
                        {item.category}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 self-center">
                    {isSelected ? (
                      <CornerDownLeft size={15} className="text-blue-600 animate-in fade-in" />
                    ) : (
                      <ArrowRight size={14} className="text-gray-300" />
                    )}
                  </div>
                </div>
              );
            })
          ) : query.trim().length >= 2 && !loading ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
              <Search size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">"{query}" için sonuç bulunamadı</p>
              <p className="text-xs text-gray-400">Farklı bir kelime aramayı veya ana menüdeki kategorilere göz atmayı deneyebilirsiniz.</p>
            </div>
          ) : null}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono font-bold">↑↓</kbd> Gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono font-bold">↵</kbd> Seç
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono font-bold">ESC</kbd> Kapat
            </span>
          </div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Lernzirkel Site Arama</span>
        </div>

      </div>
    </div>
  );
}
