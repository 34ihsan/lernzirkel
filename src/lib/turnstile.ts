// Cloudflare Turnstile sunucu tarafı doğrulama.
// TURNSTILE_SECRET_KEY tanımlı değilse doğrulama tamamen atlanır (bugünkü "CAPTCHA'sız" davranış
// bozulmaz) — anahtarlar eklendiği an form spam koruması otomatik aktif olur.

export async function verifyTurnstileToken(token: string | null | undefined, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // CAPTCHA yapılandırılmamış, kontrolü atla

  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] Verification request failed:", error);
    return false;
  }
}

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
