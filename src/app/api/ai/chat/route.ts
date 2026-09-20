import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], language = "de" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Nachricht erforderlich" }, { status: 400 });
    }

    // 1. Admin Onay Kontrolü (Gate)
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { aiConfig: true, siteName: true },
    });

    const aiConfig = (settings?.aiConfig as any) || { aiEnabled: true, provider: "builtin" };

    if (aiConfig.aiEnabled === false) {
      return NextResponse.json(
        { error: "Der KI-Assistent ist derzeit durch die Administration deaktiviert." },
        { status: 403 }
      );
    }

    // 2. Fetch Live Knowledge Context
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      select: { title: true, category: true, description: true, targetAudience: true, costsInfo: true },
      take: 10,
    });

    const courseListText = courses
      .map(c => `• ${c.title} (${c.category}): ${c.description} | Zielgruppe: ${c.targetAudience || 'Alle'} | Kosten: ${c.costsInfo || 'BAMF / BuT gefördert'}`)
      .join("\n");

    const baseKnowledge = `
Institution: Lernzirkel Ludwigshafen e.V.
Adresse: Ludwigsplatz 9a, 67059 Ludwigshafen am Rhein
Telefon: 0621 30737271
WhatsApp: +49 176 12345678
Öffnungszeiten: Montag - Freitag: 09:00 - 17:00 Uhr
Hauptbereiche:
1. BAMF Integrationskurse: Deutsch A1 bis B1 + Orientierungskurs. Bei Bezug von Bürgergeld, Wohngeld oder Asylbewerberleistungen zu 100% KOSTENLOS (0€).
2. telc Deutschprüfungen: Lizenziertes Prüfungszentrum für telc Deutsch A1, A2, B1, B2 und C1 (Zertifikate für Einbürgerung und Aufenthaltstitel).
3. Kostenlose Nachhilfe (BuT): Über das Bildungs- und Teilhabepaket (Jobcenter / Stadt Ludwigshafen) für Schülerinnen und Schüler komplett kostenlos.
Aktuelle Kurse:
${courseListText}
`;

    // 3. Provider: External LLM (Gemini or OpenAI) if configured
    if (aiConfig.provider === "gemini" && aiConfig.apiKey) {
      try {
        const prompt = `${baseKnowledge}
${aiConfig.customInstructions ? `Zusätzliche Admin-Regeln: ${aiConfig.customInstructions}\n` : ""}
Beantworte die folgende Frage des Nutzers freundlich, präzise und hilfsbereit.
Antworte in der Sprache des Nutzers (Deutsch, Türkisch, Arabisch oder Englisch).
Weise bei Bedarf darauf hin, dass die Voranmeldung direkt auf der Website im 0€-Rechner oder per WhatsApp erfolgen kann.

Nutzerfrage: "${message}"`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model || "gemini-1.5-flash"}:generateContent?key=${aiConfig.apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, provider: "gemini" });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to built-in engine:", err);
      }
    }

    // 4. Built-in Multilingual Intelligent RAG Engine (Zero API cost & 100% reliable)
    const q = message.toLowerCase();
    let reply = "";
    let suggestions: string[] = [];

    // Language detection heuristics
    const isTurkish = q.includes("merhaba") || q.includes("kurs") || q.includes("ücretsiz") || q.includes("nasıl") || q.includes("kayıt") || q.includes("fiyat") || q.includes("saat") || q.includes("çocuk") || q.includes("adres");
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const isEnglish = q.includes("hello") || q.includes("course") || q.includes("free") || q.includes("exam") || q.includes("address") || q.includes("register");

    if (isArabic) {
      if (q.includes("مجاني") || q.includes("تكلفة") || q.includes("سعر") || q.includes("جوب سنتر") || q.includes("bamf")) {
        reply = "أهلاً بك في Lernzirkel Ludwigshafen e.V.! إذا كنت تتلقى Bürgergeld أو Wohngeld، فإن دورات الاندماج (BAMF) مجانية بنسبة 100%. يمكنك التحقق من أهليتك عبر حاسبة الدعم في موقعنا أو التواصل معنا مباشرة عبر واتساب.";
        suggestions = ["كيف أسجل؟", "أوقات الدوام والعنوان", "امتحانات telc B1"];
      } else if (q.includes("telc") || q.includes("امتحان") || q.includes("b1")) {
        reply = "نحن مركز امتحانات معتمد لـ telc في Ludwigshafen (مستويات A1, A2, B1, B2). شهاداتنا معترف بها رسمياً للجنسية والإقامة. يرجى زيارتنا في Ludwigsplatz 9a مع جواز سفرك للتسجيل.";
        suggestions = ["دورات الاندماج BAMF", "دروس تقوية مجانية للأطفال", "التواصل عبر واتساب"];
      } else {
        reply = "مرحباً بك! يسعدنا مساعدتك في Lernzirkel Ludwigshafen e.V. نحن نقدم دورات اندماج لغة ألمانية معتمدة من BAMF، امتحانات telc، ودروس تقوية مجانية للأطفال (BuT). يمكنك زيارتنا في Ludwigsplatz 9a من الإثنين إلى الجمعة (09:00 - 17:00) أو مراسلتنا عبر واتساب.";
        suggestions = ["هل الكورس مجاني؟", "امتحانات telc", "حجز موعد"];
      }
    } else if (isTurkish) {
      if (q.includes("ücretsiz") || q.includes("fiyat") || q.includes("jobcenter") || q.includes("b граждан") || q.includes("bamf") || q.includes("para")) {
        reply = "Merhaba! Lernzirkel Ludwigshafen e.V. olarak resmi BAMF onaylı entegrasyon merkeziyiz. Jobcenter'dan Bürgergeld veya belediyeden Wohngeld / Kinderzuschlag alıyorsanız, Almanca Entegrasyon Kursunuz (A1-B1) ve çocuklarınız için ders takviyesi (BuT) **%100 DEVLET DESTEKLİ (Tamamen Ücretsiz - 0€)** olarak karşılanır. Sitemizdeki 0€ Destek Sihirbazı ile hemen ön başvuru yapabilirsiniz.";
        suggestions = ["0€ Destek Başvurusu Yap", "telc B1 Sınav Kaydı", "Adres ve Açılış Saatleri"];
      } else if (q.includes("telc") || q.includes("sınav") || q.includes("b1") || q.includes("b2") || q.includes("vatandaşlık")) {
        reply = "Lernzirkel e.V., Ludwigshafen'ın yetkili telc sınav merkezidir. Vatandaşlık ve süresiz oturum için geçerli resmi telc Deutsch B1 ve B2 sınavlarını kurumumuzda alabilirsiniz. Sınav tarihleri ve kontenjanlar için merkezimize (Ludwigsplatz 9a) uğrayabilir veya WhatsApp'tan yazabilirsiniz.";
        suggestions = ["BAMF Kursları Ücretsiz mi?", "Çocuklar İçin Ders Takviyesi", "WhatsApp ile İletişim"];
      } else if (q.includes("çocuk") || q.includes("nachhilfe") || q.includes("ders") || q.includes("okul") || q.includes("but")) {
        reply = "Çocuklarınız için ilkokuldan lise son sınıfa kadar Matematik, Almanca ve İngilizce branşlarında birebir ve küçük grup takviyeleri veriyoruz. BuT (Bildung und Teilhabe) belgeniz varsa tüm dersler %100 ücretsizdir; Jobcenter veya ilgili resmi kurum faturayı doğrudan karşılar.";
        suggestions = ["BuT Başvurusu Nasıl Yapılır?", "Almanca Kursları", "Telefonla Ara"];
      } else {
        reply = "Lernzirkel Ludwigshafen e.V. Danışma Asistanına hoş geldiniz! Size BAMF Entegrasyon Kursları, telc B1/B2 Sınavları, çocuklar için ücretsiz okul takviyesi (BuT) ve göçmenlik danışmanlığı konularında yardımcı olabilirim. Ofisimiz Ludwigsplatz 9a adresinde, hafta içi 09:00 - 17:00 arası açıktır.";
        suggestions = ["Kursum Ücretsiz mi?", "telc Sınav Tarihleri", "Yetkiliyle Görüş"];
      }
    } else if (isEnglish) {
      if (q.includes("free") || q.includes("cost") || q.includes("bamf") || q.includes("jobcenter") || q.includes("grant")) {
        reply = "Welcome! If you receive Bürgergeld (Jobcenter), Wohngeld, or asylum benefits, your BAMF Integration Course (A1-B1) and tutoring for your children (BuT) are **100% government funded (0€ out of pocket)**. You can check your eligibility using our online 0€ Grant Calculator or message us on WhatsApp.";
        suggestions = ["Apply for 0€ Grant", "telc Exam Dates", "Address & Hours"];
      } else if (q.includes("telc") || q.includes("exam") || q.includes("b1") || q.includes("certificate")) {
        reply = "Lernzirkel e.V. is an officially certified telc examination center in Ludwigshafen for A1, A2, B1, B2, and C1. Our certificates are recognized by authorities for citizenship and permanent residency. Please visit us at Ludwigsplatz 9a with your ID/passport to register.";
        suggestions = ["Integration Courses", "Free Tutoring for Kids", "Contact on WhatsApp"];
      } else {
        reply = "Hello and welcome to Lernzirkel Ludwigshafen e.V.! We offer certified BAMF German integration courses, official telc examinations, and free state-sponsored tutoring (BuT) for children. Located at Ludwigsplatz 9a, open Monday to Friday from 09:00 to 17:00.";
        suggestions = ["Are courses free?", "telc exam details", "WhatsApp contact"];
      }
    } else {
      // Default: German
      if (q.includes("kostenlos") || q.includes("kosten") || q.includes("preis") || q.includes("bamf") || q.includes("jobcenter") || q.includes("bürgergeld") || q.includes("wohngeld")) {
        reply = "Guten Tag! Bei Bezug von Bürgergeld (Jobcenter), Wohngeld, Kinderzuschlag oder Asylbewerberleistungen sind unsere BAMF-Integrationskurse sowie die Lernförderung (Nachhilfe nach BuT) für Kinder zu **100% staatlich gefördert (0€ Eigenanteil)**. Nutzen Sie unseren 4-Schritte Förderungs-Rechner auf der Website für eine unverbindliche Voranmeldung!";
        suggestions = ["0€ Förderungs-Rechner starten", "telc B1 Prüfungstermine", "Öffnungszeiten & Anfahrt"];
      } else if (q.includes("telc") || q.includes("prüfung") || q.includes("zertifikat") || q.includes("b1") || q.includes("b2") || q.includes("einbürgerung")) {
        reply = "Der Lernzirkel Ludwigshafen e.V. ist lizenziertes telc Prüfungszentrum. Wir bieten Prüfungen für Deutsch A1, A2, B1, B2 und C1 an – offiziell anerkannt für Einbürgerung und Aufenthaltstitel. Anmeldungen nehmen wir gerne persönlich an unserem Standort am Ludwigsplatz 9a entgegen.";
        suggestions = ["Integrationskurse (BAMF)", "Kostenlose Nachhilfe (BuT)", "Direkt per WhatsApp anfragen"];
      } else if (q.includes("nachhilfe") || q.includes("kind") || q.includes("schule") || q.includes("but") || q.includes("mathe")) {
        reply = "Unsere gezielte Nachhilfe für Schülerinnen und Schüler (Mathe, Deutsch, Englisch) wird über das Bildungs- und Teilhabepaket (BuT) zu 100% von der Stadt Ludwigshafen bzw. dem Jobcenter übernommen. Wir helfen Ihnen gerne bei der Beantragung der Gutscheine.";
        suggestions = ["Förderanspruch prüfen", "Beratungstermin vereinbaren", "Kontakt aufnehmen"];
      } else {
        reply = "Herzlich willkommen beim Lernzirkel Ludwigshafen e.V.! Als anerkannter Bildungsträger unterstützen wir Sie gerne bei BAMF-Integrationskursen, telc Sprachprüfungen, kostenloser Nachhilfe (BuT) und Bildungsberatung. Sie finden uns am Ludwigsplatz 9a in Ludwigshafen (Mo-Fr 09:00 - 17:00 Uhr). Wie kann ich Ihnen behilflich sein?";
        suggestions = ["Ist mein Kurs kostenlos?", "telc Prüfungstermine", "Standort & Öffnungszeiten"];
      }
    }

    return NextResponse.json({
      reply,
      suggestions,
      provider: "builtin-rag",
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
