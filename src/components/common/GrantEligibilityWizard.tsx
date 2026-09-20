"use client";

import React, { useState } from "react";
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, 
  HelpCircle, MessageCircle, Phone, X, Award, FileText, Send,
  UploadCloud, FileUp, AlertTriangle
} from "lucide-react";
import { submitLeadApplication } from "@/actions/applications";

interface WizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

const SERVICES = [
  {
    id: "BAMF_INTEGRATION",
    title: "BAMF Integrationskurs",
    sub: "Deutsch von A1 bis B1 + Orientierungskurs",
    icon: "🇩🇪",
    grantEligible: true,
  },
  {
    id: "NACHHILFE_BUT",
    title: "Kostenlose Nachhilfe (BuT)",
    sub: "Mathe, Deutsch, Englisch für alle Klassenstufen",
    icon: "📚",
    grantEligible: true,
  },
  {
    id: "TELC_PRUEFUNG",
    title: "telc B1 / B2 Prüfung",
    sub: "Offizielles Zertifikat für Einbürgerung & Beruf",
    icon: "📜",
    grantEligible: false,
  },
  {
    id: "BERATUNG",
    title: "Bildungs- & Migrationsberatung",
    sub: "Kostenlose Hilfe bei Behörden & Anträgen",
    icon: "🤝",
    grantEligible: true,
  },
];

const BENEFITS = [
  { id: "BUERGERGELD", label: "Bürgergeld (Jobcenter)", eligible100: true, badge: "100% Kostenlos" },
  { id: "WOHNGELD", label: "Wohngeld", eligible100: true, badge: "100% BuT / BAMF Förderung" },
  { id: "KINDERZUSCHLAG", label: "Kinderzuschlag (KIZ)", eligible100: true, badge: "100% Nachhilfe Kostenlos" },
  { id: "ASYLBLG", label: "Asylbewerberleistungen", eligible100: true, badge: "100% Kostenlos" },
  { id: "NONE", label: "Keine staatliche Leistung / Selbstzahler", eligible100: false, badge: "Günstige Konditionen" },
  { id: "UNSURE", label: "Ich bin mir nicht sicher (Beratung erwünscht)", eligible100: true, badge: "Kostenlose Prüfung" },
];

export default function GrantEligibilityWizard({ isOpen = true, onClose, inline = false }: WizardProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [selectedBenefit, setSelectedBenefit] = useState(BENEFITS[0].id);
  const [city, setCity] = useState("Ludwigshafen");
  const [timePref, setTimePref] = useState("Vormittags (09:00 - 13:00)");
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentServiceObj = SERVICES.find(s => s.id === selectedService) || SERVICES[0];
  const currentBenefitObj = BENEFITS.find(b => b.id === selectedBenefit) || BENEFITS[0];
  const is100Percent = currentBenefitObj.eligible100 && currentServiceObj.grantEligible;

  const estimatedGrantText = is100Percent
    ? "100% Staatliche Kostenübernahme (0€ Eigenanteil)"
    : currentBenefitObj.id === "NONE"
    ? "Faire Vereinsgebühren / Ratenzahlung möglich"
    : "Kostenlose Prüfung durch Lernzirkel Berater";

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !consentGiven) return;

    setIsSubmitting(true);
    setUploadError("");

    try {
      let fileUrl: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let fileSize: number | undefined = undefined;

      // 1. Upload Document if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("consent", "true");

        const uploadRes = await fetch("/api/upload/document", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Fehler beim Datei-Upload");
        }

        const uploadData = await uploadRes.json();
        fileUrl = uploadData.fileUrl;
        fileName = uploadData.fileName;
        fileSize = uploadData.fileSize;
      }

      // 2. Submit Lead Application
      const res = await submitLeadApplication({
        name,
        email,
        phone,
        serviceType: selectedService,
        benefitType: selectedBenefit,
        city: `${city} (${timePref})`,
        estimatedGrant: estimatedGrantText,
        message,
        fileUrl,
        fileName,
        fileSize,
        consentGiven: true,
        consentText: "DSGVO-Einwilligung erteilt. Automatische Löschung nach maximal 60 Tagen.",
        language: "de",
      });

      if (res.success) {
        setSubmitted(true);
        if (typeof window !== "undefined") {
          fetch("/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventName: "grant_wizard_complete",
              url: window.location.href,
              metadata: { service: selectedService, benefit: selectedBenefit, hasFile: Boolean(fileUrl) },
            }),
          }).catch(() => null);
        }
      } else {
        setUploadError(res.error || "Ein Fehler ist aufgetreten.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Fehler beim Absenden des Antrags.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hallo Lernzirkel e.V.,\n\nIch habe den Förderungs-Rechner genutzt:\n- Gewünschter Kurs: ${currentServiceObj.title}\n- Leistung: ${currentBenefitObj.label}\n- Ort: ${city}\n- Mein Förderstatus: ${estimatedGrantText}\n\nMein Name: ${name || "Interessent"}\nIch möchte gerne einen Beratungstermin vereinbaren.`
  );

  const content = (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl w-full mx-auto text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white p-6 relative">
        {onClose && !inline && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        )}
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={16} />
          <span>BAMF & BuT Förderungs-Rechner (Ludwigshafen & Mannheim)</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold">
          {step === 4 && submitted 
            ? "Antrag erfolgreich eingereicht!" 
            : "Haben Sie Anspruch auf 100% kostenlose Bildung?"}
        </h3>
        <p className="text-sky-100/90 text-sm mt-1">
          Prüfen Sie in 4 schnellen Schritten Ihren staatlichen Zuschuss.
        </p>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mt-5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-amber-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">1</span>
              Welches Bildungsangebot interessiert Sie?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedService === s.id
                      ? "border-sky-600 bg-sky-50/60 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{s.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                    </div>
                  </div>
                  {s.grantEligible && (
                    <span className="inline-block mt-3 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 self-start">
                      Staatlich gefördert (0€)
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition"
              >
                <span>Weiter zu Schritt 2</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">2</span>
              Erhalten Sie oder Ihre Familie eine dieser Leistungen?
            </h4>
            <div className="space-y-2">
              {BENEFITS.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBenefit(b.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedBenefit === b.id
                      ? "border-sky-600 bg-sky-50/60 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="font-medium text-slate-800 text-sm">{b.label}</div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    b.eligible100 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {b.badge}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-xl flex items-center gap-1.5 text-sm transition"
              >
                <ArrowLeft size={16} />
                <span>Zurück</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition"
              >
                <span>Weiter zu Schritt 3</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">3</span>
              Wohnort & gewünschte Unterrichtszeit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ihr Wohnort
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Ludwigshafen">Ludwigshafen am Rhein</option>
                  <option value="Mannheim">Mannheim</option>
                  <option value="Frankenthal">Frankenthal</option>
                  <option value="Mutterstadt / Limburgerhof">Mutterstadt / Limburgerhof</option>
                  <option value="Speyer">Speyer</option>
                  <option value="Andere">Andere Region</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bevorzugte Kurszeit
                </label>
                <select
                  value={timePref}
                  onChange={(e) => setTimePref(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Vormittags (09:00 - 13:00)">Vormittags (09:00 - 13:00 Uhr)</option>
                  <option value="Nachmittags (14:00 - 17:30)">Nachmittags (14:00 - 17:30 Uhr)</option>
                  <option value="Abendkurs (18:00 - 21:00)">Abendkurs (18:00 - 21:00 Uhr)</option>
                  <option value="Wochenendkurs">Samstags intensiv</option>
                  <option value="Flexibel">Flexibel nach Vereinbarung</option>
                </select>
              </div>
            </div>

            {/* Preview Banner */}
            <div className={`p-4 rounded-xl border mt-3 ${
              is100Percent 
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900" 
                : "bg-sky-50/80 border-sky-300 text-sky-900"
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className={is100Percent ? "text-emerald-600" : "text-sky-600"} size={18} />
                <span>Ergebnis-Vorschau: {estimatedGrantText}</span>
              </div>
              <p className="text-xs mt-1 text-slate-600">
                Unser Team in Ludwigshafen prüft Ihre Unterlagen und stellt den Förderantrag für Sie beim Amt.
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-xl flex items-center gap-1.5 text-sm transition"
              >
                <ArrowLeft size={16} />
                <span>Zurück</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition"
              >
                <span>Ergebnis & Antrag sichern</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Vielen Dank, {name}!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1.5">
                    Ihre unverbindliche Voranmeldung wurde an unser Beratungsteam übermittelt.
                    Wir prüfen Ihren Anspruch und kontaktieren Sie innerhalb von 24 Stunden.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-md mx-auto space-y-1 text-left">
                  <div><strong>Gewählter Kurs:</strong> {currentServiceObj.title}</div>
                  <div><strong>Förderstatus:</strong> {estimatedGrantText}</div>
                  <div><strong>Wohnort:</strong> {city}</div>
                  <div className="text-amber-800 pt-1">
                    ℹ️ <em>Status: Voranmeldung eingegangen (Admin-Prüfung ausstehend).</em>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/49621587900?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 text-sm shadow transition"
                  >
                    <MessageCircle size={18} />
                    <span>Direkt per WhatsApp nachfragen</span>
                  </a>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium rounded-xl text-sm transition"
                    >
                      Schließen
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Result Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Award size={18} className="text-emerald-600" />
                    <span>Ihr Förder-Ergebnis:</span>
                  </div>
                  <div className="text-lg font-extrabold text-emerald-900 mt-1">
                    {estimatedGrantText}
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">
                    Basierend auf Ihren Angaben zu <strong>{currentBenefitObj.label}</strong> für den Bereich <strong>{currentServiceObj.title}</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vor- & Nachname *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. Mehmet Yılmaz / Ali Al-Mansoor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefon / Mobilfunk *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+49 176 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-Mail Adresse *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Haben Sie bereits Unterlagen? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="z.B. Ich habe bereits einen BAMF-Berechtigungsschein oder Jobcenter Bescheid..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* Document Upload (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dokument / Bescheid hochladen (Optional - PDF, JPG, PNG bis 10MB)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl p-3 text-center transition bg-slate-50/50">
                    <input
                      type="file"
                      id="doc-upload"
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                      <UploadCloud size={22} className="text-sky-700" />
                      {selectedFile ? (
                        <div className="text-xs text-sky-900 font-semibold flex items-center gap-1">
                          <FileUp size={14} />
                          <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600">
                          <span className="font-semibold text-sky-800">Hier klicken</span> oder Datei hineinziehen (Berechtigungsschein / Bescheid)
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Explicit DSGVO Consent Checkbox */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      required
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-sky-800 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="leading-snug">
                      <strong>Datenschutz-Einwilligung (DSGVO):</strong> Ich willige ein, dass meine Daten und hochgeladenen Dokumente ausschließlich zur Antragsprüfung verarbeitet werden. Mir ist bekannt, dass alle persönlichen Daten und Dateien nach <strong>maximal 60 Tagen (gesetzliche Frist)</strong> automatisch und unwiderruflich von den Servern gelöscht werden. Ich kann diese Einwilligung jederzeit widerrufen. *
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm transition"
                  >
                    Zurück
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/49621587900?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-sm shadow transition"
                    >
                      <MessageCircle size={16} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                    <button
                      type="submit"
                      disabled={isSubmitting || !consentGiven}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm shadow transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Wird verarbeitet...</span>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Antrag absenden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {content}
    </div>
  );
}
