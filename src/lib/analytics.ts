/**
 * Client-Side Helper for DSGVO-compliant Server-Side Analytics
 */
export function trackEvent(
  eventName: string,
  metadata?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      eventName,
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
  } catch (e) {
    // Fail silently in browser
  }
}
