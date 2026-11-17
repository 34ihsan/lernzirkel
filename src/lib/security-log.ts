import prisma from "@/lib/prisma";

// Bot/spam savunma katmanlarının (honeypot, hız sınırı, CAPTCHA, giriş denemesi) tetiklendiği
// anları kayda geçirir — mevcut EventLog tablosunu kullanır (yeni migration gerekmez), admin
// panelindeki "Güvenlik" sayfası bunları okur. Loglama asla ana akışı bozmamalı (try/catch).

export const SECURITY_EVENT_NAMES = [
  "security_honeypot_triggered",
  "security_too_fast_submission",
  "security_rate_limited",
  "security_captcha_failed",
  "security_login_failed",
] as const;

export type SecurityEventName = (typeof SECURITY_EVENT_NAMES)[number];

export async function logSecurityEvent(
  eventName: SecurityEventName,
  opts: { route: string; ip?: string; metadata?: Record<string, unknown> }
) {
  try {
    await prisma.eventLog.create({
      data: {
        eventName,
        url: opts.route.slice(0, 255),
        metadata: { ip: opts.ip ?? "unknown", ...opts.metadata },
      },
    });
  } catch (err) {
    console.error("[security-log] Failed to log security event (non-blocking):", err);
  }
}
