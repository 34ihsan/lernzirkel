import React from 'react';
import { SupportedLanguage } from '@/lib/i18n/languages';

interface CountryFlagProps {
  code: SupportedLanguage | string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded' | 'flat';
}

export default function CountryFlag({
  code,
  className = '',
  size = 'sm',
  shape = 'circle'
}: CountryFlagProps) {
  const normalizedCode = code.toLowerCase();

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size] || 'w-4 h-4';

  const shapeClasses = {
    circle: 'rounded-full overflow-hidden shadow-xs border border-black/10',
    rounded: 'rounded-sm overflow-hidden shadow-xs border border-black/10 aspect-[4/3]',
    flat: 'overflow-hidden border border-black/10 aspect-[4/3]'
  }[shape];

  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 select-none ${sizeClasses} ${shapeClasses} ${className}`}
      aria-hidden="true"
    >
      {normalizedCode === 'de' && (
        <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
          <path fill="#000000" d="M0 0h640v160H0z" />
          <path fill="#DD0000" d="M0 160h640v160H0z" />
          <path fill="#FFCE00" d="M0 320h640v160H0z" />
        </svg>
      )}

      {normalizedCode === 'tr' && (
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
          <rect width="1200" height="800" fill="#E30A17" />
          <circle cx="425" cy="400" r="200" fill="#ffffff" />
          <circle cx="475" cy="400" r="160" fill="#E30A17" />
          <polygon 
            points="583.3,400 706.7,440.1 630.5,335.2 630.5,464.8 706.7,359.9" 
            fill="#ffffff" 
          />
        </svg>
      )}

      {normalizedCode === 'en' && (
        <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
          <clipPath id="uk-flag-clip">
            <path d="M0 0v30h60V0z" />
          </clipPath>
          <clipPath id="uk-flag-diag">
            <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <g clipPath="url(#uk-flag-clip)">
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
            <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-flag-diag)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      )}

      {normalizedCode === 'ar' && (
        <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
          <rect width="640" height="480" fill="#006C35" />
          {/* Stylized Arabic calligraphy & Saber representation */}
          <g fill="#ffffff">
            {/* Arabic Script Path representation */}
            <path d="M180 180h280c5 0 8 3 8 8v16c0 5-3 8-8 8H180c-5 0-8-3-8-8v-16c0-5 3-8 8-8zm20 40h240c4 0 6 2 6 6v12c0 4-2 6-6 6H200c-4 0-6-2-6-6v-12c0-4 2-6 6-6z" opacity="0.95" />
            <path d="M210 160c0-10 12-18 25-18s25 8 25 18-12 18-25 18-25-8-25-18zm80 0c0-10 12-18 25-18s25 8 25 18-12 18-25 18-25-8-25-18zm80 0c0-10 12-18 25-18s25 8 25 18-12 18-25 18-25-8-25-18z" opacity="0.9" />
            {/* Horizontal Saber/Sword */}
            <path d="M190 280h230c12 0 25 4 35 12-10 2-25 4-40 4H190c-5 0-8-3-8-8s3-8 8-8z" />
            <path d="M180 274h12v28h-12c-4 0-8-4-8-8v-12c0-4 4-8 8-8z" />
            <circle cx="168" cy="288" r="6" />
          </g>
        </svg>
      )}
    </span>
  );
}
