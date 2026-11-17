"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, Loader2, Info } from "lucide-react";
import TurnstileWidget from "@/components/common/TurnstileWidget";
import type { PublicSurveyQuestion, SurveyAnswerInput } from "@/actions/survey-public";

interface SurveyStrings {
  heading: string;
  intro: (course: string) => string;
  privacy: string;
  sectionTeacher: string;
  sectionCourse: string;
  submit: string;
  submitting: string;
  required: string;
  thanksTitle: string;
  thanksBody: string;
  npsLow: string;
  npsHigh: string;
  yes: string;
  no: string;
  textPlaceholder: string;
  scaleLegend: string;
}

type Lang = "de" | "tr" | "en" | "ar";

const STRINGS: Record<Lang, SurveyStrings> = {
  de: {
    heading: "Kursbewertung",
    intro: (course: string) => `Ihre Meinung zu „${course}“ ist uns wichtig.`,
    privacy: "Diese Umfrage ist vollständig anonym. Niemand — auch nicht unser Team — kann Ihre Antworten mit Ihrer Person in Verbindung bringen.",
    sectionTeacher: "Zum Dozenten / zur Dozentin",
    sectionCourse: "Zum Kurs",
    submit: "Absenden",
    submitting: "Wird gesendet…",
    required: "Diese Frage ist erforderlich.",
    thanksTitle: "Vielen Dank für Ihr Feedback!",
    thanksBody: "Ihre anonyme Antwort wurde erfolgreich übermittelt.",
    npsLow: "unwahrscheinlich",
    npsHigh: "sehr wahrscheinlich",
    yes: "Ja",
    no: "Nein",
    textPlaceholder: "Ihre Antwort (optional)",
    scaleLegend: "Bewertungsskala: 1 = sehr schlecht · 5 = sehr gut",
  },
  tr: {
    heading: "Kurs Değerlendirmesi",
    intro: (course: string) => `"${course}" hakkındaki görüşünüz bizim için önemli.`,
    privacy: "Bu anket tamamen anonimdir. Ekibimiz dahil hiç kimse cevaplarınızı sizinle eşleştiremez.",
    sectionTeacher: "Eğitmen Hakkında",
    sectionCourse: "Kurs Hakkında",
    submit: "Gönder",
    submitting: "Gönderiliyor…",
    required: "Bu soru zorunludur.",
    thanksTitle: "Geri bildiriminiz için teşekkürler!",
    thanksBody: "Anonim cevabınız başarıyla iletildi.",
    npsLow: "önermem",
    npsHigh: "kesinlikle öneririm",
    yes: "Evet",
    no: "Hayır",
    textPlaceholder: "Cevabınız (opsiyonel)",
    scaleLegend: "Puanlama ölçeği: 1 = çok kötü · 5 = çok iyi",
  },
  en: {
    heading: "Course Evaluation",
    intro: (course: string) => `Your opinion about "${course}" matters to us.`,
    privacy: "This survey is completely anonymous. No one — not even our team — can link your answers to you.",
    sectionTeacher: "About the instructor",
    sectionCourse: "About the course",
    submit: "Submit",
    submitting: "Submitting…",
    required: "This question is required.",
    thanksTitle: "Thank you for your feedback!",
    thanksBody: "Your anonymous response has been submitted successfully.",
    npsLow: "not likely",
    npsHigh: "very likely",
    yes: "Yes",
    no: "No",
    textPlaceholder: "Your answer (optional)",
    scaleLegend: "Rating scale: 1 = very poor · 5 = very good",
  },
  ar: {
    heading: "تقييم الدورة",
    intro: (course: string) => `رأيك حول "${course}" يهمنا.`,
    privacy: "هذا الاستبيان مجهول الهوية تمامًا. لا أحد — ولا حتى فريقنا — يمكنه ربط إجاباتك بك.",
    sectionTeacher: "حول المدرّس/ة",
    sectionCourse: "حول الدورة",
    submit: "إرسال",
    submitting: "جارٍ الإرسال…",
    required: "هذا السؤال مطلوب.",
    thanksTitle: "شكرًا لملاحظاتك!",
    thanksBody: "تم إرسال إجابتك المجهولة بنجاح.",
    npsLow: "غير محتمل",
    npsHigh: "محتمل جدًا",
    yes: "نعم",
    no: "لا",
    textPlaceholder: "إجابتك (اختياري)",
    scaleLegend: "مقياس التقييم: 1 = سيء جدًا · 5 = جيد جدًا",
  },
};

type AnswerValue = number | string | boolean;

export default function SurveyForm({
  language,
  courseTitle,
  questions,
  onSubmit,
  previewMode = false,
}: {
  language: string;
  courseTitle: string;
  questions: PublicSurveyQuestion[];
  onSubmit: (answers: SurveyAnswerInput[], turnstileToken: string | null) => Promise<{ success: true } | { success: false; error: string }>;
  /** true ise gerçek bir cevap KAYDEDİLMEZ — admin'in formu test etmesi için. */
  previewMode?: boolean;
}) {
  const lang: Lang = (language in STRINGS ? language : "de") as Lang;
  const t = STRINGS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const lehrer = questions.filter((q) => q.section === "LEHRER").sort((a, b) => a.order - b.order);
    const kurs = questions.filter((q) => q.section === "KURS").sort((a, b) => a.order - b.order);
    return { lehrer, kurs };
  }, [questions]);

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const missing = questions.find((q) => q.isRequired && answers[q.id] === undefined);
    if (missing) {
      setError(t.required);
      return;
    }

    if (previewMode) {
      setDone(true);
      return;
    }

    setSubmitting(true);
    const payload = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
    const result = await onSubmit(payload, turnstileToken);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16" dir={dir}>
        <div className="max-w-md w-full text-center bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8">
          {previewMode && (
            <div className="mb-4 text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-3 py-1 inline-block">
              ÖNİZLEME — cevap kaydedilmedi
            </div>
          )}
          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-xl font-bold mb-2">{t.thanksTitle}</h1>
          <p className="text-sm text-[var(--foreground)]/70">{t.thanksBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12" dir={dir}>
      {previewMode && (
        <div className="sticky top-0 z-10 -mx-4 -mt-12 mb-8 bg-amber-400 text-amber-950 text-center text-sm font-bold py-2 px-4">
          🔍 ÖNİZLEME MODU — bu formu gönderseniz bile hiçbir cevap kaydedilmez
        </div>
      )}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{t.heading}</h1>
        <p className="mt-2 text-[var(--foreground)]/70">{t.intro(courseTitle)}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[var(--primary)] bg-[var(--secondary)] rounded-full px-4 py-2">
          <ShieldCheck size={14} />
          <span>{t.privacy}</span>
        </div>
        {questions.some((q) => q.type === "RATING_5") && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-[var(--foreground)]/60">
            <Info size={14} />
            <span>{t.scaleLegend}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {grouped.lehrer.length > 0 && (
          <SurveySection title={t.sectionTeacher}>
            {grouped.lehrer.map((q) => (
              <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} t={t} />
            ))}
          </SurveySection>
        )}

        {grouped.kurs.length > 0 && (
          <SurveySection title={t.sectionCourse}>
            {grouped.kurs.map((q) => (
              <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} t={t} />
            ))}
          </SurveySection>
        )}

        <TurnstileWidget onToken={setTurnstileToken} />

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--primary)] hover:opacity-90 text-white font-bold rounded-[var(--radius-btn)] transition disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}

function SurveySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function QuestionField({
  q,
  value,
  onChange,
  t,
}: {
  q: PublicSurveyQuestion;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  t: SurveyStrings;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {q.prompt} {q.isRequired && <span className="text-red-500">*</span>}
      </label>

      {q.type === "RATING_5" && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition ${
                value === n
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-transparent border-[var(--border)] hover:border-[var(--primary)]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {q.type === "NPS_0_10" && (
        <div>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 11 }, (_, n) => n).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`w-9 h-9 rounded-md border text-xs font-bold transition ${
                  value === n
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-transparent border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-[var(--foreground)]/50 mt-1 px-1">
            <span>0 — {t.npsLow}</span>
            <span>10 — {t.npsHigh}</span>
          </div>
        </div>
      )}

      {q.type === "YES_NO" && (
        <div className="flex gap-2">
          {[
            { v: true, label: t.yes },
            { v: false, label: t.no },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              type="button"
              onClick={() => onChange(opt.v)}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition ${
                value === opt.v
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-transparent border-[var(--border)] hover:border-[var(--primary)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {q.type === "TEXT" && (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.textPlaceholder}
          rows={3}
          className="w-full border border-[var(--border)] rounded-lg p-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      )}
    </div>
  );
}
