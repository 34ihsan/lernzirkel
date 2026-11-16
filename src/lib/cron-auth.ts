import { NextResponse } from "next/server";

// CRON_SECRET .env'de tanımlı değilse istek reddedilir — sabit/varsayılan bir
// secret'a asla düşülmez (tahmin edilebilir bir fallback, auth'u etkisiz kılar).
export function verifyCronSecret(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET is not configured — refusing cron request.");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
