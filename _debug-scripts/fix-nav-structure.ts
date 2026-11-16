import prisma from '../src/lib/prisma';

async function main() {
  // 1. Fix the ESF+ Alpha CMS page: its slug "kurse/esfplusalpha" collides with the
  // /kurse/[slug] course-detail route, which only looks up Course rows and 404s for
  // anything else. Moving it to a top-level slug makes it reachable via the CMS catch-all.
  const esfPage = await prisma.page.findUnique({ where: { slug: 'kurse/esfplusalpha' } });
  if (esfPage && esfPage.slug !== 'esfplusalpha') {
    const clash = await prisma.page.findUnique({ where: { slug: 'esfplusalpha' } });
    if (!clash) {
      await prisma.page.update({
        where: { id: esfPage.id },
        data: { slug: 'esfplusalpha' },
      });
      console.log('Renamed Page slug kurse/esfplusalpha -> esfplusalpha');
    } else {
      console.log('Skipped slug rename: esfplusalpha already exists');
    }
  } else {
    console.log('No kurse/esfplusalpha page found (already fixed or absent)');
  }

  // 2. Rebuild headerConfig.navLinks and footerConfig to match the agreed IA.
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    console.log('No global settings found, aborting nav rebuild');
    return;
  }

  const headerConfig = (settings.headerConfig as any) || {};
  const footerConfig = (settings.footerConfig as any) || {};

  headerConfig.navLinks = [
    {
      label: 'Deutsch & Grundbildung',
      url: '/deutsch-grundbildung',
      children: [
        {
          label: 'Integrationskurse',
          url: '/deutsch-grundbildung/integrationskurse',
          description: 'BAMF-gefördert für Alltag und Beruf (A1-B1)',
          icon: 'GraduationCap',
        },
        {
          label: 'Landesgeförderte Sprachkurse',
          url: '/deutsch-grundbildung/sprachkurse',
          description: 'Allgemeine Deutschkurse mit staatlicher Förderung',
          icon: 'Languages',
        },
        {
          label: 'Privat- & Firmenkurse',
          url: '/deutsch-grundbildung/privatkurse',
          description: 'Individuelle Deutschkurse für Privatpersonen und Unternehmen',
          icon: 'Building2',
        },
        {
          label: 'ESF+ Alpha Förderprogramm',
          url: '/esfplusalpha',
          description: 'Geförderte Kurse für bessere Arbeitsmarktchancen',
          badge: 'Gefördert',
          icon: 'Users2',
        },
        {
          label: 'telc Sprachprüfungen',
          url: '/telc-pruefungen',
          description: 'Offizielles telc Prüfungszentrum in Ludwigshafen',
          badge: 'telc',
          icon: 'Award',
        },
      ],
    },
    {
      label: 'Kinder & Jugendliche',
      url: '/kinder-jugendliche',
      children: [
        {
          label: 'Kostenlose Lernförderung (BuT)',
          url: '/kurse/nachhilfe/kostenlose-lernfoerderung',
          description: 'Kostenfreie Nachhilfe über Bildung & Teilhabe',
          badge: 'Kostenlos',
          icon: 'Sparkles',
        },
        {
          label: 'Blockunterricht & Ferienkurse',
          url: '/kurse/nachhilfe/blockunterricht',
          description: 'Intensivkurse in den Schulferien zur Notenverbesserung',
          icon: 'Calendar',
        },
        {
          label: 'Abitur- & Prüfungsvorbereitung',
          url: '/kinder-jugendliche/abiturvorbereitung',
          description: 'Gezielte Prüfungsvorbereitung für Realschule & Gymnasium',
          icon: 'FileCheck',
        },
        {
          label: 'Jugendbetreuung & Mentoring',
          url: '/jugendbetreuung',
          description: 'Individuelle Begleitung und Freizeitaktivitäten',
          icon: 'HeartHandshake',
        },
      ],
    },
    {
      label: 'Kurse',
      url: '/kurse',
    },
    {
      label: 'Beratung',
      url: '/beratung',
      children: [
        {
          label: 'Migrationsfachdienst (MFD)',
          url: '/beratung/mfd',
          description: 'Kostenfreie und vertrauliche Beratung für Zugewanderte',
          badge: 'Kostenfrei',
          icon: 'LifeBuoy',
        },
        {
          label: 'AÖL-YÖS Beratung',
          url: '/aol-yoes',
          description: 'Abitur- und Studienberatung für internationale Abschlüsse',
          icon: 'Compass',
        },
      ],
    },
    {
      label: 'Projekte',
      url: '/projekte',
      children: [
        {
          label: 'Future Connect',
          url: '/projekte/future-connect',
          description: 'Generationen vernetzen für morgen – Digitales Lernen auf Augenhöhe',
          badge: 'Digital',
          icon: 'Globe',
        },
        {
          label: 'Menschen stärken Menschen',
          url: '/projekte/menschen-staerken',
          description: 'Bundesweites Patenschafts- und Mentoringprogramm',
          icon: 'Users',
        },
        {
          label: 'Sprach-Café',
          url: '/projekte/sprach-cafe',
          description: 'Offener Treffpunkt zum Deutsch sprechen bei Tee & Kaffee',
          badge: 'Offen',
          icon: 'Coffee',
        },
        {
          label: 'Konfliktmanagement',
          url: '/projekte/konfliktmanagement',
          description: 'Trainings und Workshops für Engagierte und Ehrenamtliche',
          icon: 'Shield',
        },
        {
          label: 'DSEE: Ehrenamt stärken',
          url: '/projekte/dsee',
          description: 'Kooperation mit der Deutschen Stiftung für Engagement und Ehrenamt',
          icon: 'Handshake',
        },
        {
          label: 'Wettbewerbe',
          url: '/projekte/wettbewerbe',
          description: 'Schülerwettbewerbe, Aktionen und jährliche Bildungsmesse',
          badge: 'Wettbewerbe',
          icon: 'Trophy',
          children: [
            {
              label: 'Wir sind Vielfalt',
              url: '/projekte/wettbewerbe/wir-sind-vielfalt',
              description: 'Wettbewerbe und Aktionen für Zusammenhalt und Vielfalt',
              icon: 'Heart',
            },
            {
              label: 'Bildungsmesse',
              url: '/projekte/wettbewerbe/bildungsmesse',
              description: 'Jährliche Leistungsschau mit Schüler-Experimenten und Prämierung',
              icon: 'Sparkles',
            },
          ],
        },
      ],
    },
    {
      label: 'Über uns',
      url: '/ueber-uns',
      children: [
        {
          label: 'Unser Leitbild & Profil',
          url: '/ueber-uns/leitbild',
          description: 'Werte, Vision, Chancengleichheit und soziale Verantwortung seit 2002',
          icon: 'Target',
        },
        {
          label: 'Entstehung und Intention',
          url: '/ueber-uns/philosophie',
          description: 'Von der Eltern- und Bürgerinitiative zum anerkannten Bildungsträger',
          icon: 'Lightbulb',
        },
        {
          label: 'Satzung & Organisation',
          url: '/ueber-uns/satzung',
          description: 'Gemeinnützigkeit nach § 52 AO und offizielle Vereinssatzung',
          icon: 'Scale',
        },
        {
          label: 'Organigramm & Team',
          url: '/ueber-uns/organigramm',
          description: 'Die organisatorische Aufteilung unseres Vereins in Geschäftsführung, Pädagogik und Verwaltung',
          icon: 'Network',
        },
        {
          label: 'Räumlichkeiten',
          url: '/ueber-uns/raeumlichkeiten',
          description: '12 moderne Unterrichtsräume und Bibliothek am Ludwigsplatz 9a',
          icon: 'Building2',
        },
        {
          label: 'Bildergalerie',
          url: '/ueber-uns/galerie',
          description: 'Einblicke in unsere Räumlichkeiten, Kurse und Veranstaltungen',
          icon: 'Camera',
        },
        {
          label: 'Spenden & Unterstützen',
          url: '/spenden',
          description: 'Helfen Sie mit, Bildungschancen für benachteiligte Kinder zu sichern',
          badge: 'Spenden',
          icon: 'HeartHandshake',
        },
      ],
    },
    {
      label: 'Blog & Wissen',
      url: '/blog',
    },
  ];

  footerConfig.quickLinks = {
    title: 'Schnellzugriff',
    links: [
      { label: 'Deutsch & Grundbildung', url: '/deutsch-grundbildung' },
      { label: 'Integrationskurse', url: '/deutsch-grundbildung/integrationskurse' },
      { label: 'telc-Prüfungen buchen', url: 'https://pruefungscenter.de', isExternal: true },
      { label: 'Nachhilfe & Förderung', url: '/kinder-jugendliche' },
      { label: 'Migrationsfachdienst', url: '/beratung/mfd' },
      { label: 'Projekte & Engagement', url: '/projekte' },
      { label: 'ESF+ Alpha', url: '/esfplusalpha' },
      { label: 'Alle Kurse durchsuchen', url: '/kurse' },
      { label: 'Bildergalerie', url: '/ueber-uns/galerie' },
      { label: 'Karriere', url: '/karriere' },
      { label: 'Blog & Wissen', url: '/blog' },
    ],
  };

  const legalLinks = Array.isArray(footerConfig.legalLinks) ? footerConfig.legalLinks : [];
  if (!legalLinks.some((l: any) => l.url === '/cookies')) {
    legalLinks.push({ label: 'Cookies', url: '/cookies' });
  }
  footerConfig.legalLinks = legalLinks;

  await prisma.siteSettings.update({
    where: { id: 'global' },
    data: { headerConfig, footerConfig },
  });

  console.log('headerConfig.navLinks and footerConfig updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
