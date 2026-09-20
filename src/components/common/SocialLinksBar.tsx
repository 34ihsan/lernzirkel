import React from 'react';
import { DesignSocialLinks } from '@/lib/design-defaults';

interface IconProps {
  size?: number;
  className?: string;
}

export function InstagramIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function TwitterIcon({ size = 15, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TikTokIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.47 6.13 6.13 0 0 0 1.9-4.48V8.29a8.2 8.2 0 0 0 4.83 1.57V6.41a4.92 4.92 0 0 1-1-.03z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.82 2.41h-.01c-1.46 0-2.89-.39-4.14-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.41c0-4.54 3.7-8.24 8.24-8.24m4.84 11.64c-.2-.1-.1.02-.33-.09l-1.64-.81c-.22-.11-.38-.16-.54.08-.16.24-.62.81-.76.97-.14.16-.27.18-.54.05-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.54-1.3-.74-1.78-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.42-.26" />
    </svg>
  );
}

interface Props {
  social?: DesignSocialLinks;
  variant?: 'header' | 'footer' | 'mobile';
  className?: string;
  iconSize?: number;
}

export default function SocialLinksBar({
  social,
  variant = 'header',
  className = '',
  iconSize
}: Props) {
  if (!social) return null;

  const defaultSize = variant === 'header' ? 14 : variant === 'footer' ? 18 : 16;
  const size = iconSize || defaultSize;

  const normalizeWhatsAppUrl = (val?: string) => {
    if (!val) return '';
    if (val.startsWith('http')) return val;
    const cleanNumber = val.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  const links = [
    {
      id: 'instagram',
      name: 'Instagram',
      url: social.instagram,
      icon: <InstagramIcon size={size} />,
      colorHover: 'hover:text-pink-500 hover:border-pink-500/50'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: social.facebook,
      icon: <FacebookIcon size={size} />,
      colorHover: 'hover:text-blue-500 hover:border-blue-500/50'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: social.linkedin,
      icon: <LinkedinIcon size={size} />,
      colorHover: 'hover:text-sky-500 hover:border-sky-500/50'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: social.youtube,
      icon: <YoutubeIcon size={size} />,
      colorHover: 'hover:text-red-500 hover:border-red-500/50'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: social.twitter,
      icon: <TwitterIcon size={size - 1} />,
      colorHover: 'hover:text-white hover:border-white/50'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: social.tiktok,
      icon: <TikTokIcon size={size} />,
      colorHover: 'hover:text-cyan-400 hover:border-cyan-400/50'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: normalizeWhatsAppUrl(social.whatsapp),
      icon: <WhatsAppIcon size={size} />,
      colorHover: 'hover:text-emerald-400 hover:border-emerald-400/50'
    }
  ].filter(item => Boolean(item.url && item.url.trim().length > 0));

  if (links.length === 0) return null;

  if (variant === 'header') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {links.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.name}
            aria-label={item.name}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all transform hover:scale-110"
          >
            {item.icon}
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {links.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.name}
            aria-label={item.name}
            className={`w-9 h-9 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-400 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md ${item.colorHover}`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    );
  }

  // mobile menu variant
  return (
    <div className={`flex items-center justify-center gap-3 py-2 border-t border-gray-100 ${className}`}>
      {links.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          aria-label={item.name}
          className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
