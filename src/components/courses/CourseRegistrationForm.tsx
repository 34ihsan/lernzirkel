'use client';

import { useState, useRef, useTransition } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { registerForCourse } from '@/actions/register';
import TurnstileWidget from '@/components/common/TurnstileWidget';

interface Availability {
  capacity: number | null;
  remaining: number | null;
  isFull: boolean;
  allowWaitlist: boolean;
}

export default function CourseRegistrationForm({
  courseId,
  highlightColor,
  availability,
}: {
  courseId: string;
  highlightColor: string;
  availability: Availability;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; waitlisted?: boolean; error?: string } | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const turnstileTokenRef = useRef<string>('');
  const [formStartTime] = useState<string>(() => Date.now().toString());

  const noSpotsLeft = availability.isFull && !availability.allowWaitlist;

  // Formu hemen göndermiyor — önce evrak/ulaşılamama uyarısını onaylatan bir pop-up gösteriyor.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
  };

  const confirmAndSubmit = () => {
    if (!pendingFormData) return;
    const formData = pendingFormData;
    formData.append('courseId', courseId);
    formData.append('turnstileToken', turnstileTokenRef.current);
    formData.append('formStartTime', formStartTime);
    setPendingFormData(null);

    startTransition(async () => {
      const res = await registerForCourse(formData);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
        <CheckCircle2 className="mx-auto mb-2 text-green-600" size={28} />
        <p className="font-bold text-green-800">
          {result.waitlisted ? 'Sie stehen auf der Warteliste!' : 'Anmeldung erfolgreich!'}
        </p>
        <p className="text-sm text-green-700 mt-1">
          {result.waitlisted
            ? 'Wir melden uns, sobald ein Platz frei wird.'
            : 'Wir melden uns in Kürze bei Ihnen.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* HONEYPOT - Kullanıcıdan gizli, botlar genellikle doldurur */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url_reg">Website URL (Nicht ausfüllen!)</label>
        <input type="text" id="website_url_reg" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {availability.capacity != null && (
        <div
          className={`text-xs font-bold px-3 py-2 rounded-lg ${
            availability.isFull
              ? 'bg-amber-50 text-amber-700'
              : availability.remaining! <= 5
              ? 'bg-orange-50 text-orange-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {availability.isFull
            ? availability.allowWaitlist
              ? 'Kurs ausgebucht — Anmeldung zur Warteliste möglich'
              : 'Kurs leider ausgebucht'
            : `${availability.remaining} von ${availability.capacity} Plätzen frei`}
        </div>
      )}

      {!noSpotsLeft && (
        <>
          <input
            name="name"
            required
            placeholder="Ihr Name"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="E-Mail-Adresse"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            name="phone"
            type="tel"
            required
            placeholder="Telefon"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <textarea
            name="message"
            placeholder="Nachricht (optional)"
            rows={2}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
            <Info size={15} className="shrink-0 mt-0.5 text-primary" />
            <span>
              Nach Ihrer Anmeldung setzen wir uns mit Ihnen in Verbindung, um die für die Teilnahme erforderlichen Unterlagen zu besprechen. Sollten wir Sie telefonisch nicht erreichen oder die notwendigen Dokumente nicht rechtzeitig eingereicht werden, kann die Anmeldung nicht abgeschlossen werden.
            </span>
          </div>

          {result?.error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          )}

          <TurnstileWidget onToken={(token) => { turnstileTokenRef.current = token; }} />

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white font-bold rounded-xl transition-all shadow-md dark:shadow-none hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: highlightColor }}
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {availability.isFull ? 'Auf Warteliste setzen' : 'Jetzt anmelden'}
          </button>
        </>
      )}

      {pendingFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="shrink-0 mt-0.5 text-primary" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1.5">Bitte beachten Sie</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Nach Ihrer Anmeldung setzen wir uns mit Ihnen in Verbindung, um die für die Teilnahme erforderlichen Unterlagen zu besprechen. Sollten wir Sie telefonisch nicht erreichen oder die notwendigen Dokumente nicht rechtzeitig eingereicht werden, kann die Anmeldung nicht abgeschlossen werden.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPendingFormData(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 transition-colors"
              >
                Zurück
              </button>
              <button
                type="button"
                onClick={confirmAndSubmit}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60"
                style={{ backgroundColor: highlightColor }}
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                Verstanden, anmelden
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
