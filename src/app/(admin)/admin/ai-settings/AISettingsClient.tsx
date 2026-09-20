"use client";

import React, { useState, useTransition } from "react";
import { 
  Bot, ShieldCheck, ShieldAlert, Sparkles, Key, 
  Save, Play, CheckCircle2, MessageSquare, AlertCircle 
} from "lucide-react";
import { updateAISettings, AIConfig } from "@/actions/ai";

export default function AISettingsClient({ initialConfig }: { initialConfig: AIConfig }) {
  const [config, setConfig] = useState<AIConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Test Console State
  const [testInput, setTestInput] = useState("BAMF entegrasyon kursum için para ödemem gerekiyor mu?");
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    startTransition(async () => {
      const res = await updateAISettings(config);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    });
  };

  const handleRunLiveTest = async () => {
    if (!testInput.trim() || isTesting) return;
    setIsTesting(true);
    setTestOutput("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestOutput(data.reply || "Yanıt alınamadı.");
      } else {
        setTestOutput(`Hata: ${data.error || "Bilinmeyen hata"}`);
      }
    } catch (e: any) {
      setTestOutput(`İletişim hatası: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bot className="text-sky-700" size={26} />
          <span>Yapay Zeka (AI) & Akıllı Danışman Yönetimi</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Web sitesinde ziyaretçileri karşılayan 7/24 çok dilli BAMF, telc ve kurs danışmanını yapılandırın.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toggle / Approval Banner */}
        <div className={`p-6 border-b ${config.aiEnabled ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {config.aiEnabled ? (
                <ShieldCheck size={28} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert size={28} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {config.aiEnabled ? "Yapay Zeka Asistanı AKTİF (Admin Onaylı)" : "Yapay Zeka Asistanı PASİF (Site Ziyaretçilerine Gizlendi)"}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xl">
                  {config.aiEnabled
                    ? "Asistan sitede sağ alt köşede ziyaretçilere Almanca, Türkçe, Arapça ve İngilizce dillerinde resmi BAMF ve telc danışmanlığı sağlamaktadır."
                    : "Admin olarak asistanı kapattınız. Ziyaretçiler web sitesinde AI sohbet butonunu görmez."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.aiEnabled}
                onChange={(e) => setConfig({ ...config, aiEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Yapay zeka ayarları başarıyla kaydedildi.</span>
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Yapay Zeka Motoru (AI Provider)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "builtin",
                  name: "Yerel Akıllı Motor (Önerilen)",
                  desc: "Sıfır maliyet, anında yanıt, harici API anahtarı gerekmez.",
                  badge: "100% Stabil",
                },
                {
                  id: "gemini",
                  name: "Google Gemini 1.5",
                  desc: "Google API anahtarı ile dinamik gelişmiş yanıtlar.",
                  badge: "Gelişmiş LLM",
                },
                {
                  id: "openai",
                  name: "OpenAI GPT-4o",
                  desc: "OpenAI API anahtarı ile kurumsal zeka.",
                  badge: "Kurumsal",
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setConfig({ ...config, provider: p.id as any })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    config.provider === p.id
                      ? "border-sky-600 bg-sky-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900">{p.name}</strong>
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Keys (if Gemini or OpenAI) */}
          {config.provider !== "builtin" && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {config.provider === "gemini" ? "Google Gemini API Key" : "OpenAI API Key"}
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy... / sk-proj-..."
                    value={config.apiKey || ""}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Model Kodu
                  </label>
                  <input
                    type="text"
                    placeholder={config.provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini"}
                    value={config.model || ""}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Custom Instructions (Prompt Engineering) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Özel Yönetici Talimatları (Custom System Prompt)
            </label>
            <textarea
              rows={3}
              placeholder="Örn: Ziyaretçilere daima resmi ve nazik bir dille hitap et. telc sınavı kaydı için pasaportla Ludwigsplatz 9a ofisimize gelmeleri gerektiğini özellikle hatırlat."
              value={config.customInstructions || ""}
              onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Bu talimatlar Lernzirkel'in mevcut kurs veritabanı ve açılış saatleri bilgisiyle birleştirilerek asistanın aklına eklenir.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Admin onaylı değişiklikler anında web sitesindeki bota yansır.</span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isPending ? "Kaydediliyor..." : "AI Ayarlarını Kaydet"}</span>
          </button>
        </div>
      </form>

      {/* Live AI Sandbox Test Console */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <MessageSquare size={18} className="text-sky-700" />
          <span>Canlı Asistan Test Konsolu (Admin Sandbox)</span>
        </h3>
        <p className="text-xs text-gray-500">
          Ziyaretçilerin sorabileceği bir soruyu aşağıya yazarak asistanınızın vereceği cevabı hemen test edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Bir soru yazın (Türkçe, Almanca, Arapça, İngilizce)..."
            className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <button
            onClick={handleRunLiveTest}
            disabled={isTesting}
            className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow transition disabled:opacity-50"
          >
            <Play size={16} />
            <span>{isTesting ? "Test Ediliyor..." : "Cevabı Test Et"}</span>
          </button>
        </div>

        {testOutput && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-1 animate-in fade-in">
            <strong className="text-sky-900 block font-semibold">Yapay Zeka Asistanının Yanıtı:</strong>
            <p className="whitespace-pre-wrap">{testOutput}</p>
          </div>
        )}
      </div>
    </div>
  );
}
