"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Send, Sparkles, MessageCircle, 
  HelpCircle, ChevronRight, User, RefreshCw, Award 
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Message {
  role: "assistant" | "user";
  text: string;
  suggestions?: string[];
}

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hallo! Ich bin Ihr digitaler Bildungsberater für Lernzirkel Ludwigshafen e.V. Wie kann ich Ihnen bei Kursen, Prüfungen oder staatlicher Förderung (BAMF / BuT) helfen?",
      suggestions: [
        "Ist mein Kurs kostenlos? (0€)",
        "telc B1 Prüfungstermine",
        "Kostenlose Nachhilfe für Kinder",
        "Standort & Öffnungszeiten",
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setIsLoading(true);

    trackEvent("ai_chat_message", { queryLength: query.length });

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply || "Gerne helfen wir Ihnen weiter.",
            suggestions: data.suggestions || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Entschuldigung, der KI-Dienst ist im Moment nicht erreichbar. Bitte kontaktieren Sie uns direkt per Telefon (0621 30737271) oder WhatsApp.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Verbindungsfehler. Bitte wenden Sie sich direkt an unser Büro am Ludwigsplatz 9a.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-[5.5rem] lg:bottom-8 lg:right-[6.5rem] z-40 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            trackEvent("ai_assistant_open");
          }}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-sky-900 to-indigo-900 hover:from-sky-800 hover:to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-sky-900/40 border border-white/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
          aria-label="KI-Kursberater öffnen"
        >
          <div className="relative">
            <Bot size={22} className="text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-sky-950 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none text-white">KI-Kursberater</div>
            <div className="text-[10px] text-sky-200 mt-0.5">Online • 4 Sprachen</div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 -right-[4.5rem] sm:-right-4 w-[92vw] sm:w-96 max-h-[580px] h-[80vh] sm:h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 p-4 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                <Bot size={20} />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <span>Lernzirkel KI-Berater</span>
                  <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                    BAMF & BuT
                  </span>
                </div>
                <div className="text-[11px] text-sky-200">Ludwigshafen • Deutsch, TR, AR, EN</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-sky-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot size={15} />
                  </div>
                )}

                <div className="max-w-[82%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-sky-800 text-white rounded-tr-none shadow-sm"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Suggestions Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] bg-white hover:bg-sky-50 text-sky-800 hover:text-sky-900 border border-sky-200 rounded-full px-2.5 py-1 text-left transition shadow-2xs font-medium"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-sky-900 text-amber-300 flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce delay-200"></span>
                  <span className="text-[11px] ml-1">Berater antwortet...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp / Quick Help CTA */}
          <div className="bg-slate-100/80 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span>Offizielle Beratung Ludwigshafen e.V.</span>
            <a
              href="https://wa.me/4917612345678"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Berater</span>
            </a>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Frage stellen (DE, TR, AR, EN)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-sky-800 hover:bg-sky-900 text-white rounded-xl transition disabled:opacity-40"
              aria-label="Senden"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
