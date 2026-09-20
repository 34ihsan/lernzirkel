export interface NavSubItem {
  label: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavLinkItem {
  label: string;
  url: string;
  isExternal?: boolean;
  isHighlight?: boolean;
  badge?: string;
  children?: NavSubItem[];
}

export interface HeaderConfig {
  topBar?: {
    enabled?: boolean;
    phone?: string;
    email?: string;
    tagline?: string;
    links?: { label: string; url: string }[];
    showLanguage?: boolean;
    donateButton?: { enabled: boolean; text: string; url: string };
    fontSize?: number; // Metin boyutu (px), örn: 11 - 18
    height?: number; // Şerit yüksekliği (px), örn: 32 - 56
    paddingY?: number; // Dikey dolgu (px), örn: 0 - 16
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    letterSpacing?: 'tight' | 'normal' | 'wide';
    itemGap?: number; // Öğeler arası boşluk (px), örn: 8 - 36
    showDividers?: boolean; // Öğeler arasında zarif dikey ayrım çizgileri (|)
  };
  logo?: {
    imageUrl?: string;
    text?: string;
    showText?: boolean;
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'right'; // Logo konumu (Sol / Merkez / Sağ)
    marginLeft?: number; // Sol sayfa sınırından uzaklık (px)
    marginRight?: number; // Nav menüye olan emniyet mesafesi (px)
    maxWidth?: number; // Logo alanının aşamayacağı maksimum genişlik (px)
    showDivider?: boolean; // Logo ile menü arasında dikey ayrım çizgisi
  };
  navLinks?: NavLinkItem[];
  ctaButton?: {
    enabled?: boolean;
    text?: string;
    url?: string;
    align?: 'far-right' | 'right' | 'attached';
    marginRight?: number; // Sağ sayfa sınırından uzaklık (px)
    marginLeft?: number; // Nav menü ile arasındaki emniyet mesafesi (px)
    paddingX?: number; // Yatay iç boşluk (px)
    paddingY?: number; // Dikey iç boşluk (px)
    fontSize?: number; // Yazı boyutu (px)
    borderRadius?: 'pill' | 'rounded' | 'square';
    style?: 'primary' | 'accent' | 'outline' | 'custom';
    customBgColor?: string;
    customTextColor?: string;
    icon?: 'none' | 'arrow' | 'mail' | 'phone' | 'send' | 'sparkles';
    isExternal?: boolean;
  };
  design?: {
    topBarBg?: string;
    topBarText?: string;
    navBg?: string;
    navText?: string;
    navHoverText?: string;
    navActiveText?: string;
    navFontSize?: number; // Menü yazı boyutu px (örn: 11 - 16)
    navFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    isSticky?: boolean;
    navLayout?: 'space-between' | 'center' | 'left' | 'right';
    navGap?: number; // Menü öğeleri arası boşluk px
    showDropdownArrows?: boolean; // Açılır menü yön oklarını (chevron) göster/gizle
    autoScaleMenu?: boolean; // Tek satıra sığdırmak için yazı boyutunu otomatik küçült
    fullWidth?: boolean; // Tam genişlik (Kenardan kenara - 100%) veya kutulu (1600px)
    showSearch?: boolean; // Menüde site içi arama butonunu göster
  };
}

export interface BadgePartnerItem {
  id?: string;
  name: string;
  logoUrl?: string; // Yerel yüklenen görsel URL'i (örn: /uploads/...) veya harici URL
  url?: string; // Tıklandığında gidilecek web bağlantısı (opsiyonel)
  width?: number; // Logo genişliği px (varsayılan: 120)
  height?: number; // Logo yüksekliği px (varsayılan: 40)
}

export interface DepartmentOpeningHoursDay {
  day: 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

export interface DepartmentOpeningHoursItem {
  id?: string;
  name: string;
  note?: string;
  hours: DepartmentOpeningHoursDay[];
}

export interface FooterConfig {
  about?: {
    title?: string;
    text?: string;
    address?: string;
    phone?: string;
    email?: string;
    mapsUrl?: string;
    showMapsLink?: boolean;
    mapsLinkText?: string;
    showMapEmbed?: boolean;
    mapEmbedHeight?: number;
    logoUrl?: string;
    showLogo?: boolean;
    showTitle?: boolean;
    logoWidth?: number;
    logoHeight?: number;
    logoPosition?: 'above-title' | 'inline' | 'replace-title';
    logoAlign?: 'left' | 'center';
    logoMarginBottom?: number;
  };
  quickLinks?: {
    title?: string;
    links?: { label: string; url: string; isExternal?: boolean }[];
  };
  badges?: {
    title?: string;
    items?: string[]; // Geriye dönük uyumluluk için metin listesi
    partners?: BadgePartnerItem[]; // Local logo yükleme ve link destekli zengin partner listesi
    showTitle?: boolean;
  };
  donateBlock?: {
    title?: string;
    text?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  openingHours?: {
    title?: string;
    showTitle?: boolean;
    departments?: DepartmentOpeningHoursItem[];
  };
  copyright?: string;
  legalLinks?: { label: string; url: string }[];
  design?: {
    backgroundColor?: string;
    textColor?: string;
    headingColor?: string;
  };
}

export const defaultHeaderConfig: HeaderConfig = {
  topBar: {
    enabled: true,
    phone: "0621 / 123 45 67",
    email: "info@lernzirkel-online.de",
    tagline: "",
    links: [
      { label: "Aktuelles", url: "/aktuelles" },
      { label: "Stellenangebote", url: "/stellenangebote" }
    ],
    showLanguage: true,
    donateButton: { enabled: true, text: "Spenden", url: "/spenden" },
    fontSize: 13,
    height: 40,
    paddingY: 0,
    fontWeight: 'normal',
    letterSpacing: 'normal',
    itemGap: 18,
    showDividers: true
  },
  logo: {
    imageUrl: "/logo.png",
    text: "Lernzirkel",
    showText: false,
    width: 160,
    height: 60,
    align: 'left',
    marginLeft: 0,
    marginRight: 28,
    maxWidth: 240,
    showDivider: false
  },
  navLinks: [
    { 
      label: "Deutsch & Grundbildung", 
      url: "/deutsch-grundbildung",
      children: [
        {
          label: "Allgemeine Integrationskurse",
          url: "/kurse",
          description: "BAMF-gefördert für Alltag und Beruf (A1-B1)",
          icon: "GraduationCap"
        },
        {
          label: "Alphabetisierung & Grundbildung",
          url: "/deutsch-grundbildung",
          description: "Schritt für Schritt Deutsch lesen und schreiben lernen",
          icon: "Languages"
        },
        {
          label: "ESF+ Alpha Förderprogramm",
          url: "/esfplusalpha",
          description: "Geförderte Kurse für bessere Arbeitsmarktchancen",
          badge: "Gefördert",
          icon: "Users2"
        },
        {
          label: "telc Sprachprüfungen",
          url: "/telc-pruefungen",
          description: "Offizielles telc Prüfungszentrum in Ludwigshafen",
          badge: "telc",
          icon: "Award"
        }
      ]
    },
    { 
      label: "Kinder & Jugendliche", 
      url: "/kinder-jugendliche",
      children: [
        {
          label: "Kostenlose Lernförderung (BuT)",
          url: "/kostenlose-lernfoerderung_b",
          description: "Kostenfreie Nachhilfe über Bildung & Teilhabe",
          badge: "Kostenlos",
          icon: "Sparkles"
        },
        {
          label: "Abitur- & Prüfungsvorbereitung",
          url: "/abiturvorbereitung",
          description: "Gezielte Prüfungsvorbereitung für Realschule & Gymnasium",
          icon: "FileCheck"
        },
        {
          label: "Blockunterricht & Ferienkurse",
          url: "/blockunterricht",
          description: "Intensivkurse in den Schulferien zur Notenverbesserung",
          icon: "Calendar"
        },
        {
          label: "Jugendbetreuung & Mentoring",
          url: "/jugendbetreuung",
          description: "Individuelle Begleitung und Freizeitaktivitäten",
          icon: "HeartHandshake"
        }
      ]
    },
    { 
      label: "Beratung", 
      url: "/beratung",
      children: [
        {
          label: "Migrationsfachdienst (MFD)",
          url: "/beratung",
          description: "Kostenfreie und vertrauliche Beratung für Zugewanderte",
          badge: "Kostenfrei",
          icon: "LifeBuoy"
        },
        {
          label: "AÖL-YÖS Beratung",
          url: "/aol-yoes",
          description: "Abitur- und Studienberatung für internationale Abschlüsse",
          icon: "Compass"
        },
        {
          label: "Bildungswege in Ludwigshafen",
          url: "/bildungswege-in-ludwigshafen-_b",
          description: "Orientierung und Beratung im lokalen Bildungssystem",
          icon: "MapPin"
        }
      ]
    },
    { 
      label: "Projekte", 
      url: "/projekte",
      children: [
        {
          label: "Future Connect",
          url: "/future-connect",
          description: "Digitale Medienkompetenz und IT-Workshops für Jugendliche",
          badge: "Digital",
          icon: "Globe"
        },
        {
          label: "Menschen stärken Menschen",
          url: "/menschen-staerken",
          description: "Bundesweites Patenschafts- und Mentoringprogramm",
          icon: "Users"
        },
        {
          label: "Sprach-Café",
          url: "/sprach-cafe",
          description: "Offener Treffpunkt zum Deutsch sprechen bei Tee & Kaffee",
          badge: "Offen",
          icon: "Coffee"
        },
        {
          label: "Konfliktmanagement",
          url: "/konfliktmanagement",
          description: "Trainings und Workshops für Engagierte und Ehrenamtliche",
          icon: "Shield"
        },
        {
          label: "Wir sind Vielfalt",
          url: "/wir-sind-vielfalt",
          description: "Wettbewerbe und Aktionen für Zusammenhalt und Vielfalt",
          icon: "Heart"
        }
      ]
    },
    { 
      label: "Über uns", 
      url: "/ueber-uns",
      children: [
        {
          label: "Unser Leitbild & Profil",
          url: "/ueber-uns",
          description: "Werte, Vision und soziale Verantwortung seit 2002",
          icon: "Info"
        },
        {
          label: "Satzung & Organisation",
          url: "/satzung",
          description: "Rechtliche Grundlagen und Vereinsstruktur",
          icon: "FileText"
        },
        {
          label: "Bildergalerie",
          url: "/galerie",
          description: "Einblicke in Räumlichkeiten, Kurse und Veranstaltungen",
          icon: "Image"
        },
        {
          label: "Spenden & Unterstützen",
          url: "/spenden",
          description: "Helfen Sie mit, Bildungschancen für alle zu schaffen",
          badge: "Spenden",
          icon: "HandHeart"
        }
      ]
    },
    { label: "ESF+ Alpha", url: "/esfplusalpha", isHighlight: true }
  ],
  ctaButton: {
    enabled: true,
    text: "Kontakt",
    url: "/kontakt",
    align: 'far-right',
    marginRight: 0,
    marginLeft: 20,
    paddingX: 18,
    paddingY: 10,
    fontSize: 13,
    borderRadius: 'pill',
    style: 'primary',
    customBgColor: '#0F4761',
    customTextColor: '#ffffff',
    icon: 'none',
    isExternal: false
  },
  design: {
    topBarBg: "#0F4761",
    topBarText: "#ffffff",
    navBg: "#ffffff",
    navText: "#333333",
    navHoverText: "#0F4761",
    navActiveText: "#0F4761",
    navFontSize: 13,
    navFontWeight: 'medium',
    isSticky: true,
    navLayout: 'space-between',
    navGap: 16,
    showDropdownArrows: false,
    autoScaleMenu: true,
    fullWidth: true,
    showSearch: true
  }
};

export const defaultFooterConfig: FooterConfig = {
  about: {
    title: "Über den Lernzirkel",
    text: "Seit 2002 engagieren wir uns für Bildung, Chancengleichheit und gesellschaftliche Teilhabe in Ludwigshafen und der Metropolregion Rhein-Neckar.",
    address: "Musterstraße 123, 67061 Ludwigshafen",
    phone: "0621 / 123 45 67",
    email: "info@lernzirkel-online.de",
    mapsUrl: "",
    showMapsLink: true,
    mapsLinkText: "Auf Google Maps anzeigen",
    showMapEmbed: false,
    mapEmbedHeight: 160,
    logoUrl: "/logo.png",
    showLogo: true,
    showTitle: true,
    logoWidth: 160,
    logoHeight: 52,
    logoPosition: 'above-title',
    logoAlign: 'left',
    logoMarginBottom: 16
  },
  quickLinks: {
    title: "Schnellzugriff",
    links: [
      { label: "Deutsch & Grundbildung", url: "/deutsch-grundbildung" },
      { label: "Integrationskurse", url: "/kurse" },
      { label: "telc-Prüfungen buchen", url: "https://pruefungscenter.de", isExternal: true },
      { label: "Nachhilfe & Förderung", url: "/kinder-jugendliche" },
      { label: "Migrationsfachdienst", url: "/beratung" },
      { label: "Projekte & Engagement", url: "/projekte" },
      { label: "ESF+ Alpha", url: "/esfplusalpha" },
      { label: "Bildergalerie", url: "/ueber-uns/galerie" }
    ]
  },
  badges: {
    title: "Zertifiziert & Gefördert durch:",
    items: ["AZAV", "BAMF", "ESF+", "Stadt Ludwigshafen"],
    partners: [
      { name: "AZAV", logoUrl: "", url: "", width: 120, height: 40 },
      { name: "BAMF", logoUrl: "", url: "https://www.bamf.de", width: 120, height: 40 },
      { name: "ESF+", logoUrl: "", url: "", width: 120, height: 40 },
      { name: "Stadt Ludwigshafen", logoUrl: "", url: "https://www.ludwigshafen.de", width: 120, height: 40 }
    ],
    showTitle: true
  },
  donateBlock: {
    title: "Unterstützen Sie uns",
    text: "Ihre Spende hilft uns, Bildungschancen zu ermöglichen.",
    buttonText: "Jetzt spenden",
    buttonUrl: "/spenden"
  },
  openingHours: {
    title: "Öffnungszeiten",
    showTitle: true,
    departments: [
      {
        id: "dept-bildung",
        name: "Bildung & Nachhilfe",
        note: "Nachhilfe, Prüfungsvorbereitung und Lernförderung",
        hours: [
          { day: "Mo", openTime: "14:00", closeTime: "19:00", isClosed: false },
          { day: "Di", openTime: "14:00", closeTime: "19:00", isClosed: false },
          { day: "Mi", openTime: "14:00", closeTime: "19:00", isClosed: false },
          { day: "Do", openTime: "14:00", closeTime: "19:00", isClosed: false },
          { day: "Fr", openTime: "14:00", closeTime: "19:00", isClosed: false },
          { day: "Sa", openTime: "10:00", closeTime: "14:00", isClosed: false },
          { day: "So", openTime: "", closeTime: "", isClosed: true }
        ]
      },
      {
        id: "dept-sprache",
        name: "Sprache & Integration",
        note: "Integrationskurse, Sprachkurse und telc-Prüfungen",
        hours: [
          { day: "Mo", openTime: "08:00", closeTime: "16:00", isClosed: false },
          { day: "Di", openTime: "08:00", closeTime: "16:00", isClosed: false },
          { day: "Mi", openTime: "08:00", closeTime: "16:00", isClosed: false },
          { day: "Do", openTime: "08:00", closeTime: "16:00", isClosed: false },
          { day: "Fr", openTime: "08:00", closeTime: "14:00", isClosed: false },
          { day: "Sa", openTime: "", closeTime: "", isClosed: true },
          { day: "So", openTime: "", closeTime: "", isClosed: true }
        ]
      },
      {
        id: "dept-mfd",
        name: "Beratung (MFD)",
        note: "Nur nach Terminvereinbarung",
        hours: [
          { day: "Mo", openTime: "", closeTime: "", isClosed: true },
          { day: "Di", openTime: "10:00", closeTime: "15:00", isClosed: false },
          { day: "Mi", openTime: "", closeTime: "", isClosed: true },
          { day: "Do", openTime: "10:00", closeTime: "15:00", isClosed: false },
          { day: "Fr", openTime: "", closeTime: "", isClosed: true },
          { day: "Sa", openTime: "", closeTime: "", isClosed: true },
          { day: "So", openTime: "", closeTime: "", isClosed: true }
        ]
      }
    ]
  },
  copyright: "© {year} Lernzirkel Ludwigshafen e.V. Alle Rechte vorbehalten.",
  legalLinks: [
    { label: "Impressum", url: "/impressum" },
    { label: "Datenschutz", url: "/datenschutz" },
    { label: "AGB", url: "/agb" }
  ],
  design: {
    backgroundColor: "#111111",
    textColor: "#9ca3af",
    headingColor: "#ffffff"
  }
};
