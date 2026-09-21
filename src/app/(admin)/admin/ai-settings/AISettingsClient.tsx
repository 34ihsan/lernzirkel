"use client";

import React, { useState, useTransition } from "react";
import { 
  Bot, ShieldCheck, ShieldAlert, Sparkles, Key, 
  Save, Play, CheckCircle2, MessageSquare, AlertCircle,
  Plus, Edit2, Trash2, Tag, Database, BookOpen, 
  Search, Check, X, ArrowRight, HelpCircle, Layers
} from "lucide-react";
import { updateAISettings } from "@/actions/ai";
import { AIConfig, KnowledgeTopic, DEFAULT_KNOWLEDGE_TOPICS } from "@/lib/ai-config";

export default function AISettingsClient({ initialConfig }: { initialConfig: AIConfig }) {
  const [config, setConfig] = useState<AIConfig>(() => ({
    ...initialConfig,
    knowledgeTopics: initialConfig.knowledgeTopics && initialConfig.knowledgeTopics.length > 0 
      ? initialConfig.knowledgeTopics 
      : DEFAULT_KNOWLEDGE_TOPICS
  }));
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Filter & Search State for Topics
  const [topicSearch, setTopicSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal / Form state for Add/Edit Topic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentTopic, setCurrentTopic] = useState<KnowledgeTopic>({
    id: "",
    topic: "",
    keywords: "",
    answer: "",
    suggestions: [],
    category: "Kurslar",
    isActive: true,
  });

  // Live Test Console State
  const [testInput, setTestInput] = useState("C1 kursu ne zaman başlıyor?");
  const [testOutput, setTestOutput] = useState("");
  const [testProvider, setTestProvider] = useState("");
  const [testTopicTitle, setTestTopicTitle] = useState("");
  const [testSuggestions, setTestSuggestions] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Handle Save
  const handleSaveSettings = (newConfigToSave?: AIConfig) => {
    const targetConfig = newConfigToSave || config;
    setSavedSuccess(false);

    startTransition(async () => {
      const res = await updateAISettings(targetConfig);
      if (res.success) {
        setSavedSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    });
  };

  // Topic Management Actions
  const handleOpenAddModal = () => {
    setModalMode("add");
    setCurrentTopic({
      id: `topic-${Date.now()}`,
      topic: "",
      keywords: "",
      answer: "",
      suggestions: ["0€ Destek Başvurusu", "Ofis Adresi ve Saatler", "WhatsApp Danışma"],
      category: "Kurslar",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic: KnowledgeTopic) => {
    setModalMode("edit");
    setCurrentTopic({ ...topic });
    setIsModalOpen(true);
  };

  const handleSaveTopicFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTopic.topic.trim() || !currentTopic.answer.trim()) return;

    let updatedTopics: KnowledgeTopic[] = [];
    const existingList = config.knowledgeTopics || [];

    if (modalMode === "add") {
      updatedTopics = [
        { ...currentTopic, id: currentTopic.id || `topic-${Date.now()}`, updatedAt: new Date().toISOString() },
        ...existingList,
      ];
    } else {
      updatedTopics = existingList.map((t) =>
        t.id === currentTopic.id ? { ...currentTopic, updatedAt: new Date().toISOString() } : t
      );
    }

    const updatedConfig = { ...config, knowledgeTopics: updatedTopics };
    setConfig(updatedConfig);
    setHasChanges(true);
    setIsModalOpen(false);
    handleSaveSettings(updatedConfig);
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!confirm("Bu konuyu bilgi tabanından silmek istediğinize emin misiniz?")) return;
    const updatedTopics = (config.knowledgeTopics || []).filter((t) => t.id !== topicId);
    const updatedConfig = { ...config, knowledgeTopics: updatedTopics };
    setConfig(updatedConfig);
    setHasChanges(true);
    handleSaveSettings(updatedConfig);
  };

  const handleToggleTopicActive = (topicId: string) => {
    const updatedTopics = (config.knowledgeTopics || []).map((t) =>
      t.id === topicId ? { ...t, isActive: !t.isActive } : t
    );
    const updatedConfig = { ...config, knowledgeTopics: updatedTopics };
    setConfig(updatedConfig);
    setHasChanges(true);
    handleSaveSettings(updatedConfig);
  };

  // Run Test in Sandbox
  const handleRunLiveTest = async (overrideText?: string) => {
    const textToTest = overrideText || testInput;
    if (!textToTest.trim() || isTesting) return;

    setIsTesting(true);
    setTestOutput("");
    setTestProvider("");
    setTestTopicTitle("");
    setTestSuggestions([]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToTest }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestOutput(data.reply || "Yanıt alınamadı.");
        setTestProvider(data.provider || "Bilinmeyen");
        setTestTopicTitle(data.topic || "");
        setTestSuggestions(data.suggestions || []);
      } else {
        setTestOutput(`Hata: ${data.error || "Bilinmeyen hata"}`);
      }
    } catch (e: any) {
      setTestOutput(`İletişim hatası: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Filtered Topics
  const filteredTopics = (config.knowledgeTopics || []).filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(topicSearch.toLowerCase()) ||
      item.keywords.toLowerCase().includes(topicSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(topicSearch.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["all", "Kurslar", "BAMF", "Sınavlar", "Nachhilfe", "Genel"];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
              <Bot size={24} />
            </div>
            <span>Yapay Zeka (AI) & Akıllı Bilgi Tabanı Yönetimi</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Web sitesinde 7/24 ziyaretçileri karşılayan akıllı botun özel konularını, kurs tarihlerini ve yanıtlarını yönetin.
          </p>
        </div>

        <button
          onClick={() => handleSaveSettings()}
          disabled={isPending}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition ${
            hasChanges 
              ? "bg-sky-600 hover:bg-sky-700 text-white animate-pulse" 
              : "bg-gray-900 hover:bg-black text-white"
          } disabled:opacity-50`}
        >
          <Save size={16} />
          <span>{isPending ? "Kaydediliyor..." : hasChanges ? "Değişiklikleri Kaydet *" : "Tüm Ayarları Kaydet"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="font-medium">AI ayarları ve Bilgi Tabanı başarıyla güncellendi. Değişiklikler sitede anında aktif.</span>
        </div>
      )}

      {/* SECTION 1: MASTER AI SWITCH & PROVIDER CONFIG */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toggle Banner */}
        <div className={`p-6 border-b ${config.aiEnabled ? "bg-emerald-50/60 border-emerald-200" : "bg-amber-50/60 border-amber-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {config.aiEnabled ? (
                <ShieldCheck size={30} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert size={30} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {config.aiEnabled ? "AI Asistanı Sitede AKTİF (Admin Onaylı)" : "AI Asistanı PASİF (Sitede Gizlendi)"}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  {config.aiEnabled
                    ? "Asistan sağ alt köşede ziyaretçilere 4 dilde (DE, TR, AR, EN) resmi BAMF, telc, kurs başlangıç tarihleri ve 0€ devlet desteği danışmanlığı vermektedir."
                    : "Asistanı kapattınız. Ziyaretçiler web sitesinde AI sohbet simgesini görmez."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.aiEnabled}
                onChange={(e) => {
                  const updated = { ...config, aiEnabled: e.target.checked };
                  setConfig(updated);
                  setHasChanges(true);
                  handleSaveSettings(updated);
                }}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Engine Selection */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Yapay Zeka Motoru (AI Engine)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "builtin",
                  name: "Yerel RAG Motoru (Önerilen)",
                  desc: "Sıfır maliyet, anında yanıt, harici API anahtarı gerekmez. Bilgi tabanınızı ve kurs DB'sini doğrudan okur.",
                  badge: "100% Güvenilir & Hızlı",
                },
                {
                  id: "gemini",
                  name: "Google Gemini 1.5",
                  desc: "Google API anahtarı ile dinamik yanıt üretimi ve serbest sohbet.",
                  badge: "Akıllı LLM",
                },
                {
                  id: "openai",
                  name: "OpenAI GPT-4o",
                  desc: "OpenAI API anahtarı ile kurumsal konuşma yeteneği.",
                  badge: "Kurumsal",
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setConfig({ ...config, provider: p.id as any });
                    setHasChanges(true);
                  }}
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

          {/* External Key inputs if LLM */}
          {config.provider !== "builtin" && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {config.provider === "gemini" ? "Google Gemini API Key" : "OpenAI API Key"}
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... / sk-proj-..."
                  value={config.apiKey || ""}
                  onChange={(e) => {
                    setConfig({ ...config, apiKey: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Model Adı
                </label>
                <input
                  type="text"
                  placeholder={config.provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini"}
                  value={config.model || ""}
                  onChange={(e) => {
                    setConfig({ ...config, model: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Custom Instructions */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Genel Yönetici Talimatları (System Instructions)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Ziyaretçilere daima resmi ve nazik bir dille hitap et. telc sınavı kaydı için pasaportla Ludwigsplatz 9a ofisimize gelmelerini hatırlat."
              value={config.customInstructions || ""}
              onChange={(e) => {
                setConfig({ ...config, customInstructions: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN KNOWLEDGE BASE & TOPIC MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-700 text-white rounded-lg">
                  <BookOpen size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Özel Konu & Soru-Cevap Bilgi Tabanı (Knowledge Base)
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                Botun belirli konularda (örn: C1 kursu, başlangıç tarihleri, telc sınavı, masraf muafiyeti) vereceği kesin cevapları tanımlayın. 
                Tetikleyici kelimeler ziyaretçi sorusunda geçtiğinde bot anında sizin onayladığınız bu yanıtı verir.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition shrink-0 self-start md:self-auto"
            >
              <Plus size={16} />
              <span>Yeni Konu & Cevap Ekle</span>
            </button>
          </div>

          {/* Real-time DB Sync Notice Banner */}
          <div className="mt-4 p-3 bg-white/80 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-950">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-sky-700 shrink-0" />
              <span>
                <strong>⚡ Otomatik Canlı İçerik Zekası Aktif:</strong> Web sitenizdeki tüm aktif kurslar (başlangıç tarihleri, fiyatlar, şartlar) ve yayınlanmış sayfalar veritabanından anlık taranarak bota aktarılır.
              </span>
            </div>
            <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-md shrink-0">
              Canlı DB Senkronize
            </span>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Konularda veya anahtar kelimelerde ara..."
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                  selectedCategory === cat
                    ? "bg-sky-700 text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat === "all" ? "Tüm Konular" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Cards List */}
        <div className="p-6 space-y-4">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-6">
              <Layers size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">Hiç konu bulunamadı</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Arama kriterinize uygun bir konu yok veya henüz özel bir konu eklemediniz. "Yeni Konu Ekle" butonuyla hemen ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const kwList = (topic.keywords || "").split(/[,;\n]+/).map((k) => k.trim()).filter(Boolean);

              return (
                <div
                  key={topic.id}
                  className={`p-5 rounded-2xl border transition ${
                    topic.isActive
                      ? "bg-white border-gray-200 hover:border-sky-300 hover:shadow-xs"
                      : "bg-gray-50/80 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                          {topic.category || "Genel"}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{topic.topic}</h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            topic.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {topic.isActive ? "Aktif" : "Devre Dışı"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleToggleTopicActive(topic.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                          topic.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {topic.isActive ? "Aktif" : "Pasif"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(topic)}
                        className="p-1.5 text-gray-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition"
                        title="Düzenle"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Keywords Tags */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 mr-1">
                      <Tag size={12} /> Tetikleyiciler:
                    </span>
                    {kwList.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Answer Text Block */}
                  <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-1">Botun Yanıtı:</strong>
                    <p className="whitespace-pre-wrap">{topic.answer}</p>
                  </div>

                  {/* Follow-up Suggestions */}
                  {topic.suggestions && topic.suggestions.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-gray-400">Buton Önerileri:</span>
                      {topic.suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setTestInput(s);
                            handleRunLiveTest(s);
                          }}
                          className="text-[11px] bg-white border border-gray-300 text-sky-800 px-2.5 py-0.5 rounded-full hover:bg-sky-50 transition"
                        >
                          {s} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION 3: LIVE AI SANDBOX TEST CONSOLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              Canlı Asistan Test Konsolu (Admin Sandbox)
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            Hızlı Test: "C1 kursu ne zaman başlıyor?" veya "telc sınavı"
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Ziyaretçilerin sorabileceği bir soruyu yazarak asistanınızın vereceği yanıtı, hangi bilgi kaynağını kullandığını hemen test edin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunLiveTest()}
            placeholder="Örn: C1 kursu ne zaman başlıyor? / telc sınav tarihleri / BAMF ücretsiz mi?..."
            className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleRunLiveTest()}
            disabled={isTesting}
            className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow transition disabled:opacity-50 shrink-0"
          >
            <Play size={16} />
            <span>{isTesting ? "Test Ediliyor..." : "Cevabı Test Et"}</span>
          </button>
        </div>

        {/* Test Preset Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
          <span>Örnek sorular:</span>
          {[
            "C1 kursu ne zaman başlıyor?",
            "BAMF entegrasyon kursum ücretsiz mi?",
            "telc B1 sınav kayıt şartları neler?",
            "Çocuklar için matematik dersi var mı?",
          ].map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTestInput(sample);
                handleRunLiveTest(sample);
              }}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition"
            >
              "{sample}"
            </button>
          ))}
        </div>

        {testOutput && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs leading-relaxed space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-sky-400" />
                <strong className="text-sky-300 font-semibold text-sm">Yapay Zeka Asistanının Yanıtı:</strong>
              </div>
              <div className="flex items-center gap-2">
                {testTopicTitle && (
                  <span className="text-[11px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                    Konu: {testTopicTitle}
                  </span>
                )}
                <span className="text-[10px] font-mono uppercase bg-sky-900/80 text-sky-200 px-2 py-0.5 rounded border border-sky-700">
                  Kaynak: {testProvider}
                </span>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-slate-100 text-sm font-sans">{testOutput}</p>

            {testSuggestions.length > 0 && (
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 text-[11px]">Önerilen Seçenekler:</span>
                {testSuggestions.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-800 text-sky-300 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TOPIC ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-sky-700" />
                <h3 className="font-bold text-gray-900 text-base">
                  {modalMode === "add" ? "Yeni Konu ve Özel Cevap Ekle" : "Konuyu ve Yanıtı Düzenle"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTopicFromModal} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Konu Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: C1 Kursu Başlangıç Tarihi & Şartları"
                    value={currentTopic.topic}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, topic: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={currentTopic.category || "Kurslar"}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="Kurslar">Kurslar</option>
                    <option value="BAMF">BAMF</option>
                    <option value="Sınavlar">Sınavlar</option>
                    <option value="Nachhilfe">Nachhilfe</option>
                    <option value="Genel">Genel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tetikleyici Anahtar Kelimeler (Virgülle ayırın) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="c1, c1 kursu, c1 başlangıç, c1 ne zaman, c1 kayıt"
                  value={currentTopic.keywords}
                  onChange={(e) => setCurrentTopic({ ...currentTopic, keywords: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Ziyaretçi sorusunda bu kelimelerden biri veya birkaçı geçtiğinde bot bu konunun yanıtını verir.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Botun Vereceği Cevap (Admin Onaylı Yanıt) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Yeni C1 Almanca kursumuz önümüzdeki ayın ilk pazartesi günü başlıyor..."
                  value={currentTopic.answer}
                  onChange={(e) => setCurrentTopic({ ...currentTopic, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Önerilen Takip Butonları (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  placeholder="0€ Destek Başvurusu, B2 Sertifikası Şartları, WhatsApp"
                  value={(currentTopic.suggestions || []).join(", ")}
                  onChange={(e) =>
                    setCurrentTopic({
                      ...currentTopic,
                      suggestions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={currentTopic.isActive}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, isActive: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>Bu konuyu hemen aktif yap</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-medium shadow-sm transition"
                  >
                    Kaydet ve Uygula
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
