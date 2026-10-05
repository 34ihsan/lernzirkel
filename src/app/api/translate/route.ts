import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fields, targetLanguages = ['en', 'tr', 'ar'] } = body;

    // fields should be an object: { title: "Mein Kurs", content: "<p>Hallo</p>" }
    if (!fields || typeof fields !== 'object') {
      return NextResponse.json({ error: "Invalid fields object provided." }, { status: 400 });
    }

    // Google Gemini 1.5 Flash is extremely fast, high quality, and has a very generous free tier.
    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      system: `You are a professional multi-language translator. You will receive a JSON object containing text or HTML content in German.
      Your task is to translate ALL the fields in the object into the requested target languages.
      
      CRITICAL RULES:
      1. Preserve ALL HTML tags, attributes, and structure exactly as they are. ONLY translate the text content between tags.
      2. Keep names, specific locations (e.g. Ludwigshafen), and brand names unchanged.
      3. Ensure professional, culturally appropriate translations.
      4. Return a JSON where the root keys are the target language codes (e.g., 'en', 'tr', 'ar'), and the values are objects with the exact same keys as the input fields, but translated.`,
      prompt: `Target Languages: ${targetLanguages.join(', ')}\n\nFields to translate:\n${JSON.stringify(fields, null, 2)}`,
      schema: z.record(z.string(), z.record(z.string(), z.string())),
      // Example output schema:
      // {
      //   "en": { "title": "...", "content": "..." },
      //   "tr": { "title": "...", "content": "..." },
      //   "ar": { "title": "...", "content": "..." }
      // }
    });

    return NextResponse.json({
      success: true,
      translations: result.object,
    });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}
