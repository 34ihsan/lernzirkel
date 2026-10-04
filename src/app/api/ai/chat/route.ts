import { NextResponse } from 'next/server';
import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

// Next.js Route Config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting for Security (Phase 5 compliance)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = await rateLimit(ip, 10, 60); // 10 requests per minute per IP for chat
    
    if (!rl.success) {
      return NextResponse.json({ error: "Zu viele Anfragen. Bitte warten Sie einen Moment." }, { status: 429 });
    }

    const { messages } = await req.json();

    // 2. Fetch AI Settings & API Key from Database
    const settings = await prisma.siteSettings.findFirst();
    const aiConfig = (settings?.aiConfig as any) || {};

    if (!aiConfig.apiKey || aiConfig.provider !== 'gemini') {
      // Fallback if no API key is configured
      return new Response(
        "Der KI-Berater ist aktuell im Wartungsmodus (Kein API-Key konfiguriert). Bitte kontaktieren Sie uns über WhatsApp oder Telefon.", 
        { status: 503 }
      );
    }

    // 3. Initialize Google AI Provider with user's DB key
    const google = createGoogleGenerativeAI({
      apiKey: aiConfig.apiKey,
    });

    // 4. Elite Agentic RAG Setup (Tools/Function Calling)
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: `Du bist der offizielle, hochprofessionelle 'Elite KI-Berater' des Lernzirkel Ludwigshafen e.V.
Deine Aufgabe ist es, Nutzern bei Fragen zu Sprachkursen (Integrationskurse, telc), Nachhilfe und Projekten zu helfen.
Antworte auf Deutsch, es sei denn, der Nutzer spricht dich in einer anderen Sprache (z.B. Türkisch, Arabisch, Englisch) an.
Sei hilfsbereit, empathisch, professionell und präzise. Formatiere deine Antworten übersichtlich (mit Markdown-Bulletpoints wenn passend).

WICHTIG: Nutze deine Tools (searchCourses, searchProjects), um akkurate Echtzeit-Daten aus der Datenbank abzurufen, bevor du antwortest! Wenn du nach Kursen gefragt wirst, ruf immer zuerst das Tool auf!`,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(3),
      tools: {
        searchCourses: tool({
          description: 'Sucht in der Lernzirkel-Datenbank nach aktuellen Kursen (z.B. Sprachkurse, Integrationskurse, telc, Nachhilfe)',
          inputSchema: z.object({
            query: z.string().describe('Suchbegriff (z.B. "telc", "B2", "Integration", "Deutsch")'),
          }),
          execute: async ({ query }: { query: string }) => {
            const courses = await prisma.course.findMany({
              where: {
                isActive: true,
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } }
                ]
              },
              take: 5,
              select: {
                title: true,
                description: true,
                costsInfo: true,
                startDate: true,
                endDate: true
              }
            });
            return courses;
          },
        }),
        searchProjects: tool({
          description: 'Sucht nach sozialen oder Förder-Projekten (z.B. BuT, BAMF, Flüchtlingshilfe, Sommercamp)',
          inputSchema: z.object({
            query: z.string().describe('Suchbegriff für Projekte'),
          }),
          execute: async ({ query }: { query: string }) => {
            const projects = await prisma.project.findMany({
              where: {
                status: 'AKTIV',
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } }
                ]
              },
              take: 3,
              select: {
                title: true,
                description: true,
                targetGroup: true,
                goals: true
              }
            });
            return projects;
          },
        }),
        getContactAndGeneralInfo: tool({
          description: 'Ruft allgemeine Kontaktinformationen, Öffnungszeiten und Standort des Lernzirkel e.V. ab',
          inputSchema: z.object({}),
          execute: async () => {
            return {
              address: "Lernzirkel Ludwigshafen e.V., Musterstraße 12, 67059 Ludwigshafen",
              email: "info@lernzirkel-lu.de",
              phone: "+49 176 12345678",
              openingHours: "Mo-Fr 09:00 - 18:00 Uhr, Sa 10:00 - 14:00 Uhr",
              aboutUs: "Der Lernzirkel Ludwigshafen e.V. ist ein anerkannter Bildungsträger (BAMF, telc) und fördert Integration durch Bildung."
            };
          }
        })
      },
    });

    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return new Response(
      "Es gab einen Fehler bei der KI-Verarbeitung. Bitte versuchen Sie es später nochmal.", 
      { status: 500 }
    );
  }
}
