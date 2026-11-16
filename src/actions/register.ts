'use server';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { verifyTurnstileToken } from '@/lib/turnstile';

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
    await prisma.registration.update({ where: { id }, data: { isWaitlisted: false } });
    revalidatePath('/admin/registrations');
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
    const captchaValid = await verifyTurnstileToken(turnstileToken);
    if (!captchaValid) {
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
