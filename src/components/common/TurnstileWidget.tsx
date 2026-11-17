"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void; size?: string }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onToken,
      size: "flexible",
    });
  }, [onToken]);

  useEffect(() => {
    if (SITE_KEY && window.turnstile) renderWidget();
  }, [renderWidget]);

  // CAPTCHA yapılandırılmamışsa (NEXT_PUBLIC_TURNSTILE_SITE_KEY yok) hiçbir şey render etme —
  // form bugünkü gibi CAPTCHA'sız çalışmaya devam eder.
  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} className="w-full overflow-hidden" />
    </>
  );
}
