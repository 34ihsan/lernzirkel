'use client';

import React, { useState } from 'react';
import { Phone, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/actions/analytics';
import GrantEligibilityWizard from './GrantEligibilityWizard';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { t, language } = useLanguage();

  const phoneNumber = '+4917612345678'; // Replace with actual number
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent('Hallo, ich habe eine Frage.')}`;

  const handleTrack = (eventName: string) => {
    // Fire and forget analytics
    trackEvent(eventName, window.location.pathname, language).catch(() => {});
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-10 lg:right-10">
      {/* Expandable Menu */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrack('click_whatsapp')}
            className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
          >
            <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 pointer-events-none whitespace-nowrap">
              {t('contact.whatsapp', 'WhatsApp')}
            </span>
            <div className="bg-[#25D366] text-white p-2.5 rounded-full">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-current stroke-none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </div>
          </a>

          {/* 0€ Förderungs-Rechner */}
          <button
            type="button"
            onClick={() => {
              setIsWizardOpen(true);
              setIsOpen(false);
              handleTrack('open_grant_wizard');
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
            aria-label="0€ Förderungs-Rechner"
          >
            <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 pointer-events-none whitespace-nowrap">
              0€ Förderungs-Rechner (BAMF & BuT)
            </span>
            <div className="text-white p-2 rounded-full">
              <Sparkles size={24} />
            </div>
          </button>

          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
          >
            <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 pointer-events-none whitespace-nowrap">
              {t('contact.call', 'Anrufen')}
            </span>
            <div className="bg-primary text-white p-2.5 rounded-full">
              <Phone size={24} />
            </div>
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-accent/30"
        aria-label="Contact"
      >
        {isOpen ? (
          <X size={28} className="animate-in spin-in" />
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Wizard Modal */}
      <GrantEligibilityWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
