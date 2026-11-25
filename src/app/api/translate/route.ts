import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { translateFields, defaultTargetLanguages } from '@/lib/content-translation';

export async function POST(req: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fields, targetLanguages = defaultTargetLanguages() } = body;

    // fields should be an object: { title: "Mein Kurs", content: "<p>Hallo</p>" }
    if (!fields || typeof fields !== 'object') {
      return NextResponse.json({ error: "Invalid fields object provided." }, { status: 400 });
    }

    const translations = await translateFields(fields, targetLanguages);
    if (!translations) {
      return NextResponse.json(
        { error: 'AI henüz yapılandırılmamış. /admin/ai-settings üzerinden bir Gemini API anahtarı ekleyin.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      translations,
    });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}
