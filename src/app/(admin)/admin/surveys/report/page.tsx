import { getCategoryYearlyReport } from "@/lib/survey-reports";
import YearlyReportClient from "./YearlyReportClient";

export const metadata = { title: "Yıllık Anket Raporu | Lernzirkel Admin" };

const CATEGORY_LABELS: Record<string, string> = {
  INTEGRATION: "Entegrasyon",
  SPRACHE: "Dil",
  NACHHILFE: "Özel Ders",
  GRUNDBILDUNG: "Temel Eğitim",
  BERUFSBEZOGEN: "Mesleki",
  PRUEFUNGSVORBEREITUNG: "Sınav Hazırlık",
  ALPHABETISIERUNG: "Okuma-Yazma",
  ERSTORIENTIERUNG: "İlk Yönelim",
  FRAUENKURSE: "Kadın Kursları",
  FERIENKURSE: "Tatil Kursları",
  WEITERBILDUNG: "İleri Eğitim",
  ANDERE: "Diğer",
};

export default async function YearlyReportPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  const rows = await getCategoryYearlyReport(year);

  const totalResponses = rows.reduce((sum, r) => sum + r.responseCount, 0);
  const weightedAvg = totalResponses > 0 ? rows.reduce((sum, r) => sum + (r.avgRating ?? 0) * r.responseCount, 0) / totalResponses : null;

  return (
    <YearlyReportClient
      year={year}
      rows={rows.map((r) => ({ ...r, categoryLabel: CATEGORY_LABELS[r.category] ?? r.category }))}
      totalResponses={totalResponses}
      weightedAvg={weightedAvg}
    />
  );
}
