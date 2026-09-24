export interface DefaultPageDefinition {
  title: string;
  slug: string;
  description: string;
  isSystem: boolean;
  sections: Array<{
    type: string;
    content: any;
    design: any;
    order: number;
  }>;
}

export const SYSTEM_PAGES: DefaultPageDefinition[] = [
  {
    title: "Startseite (Home)",
    slug: "home",
    description: "Lernzirkel Ludwigshafen e.V. - Bildung, Beratung und soziale Projekte",
    isSystem: true,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          title: "Bildung, Beratung und soziale Projekte",
          subtitle: "Gemeinsam Potenziale entfalten – in Ludwigshafen und der Metropolregion Rhein-Neckar.",
          buttonText: "Zu den Integrationskursen",
          buttonLink: "/deutsch-grundbildung",
          secondaryButtonText: "telc Prüfungen",
          secondaryButtonLink: "/telc-pruefungen",
          imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80",
          imageOverlayClass: "mix-blend-overlay opacity-30"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-24",
          minHeight: "min-h-[580px]",
          overlayOpacity: "bg-black/40",
          textAlign: "text-center",
          containerWidth: "max-w-5xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 1,
        content: {
          eyebrow: "Über uns",
          title: "Lernzirkel Ludwigshafen e.V.",
          subtitle: "Wir stehen für Chancengleichheit, Vielfalt und Qualität. Lernen Sie unseren Verein, unsere Entstehung und unser Leitbild kennen.",
          columns: 4,
          items: [
            {
              title: "Entstehung & Leitbild",
              description: "Erfahren Sie mehr über unsere Philosophie, Werte und unsere Zielsetzungen.",
              linkText: "Mehr erfahren",
              linkUrl: "/ueber-uns",
              icon: "Info"
            },
            {
              title: "Satzung & Orga",
              description: "Die rechtlichen Grundlagen und die Organisationsstruktur unseres Vereins.",
              linkText: "Mehr erfahren",
              linkUrl: "/satzung",
              icon: "FileText"
            },
            {
              title: "Spenden & Fördern",
              description: "Unterstützen Sie unsere gemeinnützige Arbeit für bessere Bildungschancen.",
              linkText: "Jetzt spenden",
              linkUrl: "/spenden",
              icon: "HandHeart"
            },
            {
              title: "Kontakt & Anfahrt",
              description: "Wir freuen uns auf Ihre Anfrage. Kontaktieren Sie uns persönlich oder online!",
              linkText: "Kontakt aufnehmen",
              linkUrl: "/kontakt",
              icon: "Phone"
            }
          ]
        },
        design: {
          backgroundColor: "#f9fafb",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 2,
        content: {
          eyebrow: "Deutsch lernen in Ludwigshafen",
          title: "Integrationskurse & Sprachangebote",
          subtitle: "Vom Alphabetisierungskurs bis zum berufsbezogenen Deutschkurs – gefördert durch BAMF und ESF+.",
          columns: 3,
          items: [
            {
              title: "Deutsch & Grundbildung",
              badge: "BAMF-zertifiziert",
              description: "Allgemeine Integrationskurse von A1 bis B1 inklusive Orientierungskurs und DTZ-Prüfung.",
              linkText: "Kurse ansehen",
              linkUrl: "/deutsch-grundbildung",
              icon: "Languages"
            },
            {
              title: "ESF+ Alpha Kurs",
              badge: "Kostenfrei",
              description: "Alphabetisierung und Grundbildung für Erwachsene mit und ohne Vorkenntnisse.",
              linkText: "Mehr Details",
              linkUrl: "/esfplusalpha",
              icon: "GraduationCap"
            },
            {
              title: "Sprach- & Privatkurse",
              badge: "Individuell",
              description: "Gezieltes Einzeltraining, Abendkurse und maßgeschneiderte Firmenangebote für jedes Niveau.",
              linkText: "Angebot anfragen",
              linkUrl: "/deutsch-grundbildung/privatkurse",
              icon: "BookOpen"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      },
      {
        type: "BANNER",
        order: 3,
        content: {
          eyebrow: "Offizielles Prüfungszentrum",
          title: "telc Prüfungen A1 bis C1 Hochschule",
          subtitle: "Legen Sie Ihre anerkannte Sprachprüfung direkt bei uns in Ludwigshafen ab – für Einbürgerung, Beruf und Studium.",
          noticeText: "Regelmäßige Prüfungstermine für B1, B2 und C1 mit schneller Auswertung",
          buttonText: "Prüfungstermine & Anmeldung",
          buttonLink: "https://pruefungscenter.de",
          buttonExternal: true,
          secondaryButtonText: "Mehr Informationen",
          secondaryButtonLink: "/telc-pruefungen",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-16",
          minHeight: "min-h-[380px]",
          overlayOpacity: "bg-black/60",
          textAlign: "text-center",
          buttonBg: "#e63946",
          buttonColor: "#ffffff"
        }
      },
      {
        type: "CARD_GRID",
        order: 4,
        content: {
          eyebrow: "Schulische Bildung & Nachhilfe",
          title: "Angebote für Kinder & Jugendliche",
          subtitle: "Individuelle Förderung von Grundschule bis Abitur für mehr schulischen Erfolg.",
          columns: 4,
          items: [
            {
              title: "Nachhilfeunterricht",
              badge: "Klasse 1-13",
              description: "Gezielter Förderunterricht in Mathematik, Deutsch, Englisch und allen Kernfächern.",
              linkText: "Zu den Angeboten",
              linkUrl: "/kinder-jugendliche",
              icon: "School"
            },
            {
              title: "Kostenlose Lernförderung (BuT)",
              badge: "100% gefördert",
              description: "Leistungen für Bildung und Teilhabe – kostenlose Nachhilfe über Gutscheine.",
              linkText: "Förderung prüfen",
              linkUrl: "/kostenlose-lernfoerderung_b",
              icon: "CheckCircle"
            },
            {
              title: "Blockunterricht & Ferienkurse",
              badge: "Intensiv",
              description: "Kompaktkurse in den Ferien zur gezielten Wissensauffrischung und Klausurvorbereitung.",
              linkText: "Termine ansehen",
              linkUrl: "/blockunterricht",
              icon: "Calendar"
            },
            {
              title: "Abiturvorbereitung",
              badge: "Oberstufe",
              description: "Systematisches Prüfungstraining für Realschulabschluss und Abitur.",
              linkText: "Details",
              linkUrl: "/abiturvorbereitung",
              icon: "Award"
            }
          ]
        },
        design: {
          backgroundColor: "#f9fafb",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 5,
        content: {
          eyebrow: "Gemeinschaft & Vielfalt",
          title: "Projekte & Initiativen",
          subtitle: "Unsere geförderten Projekte stärken gesellschaftliche Teilhabe, Toleranz und Vernetzung.",
          columns: 3,
          items: [
            {
              title: "Future Connect",
              badge: "Jugendförderung",
              description: "Zukunftsorientiertes Jugend- und Mentoringprojekt zur Stärkung von Medienkompetenz und Berufsorientierung.",
              linkText: "Projekt entdecken",
              linkUrl: "/future-connect",
              icon: "Lightbulb"
            },
            {
              title: "Menschen stärken Menschen",
              badge: "Patenschaften",
              description: "Bundesprogramm für Chancenpatenschaften zwischen geflüchteten und einheimischen Bürgern.",
              linkText: "Mehr erfahren",
              linkUrl: "/projekte/menschen-staerken",
              icon: "HeartHandshake"
            },
            {
              title: "Sprach-Café",
              badge: "Offener Treff",
              description: "Niedrigschwelliger Austausch bei Kaffee und Tee, um Deutschkenntnisse im Alltag praktisch anzuwenden.",
              linkText: "Treffzeiten ansehen",
              linkUrl: "/projekte/sprach-cafe",
              icon: "MessageCircle"
            },
            {
              title: "Konfliktmanagement",
              badge: "Workshops",
              description: "Gewaltprävention und interkulturelle Mediation für Jugendliche und Familien.",
              linkText: "Details",
              linkUrl: "/projekte/konfliktmanagement",
              icon: "Shield"
            },
            {
              title: "Wir sind Vielfalt",
              badge: "Demokratie",
              description: "Initiative für interkulturellen Dialog, gesellschaftlichen Zusammenhalt und Toleranz.",
              linkText: "Mehr erfahren",
              linkUrl: "/projekte/wettbewerbe/wir-sind-vielfalt",
              icon: "Users2"
            },
            {
              title: "DSEE Mikroförderung",
              badge: "Ehrenamt",
              description: "Stärkung unseres ehrenamtlichen Netzwerks und digitaler Bildungsformate.",
              linkText: "Zum Projekt",
              linkUrl: "/projekte/dsee",
              icon: "FileCheck"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 6,
        content: {
          eyebrow: "Kostenlos & Vertraulich",
          title: "Beratungsdienste & Unterstützung",
          subtitle: "Wir helfen Ihnen bei behördlichen Fragen, Bildungswegen und persönlicher Orientierung.",
          columns: 3,
          items: [
            {
              title: "Migrationsfachdienst (MFD)",
              badge: "Beratung",
              description: "Begleitung und Unterstützung für Menschen mit Zuwanderungsgeschichte bei Ämtern, Formularen und Alltag.",
              linkText: "Sprechzeiten ansehen",
              linkUrl: "/beratung",
              icon: "LifeBuoy"
            },
            {
              title: "AÖL & YÖS Beratung",
              badge: "Akademisch",
              description: "Spezifische Beratung zum türkischen Fernabitur (AÖL) und zur Universitätsaufnahmeprüfung (YÖS).",
              linkText: "Mehr erfahren",
              linkUrl: "/aol-yoes",
              icon: "GraduationCap"
            },
            {
              title: "Bildungswege Ludwigshafen",
              badge: "Orientierung",
              description: "Schullaufbahnberatung, Übergänge in Ausbildung und Beruf für Schüler und Eltern.",
              linkText: "Beratungstermin",
              linkUrl: "/bildungswege-in-ludwigshafen-_b",
              icon: "Compass"
            }
          ]
        },
        design: {
          backgroundColor: "#f9fafb",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      }
    ]
  },
  {
    title: "Über uns - Leitbild",
    slug: "ueber-uns",
    description: "Leitbild und Werte des Lernzirkel Ludwigshafen e.V.",
    isSystem: true,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          eyebrow: "Lernzirkel Ludwigshafen e.V.",
          title: "Unser Leitbild",
          subtitle: "Gegründet im Januar 2002 als gemeinnütziger Verein in Ludwigshafen am Rhein, bieten wir vielfältige Angebote für Kinder, Jugendliche und Erwachsene an.",
          buttonText: "Kontakt",
          buttonLink: "/kontakt"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-20",
          textAlign: "text-center",
          containerWidth: "max-w-4xl"
        }
      },
      {
        type: "TEXT",
        order: 1,
        content: {
          title: "Unser Selbstverständnis und unsere Ziele",
          leadText: "Mit unseren Angeboten wollen wir unserer gesellschaftlichen Verantwortung in Ludwigshafen und in der Region gerecht werden.",
          text: "<p class='mb-4'>Denn nur wenn Kindern, Jugendlichen und Erwachsenen ausreichend Möglichkeiten geboten werden, ihre Stärken und Potenziale zu entwickeln und bestehende Defizite abzubauen, können sie aktiv am gesellschaftlichen Leben teilhaben und ihren Beitrag zu einem friedlichen Miteinander leisten.</p><p>Im Bereich der Erwachsenenbildung bieten wir Angebote an, die gezielt die Interessen und Bedürfnisse von Frauen, Jugendlichen, Eltern sowie Bürgerinnen und Bürgern mit und ohne Migrationshintergrund berücksichtigen.</p>"
        },
        design: {
          backgroundColor: "bg-white",
          textColor: "text-gray-800",
          padding: "py-12",
          containerWidth: "max-w-4xl"
        }
      },
      {
        type: "FEATURES",
        order: 2,
        content: {
          title: "Unsere Grundsätze",
          subtitle: "Qualität, Wirtschaftlichkeit und gesellschaftlicher Beitrag",
          items: [
            {
              icon: "Award",
              title: "Wirtschaftlichkeit & Kundenorientierung",
              text: "Wirtschaftlichkeit bedeutet für uns, finanzielle Mittel effektiv einzusetzen. Wir orientieren uns an den aktuellen Anforderungen des Ausbildungs- und Arbeitsmarktes."
            },
            {
              icon: "ShieldCheck",
              title: "Qualitätssicherung",
              text: "Wir arbeiten nach den Grundsätzen der Qualitätssicherung und reflektieren unsere Arbeit regelmäßig durch Evaluationen und Qualitätsaudits."
            },
            {
              icon: "Users",
              title: "Chancengleichheit und Vielfalt",
              text: "Die Angebote des Vereins richten sich an alle Menschen, unabhängig von Geschlecht, Herkunft oder sozialem Status."
            }
          ]
        },
        design: {
          backgroundColor: "bg-gray-50",
          textColor: "text-gray-900",
          padding: "py-16",
          containerWidth: "max-w-6xl"
        }
      }
    ]
  },
  {
    title: "Kurse & Bildungsangebote",
    slug: "kurse",
    description: "Übersicht über alle Integrations-, Sprach- und Nachhilfekurse.",
    isSystem: true,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          eyebrow: "Bildungsangebote",
          title: "Unsere Kurse in Ludwigshafen",
          subtitle: "Zertifizierte Sprach- und Integrationskurse sowie individuelle Lernförderung.",
          buttonText: "Beratungstermin",
          buttonLink: "/kontakt"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-20",
          textAlign: "text-center",
          containerWidth: "max-w-5xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 1,
        content: {
          title: "Verfügbare Kurse",
          subtitle: "Wählen Sie das für Sie passende Bildungsangebot aus",
          columns: 3,
          items: [
            {
              title: "Allgemeine Integrationskurse",
              badge: "BAMF",
              description: "600 Stunden Sprachkurs bis B1 + 100 Stunden Orientierungskurs.",
              linkText: "Mehr Informationen",
              linkUrl: "/deutsch-grundbildung/integrationskurse",
              icon: "Languages"
            },
            {
              title: "Integrationskurse mit Alphabetisierung",
              badge: "BAMF",
              description: "Bis zu 1000 Stunden für Teilnehmende, die das lateinische Alphabet lernen.",
              linkText: "Mehr Informationen",
              linkUrl: "/deutsch-grundbildung/integrationskurse-alpha",
              icon: "BookOpen"
            },
            {
              title: "ESF+ Alpha Kurse",
              badge: "Kostenlos",
              description: "Alphabetisierung und Grundbildung für Erwachsene mit und ohne Vorkenntnisse.",
              linkText: "Mehr Informationen",
              linkUrl: "/esfplusalpha",
              icon: "GraduationCap"
            },
            {
              title: "Schülerförderung & Nachhilfe",
              badge: "Klasse 1-13",
              description: "Nachhilfe in Kleingruppen oder Einzelunterricht für alle Schularten.",
              linkText: "Mehr Informationen",
              linkUrl: "/kinder-jugendliche",
              icon: "School"
            },
            {
              title: "telc Prüfungen",
              badge: "Zertifiziert",
              description: "Offizielle telc-Prüfungen für Deutsch A1, A2, B1, B2 und C1.",
              linkText: "Termine buchen",
              linkUrl: "https://pruefungscenter.de",
              isExternal: true,
              icon: "Award"
            },
            {
              title: "Kostenlose Lernförderung (BuT)",
              badge: "Gutschein",
              description: "Lernförderung über Bildung und Teilhabe für berechtigte Familien.",
              linkText: "Informationen",
              linkUrl: "/kostenlose-lernfoerderung_b",
              icon: "CheckCircle"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      }
    ]
  },
  {
    title: "Projekte & Engagement",
    slug: "projekte",
    description: "Unsere aktuellen sozialen Projekte und Bildungsinitiativen.",
    isSystem: true,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          eyebrow: "Engagement & Gesellschaft",
          title: "Unsere Projekte",
          subtitle: "Projekte, die Brücken bauen, Teilhabe stärken und Zukunft schaffen.",
          buttonText: "Mitmachen",
          buttonLink: "/kontakt"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-20",
          textAlign: "text-center",
          containerWidth: "max-w-4xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 1,
        content: {
          title: "Aktuelle Initiativen",
          subtitle: "Erfahren Sie mehr über unsere Arbeit vor Ort",
          columns: 3,
          items: [
            {
              title: "Future Connect",
              badge: "Jugend",
              description: "Zukunftsorientiertes Jugend- und Mentoringprojekt zur Stärkung von Medienkompetenz.",
              linkText: "Details",
              linkUrl: "/future-connect",
              icon: "Lightbulb"
            },
            {
              title: "Menschen stärken Menschen",
              badge: "Patenschaften",
              description: "Chancenpatenschaften für ein solidarisches Miteinander und gegenseitiges Lernen.",
              linkText: "Details",
              linkUrl: "/projekte/menschen-staerken",
              icon: "HeartHandshake"
            },
            {
              title: "Sprach-Café",
              badge: "Treffpunkt",
              description: "Offener Begegnungsort für ungezwungenen sprachlichen und kulturellen Austausch.",
              linkText: "Details",
              linkUrl: "/projekte/sprach-cafe",
              icon: "MessageCircle"
            },
            {
              title: "Stark im Umgang mit Konflikten",
              badge: "Prävention",
              description: "Workshops und Beratung für konstruktive Konfliktbewältigung.",
              linkText: "Details",
              linkUrl: "/projekte/konfliktmanagement",
              icon: "Shield"
            },
            {
              title: "Wir sind Vielfalt",
              badge: "Gemeinschaft",
              description: "Förderung von interkulturellem Verständnis und gesellschaftlicher Teilhabe.",
              linkText: "Details",
              linkUrl: "/projekte/wettbewerbe/wir-sind-vielfalt",
              icon: "Users2"
            },
            {
              title: "DSEE Mikroförderung",
              badge: "Ehrenamt",
              description: "Stärkung unseres ehrenamtlichen Netzwerks und digitaler Bildungsformate.",
              linkText: "Details",
              linkUrl: "/projekte/dsee",
              icon: "FileCheck"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      }
    ]
  },
  {
    title: "Beratung & Migrationsfachdienst",
    slug: "beratung",
    description: "Kostenlose Beratung für Migrantinnen und Migranten sowie Bildungsberatung.",
    isSystem: true,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          eyebrow: "Hilfe & Orientierung",
          title: "Beratungsangebote",
          subtitle: "Wir unterstützen Sie bei behördlichen Angelegenheiten, Integration und Bildung.",
          buttonText: "Termin buchen",
          buttonLink: "/kontakt"
        },
        design: {
          backgroundColor: "#0F4761",
          textColor: "#ffffff",
          padding: "py-20",
          textAlign: "text-center",
          containerWidth: "max-w-4xl"
        }
      },
      {
        type: "CARD_GRID",
        order: 1,
        content: {
          title: "Unsere Beratungsstellen",
          subtitle: "Individuelle, mehrsprachige und vertrauliche Beratung",
          columns: 3,
          items: [
            {
              title: "Migrationsfachdienst (MFD)",
              description: "Unterstützung beim Umgang mit Behörden, Formularen, Wohnen und Aufenthalt.",
              linkText: "Mehr erfahren",
              linkUrl: "/beratung",
              icon: "LifeBuoy"
            },
            {
              title: "AÖL - YÖS Beratung",
              description: "Beratung für das türkische Fernabitur und Vorbereitung auf das YÖS-Studium.",
              linkText: "Mehr erfahren",
              linkUrl: "/aol-yoes",
              icon: "GraduationCap"
            },
            {
              title: "Bildungswege in Ludwigshafen",
              description: "Schul- und Bildungsberatung für Kinder, Jugendliche und Eltern.",
              linkText: "Mehr erfahren",
              linkUrl: "/bildungswege-in-ludwigshafen-_b",
              icon: "Compass"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "py-16",
          containerWidth: "max-w-7xl"
        }
      }
    ]
  }
];
