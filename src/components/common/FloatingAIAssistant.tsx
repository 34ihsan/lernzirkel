"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { 
  Bot, X, Send, Sparkles, MessageCircle, 
  HelpCircle, ChevronRight, User, RefreshCw, Award 
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const getText = (m: UIMessage) =>
  m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/chat' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{
          type: 'text',
          text: "Hallo! Ich bin Ihr intelligenter Berater für den Lernzirkel Ludwigshafen e.V.\nWie kann ich Ihnen bei Kursen, Prüfungen oder staatlicher Förderung helfen?",
        }],
      }
    ] as UIMessage[],
    onFinish: ({ message }) => {
      trackEvent("ai_chat_reply_received", { length: getText(message).length });
    },
    onError: (error) => {
      console.error("Chat error:", error);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-[5.5rem] lg:bottom-8 lg:right-[6.5rem] z-40 font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              trackEvent("ai_assistant_open");
            }}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-sky-900 to-indigo-900 hover:from-sky-800 hover:to-indigo-800 text-white rounded-full shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] border border-white/20 transition-all"
            aria-label="KI-Kursberater öffnen"
          >
            <div className="relative">
              <Bot size={22} className="text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-sky-950 animate-pulse"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-none text-white">Elite KI-Berater</div>
              <div className="text-[10px] text-sky-200 mt-0.5">Online • Agentic RAG</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-16 -right-[4.5rem] sm:-right-4 w-[92vw] sm:w-[400px] max-h-[650px] h-[80vh] sm:h-[580px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-gray-800 overflow-hidden flex flex-col"
          >
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 p-4 text-white flex items-center justify-between shadow-md z-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>Lernzirkel AI</span>
                    <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-200 flex items-center gap-1 mt-0.5">
                    <Sparkles size={10} /> Agentic RAG Enabled
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition relative z-10"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-gray-900/50 text-xs">
              {messages.map((m, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  key={m.id || idx}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-800 to-indigo-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-2 ${m.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-sm prose prose-sm prose-slate dark:prose-invert max-w-none ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-sky-600 to-blue-700 text-white rounded-tr-sm [&_p]:text-white [&_strong]:text-white [&_a]:text-white"
                          : "bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 rounded-tl-sm border border-slate-100 dark:border-gray-700"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {getText(m)}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Tool Invocations Feedback */}
                    {m.parts.filter((p) => p.type.startsWith('tool-')).map((p: any) => (
                       <div key={p.toolCallId} className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md w-fit">
                         <RefreshCw size={10} className={p.state !== 'output-available' ? 'animate-spin' : ''} />
                         {p.state !== 'output-available' ? `Abfrage: ${p.type.replace('tool-', '')}...` : `Gefunden: ${p.type.replace('tool-', '')}`}
                       </div>
                    ))}

                    {/* Show suggestions only on the first welcome message to save space */}
                    {idx === 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {["Ist der Integrationskurs kostenlos?", "Welche telc Prüfungen gibt es?", "Wo ist euer Büro?"].map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSuggestion(sug)}
                            className="text-[11px] bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-gray-700 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-gray-700 rounded-full px-3 py-1.5 text-left transition shadow-sm font-medium"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-800 to-indigo-900 text-amber-300 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Footer */}
            <div className="bg-slate-100/80 dark:bg-gray-800/80 px-4 py-2 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 backdrop-blur-md">
              <span className="flex items-center gap-1"><Award size={12} className="text-amber-500"/> Zertifiziertes Zentrum</span>
              <a
                href="https://wa.me/4917612345678"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <MessageCircle size={13} />
                WhatsApp Live
              </a>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Frage stellen (DE, TR, AR, EN)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full transition disabled:opacity-40 shadow-md flex items-center justify-center shrink-0"
                aria-label="Senden"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
