import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_KNOWLEDGE_TOPICS, KnowledgeTopic } from "@/lib/ai-config";

// Catalog of default courses for rich semantic grounding
const catalogFallbackCourses = [
  {
    id: "bamf-allgemein",
    title: "Allgemeine Integrationskurse (BAMF A1-B1)",
    category: "INTEGRATION",
    description: "Vom Bundesamt für Migration und Flüchtlinge (BAMF) geförderte Deutschkurse vom Sprachniveau A1 bis B1 (600 UE Sprachkurs) plus 100 UE Orientierungskurs zur Vorbereitung auf den Deutsch-Test für Zuwanderer (DTZ).",
    targetAudience: "Zuwanderer, Geflüchtete und Migranten mit Bleibeperspektive",
    requirements: "BAMF-Berechtigungsschein oder Verpflichtung durch Jobcenter / Ausländerbehörde",
    costsInfo: "Kostenlos bei Leistungsbezug (Bürgergeld/Wohngeld/AsylbLG), ansonsten 2,29 € / UE",
    schedule: "Vormittags (08:30 - 12:45 Uhr) & Nachmittags",
    startDate: null,
  },
  {
    id: "c1-berufssprachkurs",
    title: "C1 Deutschkurs (Akademisch & Berufssprachkurs)",
    category: "SPRACHE",
    description: "Intensiver C1 Oberstufenkurs für Akademiker, Fachkräfte, Mediziner und Berufstätige. Vertiefung von Grammatik, Textanalyse, mündlicher Ausdrucksfähigkeit und Fachwortschatz.",
    targetAudience: "Personen mit abgeschlossenem B2-Zertifikat, Studieninteressierte, Fachkräfte",
    requirements: "Nachweis B2-Zertifikat (telc, Goethe oder DTZ B2)",
    costsInfo: "Förderung über Agentur für Arbeit / Jobcenter (0€) oder Selbstzahler",
    schedule: "Montag bis Freitag 09:00 - 13:00 Uhr & Abendgruppen",
    startDate: null,
  },
  {
    id: "bamf-alpha",
    title: "Integrationskurs mit Alphabetisierung",
    category: "GRUNDBILDUNG",
    description: "Spezialkurs für Teilnehmende, die das lateinische Alphabet nicht oder nur unzureichend beherrschen. Neben Deutschlernen wird das Lesen und Schreiben von Grund auf vermittelt.",
    targetAudience: "Primäre und funktionale Analphabeten, Zweitschriftlernende",
    requirements: "Einstufungstest vor Ort im Lernzirkel e.V.",
    costsInfo: "100% Kostenübernahme über BAMF / Jobcenter möglich (0€)",
    schedule: "Mo. - Do. Vormittags",
    startDate: null,
  },
  {
    id: "but-nachhilfe",
    title: "Kostenlose Lernförderung & Nachhilfe (BuT)",
    category: "NACHHILFE",
    description: "Gezielte Nachhilfe in Kleingruppen für Mathematik, Deutsch, Englisch von Klasse 1 bis 13. Notenverbesserung und Versetzungsabsicherung.",
    targetAudience: "Schülerinnen & Schüler aller Schulformen (Grundschule bis Gymnasium/Abitur)",
    requirements: "BuT-Berechtigung (Leistungsbezug: Bürgergeld, Wohngeld, Kinderzuschlag)",
    costsInfo: "100% kostenlos über das BuT-Gutscheinsystem der Stadt Ludwigshafen / Jobcenter",
    schedule: "Mo. - Fr. 14:00 - 19:00 Uhr & Sa. 10:00 - 14:00 Uhr",
    startDate: null,
  },
  {
    id: "telc-pruefungen",
    title: "telc Sprachprüfungen (A1, A2, B1, B2, C1)",
    category: "PRUEFUNG",
    description: "Offiziell lizenziertes telc Prüfungszentrum in Ludwigshafen. Anerkannte Prüfungen für DTZ B1, telc B2 und telc C1 Hochschule für Einbürgerung und Studium.",
    targetAudience: "Alle Prüfungskandidaten mit offiziellem Nachweisbedarf",
    requirements: "Persönliche Anmeldung mit Ausweis/Pass mindestens 30 Tage vor Prüfungstermin",
    costsInfo: "Offizielle telc Gebührenordnung oder über BAMF gefördert",
    schedule: "Regelmäßige monatliche Prüfungssamstage",
    startDate: null,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = "de" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Nachricht erforderlich" }, { status: 400 });
    }

    const q = message.toLowerCase().trim();

    // 1. Admin Onay Kontrolü (Gate) & Ayarlar
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { aiConfig: true, siteName: true },
    });

    const aiConfig = (settings?.aiConfig as any) || { 
      aiEnabled: true, 
      provider: "builtin",
      knowledgeTopics: DEFAULT_KNOWLEDGE_TOPICS 
    };

    if (aiConfig.aiEnabled === false) {
      return NextResponse.json(
        { error: "Der KI-Assistent ist derzeit durch die Administration deaktiviert." },
        { status: 403 }
      );
    }

    // 2. Fetch Live Knowledge Context from DB (Courses + Pages)
    const [dbCourses, dbPages] = await Promise.all([
      prisma.course.findMany({
        where: { isActive: true },
        select: { 
          id: true, 
          title: true, 
          category: true, 
          description: true, 
          targetAudience: true, 
          requirements: true, 
          costsInfo: true, 
          startDate: true, 
          endDate: true 
        },
        take: 20,
      }).catch(() => []),
      prisma.page.findMany({
        where: { isPublished: true },
        select: { id: true, title: true, slug: true, description: true },
        take: 15,
      }).catch(() => []),
    ]);

    // Combine DB courses with catalog defaults
    const allCourses = dbCourses.length > 0 ? [...dbCourses, ...catalogFallbackCourses] : catalogFallbackCourses;

    // Language heuristics
    const isTurkish = q.includes("merhaba") || q.includes("kurs") || q.includes("ücretsiz") || 
      q.includes("nasıl") || q.includes("kayıt") || q.includes("fiyat") || q.includes("saat") || 
      q.includes("çocuk") || q.includes("adres") || q.includes("başlangıç") || q.includes("ne zaman") ||
      q.includes("nerede") || q.includes("var mı") || q.includes("sınav");
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const isEnglish = q.includes("hello") || q.includes("course") || q.includes("free") || 
      q.includes("exam") || q.includes("address") || q.includes("register") || q.includes("start") || q.includes("when");

    // 3. PRIORITY 1: ADMIN CUSTOM KNOWLEDGE BASE TOPICS (Direct Admin Answer)
    const customTopics: KnowledgeTopic[] = (
      Array.isArray(aiConfig.knowledgeTopics) && aiConfig.knowledgeTopics.length > 0
        ? aiConfig.knowledgeTopics
        : DEFAULT_KNOWLEDGE_TOPICS
    ).filter((t: KnowledgeTopic) => t.isActive !== false);

    let bestTopic: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const item of customTopics) {
      const keywords = (item.keywords || "")
        .split(/[,;\n]+/)
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0);

      let score = 0;
      for (const kw of keywords) {
        if (q.includes(kw)) {
          // Exact word or full phrase match
          score += kw.length >= 3 ? kw.length * 2 : kw.length;
        }
      }

      // If topic title matches query
      if (item.topic && q.includes(item.topic.toLowerCase())) {
        score += 30;
      }

      if (score > highestScore) {
        highestScore = score;
        bestTopic = item;
      }
    }

    if (bestTopic && highestScore >= 3) {
      return NextResponse.json({
        reply: bestTopic.answer,
        suggestions: bestTopic.suggestions || (
          isTurkish ? ["0€ Destek Başvurusu Yap", "Adres & Çalışma Saatleri", "WhatsApp Danışma"] :
          isArabic ? ["حساب الدعم 0€", "الموقع وساعات الدوام", "واتساب"] :
          isEnglish ? ["0€ Grant Calculator", "Address & Hours", "WhatsApp Support"] :
          ["0€ Förderungs-Rechner", "Öffnungszeiten & Anfahrt", "WhatsApp Kontakt"]
        ),
        provider: "admin-knowledge-topic",
        topic: bestTopic.topic,
      });
    }

    // 4. PRIORITY 2: LIVE COURSE SCAN (Matches courses in DB or Catalog)
    const isAskingCourse = q.includes("kurs") || q.includes("course") || q.includes("c1") || 
      q.includes("b2") || q.includes("b1") || q.includes("a1") || q.includes("a2") || 
      q.includes("nachhilfe") || q.includes("alpha") || q.includes("başlangıç") || 
      q.includes("ne zaman") || q.includes("start") || q.includes("beginn") || q.includes("termi") ||
      q.includes("anmeldung") || q.includes("kayıt");

    if (isAskingCourse) {
      const matchedCourse = allCourses.find(c => {
        const titleLower = c.title.toLowerCase();
        const catLower = (c.category || "").toLowerCase();
        const descLower = (c.description || "").toLowerCase();

        if (q.includes("c1") && (titleLower.includes("c1") || descLower.includes("c1"))) return true;
        if (q.includes("b2") && (titleLower.includes("b2") || descLower.includes("b2"))) return true;
        if (q.includes("b1") && (titleLower.includes("b1") || descLower.includes("b1"))) return true;
        if (q.includes("a1") && (titleLower.includes("a1") || descLower.includes("a1"))) return true;
        if ((q.includes("alpha") || q.includes("okuma")) && (titleLower.includes("alpha") || catLower.includes("grundbildung"))) return true;
        if ((q.includes("nachhilfe") || q.includes("takviye") || q.includes("okul")) && (catLower.includes("nachhilfe") || titleLower.includes("nachhilfe"))) return true;
        if ((q.includes("telc") || q.includes("sınav") || q.includes("prüf")) && (titleLower.includes("telc") || catLower.includes("pruefung"))) return true;
        if ((q.includes("integrat") || q.includes("entegrasyon")) && (catLower.includes("integration") || titleLower.includes("integrationskurs"))) return true;

        return titleLower.split(" ").some(word => word.length > 3 && q.includes(word));
      });

      if (matchedCourse) {
        const formattedDate = (matchedCourse as any).startDate
          ? new Date((matchedCourse as any).startDate).toLocaleDateString(isTurkish ? "tr-TR" : "de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : (isTurkish ? "Laufender Einstieg (Kayıtlar devam ediyor / Yeni grup yakında)" : "Laufender Einstieg / Laufende Kursanmeldung");

        let courseReply = "";
        if (isTurkish) {
          courseReply = `📌 **${matchedCourse.title}** hakkında sitemizdeki güncel bilgiler:\n\n` +
            `📅 **Başlangıç / Dönem:** ${formattedDate}\n` +
            `💶 **Ücret & Destek:** ${matchedCourse.costsInfo || 'BAMF / Jobcenter / BuT üzerinden 0€ (Devlet Destekli)'}\n` +
            ((matchedCourse as any).schedule ? `⏰ **Ders Saatleri:** ${(matchedCourse as any).schedule}\n` : '') +
            ((matchedCourse as any).requirements ? `📋 **Ön Şartlar:** ${(matchedCourse as any).requirements}\n` : '') +
            `\n📖 **Kurs Özeti:** ${matchedCourse.description}\n\n` +
            `Detaylı danışmanlık ve yerinizi ayırtmak için web sitemizdeki başvuru formunu doldurabilir veya Ludwigsplatz 9a ofisimize uğrayabilirsiniz.`;
        } else if (isArabic) {
          courseReply = `📌 معلومات الدورة المحدثة:\n\n` +
            `📚 **${matchedCourse.title}**\n` +
            `📅 **موعد البدء:** ${formattedDate}\n` +
            `💶 **التكاليف والتمويل:** ${matchedCourse.costsInfo || 'مجاني بنسبة 100% عبر BAMF / Jobcenter (0€)'}\n` +
            `\n${matchedCourse.description}\n\n` +
            `يمكنك التسجيل مباشرة عبر استمارة الموقع أو زيارة مكتبنا في Ludwigsplatz 9a.`;
        } else if (isEnglish) {
          courseReply = `📌 Current course information from our database:\n\n` +
            `📚 **${matchedCourse.title}**\n` +
            `📅 **Start Date / Term:** ${formattedDate}\n` +
            `💶 **Costs & Funding:** ${matchedCourse.costsInfo || '100% funded (0€) via BAMF / BuT'}\n` +
            ((matchedCourse as any).schedule ? `⏰ **Schedule:** ${(matchedCourse as any).schedule}\n` : '') +
            ((matchedCourse as any).requirements ? `📋 **Requirements:** ${(matchedCourse as any).requirements}\n` : '') +
            `\n📖 **Description:** ${matchedCourse.description}\n\n` +
            `You can register directly on our website or visit our office at Ludwigsplatz 9a.`;
        } else {
          // German
          courseReply = `📌 Aktuelle Informationen aus unserem Kursprogramm:\n\n` +
            `📚 **${matchedCourse.title}**\n` +
            `📅 **Kursstart:** ${formattedDate}\n` +
            `💶 **Kosten / Förderung:** ${matchedCourse.costsInfo || '100% Kostenübernahme über BAMF / Jobcenter / BuT möglich (0€)'}\n` +
            ((matchedCourse as any).schedule ? `⏰ **Zeiten:** ${(matchedCourse as any).schedule}\n` : '') +
            ((matchedCourse as any).requirements ? `📋 **Voraussetzungen:** ${(matchedCourse as any).requirements}\n` : '') +
            `\n📖 **Beschreibung:** ${matchedCourse.description}\n\n` +
            `Für eine persönliche Einstufung und Anmeldung besuchen Sie uns gerne am Ludwigsplatz 9a oder nutzen Sie die Online-Voranmeldung auf der Website.`;
        }

        return NextResponse.json({
          reply: courseReply,
          suggestions: isTurkish 
            ? ["0€ Destek Başvurusu Yap", "Ofis Adresi ve Saatler", "WhatsApp Danışma"]
            : ["0€ Förderungs-Rechner", "Anfahrt & Öffnungszeiten", "WhatsApp Kontakt"],
          provider: "live-course-db",
          courseId: matchedCourse.id,
        });
      }
    }

    // 5. PRIORITY 3: LIVE PAGE SCAN (Matches published pages on site)
    if (dbPages.length > 0) {
      const matchedPage = dbPages.find(p => {
        const pTitle = p.title.toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pSlug = p.slug.toLowerCase();
        return q.includes(pTitle) || q.includes(pSlug) || (pDesc && pDesc.split(" ").some(w => w.length > 4 && q.includes(w)));
      });

      if (matchedPage) {
        const pageReply = isTurkish
          ? `Bu konuyla ilgili web sitemizde yayınlanmış bir sayfamız bulunmaktadır:\n\n📄 **${matchedPage.title}**\n${matchedPage.description || ''}\n\n👉 Detaylar için sayfamızı ziyaret edebilirsiniz: /${matchedPage.slug}`
          : `Zu diesem Thema finden Sie ausführliche Informationen auf unserer Website:\n\n📄 **${matchedPage.title}**\n${matchedPage.description || ''}\n\n👉 Link: /${matchedPage.slug}`;

        return NextResponse.json({
          reply: pageReply,
          suggestions: [isTurkish ? "Sayfayı İncele" : "Seite ansehen", isTurkish ? "İletişime Geç" : "Kontakt aufnehmen"],
          provider: "live-page-db",
        });
      }
    }

    // 6. PRIORITY 4: EXTERNAL LLM (Google Gemini or OpenAI) IF CONFIGURED
    if (aiConfig.provider === "gemini" && aiConfig.apiKey) {
      try {
        const courseSummary = allCourses
          .map(c => `• ${c.title}: ${c.description} | Kosten: ${c.costsInfo || '0€ Förderung'} | Start: ${(c as any).startDate || 'Laufend'}`)
          .join("\n");

        const topicsSummary = customTopics
          .map(t => `• Thema: ${t.topic}\nSchlüsselwörter: ${t.keywords}\nAntwort: ${t.answer}`)
          .join("\n\n");

        const prompt = `Du bist der offizielle, hochintelligente KI-Berater von "Lernzirkel Ludwigshafen e.V." (Ludwigsplatz 9a, 67059 Ludwigshafen, Tel: 0621 30737271).
Öffnungszeiten: Montag bis Freitag 09:00 - 17:00 Uhr.

VERIFIZIERTE ADMIN-THEMEN & REGELN:
${topicsSummary}

AKTUELLE KURSE AUF DER WEBSITE:
${courseSummary}

${aiConfig.customInstructions ? `ZUSÄTZLICHE ADMIN-INSTRUKTIONEN:\n${aiConfig.customInstructions}\n` : ""}

Beantworte die folgende Frage des Nutzers präzise, freundlich und auf Basis der oben genannten verifizierten Daten.
Antworte in derselben Sprache wie die Frage (Deutsch, Türkisch, Arabisch oder Englisch).

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
            return NextResponse.json({ 
              reply, 
              provider: "gemini",
              suggestions: isTurkish 
                ? ["0€ Destek Başvurusu Yap", "telc Sınav Bilgisi", "Ofise Ulaşım"]
                : ["0€ Förderungs-Rechner", "telc Prüfungstermine", "Öffnungszeiten"]
            });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to local engine:", err);
      }
    }

    // 7. PRIORITY 5: MULTILINGUAL BUILT-IN INTELLIGENT FALLBACK
    let reply = "";
    let suggestions: string[] = [];

    if (isArabic) {
      if (q.includes("مجاني") || q.includes("تكلفة") || q.includes("سعر") || q.includes("جوب سنتر") || q.includes("bamf")) {
        reply = "أهلاً بك في Lernzirkel Ludwigshafen e.V.! إذا كنت تتلقى Bürgergeld أو Wohngeld، فإن دورات الاندماج (BAMF) ودورات C1/B2 مجانية بنسبة 100%. يمكنك التحقق من أهليتك عبر حاسبة الدعم في موقعنا أو التواصل معنا عبر واتساب.";
        suggestions = ["كيف أسجل؟", "أوقات الدوام والعنوان", "امتحانات telc"];
      } else if (q.includes("telc") || q.includes("امتحان") || q.includes("b1") || q.includes("c1")) {
        reply = "نحن مركز امتحانات معتمد لـ telc في Ludwigshafen (مستويات A1, A2, B1, B2, C1). شهاداتنا معترف بها رسمياً للجنسية والإقامة والدراسة الجامعية. يرجى زيارتنا في Ludwigsplatz 9a مع جواز سفرك للتسجيل.";
        suggestions = ["دورات الاندماج BAMF", "دروس تقوية مجانية للأطفال", "التواصل عبر واتساب"];
      } else {
        reply = "مرحباً بك! يسعدنا مساعدتك في Lernzirkel Ludwigshafen e.V. نحن نقدم دورات اندماج ولغة ألمانية حتى C1، امتحانات telc، ودروس تقوية مجانية للأطفال (BuT). يمكنك زيارتنا في Ludwigsplatz 9a من الإثنين إلى الجمعة (09:00 - 17:00).";
        suggestions = ["هل الكورس مجاني؟", "امتحانات telc", "حجز موعد"];
      }
    } else if (isTurkish) {
      if (q.includes("ücretsiz") || q.includes("fiyat") || q.includes("jobcenter") || q.includes("para") || q.includes("muaf")) {
        reply = "Merhaba! Lernzirkel Ludwigshafen e.V. olarak resmi BAMF ve telc merkezli eğitim kurumuyuz. Jobcenter'dan Bürgergeld veya belediyeden Wohngeld / Kinderzuschlag alıyorsanız, Almanca Entegrasyon Kursunuz (A1-B1), mesleki dil kursları ve çocuklarınız için ders takviyesi (BuT) **%100 DEVLET DESTEKLİ (Tamamen Ücretsiz - 0€)** olarak karşılanır. Sitemizdeki 0€ Destek Sihirbazı ile hemen ön başvuru yapabilirsiniz.";
        suggestions = ["0€ Destek Başvurusu Yap", "telc B1 Sınav Kaydı", "Adres ve Açılış Saatleri"];
      } else if (q.includes("telc") || q.includes("sınav") || q.includes("vatandaşlık") || q.includes("oturum")) {
        reply = "Lernzirkel e.V., Ludwigshafen'ın yetkili telc sınav merkezidir. Vatandaşlık, süresiz oturum ve üniversite için geçerli resmi telc Deutsch A1, A2, B1 (DTZ), B2 ve C1 sınavlarını kurumumuzda alabilirsiniz. Sınav tarihleri ve kontenjanlar için merkezimize (Ludwigsplatz 9a) uğrayabilir veya doğrudan ön kayıt oluşturabilirsiniz.";
        suggestions = ["BAMF Kursları Ücretsiz mi?", "Çocuklar İçin Ders Takviyesi", "WhatsApp ile İletişim"];
      } else if (q.includes("çocuk") || q.includes("nachhilfe") || q.includes("ders") || q.includes("okul") || q.includes("but")) {
        reply = "Çocuklarınız için ilkokuldan lise son sınıfa kadar Matematik, Almanca ve İngilizce branşlarında birebir ve küçük grup takviyeleri veriyoruz. BuT (Bildung und Teilhabe) belgeniz varsa tüm dersler %100 ücretsizdir; Jobcenter veya ilgili resmi kurum faturayı doğrudan karşılar.";
        suggestions = ["BuT Başvurusu Nasıl Yapılır?", "Almanca Kursları", "Telefonla Ara"];
      } else {
        reply = "Lernzirkel Ludwigshafen e.V. Danışma Asistanına hoş geldiniz! Size BAMF Entegrasyon Kursları, C1/B2 Almanca Kursları, telc Sınavları, çocuklar için ücretsiz okul takviyesi (BuT) ve resmi işlemler konusunda yardımcı olabilirim. Ofisimiz Ludwigsplatz 9a adresinde, hafta içi 09:00 - 17:00 arası açıktır.";
        suggestions = ["Kursum Ücretsiz mi?", "telc Sınav Tarihleri", "Yetkiliyle Görüş"];
      }
    } else if (isEnglish) {
      if (q.includes("free") || q.includes("cost") || q.includes("bamf") || q.includes("jobcenter") || q.includes("grant")) {
        reply = "Welcome! If you receive Bürgergeld (Jobcenter), Wohngeld, or asylum benefits, your BAMF Integration Course (A1-B1) and tutoring for your children (BuT) are **100% government funded (0€ out of pocket)**. You can check your eligibility using our online 0€ Grant Calculator or visit our office.";
        suggestions = ["Apply for 0€ Grant", "telc Exam Dates", "Address & Hours"];
      } else if (q.includes("telc") || q.includes("exam") || q.includes("certificate")) {
        reply = "Lernzirkel e.V. is an officially certified telc examination center in Ludwigshafen for A1, A2, B1, B2, and C1. Our certificates are recognized by authorities for citizenship, residence permits, and universities. Please visit us at Ludwigsplatz 9a to register.";
        suggestions = ["Integration Courses", "Free Tutoring for Kids", "Contact on WhatsApp"];
      } else {
        reply = "Hello and welcome to Lernzirkel Ludwigshafen e.V.! We offer certified BAMF German integration courses, advanced C1/B2 classes, official telc examinations, and free tutoring (BuT) for children. Located at Ludwigsplatz 9a, open Monday to Friday from 09:00 to 17:00.";
        suggestions = ["Are courses free?", "telc exam details", "WhatsApp contact"];
      }
    } else {
      // Default: German
      if (q.includes("kostenlos") || q.includes("kosten") || q.includes("preis") || q.includes("bamf") || q.includes("jobcenter") || q.includes("bürgergeld") || q.includes("wohngeld")) {
        reply = "Guten Tag! Bei Bezug von Bürgergeld (Jobcenter), Wohngeld, Kinderzuschlag oder Asylbewerberleistungen sind unsere BAMF-Integrationskurse sowie die Lernförderung (Nachhilfe nach BuT) für Kinder zu **100% staatlich gefördert (0€ Eigenanteil)**. Nutzen Sie unseren Förderungs-Rechner auf der Website für eine unverbindliche Voranmeldung!";
        suggestions = ["0€ Förderungs-Rechner starten", "telc B1 Prüfungstermine", "Öffnungszeiten & Anfahrt"];
      } else if (q.includes("telc") || q.includes("prüfung") || q.includes("zertifikat") || q.includes("einbürgerung")) {
        reply = "Der Lernzirkel Ludwigshafen e.V. ist lizenziertes telc Prüfungszentrum. Wir bieten Prüfungen für Deutsch A1, A2, B1, B2 und C1 an – offiziell anerkannt für Einbürgerung, Aufenthalt und Studium. Anmeldungen nehmen wir gerne am Ludwigsplatz 9a entgegen.";
        suggestions = ["Integrationskurse (BAMF)", "Kostenlose Nachhilfe (BuT)", "Direkt per WhatsApp anfragen"];
      } else if (q.includes("nachhilfe") || q.includes("kind") || q.includes("schule") || q.includes("but") || q.includes("mathe")) {
        reply = "Unsere gezielte Nachhilfe für Schülerinnen und Schüler (Mathe, Deutsch, Englisch) wird über das Bildungs- und Teilhabepaket (BuT) zu 100% von der Stadt Ludwigshafen bzw. dem Jobcenter übernommen. Wir unterstützen Sie gerne beim Antrag.";
        suggestions = ["Förderanspruch prüfen", "Beratungstermin vereinbaren", "Kontakt aufnehmen"];
      } else {
        reply = "Herzlich willkommen beim Lernzirkel Ludwigshafen e.V.! Als anerkannter Bildungsträger unterstützen wir Sie gerne bei BAMF-Integrationskursen, C1/B2 Sprachkursen, telc Sprachprüfungen und kostenloser Nachhilfe (BuT). Sie finden uns am Ludwigsplatz 9a in Ludwigshafen (Mo-Fr 09:00 - 17:00 Uhr). Wie kann ich Ihnen behilflich sein?";
        suggestions = ["Ist mein Kurs kostenlos?", "telc Prüfungstermine", "Standort & Öffnungszeiten"];
      }
    }

    return NextResponse.json({
      reply,
      suggestions,
      provider: "builtin-fallback",
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
