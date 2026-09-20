"use client";

import React, { useState, useTransition } from "react";
import { 
  TrendingUp, MessageCircle, PhoneCall, CheckCircle2, 
  ShieldAlert, ShieldCheck, Key, Save, BarChart3, Clock, AlertTriangle 
} from "lucide-react";
import { updateMarketingSettings, MarketingConfig } from "@/actions/marketing";

interface MarketingClientProps {
  initialConfig: MarketingConfig;
  metrics: {
    totalEvents: number;
    whatsappClicks: number;
    phoneCalls: number;
    wizardCompletes: number;
    recentEvents: Array<{
      id: string;
      eventName: string;
      url: string;
      locale: string | null;
      createdAt: Date;
    }>;
  };
}

export default function MarketingClient({ initialConfig, metrics }: MarketingClientProps) {
  const [config, setConfig] = useState<MarketingConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    startTransition(async () => {
      const res = await updateMarketingSettings(config);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-sky-700" size={26} />
          <span>Pazarlama, Reklam & Server-Side Tracking</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Meta CAPI ve Google Analytics 4 dönüşüm entegrasyonu. Almanya DSGVO kurallarına tam uyumlu sunucu taraflı ölçümleme.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Toplam Sinyal</span>
            <BarChart3 size={16} className="text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{metrics.totalEvents}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Sunucuda loglanan olay</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase">
            <span>WhatsApp Tıklamaları</span>
            <MessageCircle size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{metrics.whatsappClicks}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Dönüşüm sinyali</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-700 text-xs font-semibold uppercase">
            <span>Telefon Aramaları</span>
            <PhoneCall size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{metrics.phoneCalls}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Doğrudan arama</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold uppercase">
            <span>0€ Hesaplayıcı Tamamlama</span>
            <CheckCircle2 size={16} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{metrics.wizardCompletes}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Nitelikli lead dönüşümü</div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Consent / Gate Card */}
        <div className={`p-6 border-b ${config.trackingEnabled ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {config.trackingEnabled ? (
                <ShieldCheck size={28} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert size={28} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {config.trackingEnabled ? "Pazarlama ve Dönüşüm Takibi AKTİF (Admin Onaylı)" : "Pazarlama Takibi PASİF (Veri İletimi Durduruldu)"}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xl">
                  {config.trackingEnabled 
                    ? "Almanya DSGVO kurallarına uygun olarak telefon, WhatsApp ve form sinyalleri anonimleştirilerek tanımladığınız Meta CAPI ve Google Analytics hesaplarına iletilmektedir."
                    : "Bu özellik kapalıyken dış ağlara (Meta / Google) hiçbir analitik verisi aktarılmaz. Yalnızca yerel sunucu istatistikleri tutulur."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.trackingEnabled}
                onChange={(e) => setConfig({ ...config, trackingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="p-6 space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Pazarlama ve takip ayarları başarıyla kaydedildi ve önbellek güncellendi.</span>
            </div>
          )}

          {/* Meta CAPI Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm border-b border-gray-100 pb-2">
              <Key size={16} />
              <span>Meta Ads (Instagram & Facebook) — Server-Side CAPI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="Örn: 123456789012345"
                  value={config.metaPixelId || ""}
                  onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Meta Conversions API (CAPI) Access Token
                </label>
                <input
                  type="password"
                  placeholder="EAAG... (Events Manager'dan alınan gizli anahtar)"
                  value={config.metaCapiToken || ""}
                  onChange={(e) => setConfig({ ...config, metaCapiToken: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Google Analytics & Google Ads */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm border-b border-gray-100 pb-2">
              <Key size={16} />
              <span>Google Analytics 4 & Google Ads Measurement Protocol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  GA4 Measurement ID
                </label>
                <input
                  type="text"
                  placeholder="Örn: G-XXXXXXXXXX"
                  value={config.gaMeasurementId || ""}
                  onChange={(e) => setConfig({ ...config, gaMeasurementId: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  GA4 API Secret
                </label>
                <input
                  type="password"
                  placeholder="Veri akışından alınan API Gizli Anahtarı"
                  value={config.gaApiSecret || ""}
                  onChange={(e) => setConfig({ ...config, gaApiSecret: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Google Ads Conversion ID (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: AW-123456789"
                  value={config.googleAdsConversionId || ""}
                  onChange={(e) => setConfig({ ...config, googleAdsConversionId: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Google Ads Conversion Label (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: abcdEFGH123"
                  value={config.googleAdsConversionLabel || ""}
                  onChange={(e) => setConfig({ ...config, googleAdsConversionLabel: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Tüm anahtarlar güvenli veritabanı değişkenlerinde şifreli olarak saklanır.</span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isPending ? "Kaydediliyor..." : "Ayarları Onayla & Kaydet"}</span>
          </button>
        </div>
      </form>

      {/* Recent Events Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>Son 25 Canlı Dönüşüm / Sunucu Olayı</span>
          </h3>
          <span className="text-xs text-gray-500">Otomatik güncellenir</span>
        </div>

        {metrics.recentEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Henüz loglanmış bir olay bulunmamaktadır. Kullanıcılar telefon veya WhatsApp butonuna tıkladıkça buraya yansıyacaktır.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Olay Adı</th>
                  <th className="py-3 px-4 font-semibold">Sayfa URL</th>
                  <th className="py-3 px-4 font-semibold">Dil</th>
                  <th className="py-3 px-4 font-semibold">Zaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics.recentEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-gray-50/60">
                    <td className="py-2.5 px-4 font-mono font-medium text-sky-800">
                      {ev.eventName}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 truncate max-w-xs">
                      {ev.url}
                    </td>
                    <td className="py-2.5 px-4 text-gray-500 uppercase">
                      {ev.locale || "de"}
                    </td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {new Date(ev.createdAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
