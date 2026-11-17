/**
 * E-posta gönderimi. RESEND_API_KEY tanımlıysa Resend REST API üzerinden gerçek e-posta gönderir;
 * tanımlı değilse (bugünkü durum) sadece console.log yapan mock moda düşer. Ekstra npm paketi
 * gerekmiyor — Resend'in API'si basit bir fetch ile çalışır.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL MOCK] To: ${to}`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${html}`);
    return { success: true, mocked: true };
  }

  const from = process.env.EMAIL_FROM || "Lernzirkel Ludwigshafen e.V. <info@lernzirkel-online.de>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[EMAIL] Resend API error:", errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { success: true, id: data?.id as string | undefined };
  } catch (error) {
    console.error("[EMAIL] Send failed:", error);
    return { success: false, error: String(error) };
  }
}
