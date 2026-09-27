import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory rate limiting (Note: in serverless environments like Vercel this is instance-scoped,
// but works as a basic layer of protection).
const rateLimitMap = new Map<string, { count: number; lastTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 submissions per minute per IP

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // 1. Rate Limiting Check
    const currentTime = Date.now();
    const limitInfo = rateLimitMap.get(ip);
    
    if (limitInfo) {
      if (currentTime - limitInfo.lastTime < RATE_LIMIT_WINDOW) {
        if (limitInfo.count >= MAX_REQUESTS) {
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
      console.warn(`Honeypot triggered from IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Nachricht gesendet.' });
    }

    // Time-to-complete Check (Bots often fill forms instantly)
    if (formStartTime) {
      const timeDiff = currentTime - parseInt(formStartTime, 10);
      if (timeDiff < 3000) { // less than 3 seconds
        console.warn(`Form filled too quickly from IP: ${ip}. Time: ${timeDiff}ms`);
        return NextResponse.json({ success: true, message: 'Nachricht gesendet.' });
      }
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
      // For local development, we just save the file metadata.
      // In a real production environment, you would upload this to an S3 bucket or local /public/uploads directory.
      details.attachmentInfo = {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
      };
      
      // If we really wanted to, we could convert it to base64:
      // const buffer = Buffer.from(await attachment.arrayBuffer());
      // details.attachmentBase64 = buffer.toString('base64');
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
