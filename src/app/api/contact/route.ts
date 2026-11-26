import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { logSecurityEvent } from '@/lib/security-log';
import { getDepotDir } from '@/lib/depot-storage';
import { getClientIp } from '@/lib/client-ip';

const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/jpeg',
  'image/png',
];
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

// Simple in-memory rate limiting (Note: in serverless environments like Vercel this is instance-scoped,
// but works as a basic layer of protection).
const rateLimitMap = new Map<string, { count: number; lastTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 submissions per minute per IP

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    
    // 1. Rate Limiting Check
    const currentTime = Date.now();
    const limitInfo = rateLimitMap.get(ip);
    
    if (limitInfo) {
      if (currentTime - limitInfo.lastTime < RATE_LIMIT_WINDOW) {
        if (limitInfo.count >= MAX_REQUESTS) {
          await logSecurityEvent("security_rate_limited", { route: "/api/contact", ip });
          return NextResponse.json({ error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' }, { status: 429 });
        }
        limitInfo.count++;
        limitInfo.lastTime = currentTime;
      } else {
        rateLimitMap.set(ip, { count: 1, lastTime: currentTime });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastTime: currentTime });
    }

    // 2. Parse FormData instead of JSON
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }

    const website_url = formData.get('website_url') as string | null;
    const formStartTime = formData.get('formStartTime') as string | null;

    // Honeypot Check (if bots fill out this hidden field, silently reject)
    if (website_url) {
      await logSecurityEvent("security_honeypot_triggered", { route: "/api/contact", ip });
      return NextResponse.json({ success: true, message: 'Nachricht gesendet.' });
    }

    // Time-to-complete Check (Bots often fill forms instantly)
    if (formStartTime) {
      const timeDiff = currentTime - parseInt(formStartTime, 10);
      if (timeDiff < 3000) { // less than 3 seconds
        await logSecurityEvent("security_too_fast_submission", { route: "/api/contact", ip, metadata: { timeDiffMs: timeDiff } });
        return NextResponse.json({ success: true, message: 'Nachricht gesendet.' });
      }
    }

    // CAPTCHA doğrulaması (TURNSTILE_SECRET_KEY tanımlı değilse otomatik atlanır)
    const turnstileToken = formData.get('turnstileToken') as string | null;
    const captchaValid = await verifyTurnstileToken(turnstileToken, ip);
    if (!captchaValid) {
      await logSecurityEvent("security_captcha_failed", { route: "/api/contact", ip });
      return NextResponse.json({ error: 'CAPTCHA-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.' }, { status: 400 });
    }

    // Extract real data
    const topic = formData.get('topic') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const detailsStr = formData.get('details') as string;
    let details: any = detailsStr ? JSON.parse(detailsStr) : {};

    // 3. Process File Upload (if it exists)
    const attachment = formData.get('attachment') as File | null;
    if (attachment && attachment.size > 0) {
      if (!ALLOWED_ATTACHMENT_TYPES.includes(attachment.type)) {
        return NextResponse.json({ error: 'Ungültiges Dateiformat. Erlaubt sind nur PDF, DOCX, JPG und PNG.' }, { status: 400 });
      }
      if (attachment.size > MAX_ATTACHMENT_SIZE) {
        return NextResponse.json({ error: 'Datei ist zu groß (maximal 5 MB erlaubt).' }, { status: 400 });
      }

      // Başvuru ekleri kişisel veri içerebileceğinden public/uploads yerine, public olarak
      // servis edilmeyen depot-storage'a yazılıyor (sadece admin oturumuyla indirilebilir).
      const depotDir = getDepotDir();
      await mkdir(depotDir, { recursive: true }).catch(() => {});

      const sanitizedOriginalName = attachment.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storedFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizedOriginalName}`;
      const bytes = await attachment.arrayBuffer();
      await writeFile(join(depotDir, storedFileName), Buffer.from(bytes));

      details.attachmentInfo = {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        storedFileName,
      };
    }

    // 4. Basic Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 });
    }

    // 5. Save to database
    await prisma.contactMessage.create({
      data: {
        topic: topic || 'allgemein',
        firstName,
        lastName,
        email,
        phone,
        message,
        details: details
      }
    });

    return NextResponse.json({ success: true, message: 'Vielen Dank für Ihre Nachricht!' });

  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.' }, { status: 500 });
  }
}
