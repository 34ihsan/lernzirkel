"use client";

import React, { useState, useTransition } from "react";
import { 
  CheckCircle2, Clock, XCircle, PhoneCall, MessageCircle, 
  Trash2, Search, Filter, ShieldCheck, Mail, MapPin, Calendar, 
  ChevronDown, Edit3, Save, AlertCircle, FileText, Download, 
  ShieldAlert, Flame, RefreshCw 
} from "lucide-react";
import { updateLeadStatus, deleteLeadApplication } from "@/actions/applications";
import { purgeSingleApplication, purgeExpiredApplications } from "@/actions/data-retention";

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  serviceType: string;
  benefitType: string | null;
  city: string | null;
  estimatedGrant: string | null;
  message: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  consentGiven?: boolean;
  expiresAt?: Date | null;
  isPurged?: boolean;
  purgedAt?: Date | null;
  language: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
}

export default function ApplicationsClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [purgeNotice, setPurgeNotice] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: "PENDING" | "APPROVED" | "CONTACTED" | "REJECTED") => {
    startTransition(async () => {
      const res = await updateLeadStatus(id, newStatus);
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    });
  };

  const handleSaveNote = (id: string) => {
    startTransition(async () => {
      const lead = leads.find(l => l.id === id);
      if (!lead) return;
      const res = await updateLeadStatus(id, lead.status as any, noteText);
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, adminNote: noteText } : l));
        setEditingNoteId(null);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" adlı başvuru kalıcı olarak silinecek. Emin misiniz?`)) return;
    startTransition(async () => {
      const res = await deleteLeadApplication(id);
      if (res.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    });
  };

  const handlePurgeSingle = (id: string, name: string) => {
    if (!confirm(`DİKKAT (DSGVO Art. 17): "${name}" adlı başvuru sahibinin tüm kişisel verileri ve sunucudaki yüklenen dosyası kalıcı olarak imha edilecek. Bu işlem geri alınamaz. Onaylıyor musunuz?`)) {
      return;
    }

    startTransition(async () => {
      const res = await purgeSingleApplication(id);
      if (res.success) {
        setLeads(prev => prev.map(l => {
          if (l.id === id) {
            return {
              ...l,
              name: "[DSGVO GEREĞİ İMHA EDİLDİ]",
              email: "geloescht@dsgvo-archiv.de",
              phone: null,
              message: null,
              fileUrl: null,
              fileName: null,
              fileSize: null,
              isPurged: true,
              purgedAt: new Date(),
              status: "REJECTED",
            };
          }
          return l;
        }));
        setPurgeNotice("Kişisel veriler ve yüklenen dosya sunucudan başarıyla imha edildi.");
        setTimeout(() => setPurgeNotice(null), 4000);
      } else {
        alert(res.error || "İmha işlemi başarısız.");
      }
    });
  };

  const handleBatchPurge = () => {
    if (!confirm("Yasal saklama süresi (60 gün) dolmuş tüm eski başvuruların kişisel verileri ve dosyaları sunucudan kalıcı olarak silinecektir. Devam edilsin mi?")) {
      return;
    }

    startTransition(async () => {
      const res = await purgeExpiredApplications();
      if (res.success) {
        setPurgeNotice(`Süresi dolmuş ${res.purgedCount} adet başvuru ve dosya DSGVO gereği imha edildi.`);
        setTimeout(() => setPurgeNotice(null), 5000);
      } else {
        alert(res.error || "Temizleme hatası.");
      }
    });
  };

  const filteredLeads = leads.filter(lead => {
    if (filterStatus !== "ALL" && lead.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        lead.serviceType.toLowerCase().includes(q) ||
        (lead.benefitType && lead.benefitType.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = leads.filter(l => l.status === "PENDING").length;
  const approvedCount = leads.filter(l => l.status === "APPROVED").length;
  const contactedCount = leads.filter(l => l.status === "CONTACTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <span>Başvurular & Onay Merkezi</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold rounded-full animate-pulse">
                {pendingCount} Onay Bekliyor
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            0€ Destek hesaplayıcısından gelen başvurular, yüklenen evraklar ve DSGVO yasal saklama/imha yönetimi.
          </p>
        </div>

        {/* DSGVO Retention Batch Action */}
        <button
          onClick={handleBatchPurge}
          disabled={isPending}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition self-start md:self-auto disabled:opacity-50"
          title="Yasal 60 günlük süresi dolan tüm kişisel verileri ve dosyaları sunucudan kalıcı olarak sil"
        >
          <Flame size={15} className="text-amber-400" />
          <span>Süresi Dolanları İmha Et (DSGVO)</span>
        </button>
      </div>

      {purgeNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          <span>{purgeNotice}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterStatus("ALL")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition shadow-sm ${
            filterStatus === "ALL" ? "border-sky-600 ring-2 ring-sky-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam Başvuru</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{leads.length}</div>
        </div>

        <div 
          onClick={() => setFilterStatus("PENDING")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition shadow-sm ${
            filterStatus === "PENDING" ? "border-amber-600 ring-2 ring-amber-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={14} />
            <span>Onay Bekleyenler</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
        </div>

        <div 
          onClick={() => setFilterStatus("APPROVED")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition shadow-sm ${
            filterStatus === "APPROVED" ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>Onaylananlar</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</div>
        </div>

        <div 
          onClick={() => setFilterStatus("CONTACTED")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition shadow-sm ${
            filterStatus === "CONTACTED" ? "border-blue-600 ring-2 ring-blue-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall size={14} />
            <span>İletişime Geçildi</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{contactedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="İsim, e-posta, telefon veya kurs ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: "Tümü" },
            { id: "PENDING", label: "Onay Bekleyen" },
            { id: "APPROVED", label: "Onaylanan" },
            { id: "CONTACTED", label: "Görüşülen" },
            { id: "REJECTED", label: "Reddedilen" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterStatus(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterStatus === t.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-800">Başvuru bulunamadı</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery || filterStatus !== "ALL"
              ? "Arama veya filtre kriterlerine uyan başvuru bulunmamaktadır."
              : "Henüz yeni bir kurs veya hibe başvurusu gelmemiş."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9+]/g, "") : "";
            const waText = encodeURIComponent(
              `Hallo ${lead.name},\n\nwir haben Ihre Anfrage für ${lead.serviceType} bei Lernzirkel Ludwigshafen e.V. geprüft.\nIhr Förderstatus (${lead.estimatedGrant || "Gefördert"}) sieht sehr gut aus.\nWann passt es Ihnen für einen kurzen Termin bei uns am Ludwigsplatz?`
            );

            // Compute remaining days until legal retention expiration
            let daysRemaining: number | null = null;
            if (lead.expiresAt) {
              const diff = new Date(lead.expiresAt).getTime() - Date.now();
              daysRemaining = Math.ceil(diff / (1000 * 3600 * 24));
            }

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-xl border transition p-5 shadow-sm space-y-4 ${
                  lead.isPurged
                    ? "border-gray-200 bg-gray-50/70 opacity-75"
                    : lead.status === "PENDING"
                    ? "border-amber-300 bg-amber-50/20"
                    : lead.status === "APPROVED"
                    ? "border-emerald-200"
                    : "border-gray-200"
                }`}
              >
                {/* Purged Banner */}
                {lead.isPurged && (
                  <div className="p-2 bg-slate-200/80 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-slate-600" />
                      <span>Bu başvurunun kişisel verileri ve dosyası DSGVO yasal süresi uyarınca kalıcı olarak silinmiştir.</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {lead.purgedAt ? new Date(lead.purgedAt).toLocaleDateString("de-DE") : ""}
                    </span>
                  </div>
                )}

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
                      lead.isPurged ? "bg-gray-200 text-gray-500" : "bg-sky-100 text-sky-800"
                    }`}>
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>{lead.name}</span>
                        {lead.consentGiven && (
                          <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-medium">
                            DSGVO Onaylı
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(lead.createdAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {lead.city && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {lead.city}
                          </span>
                        )}
                        {daysRemaining !== null && !lead.isPurged && (
                          <span className={`flex items-center gap-1 font-semibold ${
                            daysRemaining <= 7 ? "text-red-600" : "text-slate-500"
                          }`}>
                            <Clock size={13} />
                            {daysRemaining <= 0
                              ? "Yasal süre doldu"
                              : `Silinmeye ${daysRemaining} gün kaldı`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Quick Action */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select
                      value={lead.status}
                      disabled={isPending || lead.isPurged}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${
                        lead.status === "PENDING"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : lead.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : lead.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : "bg-red-100 text-red-900 border-red-300"
                      }`}
                    >
                      <option value="PENDING">🟡 Beklemede (Onay Bekliyor)</option>
                      <option value="APPROVED">🟢 Onaylandı (Devlet Destekli)</option>
                      <option value="CONTACTED">🔵 İletişime Geçildi</option>
                      <option value="REJECTED">🔴 Reddedildi / İptal</option>
                    </select>

                    {/* DSGVO Purge Button */}
                    {!lead.isPurged && (
                      <button
                        onClick={() => handlePurgeSingle(lead.id, lead.name)}
                        className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-50 transition"
                        title="DSGVO Art. 17: Kişisel verileri ve dosyaları hemen imha et (Recht auf Vergessenwerden)"
                      >
                        <ShieldAlert size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500 block font-medium">Talep Edilen Hizmet:</span>
                    <strong className="text-gray-900 mt-0.5 block">{lead.serviceType}</strong>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500 block font-medium">Sosyal Yardım / Statü:</span>
                    <strong className="text-gray-900 mt-0.5 block">{lead.benefitType || "Belirtilmedi"}</strong>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 sm:col-span-2">
                    <span className="text-emerald-700 block font-medium">Hesaplanan Devlet Desteği:</span>
                    <strong className="text-emerald-900 mt-0.5 block">{lead.estimatedGrant}</strong>
                  </div>
                </div>

                {/* Uploaded File Link */}
                {lead.fileUrl && !lead.isPurged && (
                  <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-sky-950 font-semibold">
                      <FileText size={18} className="text-sky-700 shrink-0" />
                      <span>Yüklenen Resmi Belge: {lead.fileName || "Belge"}</span>
                      {lead.fileSize && (
                        <span className="text-[11px] text-sky-700 font-normal">
                          ({(lead.fileSize / 1024).toFixed(0)} KB)
                        </span>
                      )}
                    </div>
                    <a
                      href={lead.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Download size={13} />
                      <span>İncele / İndir</span>
                    </a>
                  </div>
                )}

                {/* Message / Notes */}
                {lead.message && (
                  <div className="text-xs text-gray-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Başvuru Notu / Evrak Durumu:</strong>
                    {lead.message}
                  </div>
                )}

                {/* Contact & Admin Note Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  {/* Contact Links */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {lead.phone && !lead.isPurged && (
                      <>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg transition"
                        >
                          <PhoneCall size={14} className="text-sky-700" />
                          <span>{lead.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone.replace("+", "")}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition shadow-sm"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp Onay Mesajı</span>
                        </a>
                      </>
                    )}
                    {!lead.isPurged && (
                      <a
                        href={`mailto:${lead.email}?subject=Ihre Anfrage bei Lernzirkel e.V.`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg transition"
                      >
                        <Mail size={14} className="text-sky-700" />
                        <span>{lead.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Admin Internal Note */}
                  <div className="flex items-center gap-2">
                    {editingNoteId === lead.id ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Admin iç notu yazın..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="text-xs px-2.5 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <button
                          onClick={() => handleSaveNote(lead.id)}
                          className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-md text-xs font-medium transition"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {lead.adminNote ? (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
                            Not: {lead.adminNote}
                          </span>
                        ) : null}
                        <button
                          onClick={() => {
                            setEditingNoteId(lead.id);
                            setNoteText(lead.adminNote || "");
                          }}
                          className="inline-flex items-center gap-1 text-gray-500 hover:text-sky-700 p-1 text-xs"
                          title="Not Ekle/Düzenle"
                        >
                          <Edit3 size={13} />
                          <span>{lead.adminNote ? "Notu Düzenle" : "+ Not Ekle"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
