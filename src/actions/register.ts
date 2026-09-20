'use server';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function registerForCourse(formData: FormData) {
  try {
    const courseId = formData.get('courseId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const language = formData.get('language') as string || 'de';

    if (!courseId || !name || !email) {
      return { success: false, error: 'Name und E-Mail sind erforderlich.' };
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return { success: false, error: 'Kurs nicht gefunden.' };
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
      },
    });

    // Send confirmation email
    const subject = language === 'tr' 
      ? `Kayıt Onayı: ${course.title}`
      : `Anmeldebestätigung: ${course.title}`;
      
    const greeting = language === 'tr' ? 'Merhaba' : 'Hallo';
    
    await sendEmail({
      to: email,
      subject,
      html: `
        <h2>${greeting} ${name},</h2>
        <p>Ihre Anmeldung für den Kurs <strong>${course.title}</strong> ist bei uns eingegangen.</p>
        <p>Wir werden uns in Kürze mit Ihnen in Verbindung setzen.</p>
        <br/>
        <p>Mit freundlichen Grüßen,</p>
        <p>Ihr Lernzirkel-Team</p>
      `,
    });

    return { success: true, id: registration.id };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: 'Ein interner Fehler ist aufgetreten.' };
  }
}
