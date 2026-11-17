import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/seo";
import { containsFlagKeyword } from "@/lib/survey-questions";

// ─── Sabitler ────────────────────────────────────────────────────────────────

const INVITE_VALID_DAYS = 60; // token bu kadar gün sonra EXPIRED olur
const REMINDER_AFTER_DAYS = 5; // ilk hatırlatma, davetten bu kadar gün sonra
const REMINDER_INTERVAL_DAYS = 5; // hatırlatmalar arası minimum süre
const MAX_REMINDERS = 2;
const INVITE_RETENTION_MONTHS = 24; // GDPR: kimlikli davet kaydı bu süre sonra silinir
const LOW_SCORE_MIN_RESPONSES = 3; // uyarı göndermeden önce minimum örnek sayısı (yanlış alarmı önler)
const LOW_SCORE_THRESHOLD_5 = 3.0; // 1-5 ölçek ortalaması bu değerin altındaysa uyar
const LOW_SCORE_THRESHOLD_NPS = 5.0; // 0-10 ölçek ortalaması bu değerin altındaysa uyar

function getBaseUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

export function surveyUrl(token: string): string {
  return `${getBaseUrl()}/umfrage/${token}`;
}

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type SurveyLang = "de" | "tr" | "en" | "ar";

function pickLanguage(lang: string | null | undefined): SurveyLang {
  return lang === "tr" || lang === "en" || lang === "ar" ? lang : "de";
}

function inviteEmailContent(courseTitle: string, name: string, lang: SurveyLang, url: string, kind: "invite" | "reminder") {
  const subjects: Record<SurveyLang, Record<"invite" | "reminder", string>> = {
    de: { invite: `Ihre Umfrage wartet: ${courseTitle}`, reminder: `Erinnerung: Umfrage zu ${courseTitle}` },
    tr: { invite: `Anketiniz bekliyor: ${courseTitle}`, reminder: `Hatırlatma: ${courseTitle} anketi` },
    en: { invite: `Your survey is waiting: ${courseTitle}`, reminder: `Reminder: survey for ${courseTitle}` },
    ar: { invite: `استبيانك في انتظارك: ${courseTitle}`, reminder: `تذكير: استبيان ${courseTitle}` },
  };
  const subject = subjects[lang][kind];

  const intros: Record<SurveyLang, Record<"invite" | "reminder", string>> = {
    de: {
      invite: `Sie haben den Kurs <strong>${courseTitle}</strong> abgeschlossen. Teilen Sie uns gerne Ihre Erfahrung mit.`,
      reminder: `Sie haben unsere Umfrage zum Kurs <strong>${courseTitle}</strong> noch nicht ausgefüllt. Es ist noch Zeit!`,
    },
    tr: {
      invite: `<strong>${courseTitle}</strong> kursunu tamamladınız. Deneyiminizi bizimle paylaşır mısınız?`,
      reminder: `<strong>${courseTitle}</strong> kursu için anketimizi henüz doldurmadınız. Hâlâ zamanınız var!`,
    },
    en: {
      invite: `You have completed the course <strong>${courseTitle}</strong>. We would love to hear about your experience.`,
      reminder: `You haven't filled out our survey for <strong>${courseTitle}</strong> yet. There's still time!`,
    },
    ar: {
      invite: `لقد أكملت دورة <strong>${courseTitle}</strong>. نود معرفة تجربتك معنا.`,
      reminder: `لم تقم بتعبئة استبياننا الخاص بدورة <strong>${courseTitle}</strong> بعد. لا يزال هناك وقت!`,
    },
  };
  const intro = intros[lang][kind];

  const privacyNotes: Record<SurveyLang, string> = {
    de: "Diese Umfrage ist vollständig anonym — Ihre Antworten können in keiner Weise mit Ihrer Identität verknüpft werden.",
    tr: "Bu anket tamamen anonimdir — cevaplarınız kimliğinizle hiçbir şekilde eşleştirilmez.",
    en: "This survey is completely anonymous — your answers can never be linked to your identity.",
    ar: "هذا الاستبيان مجهول الهوية تمامًا — لا يمكن ربط إجاباتك بهويتك بأي شكل.",
  };
  const privacyNote = privacyNotes[lang];

  const ctas: Record<SurveyLang, string> = { de: "Zur Umfrage", tr: "Ankete Katıl", en: "Go to survey", ar: "الذهاب إلى الاستبيان" };
  const greetings: Record<SurveyLang, string> = { de: "Hallo", tr: "Merhaba", en: "Hello", ar: "مرحبًا" };
  const signOffs: Record<SurveyLang, string> = {
    de: "Mit freundlichen Grüßen,",
    tr: "Saygılarımızla,",
    en: "Best regards,",
    ar: "مع خالص التحيات،",
  };
  const cta = ctas[lang];
  const greeting = greetings[lang];
  const signOff = signOffs[lang];

  const html = `
    <h2>${greeting} ${name},</h2>
    <p>${intro}</p>
    <p style="margin: 24px 0;">
      <a href="${url}" style="background:#0F4761;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">${cta}</a>
    </p>
    <p style="font-size: 13px; color: #666;">${privacyNote}</p>
    <br/>
    <p>${signOff}</p>
    <p>Ihr Lernzirkel-Team</p>
  `;

  return { subject, html };
}

// ─── Davet gönderimi ─────────────────────────────────────────────────────────

/**
 * Bir kurs için henüz davet edilmemiş, onaylı/iletişime geçilmiş (bekleme listesinde
 * olmayan) kursiyerlere anket daveti oluşturur ve e-posta gönderir. Aynı kayıt için
 * ikinci kez çağrılırsa (registrationId @unique) zaten davet edilenleri atlar.
 */
export async function dispatchCourseSurveys(courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { sent: 0, failed: 0, skipped: 0 };

  const design = (course.design as Record<string, unknown> | null) ?? {};
  const teacherSnapshot = typeof design.instructor === "string" ? design.instructor : null;

  const registrations = await prisma.registration.findMany({
    where: {
      courseId,
      status: { in: ["APPROVED", "CONTACTED"] },
      isWaitlisted: false,
      surveyInvite: null,
    },
  });

  let sent = 0;
  let failed = 0;
  const expiresAt = new Date(Date.now() + INVITE_VALID_DAYS * 24 * 60 * 60 * 1000);

  for (const reg of registrations) {
    const token = generateToken();
    const lang = pickLanguage(reg.language);

    let invite;
    try {
      // Önce PENDING olarak oluşturulur; e-posta gerçekten gitti mi sonra belirlenir.
      // Böylece Resend hata verse bile davet "gönderildi" diye yanlış işaretlenmez
      // ve bir dahaki "Şimdi Gönder"/cron çalışmasında tekrar denenebilir.
      invite = await prisma.surveyInvite.create({
        data: { token, courseId, registrationId: reg.id, teacherSnapshot, language: lang, status: "PENDING", expiresAt },
      });
    } catch {
      // registrationId zaten davet edilmiş (yarış durumu) — atla
      continue;
    }

    const { subject, html } = inviteEmailContent(course.title, reg.name, lang, surveyUrl(token), "invite");
    const result = await sendEmail({ to: reg.email, subject, html });

    if (result.success) {
      await prisma.surveyInvite.update({
        where: { id: invite.id },
        data: { status: "SENT", sentAt: new Date(), resendEmailId: result.id ?? null, deliveryStatus: null, deliveryStatusAt: null },
      });
      sent++;
    } else {
      await prisma.surveyInvite.update({ where: { id: invite.id }, data: { status: "FAILED" } });
      failed++;
    }
  }

  return { sent, failed, skipped: registrations.length - sent - failed };
}

/** E-posta gönderimi (API hatası, geçersiz adres vb.) başarısız olmuş davetleri tekrar dener. */
export async function retryFailedSurveyInvites() {
  const candidates = await prisma.surveyInvite.findMany({
    where: { status: { in: ["FAILED", "PENDING"] }, expiresAt: { gt: new Date() } },
    include: { registration: true, course: { select: { title: true } } },
  });

  let retried = 0;
  for (const invite of candidates) {
    const lang = pickLanguage(invite.language);
    const { subject, html } = inviteEmailContent(invite.course.title, invite.registration.name, lang, surveyUrl(invite.token), "invite");
    const result = await sendEmail({ to: invite.registration.email, subject, html });
    if (result.success) {
      await prisma.surveyInvite.update({
        where: { id: invite.id },
        data: { status: "SENT", sentAt: new Date(), resendEmailId: result.id ?? null, deliveryStatus: null, deliveryStatusAt: null },
      });
      retried++;
    }
  }
  return { retried, stillFailing: candidates.length - retried };
}

/** Tek bir kişiye (örn. admin panelinden "Yeniden Gönder") anket davetini tekrar e-postalar. */
export async function resendSurveyInvite(registrationId: string) {
  const invite = await prisma.surveyInvite.findUnique({
    where: { registrationId },
    include: { registration: true, course: { select: { title: true } } },
  });
  if (!invite) return { success: false as const, error: "Davet bulunamadı." };
  if (invite.status === "COMPLETED") return { success: false as const, error: "Bu kişi anketi zaten doldurdu." };

  const lang = pickLanguage(invite.language);
  const { subject, html } = inviteEmailContent(invite.course.title, invite.registration.name, lang, surveyUrl(invite.token), "invite");
  const result = await sendEmail({ to: invite.registration.email, subject, html });

  await prisma.surveyInvite.update({
    where: { id: invite.id },
    data: result.success
      ? { status: "SENT", sentAt: new Date(), resendEmailId: result.id ?? null, deliveryStatus: null, deliveryStatusAt: null }
      : { status: "FAILED" },
  });

  return result.success ? { success: true as const } : { success: false as const, error: "E-posta gönderilemedi." };
}

/** Süresi dolmamış, henüz tamamlanmamış tüm biten kurslar için otomatik davet gönderir (cron). */
export async function dispatchDueCourseSurveys() {
  const now = new Date();
  const dueCourses = await prisma.course.findMany({
    where: { endDate: { lte: now, not: null } },
    select: { id: true },
  });

  let totalSent = 0;
  for (const c of dueCourses) {
    const result = await dispatchCourseSurveys(c.id);
    totalSent += result.sent;
  }
  return { coursesChecked: dueCourses.length, invitesSent: totalSent };
}

/** 5+ gün yanıtsız davetlere, en fazla 2 kez, 5 günde bir hatırlatma gönderir. */
export async function sendSurveyReminders() {
  const now = new Date();
  const reminderCutoff = new Date(now.getTime() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000);

  const candidates = await prisma.surveyInvite.findMany({
    where: {
      status: { in: ["SENT", "OPENED"] },
      completedAt: null,
      expiresAt: { gt: now },
      remindersSent: { lt: MAX_REMINDERS },
      sentAt: { lte: reminderCutoff },
      OR: [
        { lastReminderAt: null },
        { lastReminderAt: { lte: new Date(now.getTime() - REMINDER_INTERVAL_DAYS * 24 * 60 * 60 * 1000) } },
      ],
    },
    include: { registration: true, course: { select: { title: true } } },
  });

  let sent = 0;
  for (const invite of candidates) {
    const lang = pickLanguage(invite.language);
    const { subject, html } = inviteEmailContent(
      invite.course.title,
      invite.registration.name,
      lang,
      surveyUrl(invite.token),
      "reminder"
    );
    const result = await sendEmail({ to: invite.registration.email, subject, html });

    await prisma.surveyInvite.update({
      where: { id: invite.id },
      data: {
        remindersSent: { increment: 1 },
        lastReminderAt: now,
        ...(result.success ? { resendEmailId: result.id ?? null, deliveryStatus: null, deliveryStatusAt: null } : {}),
      },
    });
    sent++;
  }

  return { remindersSent: sent };
}

/** Süresi geçmiş ve hâlâ tamamlanmamış davetleri EXPIRED yapar. */
export async function expireOldInvites() {
  const result = await prisma.surveyInvite.updateMany({
    where: { status: { not: "COMPLETED" }, expiresAt: { lt: new Date() }, NOT: { status: "EXPIRED" } },
    data: { status: "EXPIRED" },
  });
  return { expired: result.count };
}

/**
 * GDPR veri minimizasyonu: kimlikli davet kayıtları (SurveyInvite → Registration)
 * belirli bir süre sonra silinir. SurveyResponse (anonim cevaplar) buna dokunulmaz —
 * zaten hiçbir ilişkisi yok.
 */
export async function cleanupOldSurveyInvites() {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - INVITE_RETENTION_MONTHS);

  const result = await prisma.surveyInvite.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  return { deleted: result.count };
}

// ─── Düşük puan uyarısı ──────────────────────────────────────────────────────

type AnswerEntry = { questionId: string; section: string; type: string; prompt: string; value: unknown };

function averageForType(answers: AnswerEntry[][], type: "RATING_5" | "NPS_0_10"): number | null {
  const values: number[] = [];
  for (const answerSet of answers) {
    for (const a of answerSet) {
      if (a.type === type && typeof a.value === "number") values.push(a.value);
    }
  }
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/**
 * Bir cevap gönderildikten sonra, o kursun SON yanıtlarına bakarak ortalama puan
 * eşiğin altındaysa admin'e e-posta uyarısı gönderir. En az LOW_SCORE_MIN_RESPONSES
 * yanıt birikmeden tetiklenmez (tek kötü yorumdan yanlış alarm olmasın).
 */
export async function checkLowScoreAlert(courseId: string) {
  try {
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
    if (!course) return;

    const responses = await prisma.surveyResponse.findMany({
      where: { courseId },
      orderBy: { submittedAt: "desc" },
      take: 50,
      select: { answers: true, teacherSnapshot: true },
    });

    if (responses.length < LOW_SCORE_MIN_RESPONSES) return;

    const answerSets = responses.map((r) => r.answers as unknown as AnswerEntry[]);
    const avgRating = averageForType(answerSets, "RATING_5");
    const avgNps = averageForType(answerSets, "NPS_0_10");

    const isLow = (avgRating !== null && avgRating < LOW_SCORE_THRESHOLD_5) ||
      (avgNps !== null && avgNps < LOW_SCORE_THRESHOLD_NPS);
    if (!isLow) return;

    const admins = await prisma.teamMember.findMany({
      where: { adminRole: "ADMIN", email: { not: null } },
      select: { email: true },
    });
    if (admins.length === 0) return;

    const teacherSnapshot = responses[0]?.teacherSnapshot;
    const html = `
      <h2>Niedrige Umfragewerte erkannt</h2>
      <p>Kurs: <strong>${course.title}</strong>${teacherSnapshot ? ` — Eğitmen: <strong>${teacherSnapshot}</strong>` : ""}</p>
      <p>Durchschnittliche Bewertung (1-5): <strong>${avgRating?.toFixed(2) ?? "–"}</strong></p>
      <p>Durchschnittlicher NPS (0-10): <strong>${avgNps?.toFixed(2) ?? "–"}</strong></p>
      <p>Basierend auf den letzten ${responses.length} anonymen Antworten. Bitte prüfen Sie den Kursbericht im Admin-Panel.</p>
    `;

    for (const admin of admins) {
      if (!admin.email) continue;
      await sendEmail({ to: admin.email, subject: `⚠️ Niedrige Umfragewerte: ${course.title}`, html });
    }
  } catch (err) {
    console.error("[survey] Low score alert check failed (non-blocking):", err);
  }
}

// ─── E-posta teslimat takibi (Resend webhook) ───────────────────────────────

const RESEND_EVENT_TO_STATUS: Record<string, string> = {
  "email.delivered": "DELIVERED",
  "email.bounced": "BOUNCED",
  "email.complained": "COMPLAINED",
  "email.delivery_delayed": "DELAYED",
};

/**
 * Resend webhook'undan gelen bir teslimat olayını ilgili davete işler. "email.sent"
 * gibi bizim zaten bildiğimiz olaylar RESEND_EVENT_TO_STATUS'ta yok, görmezden gelinir.
 * resendEmailId eşleşmezse (örn. mock modda hiç gönderilmemiş bir e-posta) sessizce no-op.
 */
export async function recordEmailDeliveryEvent(resendEmailId: string, eventType: string) {
  const status = RESEND_EVENT_TO_STATUS[eventType];
  if (!status) return { handled: false };

  const result = await prisma.surveyInvite.updateMany({
    where: { resendEmailId },
    data: { deliveryStatus: status, deliveryStatusAt: new Date() },
  });
  return { handled: result.count > 0 };
}

export { containsFlagKeyword };
