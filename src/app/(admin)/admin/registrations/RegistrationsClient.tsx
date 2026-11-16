"use client";

import { useState, useTransition } from "react";
import {
  Trash2, Search, Mail, PhoneCall,
  Calendar, ArrowUpCircle, Hourglass, AlertCircle,
  Clock, CheckCircle2, LayoutGrid, List as ListIcon,
} from "lucide-react";
import { updateRegistrationStatus, promoteFromWaitlist, deleteRegistration, assignRegistration } from "@/actions/register";
import RegistrationKanbanBoard from "@/components/admin/RegistrationKanbanBoard";

export interface TeamMemberOption {
  id: string;
  name: string;
  role: string;
}

export interface RegistrationItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  language: string;
  status: string;
  isWaitlisted: boolean;
  createdAt: Date;
  courseId: string;
  courseTitle: string;
  courseCapacity: number | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  lastContactedAt?: Date | null;
}

export default function RegistrationsClient({
  initialRegistrations,
  teamMembers,
}: {
  initialRegistrations: RegistrationItem[];
  teamMembers: TeamMemberOption[];
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: "PENDING" | "APPROVED" | "CONTACTED" | "REJECTED") => {
    startTransition(async () => {
      const res = await updateRegistrationStatus(id, status);
      if (res.success) {
        setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    });
  };

  const handleAssign = (id: string, teamMemberId: string) => {
    startTransition(async () => {
      const res = await assignRegistration(id, teamMemberId || null);
      if (res.success) {
        setRegistrations((prev) => prev.map((r) => (r.id === id ? {
          ...r,
          assignedToId: teamMemberId || null,
          assignedToName: res.assignedToName ?? null,
        } : r)));
      }
    });
  };

  const handlePromote = (id: string) => {
    startTransition(async () => {
      const res = await promoteFromWaitlist(id);
      if (res.success) {
        setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, isWaitlisted: false } : r)));
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" adlı kayıt kalıcı olarak silinecek. Emin misiniz?`)) return;
    startTransition(async () => {
      const res = await deleteRegistration(id);
      if (res.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
      }
    });
  };

  const filtered = registrations.filter((r) => {
    if (filterStatus === "WAITLIST" && !r.isWaitlisted) return false;
    if (filterStatus !== "ALL" && filterStatus !== "WAITLIST" && r.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        r.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = registrations.filter((r) => r.status === "PENDING").length;
  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;
  const contactedCount = registrations.filter((r) => r.status === "CONTACTED").length;
  const waitlistCount = registrations.filter((r) => r.isWaitlisted).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <span>Kayıtlar & Onay</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold rounded-full animate-pulse">
                {pendingCount} Onay Bekliyor
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kurs sayfalarından gelen anmeldung/kayıt başvuruları, bekleme listesi ve onay yönetimi.
          </p>
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl p-1 self-start md:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ListIcon size={14} />
            <span>Liste</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "board" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid size={14} />
            <span>Pano</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterStatus("ALL")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition shadow-sm ${
            filterStatus === "ALL" ? "border-sky-600 ring-2 ring-sky-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam Kayıt</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{registrations.length}</div>
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

      {viewMode === "board" ? (
        <RegistrationKanbanBoard registrations={registrations} onStatusChange={handleStatusChange} />
      ) : (
      <>
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
            { id: "WAITLIST", label: `Bekleme Listesi (${waitlistCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterStatus(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-800">Kayıt bulunamadı</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery || filterStatus !== "ALL"
              ? "Arama veya filtre kriterlerine uyan kayıt bulunmamaktadır."
              : "Henüz yeni bir kurs kaydı gelmemiş."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 ${
                r.isWaitlisted ? "border-amber-300 bg-amber-50/20" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{r.name}</h4>
                    {r.isWaitlisted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        <Hourglass size={11} /> Bekleme Listesi
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-sky-700 font-semibold mt-0.5">{r.courseTitle}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(r.createdAt).toLocaleDateString("de-DE")}</span>
                    <span className="flex items-center gap-1"><Mail size={12} />{r.email}</span>
                    {r.phone && <span className="flex items-center gap-1"><PhoneCall size={12} />{r.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  {r.isWaitlisted && (
                    <button
                      onClick={() => handlePromote(r.id)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                      title="Kontenjana al"
                    >
                      <ArrowUpCircle size={14} /> Kontenjana Al
                    </button>
                  )}
                  <select
                    value={r.status}
                    disabled={isPending}
                    onChange={(e) => handleStatusChange(r.id, e.target.value as "PENDING" | "APPROVED" | "CONTACTED" | "REJECTED")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${
                      r.status === "PENDING"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : r.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : r.status === "CONTACTED"
                        ? "bg-blue-100 text-blue-900 border-blue-300"
                        : "bg-red-100 text-red-900 border-red-300"
                    }`}
                  >
                    <option value="PENDING">🟡 Beklemede</option>
                    <option value="APPROVED">🟢 Onaylandı</option>
                    <option value="CONTACTED">🔵 İletişime Geçildi</option>
                    <option value="REJECTED">🔴 Reddedildi</option>
                  </select>

                  <select
                    value={r.assignedToId || ""}
                    disabled={isPending}
                    onChange={(e) => handleAssign(r.id, e.target.value)}
                    title="Sorumlu ekip üyesi ata"
                    className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none transition cursor-pointer"
                  >
                    <option value="">👤 Atanmadı</option>
                    {teamMembers.map((tm) => (
                      <option key={tm.id} value={tm.id}>{tm.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(r.id, r.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {r.message && (
                <div className="text-xs text-gray-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {r.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
