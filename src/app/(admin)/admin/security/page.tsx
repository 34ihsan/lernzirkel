import { getSecurityOverview } from "@/actions/security";
import { ShieldAlert, Bug, Clock, Gauge, KeyRound, LogIn } from "lucide-react";

export const metadata = { title: "Güvenlik | Lernzirkel Admin" };

const EVENT_META: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
  security_honeypot_triggered: {
    label: "Honeypot Tetiklendi",
    description: "Gizli alanı doldurdu — neredeyse kesin bot.",
    icon: <Bug size={16} />,
  },
  security_too_fast_submission: {
    label: "Çok Hızlı Gönderim",
    description: "Formu 3 saniyeden kısa sürede doldurdu.",
    icon: <Clock size={16} />,
  },
  security_rate_limited: {
    label: "Hız Sınırı Aşıldı",
    description: "Kısa sürede çok fazla istek/deneme.",
    icon: <Gauge size={16} />,
  },
  security_captcha_failed: {
    label: "CAPTCHA Başarısız",
    description: "Turnstile doğrulamasını geçemedi.",
    icon: <KeyRound size={16} />,
  },
  security_login_failed: {
    label: "Başarısız Admin Girişi",
    description: "Yanlış e-posta/şifre ile giriş denemesi.",
    icon: <LogIn size={16} />,
  },
};

function getIp(metadata: unknown): string {
  if (metadata && typeof metadata === "object" && "ip" in metadata) {
    return String((metadata as Record<string, unknown>).ip ?? "—");
  }
  return "—";
}

function getExtra(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") return "";
  const rest = Object.fromEntries(Object.entries(metadata as Record<string, unknown>).filter(([k]) => k !== "ip"));
  const entries = Object.entries(rest);
  if (entries.length === 0) return "";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

export default async function SecurityPage() {
  const overview = await getSecurityOverview();
  const eventNames = Object.keys(EVENT_META);

  const total24h = eventNames.reduce((sum, n) => sum + (overview.counts24h[n] ?? 0), 0);
  const total7d = eventNames.reduce((sum, n) => sum + (overview.counts7d[n] ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldAlert size={24} /> Güvenlik & Spam Koruması</h1>
        <p className="text-sm text-gray-500">
          Kontakt, kurs kaydı, anket ve admin girişi formlarındaki bot/spam savunma katmanlarının (honeypot, hız
          sınırı, CAPTCHA) ne zaman tetiklendiğini gösterir.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-1">
          <div className="text-2xl font-bold">{total24h}</div>
          <div className="text-xs text-gray-500 mt-1">Son 24 saat (toplam)</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-1">
          <div className="text-2xl font-bold">{total7d}</div>
          <div className="text-xs text-gray-500 mt-1">Son 7 gün (toplam)</div>
        </div>
        {eventNames.map((name) => (
          <div key={name} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: (overview.counts24h[name] ?? 0) > 0 ? "#d97706" : "#111827" }}>
              {overview.counts24h[name] ?? 0}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              {EVENT_META[name].icon} {EVENT_META[name].label}
            </div>
          </div>
        ))}
      </div>

      {total24h === 0 && total7d === 0 && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm">
          Son 7 günde hiçbir bot/spam savunma katmanı tetiklenmedi. Sistem sakin.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-bold">Son Olaylar (en fazla 50)</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Zaman</th>
              <th className="text-left px-4 py-3">Tür</th>
              <th className="text-left px-4 py-3">Sayfa</th>
              <th className="text-left px-4 py-3">IP</th>
              <th className="text-left px-4 py-3">Detay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {overview.recent.map((event) => {
              const meta = EVENT_META[event.eventName];
              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(event.createdAt).toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      {meta?.icon} {meta?.label ?? event.eventName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{event.url}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{getIp(event.metadata)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{getExtra(event.metadata)}</td>
                </tr>
              );
            })}
            {overview.recent.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Henüz kayıtlı bir olay yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
