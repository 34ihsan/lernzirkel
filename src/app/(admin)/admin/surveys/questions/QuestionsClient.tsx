"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Loader2, Pencil, X } from "lucide-react";
import {
  createSurveyQuestion,
  updateSurveyQuestion,
  deleteSurveyQuestion,
  reorderSurveyQuestion,
  resetToStandardQuestions,
  type SurveyQuestionInput,
} from "@/actions/survey-admin";

interface SurveyQuestionRow {
  id: string;
  section: string;
  type: string;
  prompt: string;
  translations: unknown;
  isRequired: boolean;
  order: number;
  isActive: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  RATING_5: "Puan (1-5)",
  NPS_0_10: "NPS (0-10)",
  TEXT: "Açık Uçlu",
  YES_NO: "Evet/Hayır",
};

export default function QuestionsClient({ initialQuestions }: { initialQuestions: SurveyQuestionRow[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [section, setSection] = useState<"LEHRER" | "KURS">("LEHRER");
  const [editing, setEditing] = useState<SurveyQuestionRow | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = questions.filter((q) => q.section === section).sort((a, b) => a.order - b.order);

  function refresh() {
    startTransition(async () => {
      // Basit yaklaşım: sayfayı yeniden yükle yerine action'lardaki revalidatePath zaten
      // server component'i günceller; client state'i de aynı anda senkronlamak için reload.
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteSurveyQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    });
  }

  function handleToggleActive(q: SurveyQuestionRow) {
    startTransition(async () => {
      await updateSurveyQuestion(q.id, { isActive: !q.isActive });
      setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, isActive: !x.isActive } : x)));
    });
  }

  function handleReorder(id: string, direction: "up" | "down") {
    startTransition(async () => {
      await reorderSurveyQuestion(id, direction);
      refresh();
    });
  }

  function handleReset() {
    if (!confirm("Tüm sorular silinip standart şablonla değiştirilecek. Emin misiniz?")) return;
    startTransition(async () => {
      await resetToStandardQuestions();
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Anket Soru Bankası</h1>
          <p className="text-sm text-gray-500">Kurs-sonu anketinde kursiyerlere gösterilecek sorular.</p>
        </div>
        <button
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RotateCcw size={15} /> Standart Şablona Sıfırla
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(["LEHRER", "KURS"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${
              section === s ? "border-sky-600 text-sky-700" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {s === "LEHRER" ? "Eğitmen Soruları" : "Kurs Soruları"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {visible.map((q, i) => (
          <div key={q.id} className={`flex items-center gap-3 px-4 py-3 ${!q.isActive ? "opacity-50" : ""}`}>
            <div className="flex flex-col">
              <button onClick={() => handleReorder(q.id, "up")} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => handleReorder(q.id, "down")} disabled={i === visible.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{q.prompt}</div>
              <div className="text-xs text-gray-400">
                {TYPE_LABELS[q.type] ?? q.type} {q.isRequired && "· Zorunlu"}
              </div>
            </div>
            <button
              onClick={() => handleToggleActive(q)}
              className={`text-xs font-bold px-2 py-1 rounded-full ${q.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {q.isActive ? "Aktif" : "Pasif"}
            </button>
            <button onClick={() => setEditing(q)} className="p-2 text-gray-400 hover:text-sky-600">
              <Pencil size={15} />
            </button>
            <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {visible.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">Bu bölümde soru yok.</div>}
      </div>

      <button
        onClick={() => setEditing("new")}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black"
      >
        <Plus size={15} /> Yeni Soru Ekle ({section === "LEHRER" ? "Eğitmen" : "Kurs"})
      </button>

      {editing && (
        <QuestionEditorModal
          question={editing === "new" ? null : editing}
          defaultSection={section}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function QuestionEditorModal({
  question,
  defaultSection,
  onClose,
  onSaved,
}: {
  question: SurveyQuestionRow | null;
  defaultSection: "LEHRER" | "KURS";
  onClose: () => void;
  onSaved: () => void;
}) {
  const translations = (question?.translations as Record<string, string> | null) ?? {};
  const [form, setForm] = useState({
    section: (question?.section as "LEHRER" | "KURS") ?? defaultSection,
    type: (question?.type as SurveyQuestionInput["type"]) ?? "RATING_5",
    prompt: question?.prompt ?? "",
    tr: translations.tr ?? "",
    en: translations.en ?? "",
    ar: translations.ar ?? "",
    isRequired: question?.isRequired ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!form.prompt.trim()) {
      setError("Soru metni (Almanca) boş olamaz.");
      return;
    }
    setSaving(true);
    setError(null);
    const input: SurveyQuestionInput = {
      section: form.section,
      type: form.type,
      prompt: form.prompt.trim(),
      translations: { tr: form.tr || undefined, en: form.en || undefined, ar: form.ar || undefined },
      isRequired: form.isRequired,
    };
    try {
      if (question) await updateSurveyQuestion(question.id, input);
      else await createSurveyQuestion(input);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilirken hata oluştu.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{question ? "Soruyu Düzenle" : "Yeni Soru"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Bölüm</label>
            <select
              value={form.section}
              onChange={(e) => setForm((f) => ({ ...f, section: e.target.value as "LEHRER" | "KURS" }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="LEHRER">Eğitmen</option>
              <option value="KURS">Kurs</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tip</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as SurveyQuestionInput["type"] }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="RATING_5">Puan (1-5)</option>
              <option value="NPS_0_10">NPS (0-10)</option>
              <option value="TEXT">Açık Uçlu</option>
              <option value="YES_NO">Evet/Hayır</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Soru (Almanca — varsayılan)</label>
          <textarea
            value={form.prompt}
            onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Türkçe (opsiyonel)</label>
            <input value={form.tr} onChange={(e) => setForm((f) => ({ ...f, tr: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">English (opsiyonel)</label>
            <input value={form.en} onChange={(e) => setForm((f) => ({ ...f, en: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">العربية (opsiyonel)</label>
            <input value={form.ar} onChange={(e) => setForm((f) => ({ ...f, ar: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" dir="rtl" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isRequired} onChange={(e) => setForm((f) => ({ ...f, isRequired: e.target.checked }))} />
          Zorunlu soru
        </label>

        {error && <div className="text-sm text-red-700 bg-red-50 p-2 rounded-lg">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
