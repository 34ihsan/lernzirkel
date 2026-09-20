/**
 * Mock email service. In production, connect this to Resend, SendGrid, or Nodemailer.
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
  console.log(`[EMAIL MOCK] To: ${to}`);
  console.log(`[EMAIL MOCK] Subject: ${subject}`);
  console.log(`[EMAIL MOCK] Body: ${html}`);
  
  // Example for Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'info@lernzirkel-ludwigshafen.de', to, subject, html });

  return { success: true };
}
