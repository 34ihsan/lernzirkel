"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkLowScoreAlert, containsFlagKeyword } from "@/lib/survey";
import { rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";

export interface PublicSurveyQuestion {
  id: string;
  section: "LEHRER" | "KURS";
  type: "RATING_5" | "NPS_0_10" | "TEXT" | "YES_NO";
  prompt: string;
  isRequired: boolean;
  order: number;
}

type SurveyGate =
  | { ok: true; language: string; courseTitle: string; teacherSnapshot: string | null; questions: PublicSurveyQuestion[] }
  | { ok: false; reason: "NOT_FOUND" | "EXPIRED" | "COMPLETED" };

function localize(prompt: string, translations: unknown, language: string): string {
  if (language === "de" || !translations || typeof translations !== "object") return prompt;
  const t = translations as Record<string, string | undefined>;
  return t[language] || prompt;
}

/** Token'ı doğrular, ilk açılışta davet durumunu OPENED'a çevirir. Anket formunu getirir. */
export async function getSurveyByToken(token: string): Promise<SurveyGate> {
  const invite = await prisma.surveyInvite.findUnique({
    where: { token },
    include: { course: { select: { title: true } } },
  });

  if (!invite) return { ok: false, reason: "NOT_FOUND" };
  if (invite.status === "COMPLETED") return { ok: false, reason: "COMPLETED" };
  if (invite.status === "EXPIRED" || invite.expiresAt < new Date()) return { ok: false, reason: "EXPIRED" };

  if (invite.status === "SENT") {
    await prisma.surveyInvite.update({ where: { id: invite.id }, data: { status: "OPENED", openedAt: new Date() } });
  }

  const questions = await prisma.surveyQuestion.findMany({
    where: { isActive: true },
    orderBy: [{ section: "asc" }, { order: "asc" }],
  });

  return {
    ok: true,
    language: invite.language,
    courseTitle: invite.course.title,
    teacherSnapshot: invite.teacherSnapshot,
    questions: questions.map((q) => ({
      id: q.id,
      section: q.section as "LEHRER" | "KURS",
      type: q.type as PublicSurveyQuestion["type"],
      prompt: localize(q.prompt, q.translations, invite.language),
      isRequired: q.isRequired,
      order: q.order,
    })),
  };
}

export interface SurveyAnswerInput {
  questionId: string;
  value: number | string | boolean;
}

/**
 * Anket cevabını kaydeder. KRİTİK: SurveyResponse hiçbir şekilde registrationId/email
 * içermez — token sadece tek-kullanımlık doğrulama için kullanılır, cevapla birlikte
 * hiçbir tabloya yazılmaz. updateMany'nin status filtresi, aynı token ile eşzamanlı
 * iki gönderimi (çift kayıt / yarış durumu) atomik olarak engeller.
 */
export async function submitSurveyResponse(
  token: string,
  answers: SurveyAnswerInput[],
  turnstileToken: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const captchaValid = await verifyTurnstileToken(turnstileToken);
  if (!captchaValid) {
    return { success: false, error: "CAPTCHA-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  const invite = await prisma.surveyInvite.findUnique({
    where: { token },
    include: { course: { select: { id: true, title: true, category: true } } },
  });
  if (!invite) return { success: false, error: "Umfrage nicht gefunden." };
  if (invite.expiresAt < new Date()) return { success: false, error: "Diese Umfrage ist abgelaufen." };

  const questions = await prisma.surveyQuestion.findMany({
    where: { id: { in: answers.map((a) => a.questionId) } },
  });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const requiredQuestions = await prisma.surveyQuestion.findMany({ where: { isActive: true, isRequired: true } });
  const answeredIds = new Set(answers.map((a) => a.questionId));
  const missingRequired = requiredQuestions.some((q) => !answeredIds.has(q.id));
  if (missingRequired) {
    return { success: false, error: "Bitte beantworten Sie alle erforderlichen Fragen." };
  }

  let flagged = false;
  const snapshotAnswers = answers.map((a) => {
    const q = questionMap.get(a.questionId);
    if (q?.type === "TEXT" && typeof a.value === "string" && containsFlagKeyword(a.value)) {
      flagged = true;
    }
    return {
      questionId: a.questionId,
      section: q?.section ?? "KURS",
      type: q?.type ?? "TEXT",
      prompt: q?.prompt ?? "",
      value: a.value,
    };
  });

  // Atomik "tek kullanım" koruması: sadece hâlâ PENDING/SENT/OPENED durumundaki bir
  // davet COMPLETED'e çevrilebilir. count === 0 ise token zaten kullanılmış/geçersiz.
  const updateResult = await prisma.surveyInvite.updateMany({
    where: { id: invite.id, status: { in: ["PENDING", "SENT", "OPENED"] } },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  if (updateResult.count === 0) {
    return { success: false, error: "Diese Umfrage wurde bereits ausgefüllt." };
  }

  await prisma.surveyResponse.create({
    data: {
      courseId: invite.course.id,
      courseTitleSnapshot: invite.course.title,
      categorySnapshot: invite.course.category,
      teacherSnapshot: invite.teacherSnapshot,
      language: invite.language,
      answers: snapshotAnswers,
      flagged,
    },
  });

  await checkLowScoreAlert(invite.course.id);

  return { success: true };
}

// ─── Yerinde ("walk-in") QR anketi ───────────────────────────────────────────
// E-postayla kişisel davet almayan kursiyerler için: sınıfta asılan bir QR kod,
// herkesin aynı (çoklu kullanımlı) linki açıp doldurabildiği bir giriş sunar.
// Kişisel token olmadığı için burada "tek kullanım" koruması YOK — ama zaten
// hiçbir kimlik bilgisi toplanmadığından bu, anonimliği daha da güçlendirir.

export async function getWalkInSurveyForm(
  courseId: string
): Promise<{ ok: true; courseTitle: string; teacherSnapshot: string | null; questions: PublicSurveyQuestion[] } | { ok: false }> {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { ok: false };

  const design = (course.design as Record<string, unknown> | null) ?? {};
  const teacherSnapshot = typeof design.instructor === "string" ? design.instructor : null;

  const questions = await prisma.surveyQuestion.findMany({
    where: { isActive: true },
    orderBy: [{ section: "asc" }, { order: "asc" }],
  });

  return {
    ok: true,
    courseTitle: course.title,
    teacherSnapshot,
    questions: questions.map((q) => ({
      id: q.id,
      section: q.section as "LEHRER" | "KURS",
      type: q.type as PublicSurveyQuestion["type"],
      prompt: q.prompt,
      isRequired: q.isRequired,
      order: q.order,
    })),
  };
}

export async function submitWalkInSurveyResponse(
  courseId: string,
  answers: SurveyAnswerInput[],
  turnstileToken: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const captchaValid = await verifyTurnstileToken(turnstileToken);
  if (!captchaValid) {
    return { success: false, error: "CAPTCHA-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  // Tek kullanımlık token koruması olmadığı için (bilinçli olarak — çoklu kullanıma açık
  // QR girişi) burada IP başına basit bir hız sınırı ekleniyor; IP cevapla birlikte
  // KAYDEDİLMEZ, sadece bu anlık kontrol için kullanılır.
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown-ip";
  const limited = await rateLimit(`survey-walkin:${ip}`, 8, 600);
  if (!limited.success) {
    await logSecurityEvent("security_rate_limited", { route: "/umfrage/kurs", ip });
    return { success: false, error: "Zu viele Einreichungen. Bitte versuchen Sie es später erneut." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { success: false, error: "Kurs nicht gefunden." };

  const design = (course.design as Record<string, unknown> | null) ?? {};
  const teacherSnapshot = typeof design.instructor === "string" ? design.instructor : null;

  const questions = await prisma.surveyQuestion.findMany({ where: { id: { in: answers.map((a) => a.questionId) } } });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let flagged = false;
  const snapshotAnswers = answers.map((a) => {
    const q = questionMap.get(a.questionId);
    if (q?.type === "TEXT" && typeof a.value === "string" && containsFlagKeyword(a.value)) flagged = true;
    return { questionId: a.questionId, section: q?.section ?? "KURS", type: q?.type ?? "TEXT", prompt: q?.prompt ?? "", value: a.value };
  });

  await prisma.surveyResponse.create({
    data: {
      courseId: course.id,
      courseTitleSnapshot: course.title,
      categorySnapshot: course.category,
      teacherSnapshot,
      language: "de",
      answers: snapshotAnswers,
      flagged,
    },
  });

  await checkLowScoreAlert(course.id);
  return { success: true };
}
