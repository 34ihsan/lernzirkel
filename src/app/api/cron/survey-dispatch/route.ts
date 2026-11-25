import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import {
  sendSurveyReminders,
  retryFailedSurveyInvites,
  expireOldInvites,
  cleanupOldSurveyInvites,
} from "@/lib/survey";

// Günlük çalışır: (1) yanıtsız davetlere hatırlatma gönderir, (2) süresi geçenleri
// EXPIRED yapar, (3) GDPR veri minimizasyonu için eski davet kayıtlarını temizler
// (cevaplara dokunmaz). Kurs bitince YENİ davet göndermek artık bu cron'un işi değil —
// admin bunu "Anketi Şimdi Gönder" ile kendi istediği an tetikliyor (bkz. CourseReportClient.tsx).
export async function GET(req: Request) {
  try {
    const authError = verifyCronSecret(req);
    if (authError) return authError;

    const retry = await retryFailedSurveyInvites();
    const reminders = await sendSurveyReminders();
    const expired = await expireOldInvites();
    const cleanup = await cleanupOldSurveyInvites();

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
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
