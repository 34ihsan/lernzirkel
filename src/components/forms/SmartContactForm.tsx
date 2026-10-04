'use client';

import React, { useState, useEffect } from 'react';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import { Send, CheckCircle, AlertCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function SmartContactForm() {
  const searchParams = useSearchParams();
  const betreffParam = searchParams?.get('betreff');
  
  const [topic, setTopic] = useState('allgemein');
  const [initialMessage, setInitialMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  
  // Anti-Spam: Time to complete form
  const [formStartTime, setFormStartTime] = useState<string>('');
  
  useEffect(() => {
    setFormStartTime(Date.now().toString());
    
    if (betreffParam) {
      if (betreffParam.toLowerCase().includes('bewerbung') || betreffParam.toLowerCase().includes('praktikum')) {
        setTopic('bewerbung');
      }
      setInitialMessage(betreffParam + '\n\n');
    }
  }, [betreffParam]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consentGiven) {
      setErrorMsg('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    formData.append('formStartTime', formStartTime);
    
    // Topic specific details - handled as JSON string in form data
    const details: any = {};
    if (topic === 'nachhilfe') {
      details.klasse = formData.get('klasse');
      details.faecher = formData.get('faecher');
    } else if (topic === 'deutschkurs') {
      details.bamfStatus = formData.get('bamfStatus');
    }
    formData.append('details', JSON.stringify(details));

    try {
      // Use FormData directly for file upload support
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData // No Content-Type header needed for FormData (browser sets it with boundary)
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error || 'Es ist ein Fehler aufgetreten.');
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setErrorMsg('Es konnte keine Verbindung zum Server hergestellt werden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Vielen Dank für Ihre Nachricht!</h3>
        <p className="text-green-700">Wir werden uns schnellstmöglich bei Ihnen melden.</p>
        <Button 
          variant="outline" 
          className="mt-6 border-green-600 text-green-700 hover:bg-green-100"
          onClick={() => {
            setIsSuccess(false);
            setFormStartTime(Date.now().toString()); // Reset timer
          }}
        >
          Weitere Nachricht senden
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-royal p-6 md:p-8 border border-slate-100">
      <h3 className="text-2xl font-bold text-primary mb-6">Schreiben Sie uns</h3>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* HONEYPOT - Hidden from users, filled by bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_url">Website URL (Nicht ausfüllen!)</label>
          <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Worum geht es?</label>
          <select 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="allgemein">Allgemeine Anfrage</option>
            <option value="bewerbung">Bewerbung / Karriere</option>
            <option value="deutschkurs">Deutschkurs / Integrationskurs</option>
            <option value="nachhilfe">Nachhilfe für Kinder/Jugendliche</option>
            <option value="beratung">Migrationsberatung</option>
            <option value="spende">Spenden & Unterstützung</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vorname</label>
            <input 
              name="firstName"
              required 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="Max"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nachname</label>
            <input 
              name="lastName"
              required 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="Mustermann"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-Mail Adresse</label>
            <input 
              name="email"
              required 
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="max@beispiel.de"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon (optional)</label>
            <input 
              name="phone"
              type="tel" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="0123 456789"
            />
          </div>
        </div>

        {/* Dynamic Fields based on Topic */}
        {topic === 'nachhilfe' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">Klasse (Schüler)</label>
              <input name="klasse" type="text" className="w-full bg-white dark:bg-gray-900 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400" placeholder="z.B. 8. Klasse" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">Fach/Fächer</label>
              <input name="faecher" type="text" className="w-full bg-white dark:bg-gray-900 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400" placeholder="z.B. Mathe, Englisch" />
            </div>
          </div>
        )}

        {topic === 'deutschkurs' && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <label className="block text-sm font-semibold text-amber-900 mb-2">Haben Sie einen Berechtigungsschein vom BAMF oder Jobcenter?</label>
            <select name="bamfStatus" className="w-full bg-white dark:bg-gray-900 border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400">
              <option value="unbekannt">Ich weiß es nicht / Bitte um Beratung</option>
              <option value="ja_bamf">Ja, vom BAMF</option>
              <option value="ja_jobcenter">Ja, vom Jobcenter / Agentur für Arbeit</option>
              <option value="nein">Nein</option>
            </select>
          </div>
        )}

        {topic === 'bewerbung' && (
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-4">
            <label className="block text-sm font-semibold text-emerald-900 mb-2 flex items-center">
              <Paperclip className="w-4 h-4 mr-2" /> Bewerbungsunterlagen (Lebenslauf, Anschreiben)
            </label>
            <input 
              name="attachment" 
              type="file" 
              accept=".pdf,.doc,.docx,.jpg,.png"
              className="w-full bg-white dark:bg-gray-900 border border-emerald-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
            />
            <p className="text-xs text-emerald-700 mt-2">Erlaubte Formate: PDF, DOCX, JPG, PNG. (Max. 5 MB)</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ihre Nachricht</label>
          <textarea 
            name="message"
            required 
            rows={4}
            defaultValue={initialMessage}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" 
            placeholder="Wie können wir Ihnen helfen?"
          ></textarea>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
          <input 
            type="checkbox" 
            id="privacy_consent" 
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="privacy_consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
            Ich stimme zu, dass meine Angaben aus dem Kontaktformular zur Beantwortung meiner Anfrage erhoben und verarbeitet werden. 
            Die Daten werden nach abgeschlossener Bearbeitung Ihrer Anfrage gelöscht. 
            Hinweis: Sie können Ihre Einwilligung jederzeit für die Zukunft per E-Mail an info@lernzirkel-online.de widerrufen. 
            Detaillierte Informationen zum Umgang mit Nutzerdaten finden Sie in unserer <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>.
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 max-w-sm">
            Alternativ können Sie uns auch direkt schreiben: <br/>
            <EmailObfuscator user="info" domain="lernzirkel-online.de" className="font-semibold text-primary" />
          </p>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-6 rounded-full bg-primary hover:bg-primary-light transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
            {!isSubmitting && <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
