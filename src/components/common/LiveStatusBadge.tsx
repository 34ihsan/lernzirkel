'use client';

import React, { useState, useEffect } from 'react';

type HourEntry = {
  day: string; // 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'
  openTime?: string; // '09:00'
  closeTime?: string; // '17:00'
  isClosed?: boolean;
};

interface LiveStatusBadgeProps {
  hours?: HourEntry[];
}

export default function LiveStatusBadge({ hours }: LiveStatusBadgeProps) {
  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!hours || hours.length === 0) return;

    const checkStatus = () => {
      const now = new Date();
      // JavaScript getDay(): 0 = Sun, 1 = Mon... 6 = Sat
      // Our array mapping uses: Mo, Di, Mi, Do, Fr, Sa, So
      const jsDayMap = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      const todayString = jsDayMap[now.getDay()];

      const todayHours = hours.find(h => h.day === todayString);

      if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) {
        setStatus('closed');
        setMessage('Geschlossen');
        return;
      }

      const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
      const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);

      const openDate = new Date();
      openDate.setHours(openHour, openMin, 0);

      const closeDate = new Date();
      closeDate.setHours(closeHour, closeMin, 0);

      if (now >= openDate && now <= closeDate) {
        setStatus('open');
        setMessage(`Jetzt geöffnet (bis ${todayHours.closeTime} Uhr)`);
      } else {
        setStatus('closed');
        // Small logic to find next opening time could be added here
        setMessage('Geschlossen');
      }
    };

    checkStatus();
    // Recheck every minute
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [hours]);

  if (status === 'unknown') return null;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
      status === 'open' 
        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
        : 'bg-red-500/10 text-red-400 border border-red-500/20'
    }`}>
      <span className="relative flex h-2 w-2">
        {status === 'open' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </span>
      {message}
    </div>
  );
}
