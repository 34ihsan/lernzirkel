'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Search, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/lib/analytics';

export default function MobileActionBar() {
  const { t, language } = useLanguage();
  const phoneNumber = '062130737271';
  const whatsappNumber = '4917612345678';
  const mapsUrl = 'https://maps.google.com/?q=Ludwigsplatz+9a+67059+Ludwigshafen';

  const handleOpenSearch = () => {
    trackEvent('site_search_open');
    window.dispatchEvent(new CustomEvent('open-site-search'));
  };

  return (
    <nav 
      aria-label="Mobile Schnellaktionen"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      {/* 1. Call */}
      <a
        href={`tel:${phoneNumber}`}
        onClick={() => trackEvent('phone_call', { source: 'mobile_action_bar' })}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-primary active:scale-95 transition-transform"
        aria-label="Telefonisch anrufen"
      >
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-0.5">
          <Phone className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight">
          {language === 'tr' ? 'Ara' : 'Anrufen'}
        </span>
      </a>

      {/* 2. WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          language === 'tr' ? 'Merhaba, kurslar ve danışmanlık hakkında bilgi almak istiyorum.' : 'Hallo, ich interessiere mich für Ihre Kurse und Beratungsangebote.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { source: 'mobile_action_bar' })}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-emerald-600 active:scale-95 transition-transform"
        aria-label="WhatsApp Nachricht senden"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-0.5">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight">
          WhatsApp
        </span>
      </a>

      {/* 3. Kurse (Catalog) */}
      <Link
        href="/kurse"
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-primary active:scale-95 transition-transform"
        aria-label="Alle Kurse ansehen"
      >
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mb-0.5">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight">
          {language === 'tr' ? 'Kurslar' : 'Kurse'}
        </span>
      </Link>

      {/* 4. Maps / Anfahrt */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-primary active:scale-95 transition-transform"
        aria-label="Google Maps Anfahrt"
      >
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-0.5">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight">
          {language === 'tr' ? 'Konum' : 'Anfahrt'}
        </span>
      </a>

      {/* 5. Site Search */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-primary active:scale-95 transition-transform"
        aria-label="Website durchsuchen"
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-0.5">
          <Search className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight">
          {language === 'tr' ? 'Arama' : 'Suche'}
        </span>
      </button>
    </nav>
  );
}
