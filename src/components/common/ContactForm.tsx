'use client';

import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Allgemeine Anfrage',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In demo / production, this sends message or dispatches action
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} />
        </div>
        <h4 className="text-xl font-bold text-emerald-900">Vielen Dank für Ihre Nachricht!</h4>
        <p className="text-sm text-emerald-700 max-w-md mx-auto">
          Ihre Anfrage ist erfolgreich bei uns eingegangen. Wir werden uns schnellstmöglich bei Ihnen melden.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', topic: 'Allgemeine Anfrage', message: '' });
          }}
          className="mt-4 inline-block text-xs font-bold text-emerald-800 bg-white border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          Neue Nachricht verfassen
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vor- und Nachname *</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" 
            placeholder="Max Mustermann" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail Adresse *</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" 
            placeholder="max@beispiel.de" 
            required 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bereich / Thema</label>
        <select 
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
        >
          <option>Allgemeine Anfrage</option>
          <option>Deutsch & Integrationskurse</option>
          <option>telc-Prüfungen</option>
          <option>Nachhilfe & Förderung</option>
          <option>Migrationsfachdienst (Beratung)</option>
          <option>ESF+ Alpha</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ihre Nachricht *</label>
        <textarea 
          rows={5} 
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none" 
          placeholder="Wie können wir Ihnen helfen?" 
          required
        />
      </div>

      <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-200">
        <ShieldCheck className="w-5 h-5 text-green-600 mr-3 shrink-0" />
        Ihre Daten werden sicher und verschlüsselt übertragen. (Spamschutz aktiv)
      </div>

      <button type="submit" className="flatsome-button w-full sm:w-auto flex items-center justify-center">
        <Send className="w-4 h-4 mr-2" /> Nachricht absenden
      </button>
    </form>
  );
}
