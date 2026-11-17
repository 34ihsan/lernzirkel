"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, Printer, Flag, MessageSquare, QrCode, Eye, UserCog, Copy, Check, MessageCircle, RefreshCw, UserPlus, Loader2, MailWarning, MailCheck, MailX, Clock3 } from "lucide-react";
import { exportCourseResponsesCsv, resendSurveyInviteNow, addCourseParticipants } from "@/actions/survey-admin";
import type { CourseSurveyReport, CourseInviteRow } from "@/lib/survey-reports";

const CHART_COLOR = "#0F4761";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Bekliyor", className: "bg-gray-100 text-gray-500" },
  SENT: { label: "Gönderildi", className: "bg-sky-100 text-sky-700" },
  OPENED: { label: "Açıldı", className: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Tamamlandı", className: "bg-green-100 text-green-700" },
  EXPIRED: { label: "Süresi Doldu", className: "bg-red-100 text-red-600" },
  FAILED: { label: "Gönderilemedi", className: "bg-red-100 text-red-700" },
};

// Resend webhook'undan gelen GERÇEK posta kutusu durumu — "Gönderildi" rozeti sadece
// Resend'in isteği kabul ettiğini gösterir, bu ise fiilen ne olduğunu gösterir.
const DELIVERY_LABELS: Record<string, { label: string; className: string; Icon: typeof MailCheck }> = {
  DELIVERED: { label: "Teslim edildi", className: "text-green-600", Icon: MailCheck },
  BOUNCED: { label: "Geri döndü (adres hatalı/dolu)", className: "text-red-600", Icon: MailX },
  COMPLAINED: { label: "Spam olarak işaretlendi", className: "text-red-600", Icon: MailWarning },
  DELAYED: { label: "Teslimat gecikti", className: "text-amber-600", Icon: Clock3 },
};

function whatsAppLink(phone: string | null, link: string, courseTitle: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  const message = `Merhaba! "${courseTitle}" kursu için anonim değerlendirme anketimizi doldurur musunuz? ${link}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-2xl font-bold" style={{ color: accent ?? "#111827" }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function CourseReportClient({
  report,
  invites,
  walkInUrl,
  previewUrl,
  qrDataUrl,
  courseId,
}: {
  report: CourseSurveyReport;
  invites: CourseInviteRow[];
  walkInUrl: string;
  previewUrl: string;
  qrDataUrl: string;
  courseId: string;
}) {
  const router = useRouter();
  const [showQr, setShowQr] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [addingParticipants, setAddingParticipants] = useState(false);
  const [addResult, setAddResult] = useState<string | null>(null);

  function handleCopy(id: string, link: string) {
    navigator.clipboard?.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleResend(registrationId: string) {
    setResendingId(registrationId);
    await resendSurveyInviteNow(registrationId);
    setResendingId(null);
    router.refresh();
  }

  async function handleAddParticipants() {
    const rows = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, email, phone] = line.split(",").map((p) => p.trim());
        return { name, email, phone };
      });
    if (rows.length === 0) return;

    setAddingParticipants(true);
    setAddResult(null);
    try {
      const result = await addCourseParticipants(courseId, rows);
      setAddResult(
        `${result.added} kişi eklendi, ${result.skipped} atlandı (geçersiz/zaten kayıtlı). ${result.emailsSent} davet e-postası gönderildi` +
          (result.emailsFailed > 0 ? `, ${result.emailsFailed} tanesi gönderilemedi.` : ".")
      );
      setBulkText("");
      router.refresh();
    } finally {
      setAddingParticipants(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const csv = await exportCourseResponsesCsv(courseId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anket-${courseId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6 print:p-6">
      <div className="flex items-start justify-between print:block">
        <div>
          <h1 className="text-2xl font-bold">{report.courseTitle}</h1>
          <p className="text-sm text-gray-500">
            {report.category}
            {report.teacherSnapshot ? (
              <> · Eğitmen: <strong>{report.teacherSnapshot}</strong></>
            ) : (
              <>
                {" · "}
                <Link href={`/admin/content/Course/${courseId}`} className="inline-flex items-center gap-1 text-amber-600 hover:underline">
                  <UserCog size={12} /> Eğitmen girilmedi — kurs düzenleme ekranından ekleyin
                </Link>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Eye size={15} /> Önizle
          </a>
          <button onClick={() => setShowQr((v) => !v)} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <QrCode size={15} /> QR Poster
          </button>
          <button onClick={handleExport} disabled={exporting} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            <Download size={15} /> CSV İndir
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
            <Printer size={15} /> Raporu Yazdır
          </button>
        </div>
      </div>

      {showQr && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-6 print:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR" width={160} height={160} className="rounded-lg border border-gray-100" />
          <div>
            <p className="text-sm font-medium mb-1">Yazdırılabilir, çoklu kullanımlı anket girişi.</p>
            <p className="text-xs text-gray-500 max-w-md">
              E-posta davetiyesi almayan veya anında (sınıfta) doldurmak isteyen kursiyerler için. Kişisel davetlerle
              aynı şekilde tamamen anonimdir, ama tek-kullanımlık değildir — herkes aynı linki kullanabilir.
            </p>
            <code className="block mt-2 text-xs bg-gray-50 px-2 py-1 rounded break-all">{walkInUrl}</code>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Davet" value={String(report.invited)} />
        <StatCard label="Tamamlandı" value={String(report.completed)} accent="#16a34a" />
        <StatCard label="Yanıt Oranı" value={report.responseRate != null ? `${report.responseRate}%` : "—"} />
        <StatCard label="Eğitmen Ort." value={report.avgTeacherRating?.toFixed(1) ?? "—"} accent={CHART_COLOR} />
        <StatCard label="NPS Skoru" value={report.npsScore != null ? String(report.npsScore) : "—"} accent={(report.npsScore ?? 0) >= 0 ? "#16a34a" : "#dc2626"} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 print:hidden">
        <button onClick={() => setShowInvites((v) => !v)} className="w-full flex items-center justify-between font-bold">
          <span>Davet Durumu ({invites.length} kişi)</span>
          <span className="text-xs font-normal text-gray-400">{showInvites ? "Gizle" : "Göster"}</span>
        </button>
        {showInvites && (
          <div className="mt-4 space-y-1">
            <p className="text-xs text-gray-500 mb-3">
              Bu liste sadece davet/gönderim durumunu gösterir — kim tamamladıysa bile ne yazdığı burada veya
              başka hiçbir yerde görünmez. E-posta dışında WhatsApp ile de aynı kişisel linki manuel iletebilirsiniz.
            </p>
            {invites.map((inv) => {
              const status = STATUS_LABELS[inv.status] ?? STATUS_LABELS.PENDING;
              const delivery = inv.deliveryStatus ? DELIVERY_LABELS[inv.deliveryStatus] : null;
              const wa = whatsAppLink(inv.phone, inv.link, report.courseTitle);
              return (
                <div key={inv.registrationId} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{inv.name}</div>
                    <div className="text-xs text-gray-400 truncate">{inv.email}</div>
                  </div>
                  {delivery && (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${delivery.className}`} title="Resend teslimat bildirimi">
                      <delivery.Icon size={13} /> {delivery.label}
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.className}`}>{status.label}</span>
                  {(inv.deliveryStatus === "BOUNCED" || inv.deliveryStatus === "COMPLAINED") && wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100" title="E-posta ulaşmadı, WhatsApp'tan deneyin">
                      <MessageCircle size={12} /> WhatsApp dene
                    </a>
                  )}
                  {inv.status !== "COMPLETED" && (
                    <>
                      {(inv.status === "FAILED" || inv.status === "PENDING") && (
                        <button
                          onClick={() => handleResend(inv.registrationId)}
                          disabled={resendingId === inv.registrationId}
                          className="p-2 text-gray-400 hover:text-amber-600 disabled:opacity-50"
                          title="E-postayı yeniden gönder"
                        >
                          {resendingId === inv.registrationId ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                        </button>
                      )}
                      <button onClick={() => handleCopy(inv.registrationId, inv.link)} className="p-2 text-gray-400 hover:text-sky-600" title="Linki kopyala">
                        {copiedId === inv.registrationId ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                      </button>
                      {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-green-600" title="WhatsApp'tan gönder">
                          <MessageCircle size={15} />
                        </a>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            {invites.length === 0 && <p className="text-sm text-gray-400">Henüz davet gönderilmedi.</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 print:hidden">
        <button onClick={() => setShowAddParticipants((v) => !v)} className="w-full flex items-center justify-between font-bold">
          <span className="flex items-center gap-2"><UserPlus size={16} /> Kursiyer Ekle (çevrimdışı kayıtlar için)</span>
          <span className="text-xs font-normal text-gray-400">{showAddParticipants ? "Gizle" : "Göster"}</span>
        </button>
        {showAddParticipants && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-gray-500">
              Bu kurs için kursiyerler zaten web sitesindeki kayıt formundan geldiyse (ad soyad/e-posta/telefon)
              hiçbir şey yapmanıza gerek yok — anket davetleri otomatik oluşur. Bu alan sadece <strong>sitede
              kayıt olmamış</strong>, kağıt üzerinden/elden kayıt edilmiş kursiyerler içindir. Her satıra bir kişi,
              virgülle ayırarak yazın:
            </p>
            <code className="block text-xs bg-gray-50 p-2 rounded">Ayşe Yılmaz, ayse@example.com, 0170 1234567</code>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={5}
              placeholder={"Ad Soyad, e-posta, telefon\nAd Soyad, e-posta, telefon"}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono"
            />
            <button
              onClick={handleAddParticipants}
              disabled={addingParticipants || !bulkText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50"
            >
              {addingParticipants && <Loader2 size={14} className="animate-spin" />} Ekle ve Anketi Gönder
            </button>
            {addResult && <p className="text-sm text-green-700 bg-green-50 p-2 rounded-lg">{addResult}</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Soru Bazlı Ortalamalar ve Dağılım (1-5)</h2>
        <div className="space-y-5">
          {report.ratingQuestions.map((rq) => (
            <div key={rq.prompt}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{rq.prompt}</span>
                <span className="text-gray-500">Ø {rq.average?.toFixed(2) ?? "—"} ({rq.count})</span>
              </div>
              <ResponsiveContainer width="100%" height={70}>
                <BarChart
                  layout="vertical"
                  data={[1, 2, 3, 4, 5].map((n) => ({ score: n, count: rq.distribution[n] ?? 0 }))}
                  margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="score" width={16} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
          {report.ratingQuestions.length === 0 && <p className="text-sm text-gray-400">Henüz puanlama cevabı yok.</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Açık Uçlu Cevaplar ({report.textAnswers.length})</h2>
        <div className="space-y-2">
          {report.textAnswers.map((a, i) => (
            <div key={i} className={`flex items-start gap-2 text-sm p-3 rounded-lg ${a.flagged ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}>
              {a.flagged ? <Flag size={14} className="mt-0.5 shrink-0 text-red-500" /> : <MessageSquare size={14} className="mt-0.5 shrink-0 text-gray-400" />}
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{a.prompt}</div>
                <div>{a.value}</div>
              </div>
            </div>
          ))}
          {report.textAnswers.length === 0 && <p className="text-sm text-gray-400">Henüz açık uçlu cevap yok.</p>}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Not: Sıralama kasıtlı olarak rastgele gösterilir ve zaman damgaları gizlenir — küçük sınıflarda kimlik
          tahmini riskini azaltmak için.
        </p>
      </div>
    </div>
  );
}
