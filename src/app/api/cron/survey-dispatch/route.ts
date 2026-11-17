import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import {
  dispatchDueCourseSurveys,
  sendSurveyReminders,
  retryFailedSurveyInvites,
  expireOldInvites,
  cleanupOldSurveyInvites,
} from "@/lib/survey";

// Günlük çalışır: (1) bitmiş kurslar için yeni anket davetleri gönderir,
// (2) yanıtsız davetlere hatırlatma gönderir, (3) süresi geçenleri EXPIRED yapar,
// (4) GDPR veri minimizasyonu için eski davet kayıtlarını temizler (cevaplara dokunmaz).
export async function GET(req: Request) {
  try {
    const authError = verifyCronSecret(req);
    if (authError) return authError;

    const dispatch = await dispatchDueCourseSurveys();
    const retry = await retryFailedSurveyInvites();
    const reminders = await sendSurveyReminders();
    const expired = await expireOldInvites();
    const cleanup = await cleanupOldSurveyInvites();

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      ...dispatch,
      ...retry,
      ...reminders,
      ...expired,
      ...cleanup,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
