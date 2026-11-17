"use client";

import { useState, useTransition } from "react";
import { Link2, Copy, Trash2, Check } from "lucide-react";
import { generateTeacherReportToken, revokeTeacherReportToken } from "@/actions/survey-admin";
import type { TeacherComparisonRow } from "@/lib/survey-reports";

interface TeamMemberRow {
  id: string;
  name: string;
  email: string | null;
  teacherReportToken: string | null;
  teacherReportTokenAt: string | null;
}

export default function TeachersClient({
  comparison,
  teamMembers,
  baseUrl,
}: {
  comparison: TeacherComparisonRow[];
  teamMembers: TeamMemberRow[];
  baseUrl: string;
}) {
  const [members, setMembers] = useState(teamMembers);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate(id: string) {
    startTransition(async () => {
      const { token } = await generateTeacherReportToken(id);
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, teacherReportToken: token, teacherReportTokenAt: new Date().toISOString() } : m)));
    });
  }

  function handleRevoke(id: string) {
    if (!confirm("Bu eğitmenin rapor linkini iptal etmek istiyor musunuz?")) return;
    startTransition(async () => {
      await revokeTeacherReportToken(id);
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, teacherReportToken: null, teacherReportTokenAt: null } : m)));
    });
  }

  function handleCopy(id: string, link: string) {
    navigator.clipboard?.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Eğitmen Karşılaştırma</h1>
        <p className="text-sm text-gray-500">Eğitmen adı (kurs içinde girilen metin) üzerinden kurslar arası ortalama karşılaştırması.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Eğitmen</th>
              <th className="text-center px-4 py-3">Kurs Sayısı</th>
              <th className="text-center px-4 py-3">Yanıt Sayısı</th>
              <th className="text-center px-4 py-3">Ortalama Puan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparison.map((row) => (
              <tr key={row.teacherName} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.teacherName}</td>
                <td className="px-4 py-3 text-center">{row.courseCount}</td>
                <td className="px-4 py-3 text-center">{row.responseCount}</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: (row.avgRating ?? 0) >= 4 ? "#16a34a" : (row.avgRating ?? 0) >= 3 ? "#d97706" : "#dc2626" }}>
                  {row.avgRating?.toFixed(2) ?? "—"}
                </td>
              </tr>
            ))}
            {comparison.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Henüz yeterli veri yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-1">Eğitmen Rapor Linkleri</h2>
        <p className="text-sm text-gray-500 mb-3">
          Her eğitmene, sadece kendi (anonim/aggregate) sonuçlarını gösteren ayrı bir link oluşturabilirsiniz. Bu
          link admin paneli oturumu gerektirmez — isim eşleşmesi kurs içindeki &quot;Eğitmen&quot; alanına göre yapılır.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {members.map((m) => {
            const link = m.teacherReportToken ? `${baseUrl}/lehrer-rapor/${m.teacherReportToken}` : null;
            return (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{m.name}</div>
                  {link ? (
                    <code className="text-xs text-gray-500 truncate block">{link}</code>
                  ) : (
                    <span className="text-xs text-gray-400">Henüz link oluşturulmadı.</span>
                  )}
                </div>
                {link && (
                  <button onClick={() => handleCopy(m.id, link)} className="p-2 text-gray-400 hover:text-sky-600" title="Kopyala">
                    {copiedId === m.id ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                  </button>
                )}
                <button
                  onClick={() => handleGenerate(m.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold hover:bg-sky-100 disabled:opacity-50"
                >
                  <Link2 size={13} /> {m.teacherReportToken ? "Yenile" : "Oluştur"}
                </button>
                {m.teacherReportToken && (
                  <button onClick={() => handleRevoke(m.id)} disabled={isPending} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
          {members.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">Henüz e-postalı ekip üyesi yok.</div>}
        </div>
      </div>
    </div>
  );
}
