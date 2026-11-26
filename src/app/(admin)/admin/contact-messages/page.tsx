'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Paperclip, Phone, ChevronDown, ChevronUp, Archive } from 'lucide-react';

const TOPIC_LABELS: Record<string, string> = {
  allgemein: 'Allgemeine Anfrage',
  bewerbung: 'Bewerbung / Karriere',
  deutschkurs: 'Deutschkurs / Integrationskurs',
  nachhilfe: 'Nachhilfe für Kinder/Jugendliche',
  beratung: 'Migrationsberatung',
  spende: 'Spenden & Unterstützung',
};

export default function ContactMessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact-messages');
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    try {
      await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (msg: any) => {
    const isOpening = expandedId !== msg.id;
    setExpandedId(isOpening ? msg.id : null);
    if (isOpening && msg.status === 'UNREAD') {
      updateStatus(msg.id, 'READ');
    }
  };

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">İletişim Mesajları</h1>
          <p className="text-sm text-gray-500 mt-1">
            /kontakt formu üzerinden gelen mesajlar{unreadCount > 0 && ` · ${unreadCount} okunmamış`}
          </p>
        </div>
      </div>

      {loading ? (
        <p>Mesajlar yükleniyor...</p>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          Henüz mesaj yok.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200 overflow-hidden">
          {messages.map(msg => {
            const attachmentInfo = msg.details?.attachmentInfo;
            const isExpanded = expandedId === msg.id;
            const isUnread = msg.status === 'UNREAD';

            return (
              <div key={msg.id} className={isUnread ? 'bg-blue-50/40' : ''}>
                <button
                  onClick={() => toggleExpand(msg)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {isUnread ? (
                    <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <MailOpen className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.firstName} {msg.lastName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {TOPIC_LABELS[msg.topic] || msg.topic}
                      </span>
                      {attachmentInfo && (
                        <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {msg.status === 'ARCHIVED' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Arşiv</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                    {new Date(msg.createdAt).toLocaleString('de-DE')}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 bg-gray-50/60 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                      <p><span className="text-gray-500">E-Mail:</span> <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a></p>
                      {msg.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">{msg.phone}</a>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white border border-gray-200 rounded-lg p-4">
                      {msg.message}
                    </p>

                    {attachmentInfo && (
                      <a
                        href={`/api/admin/contact-messages/${msg.id}/attachment`}
                        className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2"
                      >
                        <Paperclip className="w-4 h-4" />
                        {attachmentInfo.name} ({(attachmentInfo.size / 1024).toFixed(0)} KB) indir
                      </a>
                    )}

                    <div className="flex gap-2 mt-4">
                      {msg.status !== 'ARCHIVED' ? (
                        <button
                          onClick={() => updateStatus(msg.id, 'ARCHIVED')}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                        >
                          <Archive className="w-3.5 h-3.5" /> Arşivle
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(msg.id, 'READ')}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                        >
                          Arşivden Çıkar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
