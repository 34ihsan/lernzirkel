import prisma from "@/lib/prisma";
import { getTeacherOwnReport } from "@/lib/survey-reports";
import { notFound } from "next/navigation";
import { Star, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Mein Umfrage-Bericht | Lernzirkel Ludwigshafen e.V.",
  robots: { index: false, follow: false },
};

export default async function TeacherReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const member = await prisma.teamMember.findUnique({ where: { teacherReportToken: token } });
  if (!member) notFound();

  const report = await getTeacherOwnReport(member.name);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Ihr anonymer Umfrage-Bericht</h1>
      <p className="text-[var(--foreground)]/60 mb-8">{member.name}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-5 text-center">
          <div className="text-3xl font-bold text-[var(--primary)]">{report.overallAverage?.toFixed(1) ?? "–"}</div>
          <div className="text-xs text-[var(--foreground)]/60 mt-1">Durchschnitt (1-5)</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-5 text-center">
          <div className="text-3xl font-bold text-[var(--primary)]">{report.responseCount}</div>
          <div className="text-xs text-[var(--foreground)]/60 mt-1">Anonyme Antworten insgesamt</div>
        </div>
      </div>

      {report.courses.length === 0 && (
        <p className="text-sm text-[var(--foreground)]/60">Für Sie liegen noch keine Umfrageantworten vor.</p>
      )}

      <div className="space-y-6">
        {report.courses.map((c) => (
          <div key={c.courseId} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">{c.title}</h2>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={16} className="fill-amber-500" />
                {c.average?.toFixed(1) ?? "–"}
              </div>
            </div>
            {c.textAnswers.length > 0 && (
              <div className="space-y-2">
                {c.textAnswers.map((text, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm bg-[var(--muted)] rounded-lg p-3">
                    <MessageSquare size={14} className="mt-0.5 shrink-0 text-[var(--foreground)]/40" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--foreground)]/40 mt-8 text-center">
        Diese Ansicht zeigt nur anonyme, aggregierte Daten — einzelne Antworten können nicht zurückverfolgt werden.
      </p>
    </div>
  );
}
