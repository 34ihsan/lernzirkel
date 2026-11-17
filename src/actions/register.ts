'use server';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { cookies, headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/security-log';

// Bir kursun dolu olup olmadığını hesaplar (REJECTED hariç tüm kayıtlar sayılır)
export async function getCourseAvailability(courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;

  if (course.capacity == null) {
    return { capacity: null, taken: 0, remaining: null, isFull: false, allowWaitlist: course.allowWaitlist };
  }

  const taken = await prisma.registration.count({
    where: { courseId, status: { not: 'REJECTED' }, isWaitlisted: false },
  });

  const remaining = Math.max(course.capacity - taken, 0);
  return {
    capacity: course.capacity,
    taken,
    remaining,
    isFull: remaining <= 0,
    allowWaitlist: course.allowWaitlist,
  };
}

export async function updateRegistrationStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'CONTACTED' | 'REJECTED'
) {
  try {
    await prisma.registration.update({
      where: { id },
      data: {
        status,
        ...(status === 'CONTACTED' ? { lastContactedAt: new Date() } : {}),
      },
    });
    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (error) {
    console.error('Error updating registration status:', error);
    return { success: false, error: 'Durum güncellenirken hata oluştu.' };
  }
}

export async function assignRegistration(id: string, teamMemberId: string | null) {
  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: { assignedToId: teamMemberId },
      include: { assignedTo: true },
    });
    revalidatePath('/admin/registrations');
    return { success: true, assignedToName: updated.assignedTo?.name ?? null };
  } catch (error) {
    console.error('Error assigning registration:', error);
    return { success: false, error: 'Atama yapılırken hata oluştu.' };
  }
}

export async function getRegistrationStats() {
  const [total, pending, approved, contacted] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: 'PENDING' } }),
    prisma.registration.count({ where: { status: 'APPROVED' } }),
    prisma.registration.count({ where: { status: 'CONTACTED' } }),
  ]);
  return { total, pending, approved, contacted };
}

// Bekleme listesindeki bir kaydı aktif kontenjana alır (kapasite kontrolü yapmadan, admin bilinçli karar verir)
export async function promoteFromWaitlist(id: string) {
  try {
    const registration = await prisma.registration.update({
      where: { id },
      data: { isWaitlisted: false },
      include: { course: true },
    });
    revalidatePath('/admin/registrations');

    const lang = registration.language === 'tr' ? 'tr' : 'de';
    const subject = lang === 'tr'
      ? `Yer açıldı: ${registration.course.title}`
      : `Ein Platz ist frei geworden: ${registration.course.title}`;
    const body = lang === 'tr'
      ? `Bekleme listesinde olduğunuz <strong>${registration.course.title}</strong> kursunda bir yer açıldı ve kaydınız kontenjana alındı. Kısa süre içinde sizinle iletişime geçeceğiz.`
      : `Für den Kurs <strong>${registration.course.title}</strong>, für den Sie auf der Warteliste standen, ist ein Platz frei geworden — Ihre Anmeldung wurde in den aktiven Kontingent aufgenommen. Wir melden uns in Kürze bei Ihnen.`;
    const greeting = lang === 'tr' ? 'Merhaba' : 'Hallo';

    sendEmail({
      to: registration.email,
      subject,
      html: `
        <h2>${greeting} ${registration.name},</h2>
        <p>${body}</p>
        <br/>
        <p>Mit freundlichen Grüßen / Saygılarımızla,</p>
        <p>Ihr Lernzirkel-Team</p>
      `,
    }).catch((err) => console.error('Waitlist promotion email failed:', err));

    return { success: true };
  } catch (error) {
    console.error('Error promoting from waitlist:', error);
    return { success: false, error: 'Bekleme listesinden çıkarılırken hata oluştu.' };
  }
}

export async function deleteRegistration(id: string) {
  try {
    await prisma.registration.delete({ where: { id } });
    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (error) {
    console.error('Error deleting registration:', error);
    return { success: false, error: 'Kayıt silinirken hata oluştu.' };
  }
}

export async function registerForCourse(formData: FormData) {
  try {
    const ip = (await headers()).get('x-forwarded-for') ?? 'unknown-ip';

    // Honeypot: gerçek kullanıcılar bu alanı görmez/doldurmaz, botlar genelde doldurur.
    // Botu "başarılı" zannettirip hiçbir kayıt oluşturmadan sessizce reddediyoruz.
    const website_url = formData.get('website_url') as string | null;
    if (website_url) {
      await logSecurityEvent('security_honeypot_triggered', { route: '/kurse (Anmeldung)', ip });
      return { success: true, waitlisted: false };
    }

    // Formu doldurma süresi: botlar genelde formu anında gönderir.
    const formStartTime = formData.get('formStartTime') as string | null;
    if (formStartTime) {
      const timeDiff = Date.now() - parseInt(formStartTime, 10);
      if (timeDiff >= 0 && timeDiff < 3000) {
        await logSecurityEvent('security_too_fast_submission', { route: '/kurse (Anmeldung)', ip, metadata: { timeDiffMs: timeDiff } });
        return { success: true, waitlisted: false };
      }
    }

    // IP başına hız sınırı: aynı IP'den kısa sürede çok fazla kayıt denemesi.
    const limited = await rateLimit(`course-register:${ip}`, 5, 600);
    if (!limited.success) {
      await logSecurityEvent('security_rate_limited', { route: '/kurse (Anmeldung)', ip });
      return { success: false, error: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es in einigen Minuten erneut.' };
    }

    const courseId = formData.get('courseId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const language = formData.get('language') as string || 'de';

    if (!courseId || !name || !email || !phone) {
      return { success: false, error: 'Name, E-Mail und Telefon sind erforderlich.' };
    }

    const turnstileToken = formData.get('turnstileToken') as string | null;
    const captchaValid = await verifyTurnstileToken(turnstileToken, ip);
    if (!captchaValid) {
      await logSecurityEvent('security_captcha_failed', { route: '/kurse (Anmeldung)', ip });
      return { success: false, error: 'CAPTCHA-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.' };
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return { success: false, error: 'Kurs nicht gefunden.' };
    }

    const availability = await getCourseAvailability(courseId);
    const willBeWaitlisted = !!availability?.isFull;

    if (willBeWaitlisted && !course.allowWaitlist) {
      return { success: false, error: 'Dieser Kurs ist leider ausgebucht und bietet keine Warteliste an.' };
    }

    const cookieStore = await cookies();
    const source = cookieStore.get('lz_ref')?.value || null;

    const registration = await prisma.registration.create({
      data: {
        courseId,
        name,
        email,
        phone,
        message,
        language,
        status: 'PENDING',
        isWaitlisted: willBeWaitlisted,
        source,
      },
    });

    const subjectByLang: Record<string, string> = {
      tr: willBeWaitlisted ? `Bekleme Listesi: ${course.title}` : `Kayıt Onayı: ${course.title}`,
      de: willBeWaitlisted ? `Warteliste: ${course.title}` : `Anmeldebestätigung: ${course.title}`,
    };
    const greetingByLang: Record<string, string> = { tr: 'Merhaba', de: 'Hallo' };
    const bodyByLang: Record<string, string> = {
      tr: willBeWaitlisted
        ? `<strong>${course.title}</strong> kursu için başvurunuz bekleme listesine alınmıştır. Bir yer açıldığında sizinle iletişime geçeceğiz.`
        : `<strong>${course.title}</strong> kursuna kaydınız bize ulaştı. Kısa süre içinde sizinle iletişime geçeceğiz.`,
      de: willBeWaitlisted
        ? `Ihre Anmeldung für den Kurs <strong>${course.title}</strong> wurde auf die Warteliste gesetzt. Wir melden uns, sobald ein Platz frei wird.`
        : `Ihre Anmeldung für den Kurs <strong>${course.title}</strong> ist bei uns eingegangen. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.`,
    };
    const lang = language === 'tr' ? 'tr' : 'de';

    await sendEmail({
      to: email,
      subject: subjectByLang[lang],
      html: `
        <h2>${greetingByLang[lang]} ${name},</h2>
        <p>${bodyByLang[lang]}</p>
        <br/>
        <p>Mit freundlichen Grüßen / Saygılarımızla,</p>
        <p>Ihr Lernzirkel-Team</p>
      `,
    });

    revalidatePath(`/kurse/${courseId}`);

    return { success: true, id: registration.id, waitlisted: willBeWaitlisted };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: 'Ein interner Fehler ist aufgetreten.' };
  }
}
