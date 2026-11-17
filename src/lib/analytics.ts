/**
 * Client-Side Helper for DSGVO-compliant Server-Side Analytics.
 * Ziyaretçi "Pazarlama" çerezine rıza verdiyse (bkz. ConsentGatedScripts), window.fbq/gtag
 * burada da tetiklenir — Meta için browser+server (CAPI) olayları aynı eventId ile eşleşir
 * (dedup) ve eşleştirme kalitesini artırır.
 */
export function trackEvent(
  eventName: string,
  metadata?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  try {
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const payload = {
      eventName,
      eventId,
      url: window.location.pathname + window.location.search,
      locale: document.documentElement.lang || "de",
      metadata,
    };

    // Use sendBeacon if available, fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/analytics/event", blob);
    } else {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => null);
    }

    // Tarayıcı taraflı etiketler (yalnızca rıza verildiyse ConsentGatedScripts tarafından yüklenmiştir)
    window.fbq?.("trackCustom", eventName, metadata, { eventID: eventId });
    window.gtag?.("event", eventName, metadata);
    window.dataLayer?.push({ event: eventName, ...metadata });

    const adsConfig = window.__lzMarketing;
    if (adsConfig?.googleAdsConversionId && adsConfig?.googleAdsConversionLabel) {
      window.gtag?.("event", "conversion", {
        send_to: `${adsConfig.googleAdsConversionId}/${adsConfig.googleAdsConversionLabel}`,
      });
    }
  } catch (e) {
    // Fail silently in browser
  }
}
