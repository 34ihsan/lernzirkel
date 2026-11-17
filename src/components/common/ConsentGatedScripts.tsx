'use client';

import { useEffect, useState } from 'react';

interface Props {
  trackingEnabled: boolean;
  gtmContainerId?: string;
  metaPixelId?: string;
  gaMeasurementId?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
}

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    __lzMarketing?: {
      googleAdsConversionId?: string;
      googleAdsConversionLabel?: string;
    };
  }
}

function hasMarketingConsent(): boolean {
  try {
    const raw = localStorage.getItem('cookie-preferences');
    if (!raw) return false;
    return Boolean(JSON.parse(raw)?.marketing);
  } catch {
    return false;
  }
}

function injectOnce(id: string, create: () => HTMLElement) {
  if (document.getElementById(id)) return;
  const el = create();
  el.id = id;
  document.head.appendChild(el);
}

/**
 * Ziyaretçi çerez bannerında "Pazarlama" iznini onaylamadan hiçbir üçüncü taraf
 * etiketi (GTM/Meta Pixel/gtag.js) yüklenmez — DSGVO gereği. Admin'in "Pazarlama
 * Takibi Aktif/Pasif" anahtarı sunucu tarafı CAPI/MP iletimini ayrıca kontrol eder,
 * bu bileşen sadece TARAYICIDA çalışan scriptleri yönetir.
 */
export default function ConsentGatedScripts({
  trackingEnabled,
  gtmContainerId,
  metaPixelId,
  gaMeasurementId,
  googleAdsConversionId,
  googleAdsConversionLabel,
}: Props) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasMarketingConsent());
    const onUpdate = () => setConsented(hasMarketingConsent());
    window.addEventListener('cookie-consent-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('cookie-consent-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  useEffect(() => {
    if (!trackingEnabled || !consented) return;

    // Google Ads conversion linking bilgisini trackEvent() için global'de taşı
    window.__lzMarketing = { googleAdsConversionId, googleAdsConversionLabel };

    // GTM container varsa diğer tüm etiketler onun içinden yönetilir (çift sayımı önlemek için
    // Meta Pixel/gtag.js burada ayrıca enjekte edilmez).
    if (gtmContainerId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

      injectOnce('lz-gtm-script', () => {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
        return s;
      });

      if (!document.getElementById('lz-gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'lz-gtm-noscript';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.prepend(noscript);
      }
      return;
    }

    // GTM yoksa: ayrı alanlardan doğrudan enjekte et
    if (gaMeasurementId || googleAdsConversionId) {
      const loaderId = gaMeasurementId || googleAdsConversionId!;
      injectOnce('lz-gtag-loader', () => {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`;
        return s;
      });

      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function gtag(...args: any[]) {
          window.dataLayer!.push(args);
        };
      }
      window.gtag('js', new Date());
      if (gaMeasurementId) window.gtag('config', gaMeasurementId);
      if (googleAdsConversionId) window.gtag('config', googleAdsConversionId);
    }

    if (metaPixelId && !window.fbq) {
      (function (f: any, b: Document, e: string, v: string) {
        if (f.fbq) return;
        const n: any = (f.fbq = function (...args: any[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        });
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        const s = b.getElementsByTagName(e)[0];
        s.parentNode?.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq!('init', metaPixelId);
      window.fbq!('track', 'PageView');
    }
  }, [trackingEnabled, consented, gtmContainerId, metaPixelId, gaMeasurementId, googleAdsConversionId, googleAdsConversionLabel]);

  return null;
}
