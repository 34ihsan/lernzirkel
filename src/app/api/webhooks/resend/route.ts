import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { recordEmailDeliveryEvent } from "@/lib/survey";

// Resend, webhook isteklerini Svix altyapısı üzerinden imzalar. Burada doğrulanan
// imza, bir API anahtarı kadar güvenlidir — bu route bilerek "açık" (auth header
// istemiyor) ama RESEND_WEBHOOK_SECRET olmadan HİÇBİR payload kabul edilmez.
//
// Kurulum: Resend Dashboard → Webhooks → Add Endpoint
//   URL: https://<domain>/api/webhooks/resend
//   Events: email.delivered, email.bounced, email.complained, email.delivery_delayed
//   "Signing Secret" değerini RESEND_WEBHOOK_SECRET olarak .env'e ekleyin.
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET tanımlı değil — webhook isteği reddedildi.");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: { type?: string; data?: { email_id?: string } };
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, svixHeaders) as typeof event;
  } catch (err) {
    console.error("[resend-webhook] İmza doğrulama başarısız:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const emailId = event.data?.email_id;
  if (event.type && emailId) {
    await recordEmailDeliveryEvent(emailId, event.type).catch((err) =>
      console.error("[resend-webhook] Delivery event processing failed:", err)
    );
  }

  return NextResponse.json({ received: true });
}
