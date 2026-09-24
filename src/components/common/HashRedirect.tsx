'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HashRedirectProps {
  targetHash?: string;
  redirectTo?: string;
}

export default function HashRedirect({
  targetHash = '#leitbild',
  redirectTo = '/ueber-uns/leitbild',
}: HashRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === targetHash) {
      router.replace(redirectTo);
    }
  }, [router, targetHash, redirectTo]);

  return null;
}
