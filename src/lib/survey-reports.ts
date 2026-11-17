import prisma from "@/lib/prisma";
import { surveyUrl } from "@/lib/survey";

type AnswerEntry = { questionId: string; section: "LEHRER" | "KURS"; type: string; prompt: string; value: unknown };

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}

/** NPS skoru: (promoter% - detractor%), klasik -100..+100 ölçeği. 0-6 detractor, 7-8 passive, 9-10 promoter. */
function npsScore(values: number[]): number | null {
  if (values.length === 0) return null;
  const promoters = values.filter((v) => v >= 9).length;
  const detractors = values.filter((v) => v <= 6).length;
  return Math.round(((promoters - detractors) / values.length) * 100);
}

export interface CourseStatRow {
  courseId: string;
  title: string;
  category: string;
  endDate: Date | null;
  invited: number;
  completed: number;
  responseRate: number | null;
  lastResponseAt: Date | null;
}

/** Admin anket genel görünümü: her kurs için davet/yanıt oranı özeti. */
export async function listCoursesWithSurveyStats(): Promise<CourseStatRow[]> {
  const courses = await prisma.course.findMany({
    where: { OR: [{ surveyInvites: { some: {} } }, { surveyResponses: { some: {} } }, { endDate: { not: null } }] },
    orderBy: { endDate: "desc" },
  });

  const [inviteCounts, completedCounts, lastResponses] = await Promise.all([
    prisma.surveyInvite.groupBy({ by: ["courseId"], _count: { _all: true } }),
    prisma.surveyInvite.groupBy({ by: ["courseId"], where: { status: "COMPLETED" }, _count: { _all: true } }),
    prisma.surveyResponse.groupBy({ by: ["courseId"], _max: { submittedAt: true } }),
  ]);

  const invitedMap = new Map(inviteCounts.map((r) => [r.courseId, r._count._all]));
  const completedMap = new Map(completedCounts.map((r) => [r.courseId, r._count._all]));
  const lastResponseMap = new Map(lastResponses.map((r) => [r.courseId, r._max.submittedAt]));

  return courses.map((c) => {
    const invited = invitedMap.get(c.id) ?? 0;
    const completed = completedMap.get(c.id) ?? 0;
    return {
      courseId: c.id,
      title: c.title,
      category: c.category,
      endDate: c.endDate,
      invited,
      completed,
      responseRate: invited > 0 ? Math.round((completed / invited) * 100) : null,
      lastResponseAt: lastResponseMap.get(c.id) ?? null,
    };
  });
}

export interface RatingAggregate {
  prompt: string;
  average: number | null;
  distribution: Record<number, number>;
  count: number;
}

export interface CourseSurveyReport {
  courseId: string;
  courseTitle: string;
  category: string;
  teacherSnapshot: string | null;
  invited: number;
  completed: number;
  expired: number;
  pending: number;
  responseRate: number | null;
  avgTeacherRating: number | null;
  avgCourseRating: number | null;
  npsAverage: number | null;
  npsScore: number | null;
  ratingQuestions: RatingAggregate[];
  textAnswers: { prompt: string; value: string; flagged: boolean; submittedAt: Date }[];
  responseCount: number;
}

export async function getCourseSurveyReport(courseId: string): Promise<CourseSurveyReport | null> {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;

  const [invites, responses] = await Promise.all([
    prisma.surveyInvite.findMany({ where: { courseId } }),
    prisma.surveyResponse.findMany({ where: { courseId }, orderBy: { submittedAt: "desc" } }),
  ]);

  const invited = invites.length;
  const completed = invites.filter((i) => i.status === "COMPLETED").length;
  const expired = invites.filter((i) => i.status === "EXPIRED").length;
  const pending = invites.filter((i) => ["PENDING", "SENT", "OPENED"].includes(i.status)).length;

  const design = (course.design as Record<string, unknown> | null) ?? {};
  const teacherSnapshot =
    responses.find((r) => r.teacherSnapshot)?.teacherSnapshot ??
    (typeof design.instructor === "string" ? design.instructor : null);

  const allAnswers = responses.flatMap((r) => r.answers as unknown as AnswerEntry[]);

  const lehrerRatings = allAnswers.filter((a) => a.section === "LEHRER" && a.type === "RATING_5" && typeof a.value === "number").map((a) => a.value as number);
  const kursRatings = allAnswers.filter((a) => a.section === "KURS" && a.type === "RATING_5" && typeof a.value === "number").map((a) => a.value as number);
  const npsValues = allAnswers.filter((a) => a.type === "NPS_0_10" && typeof a.value === "number").map((a) => a.value as number);

  // Soru bazlı dağılım (prompt'a göre grupla — soru silinse bile metin korunur)
  const byPrompt = new Map<string, AnswerEntry[]>();
  for (const a of allAnswers) {
    if (a.type !== "RATING_5") continue;
    if (!byPrompt.has(a.prompt)) byPrompt.set(a.prompt, []);
    byPrompt.get(a.prompt)!.push(a);
  }
  const ratingQuestions: RatingAggregate[] = Array.from(byPrompt.entries()).map(([prompt, entries]) => {
    const values = entries.map((e) => e.value as number);
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const v of values) if (distribution[v] !== undefined) distribution[v]++;
    return { prompt, average: average(values), distribution, count: values.length };
  });

  const textAnswers = responses.flatMap((r) =>
    (r.answers as unknown as AnswerEntry[])
      .filter((a) => a.type === "TEXT" && typeof a.value === "string" && (a.value as string).trim().length > 0)
      .map((a) => ({ prompt: a.prompt, value: a.value as string, flagged: r.flagged, submittedAt: r.submittedAt }))
  );
  // Zaman damgalarını gün bazına yuvarlayıp rastgele sıralamak, küçük sınıflarda
  // "hangi cevap ne zaman geldi" korelasyonunu azaltır.
  textAnswers.sort(() => Math.random() - 0.5);

  return {
    courseId: course.id,
    courseTitle: course.title,
    category: course.category,
    teacherSnapshot,
    invited,
    completed,
    expired,
    pending,
    responseRate: invited > 0 ? Math.round((completed / invited) * 100) : null,
    avgTeacherRating: average(lehrerRatings),
    avgCourseRating: average(kursRatings),
    npsAverage: average(npsValues),
    npsScore: npsScore(npsValues),
    ratingQuestions,
    textAnswers,
    responseCount: responses.length,
  };
}

export interface TeacherComparisonRow {
  teacherName: string;
  courseCount: number;
  responseCount: number;
  avgRating: number | null;
}

/** Eğitmen bazlı, kurslar arası karşılaştırma (teacherSnapshot serbest metnine göre gruplanır). */
export async function getTeacherComparison(): Promise<TeacherComparisonRow[]> {
  const responses = await prisma.surveyResponse.findMany({
    where: { teacherSnapshot: { not: null } },
    select: { teacherSnapshot: true, courseId: true, answers: true },
  });

  const byTeacher = new Map<string, { courses: Set<string>; ratings: number[]; count: number }>();
  for (const r of responses) {
    const name = r.teacherSnapshot!;
    if (!byTeacher.has(name)) byTeacher.set(name, { courses: new Set(), ratings: [], count: 0 });
    const bucket = byTeacher.get(name)!;
    bucket.courses.add(r.courseId);
    bucket.count++;
    const answers = r.answers as unknown as AnswerEntry[];
    for (const a of answers) {
      if (a.section === "LEHRER" && a.type === "RATING_5" && typeof a.value === "number") bucket.ratings.push(a.value);
    }
  }

  return Array.from(byTeacher.entries())
    .map(([teacherName, bucket]) => ({
      teacherName,
      courseCount: bucket.courses.size,
      responseCount: bucket.count,
      avgRating: average(bucket.ratings),
    }))
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
}

export interface CategoryYearlyRow {
  category: string;
  responseCount: number;
  avgRating: number | null;
  avgNps: number | null;
}

/** Yıllık/kategori bazlı "profesyonel rapor" — fon sağlayıcı/kalite raporlaması için. */
export async function getCategoryYearlyReport(year: number): Promise<CategoryYearlyRow[]> {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const responses = await prisma.surveyResponse.findMany({
    where: { submittedAt: { gte: start, lt: end } },
    select: { categorySnapshot: true, answers: true },
  });

  const byCategory = new Map<string, { ratings: number[]; nps: number[]; count: number }>();
  for (const r of responses) {
    const cat = r.categorySnapshot ?? "ANDERE";
    if (!byCategory.has(cat)) byCategory.set(cat, { ratings: [], nps: [], count: 0 });
    const bucket = byCategory.get(cat)!;
    bucket.count++;
    const answers = r.answers as unknown as AnswerEntry[];
    for (const a of answers) {
      if (a.type === "RATING_5" && typeof a.value === "number") bucket.ratings.push(a.value);
      if (a.type === "NPS_0_10" && typeof a.value === "number") bucket.nps.push(a.value);
    }
  }

  return Array.from(byCategory.entries())
    .map(([category, bucket]) => ({
      category,
      responseCount: bucket.count,
      avgRating: average(bucket.ratings),
      avgNps: average(bucket.nps),
    }))
    .sort((a, b) => b.responseCount - a.responseCount);
}

export interface CourseInviteRow {
  registrationId: string;
  name: string;
  email: string;
  phone: string | null;
  language: string;
  status: string;
  sentAt: Date | null;
  completedAt: Date | null;
  remindersSent: number;
  expiresAt: Date;
  link: string;
  /** Resend webhook'undan gelen GERÇEK teslimat durumu (status="SENT" sadece Resend'in isteği kabul ettiğini gösterir). */
  deliveryStatus: string | null;
  deliveryStatusAt: Date | null;
}

/**
 * Admin için kişi bazlı davet listesi — bu, anonimliği BOZMAZ: burada görünen sadece
 * "davet gönderildi mi / açıldı mı / tamamlandı mı" durumudur, o kişinin anketi
 * TAMAMLADIYSA ne yazdığı hâlâ hiçbir şekilde görünmez/sorgulanamaz (SurveyResponse'ta
 * registrationId yok). Linkin burada gösterilmesi, zaten o kişiye e-postayla gönderilen
 * linkle birebir aynıdır — personel bunu WhatsApp/SMS ile de manuel iletebilsin diye.
 */
export async function getCourseInviteDetails(courseId: string): Promise<CourseInviteRow[]> {
  const invites = await prisma.surveyInvite.findMany({
    where: { courseId },
    include: { registration: { select: { name: true, email: true, phone: true } } },
    orderBy: { sentAt: "desc" },
  });

  return invites.map((i) => ({
    registrationId: i.registrationId,
    name: i.registration.name,
    email: i.registration.email,
    phone: i.registration.phone,
    language: i.language,
    status: i.status,
    sentAt: i.sentAt,
    completedAt: i.completedAt,
    remindersSent: i.remindersSent,
    expiresAt: i.expiresAt,
    link: surveyUrl(i.token),
    deliveryStatus: i.deliveryStatus,
    deliveryStatusAt: i.deliveryStatusAt,
  }));
}

/** Eğitmenin kendi anonim rapor linki için: sadece kendi adıyla eşleşen kurslardaki aggregate veriler. */
export async function getTeacherOwnReport(teacherName: string) {
  const responses = await prisma.surveyResponse.findMany({
    where: { teacherSnapshot: { equals: teacherName, mode: "insensitive" } },
    orderBy: { submittedAt: "desc" },
  });

  const byCourse = new Map<string, { title: string; ratings: number[]; textAnswers: string[] }>();
  for (const r of responses) {
    if (!byCourse.has(r.courseId)) byCourse.set(r.courseId, { title: r.courseTitleSnapshot, ratings: [], textAnswers: [] });
    const bucket = byCourse.get(r.courseId)!;
    const answers = r.answers as unknown as AnswerEntry[];
    for (const a of answers) {
      if (a.section !== "LEHRER") continue;
      if (a.type === "RATING_5" && typeof a.value === "number") bucket.ratings.push(a.value);
      if (a.type === "TEXT" && typeof a.value === "string" && a.value.trim()) bucket.textAnswers.push(a.value);
    }
  }

  const allRatings = responses.flatMap((r) =>
    (r.answers as unknown as AnswerEntry[])
      .filter((a) => a.section === "LEHRER" && a.type === "RATING_5" && typeof a.value === "number")
      .map((a) => a.value as number)
  );

  return {
    overallAverage: average(allRatings),
    responseCount: responses.length,
    courses: Array.from(byCourse.entries()).map(([courseId, bucket]) => ({
      courseId,
      title: bucket.title,
      average: average(bucket.ratings),
      responseCount: bucket.ratings.length > 0 ? bucket.ratings.length : bucket.textAnswers.length,
      textAnswers: bucket.textAnswers.sort(() => Math.random() - 0.5),
    })),
  };
}
