"use server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-server";
import { dispatchCourseSurveys, resendSurveyInvite, generateToken } from "@/lib/survey";
import { STANDARD_SURVEY_QUESTIONS } from "@/lib/survey-questions";

async function audit(action: string, adminUser: string, details?: Record<string, Prisma.InputJsonValue>) {
  await prisma.auditLog.create({ data: { action, adminUser, details: details ?? {} } }).catch(() => {});
}

// ─── Soru Bankası (CRUD) ─────────────────────────────────────────────────────

export async function listSurveyQuestions() {
  return prisma.surveyQuestion.findMany({ orderBy: [{ section: "asc" }, { order: "asc" }] });
}

export interface SurveyQuestionInput {
  section: "LEHRER" | "KURS";
  type: "RATING_5" | "NPS_0_10" | "TEXT" | "YES_NO";
  prompt: string;
  translations?: { tr?: string; en?: string; ar?: string };
  isRequired: boolean;
}

export async function createSurveyQuestion(input: SurveyQuestionInput) {
  const session = await requireAdminSession();
  const maxOrder = await prisma.surveyQuestion.aggregate({
    where: { section: input.section },
    _max: { order: true },
  });
  const question = await prisma.surveyQuestion.create({
    data: { ...input, order: (maxOrder._max.order ?? 0) + 1 },
  });
  await audit("SURVEY_QUESTION_CREATE", session.name, { questionId: question.id, section: input.section });
  revalidatePath("/admin/surveys/questions");
  return question;
}

export async function updateSurveyQuestion(id: string, input: Partial<SurveyQuestionInput> & { isActive?: boolean }) {
  const session = await requireAdminSession();
  const question = await prisma.surveyQuestion.update({ where: { id }, data: input });
  await audit("SURVEY_QUESTION_UPDATE", session.name, { questionId: id });
  revalidatePath("/admin/surveys/questions");
  return question;
}

export async function deleteSurveyQuestion(id: string) {
  const session = await requireAdminSession();
  await prisma.surveyQuestion.delete({ where: { id } });
  await audit("SURVEY_QUESTION_DELETE", session.name, { questionId: id });
  revalidatePath("/admin/surveys/questions");
  return { success: true };
}

export async function reorderSurveyQuestion(id: string, direction: "up" | "down") {
  await requireAdminSession();
  const question = await prisma.surveyQuestion.findUnique({ where: { id } });
  if (!question) return { success: false };

  const siblings = await prisma.surveyQuestion.findMany({
    where: { section: question.section },
    orderBy: { order: "asc" },
  });
  const idx = siblings.findIndex((s) => s.id === id);
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= siblings.length) return { success: false };

  const target = siblings[targetIdx];
  await prisma.$transaction([
    prisma.surveyQuestion.update({ where: { id: question.id }, data: { order: target.order } }),
    prisma.surveyQuestion.update({ where: { id: target.id }, data: { order: question.order } }),
  ]);
  revalidatePath("/admin/surveys/questions");
  return { success: true };
}

/** Mevcut soru bankasını siler ve standart şablonla yeniden doldurur. */
export async function resetToStandardQuestions() {
  const session = await requireAdminSession();
  await prisma.$transaction([
    prisma.surveyQuestion.deleteMany({}),
    prisma.surveyQuestion.createMany({ data: STANDARD_SURVEY_QUESTIONS }),
  ]);
  await audit("SURVEY_QUESTIONS_RESET_STANDARD", session.name);
  revalidatePath("/admin/surveys/questions");
  return { success: true };
}

/** İlk kurulumda soru bankası boşsa standart şablonu sessizce ekler. */
export async function ensureStandardQuestionsSeeded() {
  const count = await prisma.surveyQuestion.count();
  if (count === 0) {
    await prisma.surveyQuestion.createMany({ data: STANDARD_SURVEY_QUESTIONS });
  }
}

// ─── Gönderim ────────────────────────────────────────────────────────────────

export async function sendCourseSurveyNow(courseId: string) {
  const session = await requireAdminSession();
  const result = await dispatchCourseSurveys(courseId);
  await audit("SURVEY_SEND_NOW", session.name, { courseId, ...result });
  revalidatePath("/admin/surveys");
  revalidatePath(`/admin/surveys/course/${courseId}`);
  return result;
}

/** Tek bir kişiye (e-postası daha önce başarısız olmuş veya elle istenmiş) daveti tekrar gönderir. */
export async function resendSurveyInviteNow(registrationId: string) {
  const session = await requireAdminSession();
  const result = await resendSurveyInvite(registrationId);
  await audit("SURVEY_RESEND_INVITE", session.name, {
    registrationId,
    success: result.success,
    ...(result.success ? {} : { error: result.error }),
  });
  revalidatePath("/admin/surveys");
  return result;
}

// ─── Kursiyer ekleme (çevrimdışı/elle kayıt edilenler için) ─────────────────

export interface ParticipantInput {
  name: string;
  email: string;
  phone?: string;
  language?: string;
}

/**
 * Online kayıt formu üzerinden değil, elle/kağıt üzerinden kayıt olmuş kursiyerleri
 * ankete dahil etmek için: normal Registration kaydı gibi oluşturulur (status
 * APPROVED), böylece mevcut gönderim/rapor akışının hiçbiri değişmeden aynen çalışır.
 * Aynı kurs için e-postası zaten kayıtlı olanlar atlanır. Ekleme sonrası davet
 * otomatik olarak gönderilir (ekstra bir "Şimdi Gönder" tıklamasına gerek kalmaz).
 */
export async function addCourseParticipants(courseId: string, rows: ParticipantInput[]) {
  const session = await requireAdminSession();

  let added = 0;
  let skipped = 0;

  for (const row of rows) {
    const name = row.name?.trim();
    const email = row.email?.trim().toLowerCase();
    if (!name || !email || !email.includes("@")) {
      skipped++;
      continue;
    }

    const existing = await prisma.registration.findFirst({
      where: { courseId, email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.registration.create({
      data: {
        courseId,
        name,
        email,
        phone: row.phone?.trim() || null,
        language: row.language || "de",
        status: "APPROVED",
        isWaitlisted: false,
        message: "Admin tarafından anket için elle eklendi.",
      },
    });
    added++;
  }

  const dispatchResult = added > 0 ? await dispatchCourseSurveys(courseId) : { sent: 0, failed: 0, skipped: 0 };
  await audit("SURVEY_PARTICIPANTS_ADD", session.name, { courseId, added, skipped });
  revalidatePath(`/admin/surveys/course/${courseId}`);
  revalidatePath("/admin/surveys");
  revalidatePath("/admin/registrations");

  return { added, skipped, emailsSent: dispatchResult.sent, emailsFailed: dispatchResult.failed };
}

// ─── Eğitmen rapor linki (magic link, admin oturumu gerektirmez) ────────────

export async function generateTeacherReportToken(teamMemberId: string) {
  const session = await requireAdminSession();
  const token = generateToken();
  await prisma.teamMember.update({
    where: { id: teamMemberId },
    data: { teacherReportToken: token, teacherReportTokenAt: new Date() },
  });
  await audit("SURVEY_TEACHER_TOKEN_GENERATE", session.name, { teamMemberId });
  revalidatePath("/admin/surveys/teachers");
  return { token };
}

export async function revokeTeacherReportToken(teamMemberId: string) {
  const session = await requireAdminSession();
  await prisma.teamMember.update({
    where: { id: teamMemberId },
    data: { teacherReportToken: null, teacherReportTokenAt: null },
  });
  await audit("SURVEY_TEACHER_TOKEN_REVOKE", session.name, { teamMemberId });
  revalidatePath("/admin/surveys/teachers");
  return { success: true };
}

// ─── CSV export ──────────────────────────────────────────────────────────────

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Anonim ham cevapları CSV olarak döner — hiçbir kimlik alanı içermez. */
export async function exportCourseResponsesCsv(courseId: string): Promise<string> {
  await requireAdminSession();
  const responses = await prisma.surveyResponse.findMany({
    where: { courseId },
    orderBy: { submittedAt: "asc" },
  });
  const questions = await prisma.surveyQuestion.findMany({ orderBy: [{ section: "asc" }, { order: "asc" }] });

  const header = ["submittedAt", "flagged", ...questions.map((q) => q.prompt)];
  const rows = responses.map((r) => {
    const answers = r.answers as Array<{ questionId: string; value: unknown }>;
    const byQuestionId = new Map(answers.map((a) => [a.questionId, a.value]));
    return [
      r.submittedAt.toISOString(),
      r.flagged ? "1" : "0",
      ...questions.map((q) => byQuestionId.get(q.id) ?? ""),
    ];
  });

  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}
