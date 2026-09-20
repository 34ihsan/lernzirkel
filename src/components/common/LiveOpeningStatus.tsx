'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LiveOpeningStatus({ className = '' }: { className?: string }) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<{ isOpen: boolean; text: string; subText?: string }>({
    isOpen: false,
    text: 'Öffnungszeiten...',
  });

  useEffect(() => {
    const calculateStatus = () => {
      // Calculate based on Europe/Berlin timezone
      const now = new Date();
      const berlinTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
      const berlinDate = new Date(berlinTimeStr);
      
      const day = berlinDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hour = berlinDate.getHours();
      const minute = berlinDate.getMinutes();
      const timeVal = hour * 60 + minute;

      // Hours rule:
      // Mon - Thu (1-4): 08:00 (480) - 19:00 (1140)
      // Fri (5): 08:00 (480) - 19:00 (1140)
      // Sat (6): 10:00 (600) - 14:00 (840)
      // Sun (0): Closed

      if (day >= 1 && day <= 5) {
        if (timeVal >= 480 && timeVal < 1140) {
          const isDe = language === 'de';
          setStatus({
            isOpen: true,
            text: isDe ? 'Jetzt geöffnet' : 'Şu an Açık',
            subText: isDe ? 'bis 19:00 Uhr' : '19:00\'a kadar'
          });
          return;
        }
      } else if (day === 6) {
        if (timeVal >= 600 && timeVal < 840) {
          const isDe = language === 'de';
          setStatus({
            isOpen: true,
            text: isDe ? 'Jetzt geöffnet' : 'Şu an Açık',
            subText: isDe ? 'bis 14:00 Uhr' : '14:00\'e kadar'
          });
          return;
        }
      }

      // Closed
      const isDe = language === 'de';
      let nextOpen = isDe ? 'Mo. 08:00 Uhr' : 'Pzt. 08:00';
      if (day >= 1 && day <= 4 && timeVal < 480) nextOpen = isDe ? 'heute 08:00 Uhr' : 'bugün 08:00';
      else if (day === 5 && timeVal < 480) nextOpen = isDe ? 'heute 08:00 Uhr' : 'bugün 08:00';
      else if (day === 5 && timeVal >= 1140) nextOpen = isDe ? 'Sa. 10:00 Uhr' : 'Cmt. 10:00';
      else if (day === 6 && timeVal < 600) nextOpen = isDe ? 'heute 10:00 Uhr' : 'bugün 10:00';

      setStatus({
        isOpen: false,
        text: isDe ? 'Derzeit geschlossen' : 'Şu an Kapalı',
        subText: isDe ? `Öffnet ${nextOpen}` : `Açılış: ${nextOpen}`
      });
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className={`inline-flex items-center gap-2 text-xs select-none ${className}`}>
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {status.isOpen ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400"></span>
        )}
      </span>
      <span className="font-semibold">
        {status.text}
      </span>
      {status.subText && (
        <span className="text-[11px] opacity-80 hidden sm:inline">
          ({status.subText})
        </span>
      )}
    </div>
  );
}
