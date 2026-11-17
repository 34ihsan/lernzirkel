import Link from "next/link";
import prisma from "@/lib/prisma";
import { listCoursesWithSurveyStats } from "@/lib/survey-reports";
import { sendCourseSurveyNow, ensureStandardQuestionsSeeded } from "@/actions/survey-admin";
import { ListChecks, Users, FileBarChart, ArrowRight, Eye, Mail, UserCog, Info } from "lucide-react";

export const metadata = { title: "Kurs Anketleri | Lernzirkel Admin" };

async function sendNow(formData: FormData) {
  "use server";
  const courseId = formData.get("courseId") as string;
  if (courseId) await sendCourseSurveyNow(courseId);
}

export default async function SurveysOverviewPage() {
  await ensureStandardQuestionsSeeded();

  const [stats, allCourses] = await Promise.all([
    listCoursesWithSurveyStats(),
    prisma.course.findMany({ select: { id: true, title: true, endDate: true, design: true }, orderBy: { endDate: "desc" } }),
  ]);

  const statsByCourseId = new Map(stats.map((s) => [s.courseId, s]));
  const instructorOf = (design: unknown) => {
    const d = (design as Record<string, unknown> | null) ?? {};
    return typeof d.instructor === "string" && d.instructor.trim() ? d.instructor : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kurs-Sonu Anketleri</h1>
          <p className="text-sm text-gray-500">Anonim eğitmen & kurs memnuniyet anketleri — gönderim, sonuçlar ve raporlar.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/surveys/questions" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <ListChecks size={16} /> Sorular
          </Link>
          <Link href="/admin/surveys/teachers" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Users size={16} /> Eğitmenler
          </Link>
          <Link href="/admin/surveys/report" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
            <FileBarChart size={16} /> Yıllık Rapor
          </Link>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex gap-3 text-sm text-sky-900">
        <Info size={18} className="shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p><strong>Kursiyer nereye ulaşır?</strong> Kişisel e-posta linki <code>/umfrage/[token]</code> adresine açılır. Aşağıdaki <Eye size={12} className="inline" /> ikonuyla her kursun kursiyerin göreceği formu önizleyebilirsiniz (önizlemede hiçbir cevap kaydedilmez).</p>
          <p><strong>Eğitmen (Lehrer) nereden eklenir?</strong> Kurs düzenleme ekranındaki &quot;Eğitmen / Sorumlu&quot; alanından (<Link href="/admin/content/Course" className="underline font-medium">Kurslar → kursu düzenle</Link>). Anket bu ismi kursun bitişinde/gönderim anında otomatik olarak yakalar.</p>
          <p><strong>Link kursiyere nasıl ulaşır?</strong> Varsayılan olarak otomatik <strong>e-posta</strong> ile (gönderici: Resend). WhatsApp/SMS için otomasyon yok — ama kurs raporunda her kursiyerin kişisel linkini görüp &quot;WhatsApp&apos;tan Gönder&quot; ile tek tıkla iletebilirsiniz.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Kurs</th>
              <th className="text-left px-4 py-3">Eğitmen</th>
              <th className="text-left px-4 py-3">Bitiş</th>
              <th className="text-center px-4 py-3">Davet</th>
              <th className="text-center px-4 py-3">Yanıt</th>
              <th className="text-center px-4 py-3">Oran</th>
              <th className="text-right px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allCourses.map((course) => {
              const s = statsByCourseId.get(course.id);
              const instructor = instructorOf(course.design);
              return (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/surveys/course/${course.id}`} className="hover:underline inline-flex items-center gap-1">
                      {course.title} <ArrowRight size={12} className="text-gray-400" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {instructor ? (
                      instructor
                    ) : (
                      <Link href={`/admin/content/Course/${course.id}`} className="inline-flex items-center gap-1 text-amber-600 hover:underline text-xs font-medium">
                        <UserCog size={12} /> Eğitmen girilmedi
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {course.endDate ? new Date(course.endDate).toLocaleDateString("de-DE") : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">{s?.invited ?? 0}</td>
                  <td className="px-4 py-3 text-center">{s?.completed ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    {s?.responseRate != null ? (
                      <span className={`font-bold ${s.responseRate >= 50 ? "text-green-600" : "text-amber-600"}`}>{s.responseRate}%</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/umfrage/kurs/${course.id}?preview=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100"
                        title="Kursiyerin göreceği anket formunu önizle (cevap kaydedilmez)"
                      >
                        <Eye size={13} /> Önizle
                      </a>
                      <form action={sendNow}>
                        <input type="hidden" name="courseId" value={course.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold hover:bg-sky-100"
                          title="Bu kurs için anket davetlerini şimdi gönder (henüz davet edilmemiş onaylı kursiyerlere, e-posta ile)"
                        >
                          <Mail size={13} /> Şimdi Gönder
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {allCourses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Henüz kurs bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
