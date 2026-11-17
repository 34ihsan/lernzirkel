"use client";

import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Printer, Calendar } from "lucide-react";

const CHART_COLOR = "#0F4761";
const CHART_COLOR_2 = "#e63946";

interface Row {
  category: string;
  categoryLabel: string;
  responseCount: number;
  avgRating: number | null;
  avgNps: number | null;
}

export default function YearlyReportClient({
  year,
  rows,
  totalResponses,
  weightedAvg,
}: {
  year: number;
  rows: Row[];
  totalResponses: number;
  weightedAvg: number | null;
}) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6 print:p-6">
      <div className="flex items-center justify-between print:block">
        <div>
          <h1 className="text-2xl font-bold">Yıllık Kalite Raporu</h1>
          <p className="text-sm text-gray-500">Kategori bazında memnuniyet özeti — fon sağlayıcı / kalite raporlaması için.</p>
        </div>
        <div className="flex gap-2 items-center print:hidden">
          <form className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-400" />
            <select
              name="year"
              defaultValue={year}
              onChange={(e) => {
                router.push(`/admin/surveys/report?year=${e.target.value}`);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </form>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
            <Printer size={15} /> Yazdır
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">{year}</div>
          <div className="text-xs text-gray-500 mt-1">Rapor Yılı</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">{totalResponses}</div>
          <div className="text-xs text-gray-500 mt-1">Toplam Anonim Yanıt</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: CHART_COLOR }}>{weightedAvg?.toFixed(2) ?? "—"}</div>
          <div className="text-xs text-gray-500 mt-1">Genel Ağırlıklı Ortalama</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Kategori Bazında Memnuniyet</h2>
        <ResponsiveContainer width="100%" height={Math.max(240, rows.length * 50)}>
          <BarChart layout="vertical" data={rows} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="categoryLabel" width={120} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgRating" name="Ortalama Puan (1-5)" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Kategori</th>
              <th className="text-center px-4 py-3">Yanıt</th>
              <th className="text-center px-4 py-3">Ortalama Puan</th>
              <th className="text-center px-4 py-3">Ortalama NPS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.category}>
                <td className="px-4 py-3 font-medium">{r.categoryLabel}</td>
                <td className="px-4 py-3 text-center">{r.responseCount}</td>
                <td className="px-4 py-3 text-center" style={{ color: CHART_COLOR }}>{r.avgRating?.toFixed(2) ?? "—"}</td>
                <td className="px-4 py-3 text-center" style={{ color: CHART_COLOR_2 }}>{r.avgNps?.toFixed(1) ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">{year} yılı için henüz veri yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
