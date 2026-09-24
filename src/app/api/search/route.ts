import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: "Kurse & Bildung" | "Seiten & Verein" | "Beratung & Projekte" | "Service";
  badge?: string;
  icon?: string;
}

// Pre-indexed static site catalog for instant, comprehensive search
const STATIC_CATALOG: SearchResultItem[] = [
  {
    id: "cat-kurse",
    title: "Alle Kurse & Bildungsangebote",
    description: "BAMF-Integrationskurse, Alphabetisierung, telc-Prüfungen und Nachhilfe im Überblick.",
    url: "/kurse",
    category: "Kurse & Bildung",
    badge: "Übersicht",
    icon: "GraduationCap"
  },
  {
    id: "cat-integrationskurse",
    title: "Allgemeine Integrationskurse (BAMF)",
    description: "BAMF-geförderte Integrationskurse von A1 bis B1 inklusive Orientierungskurs und DTZ-Prüfung.",
    url: "/deutsch-grundbildung/integrationskurse",
    category: "Kurse & Bildung",
    badge: "BAMF gefördert",
    icon: "Languages"
  },
  {
    id: "cat-alpha",
    title: "Integrationskurs mit Alphabetisierung",
    description: "Schritt für Schritt Deutsch lesen und schreiben lernen mit intensiver pädagogischer Begleitung.",
    url: "/deutsch-grundbildung/integrationskurse-alpha",
    category: "Kurse & Bildung",
    badge: "BAMF gefördert",
    icon: "BookOpen"
  },
  {
    id: "cat-esf",
    title: "ESF+ Alpha Förderprogramm",
    description: "Europäisch geförderte Alphabetisierung und Grundbildung für Erwachsene. Kostenfreie Teilnahme.",
    url: "/esfplusalpha",
    category: "Kurse & Bildung",
    badge: "Kostenfrei",
    icon: "Users2"
  },
  {
    id: "cat-privatkurse",
    title: "Privat- und Firmenkurse",
    description: "Maßgeschneiderte Sprachkurse für Einzelpersonen und Unternehmen mit flexiblen Zeiten.",
    url: "/deutsch-grundbildung/privatkurse",
    category: "Kurse & Bildung",
    badge: "Individuell",
    icon: "Briefcase"
  },
  {
    id: "cat-telc",
    title: "telc Sprachprüfungen A1 bis C1",
    description: "Offizielles telc-Prüfungszentrum in Ludwigshafen für Einbürgerung, Beruf und Studium.",
    url: "/telc-pruefungen",
    category: "Kurse & Bildung",
    badge: "telc Zertifikat",
    icon: "Award"
  },
  {
    id: "cat-but",
    title: "Kostenlose Lernförderung (BuT)",
    description: "Kostenfreie Nachhilfe und Hausaufgabenhilfe über das Bildungs- und Teilhabepaket.",
    url: "/kostenlose-lernfoerderung_b",
    category: "Kurse & Bildung",
    badge: "BuT Kostenfrei",
    icon: "Sparkles"
  },
  {
    id: "cat-abitur",
    title: "Abitur- & Prüfungsvorbereitung",
    description: "Gezielte Prüfungsvorbereitung für Realschule, Fachabitur und Gymnasium in Kleingruppen.",
    url: "/abiturvorbereitung",
    category: "Kurse & Bildung",
    badge: "Nachhilfe",
    icon: "GraduationCap"
  },
  {
    id: "cat-blockunterricht",
    title: "Blockunterricht & Ferienkurse",
    description: "Intensivkurse in den Schulferien zur Schließung von Wissenslücken und Notenverbesserung.",
    url: "/blockunterricht",
    category: "Kurse & Bildung",
    badge: "Ferien",
    icon: "Calendar"
  },
  {
    id: "cat-jugendbetreuung",
    title: "Jugendbetreuung & Mentoring",
    description: "Individuelle Begleitung, Freizeitaktivitäten und interkultureller Austausch für Jugendliche.",
    url: "/jugendbetreuung",
    category: "Kurse & Bildung",
    badge: "Jugend",
    icon: "HeartHandshake"
  },
  {
    id: "cat-mfd",
    title: "Migrationsfachdienst (MFD)",
    description: "Kostenfreie, vertrauliche Beratung für Zugewanderte bei Behörden, Aufenthalt und Integration.",
    url: "/beratung",
    category: "Beratung & Projekte",
    badge: "Kostenfrei",
    icon: "LifeBuoy"
  },
  {
    id: "cat-aol",
    title: "AÖL-YÖS Bildungsberatung",
    description: "Abitur- und Studienberatung für internationale Abschlüsse und Hochschulzulassung.",
    url: "/aol-yoes",
    category: "Beratung & Projekte",
    badge: "Beratung",
    icon: "Compass"
  },
  {
    id: "cat-bildungswege",
    title: "Bildungswege in Ludwigshafen",
    description: "Orientierung und Orientierungsberatung im lokalen und regionalen Schul- und Ausbildungssystem.",
    url: "/bildungswege-in-ludwigshafen-_b",
    category: "Beratung & Projekte",
    badge: "Orientierung",
    icon: "MapPin"
  },
  {
    id: "cat-future",
    title: "Future Connect",
    description: "Generationen vernetzen für morgen – Digitales Lernen auf Augenhöhe zwischen Jugendlichen und Senior:innen.",
    url: "/projekte/future-connect",
    category: "Beratung & Projekte",
    badge: "Digital",
    icon: "Globe"
  },
  {
    id: "cat-menschen",
    title: "Menschen stärken Menschen",
    description: "Bundesweites Patenschafts- und Mentoringprogramm für Chancengleichheit und Zusammenhalt.",
    url: "/projekte/menschen-staerken",
    category: "Beratung & Projekte",
    badge: "Patenschaft",
    icon: "Users"
  },
  {
    id: "cat-cafe",
    title: "Sprach-Café Ludwigshafen",
    description: "Offener Begegnungsort zum Deutsch sprechen bei Tee & Kaffee – ohne Anmeldung.",
    url: "/projekte/sprach-cafe",
    category: "Beratung & Projekte",
    badge: "Offen",
    icon: "Coffee"
  },
  {
    id: "cat-konflikt",
    title: "Konfliktmanagement",
    description: "Workshops und Deeskalationstrainings für Engagierte, Jugendliche und Ehrenamtliche.",
    url: "/projekte/konfliktmanagement",
    category: "Beratung & Projekte",
    badge: "Training",
    icon: "Shield"
  },
  {
    id: "cat-wettbewerbe",
    title: "Wettbewerbe & Schülerinitiativen",
    description: "Übersicht unserer Wettbewerbe: „Wir sind Vielfalt“ und die jährliche „Bildungsmesse“ für Schülerteams.",
    url: "/projekte/wettbewerbe",
    category: "Beratung & Projekte",
    badge: "Wettbewerbe",
    icon: "Trophy"
  },
  {
    id: "cat-vielfalt",
    title: "Wir sind Vielfalt",
    description: "Aktionen, Wettbewerbe und Projekte für ein vorurteilsfreies und tolerantes Miteinander.",
    url: "/projekte/wettbewerbe/wir-sind-vielfalt",
    category: "Beratung & Projekte",
    badge: "Vielfalt",
    icon: "Heart"
  },
  {
    id: "cat-bildungsmesse",
    title: "Bildungsmesse",
    description: "Lernen, Experimentieren und Forschen: Schülerteams präsentieren eigene Experimente an Messeständen mit Projektprämierung.",
    url: "/projekte/wettbewerbe/bildungsmesse",
    category: "Beratung & Projekte",
    badge: "Messe",
    icon: "Sparkles"
  },
  {
    id: "cat-ueber-uns",
    title: "Über uns (Lernzirkel Ludwigshafen e.V.)",
    description: "Unser Verein, Leitbild, Werte und soziale Verantwortung in der Region seit 2002.",
    url: "/ueber-uns",
    category: "Seiten & Verein",
    badge: "Verein",
    icon: "Info"
  },
  {
    id: "cat-leitbild",
    title: "Leitbild des Lernzirkel Ludwigshafen e.V.",
    description: "Werte, Vision, Chancengleichheit, Bildungsangebote und soziale Verantwortung seit 2002.",
    url: "/ueber-uns/leitbild",
    category: "Seiten & Verein",
    badge: "Leitbild",
    icon: "Target"
  },
  {
    id: "cat-philosophie",
    title: "Entstehung und Intension (Philosophie)",
    description: "Die Entstehungsgeschichte, Motivation und Meilensteine des Lernzirkel Ludwigshafen e.V.",
    url: "/ueber-uns/philosophie",
    category: "Seiten & Verein",
    badge: "Geschichte",
    icon: "GraduationCap"
  },
  {
    id: "cat-galerie",
    title: "Bildergalerie & Impressionen",
    description: "Einblicke in unsere Räumlichkeiten, Seminarräume, Sprachkurse und Veranstaltungen.",
    url: "/galerie",
    category: "Seiten & Verein",
    badge: "Galerie",
    icon: "Image"
  },
  {
    id: "cat-satzung",
    title: "Satzung & Vereinsstruktur",
    description: "Rechtliche Grundlagen, Gemeinnützigkeit und offizielle Satzung des Vereins.",
    url: "/satzung",
    category: "Seiten & Verein",
    badge: "Rechtlich",
    icon: "FileText"
  },
  {
    id: "cat-spenden",
    title: "Spenden & Unterstützen",
    description: "Unterstützen Sie unsere gemeinnützige Bildungsarbeit mit einer steuerabzugsfähigen Spende.",
    url: "/spenden",
    category: "Service",
    badge: "Spenden",
    icon: "HandHeart"
  },
  {
    id: "cat-kontakt",
    title: "Kontakt & Anfahrt",
    description: "Ludwigsplatz 9a, 67059 Ludwigshafen. Öffnungszeiten, Telefonnummer und Kontaktformular.",
    url: "/kontakt",
    category: "Service",
    badge: "Kontakt",
    icon: "Phone"
  }
];

// Multilingual synonym dictionary (Turkish, German, common shorthand)
const SYNONYMS: Record<string, string[]> = {
  entegrasyon: ["integration", "integrationskurs", "bamf"],
  uyum: ["integration", "integrationskurs"],
  almanca: ["deutsch", "sprachkurs", "integration", "grundbildung"],
  kurs: ["kurse", "integrationskurs", "sprachkurs"],
  kurslar: ["kurse", "integrationskurs", "sprachkurs"],
  nachhilfe: ["lernfoerderung", "but", "abiturvorbereitung"],
  ders: ["nachhilfe", "lernfoerderung", "unterricht"],
  "özel ders": ["nachhilfe", "privatkurse", "lernfoerderung"],
  takviye: ["nachhilfe", "lernfoerderung"],
  sinav: ["pruefung", "telc", "dtz"],
  sınav: ["pruefung", "telc", "dtz"],
  sertifika: ["telc", "zertifikat", "pruefung"],
  ucretsiz: ["kostenlos", "but", "esf"],
  ücretsiz: ["kostenlos", "but", "esf"],
  bedava: ["kostenlos", "but", "esf"],
  yardim: ["but", "esf", "beratung", "spenden"],
  yardım: ["but", "esf", "beratung", "spenden"],
  burs: ["but", "foerderung"],
  danismanlik: ["beratung", "mfd", "bildungsberatung"],
  danışmanlık: ["beratung", "mfd", "bildungsberatung"],
  gocmen: ["mfd", "beratung", "integration"],
  göçmen: ["mfd", "beratung", "integration"],
  saatler: ["oeffnungszeiten", "kontakt"],
  "çalışma saatleri": ["oeffnungszeiten", "kontakt"],
  "calisma saatleri": ["oeffnungszeiten", "kontakt"],
  adres: ["kontakt", "anfahrt", "ludwigsplatz"],
  iletisim: ["kontakt", "telefon", "email"],
  iletişim: ["kontakt", "telefon", "email"],
  nerede: ["kontakt", "anfahrt", "ludwigsplatz"],
  bagis: ["spenden"],
  bağış: ["spenden"],
  cocuk: ["kinder-jugendliche", "jugendbetreuung", "nachhilfe"],
  çocuk: ["kinder-jugendliche", "jugendbetreuung", "nachhilfe"],
  genclik: ["jugendbetreuung", "future-connect"],
  gençlik: ["jugendbetreuung", "future-connect"],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get("q") || "").trim().toLowerCase();

  // If query is empty or 1 char, return popular quick suggestions
  if (!rawQuery || rawQuery.length < 2) {
    const suggestions = STATIC_CATALOG.slice(0, 6);
    return NextResponse.json({
      query: "",
      total: suggestions.length,
      results: suggestions,
      suggestions: [
        "Integrationskurse",
        "ESF+ Alpha",
        "telc Prüfungen",
        "Nachhilfe BuT",
        "Öffnungszeiten",
        "Über uns",
        "Kontakt"
      ]
    });
  }

  // Expand with synonyms
  const searchTerms = [rawQuery];
  for (const [key, synList] of Object.entries(SYNONYMS)) {
    if (rawQuery.includes(key) || key.includes(rawQuery)) {
      searchTerms.push(...synList);
    }
  }
  const uniqueTerms = Array.from(new Set(searchTerms));

  const results: SearchResultItem[] = [];
  const addedUrls = new Set<string>();

  // 1. Search database dynamic pages
  try {
    const orConditions: any[] = [];
    for (const term of uniqueTerms.slice(0, 4)) {
      orConditions.push(
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { slug: { contains: term, mode: "insensitive" } }
      );
    }

    const dbPages = await prisma.page.findMany({
      where: {
        isPublished: true,
        OR: orConditions
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true
      },
      take: 8
    });

    for (const p of dbPages) {
      const url = p.slug === "home" ? "/" : `/${p.slug}`;
      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        results.push({
          id: `page-${p.id}`,
          title: p.title,
          description: p.description || "CMS Sayfası",
          url,
          category: p.slug.includes("kurse") || p.slug.includes("deutsch") ? "Kurse & Bildung" : "Seiten & Verein",
          badge: "Sayfa",
          icon: "FileText"
        });
      }
    }
  } catch (err) {
    console.error("Search DB pages error:", err);
  }

  // 2. Search database courses if any exist
  try {
    const courseOrConditions: any[] = [];
    for (const term of uniqueTerms.slice(0, 4)) {
      courseOrConditions.push(
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { targetAudience: { contains: term, mode: "insensitive" } },
        { requirements: { contains: term, mode: "insensitive" } }
      );
    }

    const dbCourses = await prisma.course.findMany({
      where: {
        isActive: true,
        OR: courseOrConditions
      },
      take: 6
    });

    for (const c of dbCourses) {
      const url = `/kurse#${c.id}`;
      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        results.push({
          id: `course-${c.id}`,
          title: c.title,
          description: c.description.slice(0, 140) + "...",
          url,
          category: "Kurse & Bildung",
          badge: c.category || "Kurs",
          icon: "GraduationCap"
        });
      }
    }
  } catch (err) {
    console.error("Search DB courses error:", err);
  }

  // 3. Search pre-indexed static catalog with synonym expansion
  const filteredCatalog = STATIC_CATALOG.filter(item => {
    const haystack = `${item.title} ${item.description} ${item.url} ${item.badge} ${item.category}`.toLowerCase();
    return uniqueTerms.some(term => haystack.includes(term));
  });

  for (const item of filteredCatalog) {
    if (!addedUrls.has(item.url)) {
      addedUrls.add(item.url);
      results.push(item);
    }
  }

  // Group into categories
  return NextResponse.json({
    query: rawQuery,
    total: results.length,
    results: results.slice(0, 12)
  });
}
