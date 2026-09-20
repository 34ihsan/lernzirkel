'use client';

import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface EmailObfuscatorProps {
  user: string;
  domain: string;
  subject?: string;
  className?: string;
  showIcon?: boolean;
}

export default function EmailObfuscator({
  user,
  domain,
  subject,
  className = '',
  showIcon = true,
}: EmailObfuscatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = `${user}@${domain}`;
    const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    window.location.href = `mailto:${email}${subjectParam}`;
  };

  return (
    <span
      onClick={handleClick}
      className={`cursor-pointer inline-flex items-center hover:text-primary transition-colors ${className}`}
      title="E-Mail schreiben"
    >
      {showIcon && <Mail className="w-4 h-4 mr-2" />}
      {mounted ? `${user}@${domain}` : 'E-Mail anzeigen...'}
    </span>
  );
}
