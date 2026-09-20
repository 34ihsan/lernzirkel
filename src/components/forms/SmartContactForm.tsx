'use client';

import React, { useState } from 'react';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SmartContactForm() {
  const [topic, setTopic] = useState('allgemein');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
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
          onClick={() => setIsSuccess(false)}
        >
          Weitere Nachricht senden
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-royal p-6 md:p-8 border border-slate-100">
      <h3 className="text-2xl font-bold text-primary mb-6">Schreiben Sie uns</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Worum geht es?</label>
          <select 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="allgemein">Allgemeine Anfrage</option>
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
              required 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="Max"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nachname</label>
            <input 
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
              required 
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="max@beispiel.de"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon (optional)</label>
            <input 
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
              <input type="text" className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400" placeholder="z.B. 8. Klasse" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">Fach/Fächer</label>
              <input type="text" className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400" placeholder="z.B. Mathe, Englisch" />
            </div>
          </div>
        )}

        {topic === 'deutschkurs' && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <label className="block text-sm font-semibold text-amber-900 mb-2">Haben Sie einen Berechtigungsschein vom BAMF oder Jobcenter?</label>
            <select className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400">
              <option value="unbekannt">Ich weiß es nicht / Bitte um Beratung</option>
              <option value="ja_bamf">Ja, vom BAMF</option>
              <option value="ja_jobcenter">Ja, vom Jobcenter / Agentur für Arbeit</option>
              <option value="nein">Nein</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ihre Nachricht</label>
          <textarea 
            required 
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" 
            placeholder="Wie können wir Ihnen helfen?"
          ></textarea>
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
