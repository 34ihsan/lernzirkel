'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  X, 
  ArrowUpDown, 
  GraduationCap, 
  Languages, 
  Users2, 
  BookOpen, 
  Briefcase, 
  Award, 
  Sparkles, 
  Calendar, 
  Clock, 
  Euro, 
  CheckCircle2, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  RotateCcw,
  BadgeCheck,
  ChevronRight,
  Phone,
  Mail,
  HelpCircle,
  Building2,
  FileCheck
} from 'lucide-react';

export interface CourseItem {
  id: string;
  title: string;
  slug?: string;
  link: string;
  category: 'INTEGRATION' | 'SPRACHE' | 'NACHHILFE' | 'GRUNDBILDUNG' | 'PRUEFUNG' | 'ANDERE';
  categoryLabel: string;
  description: string;
  targetAudience?: string;
  requirements?: string;
  costsInfo?: string;
  fundingType?: 'bamf' | 'but' | 'esf' | 'free' | 'private' | 'land';
  fundingLabel?: string;
  level?: string[]; // e.g. ['A1', 'A2', 'B1']
  schedule?: string;
  duration?: string;
  badge?: string;
  badgeColor?: string;
  isPopular?: boolean;
}

// Comprehensive catalog of Lernzirkel courses and programs
const defaultCatalogCourses: CourseItem[] = [
  {
    id: 'bamf-allgemein',
    title: 'Allgemeine Integrationskurse (BAMF)',
    link: '/deutsch-grundbildung/integrationskurse',
    category: 'INTEGRATION',
    categoryLabel: 'Integrationskurse',
    description: 'Vom Bundesamt für Migration und Flüchtlinge (BAMF) geförderte Deutschkurse vom Sprachniveau A1 bis B1 (600 UE Sprachkurs) plus 100 UE Orientierungskurs zur Vorbereitung auf den Deutsch-Test für Zuwanderer (DTZ).',
    targetAudience: 'Zuwanderer, Geflüchtete und Migranten mit Bleibeperspektive',
    requirements: 'BAMF-Berechtigungsschein oder Verpflichtung durch Jobcenter / Ausländerbehörde',
    costsInfo: 'Kostenlos bei Leistungsbezug (Bürgergeld/AsylbLG), ansonsten geförderter Eigenanteil (2,29 € / UE)',
    fundingType: 'bamf',
    fundingLabel: 'BAMF-gefördert',
    level: ['A1', 'A2', 'B1'],
    schedule: 'Vormittags (08:30 - 12:45 Uhr) & Nachmittags',
    duration: '700 Unterrichtsstunden (ca. 7 Monate)',
    badge: 'BAMF-zertifiziert',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    isPopular: true,
  },
  {
    id: 'bamf-alpha',
    title: 'Integrationskurs mit Alphabetisierung',
    link: '/deutsch-grundbildung/integrationskurse-alpha',
    category: 'GRUNDBILDUNG',
    categoryLabel: 'Alphabetisierung',
    description: 'Spezialkurs für Teilnehmende, die das lateinische Alphabet nicht oder nur unzureichend beherrschen. Neben Deutschlernen wird das Lesen und Schreiben von Grund auf vermittelt.',
    targetAudience: 'Primäre und funktionale Analphabeten, Zweitschriftlernende',
    requirements: 'Einstufungstest vor Ort im Lernzirkel e.V.',
    costsInfo: '100% Kostenübernahme über BAMF / Jobcenter möglich',
    fundingType: 'bamf',
    fundingLabel: 'BAMF-gefördert',
    level: ['Alphabetisierung', 'A1', 'A2'],
    schedule: 'Mo. - Do. Vormittags',
    duration: 'Bis zu 1.200 Unterrichtsstunden',
    badge: 'Alphabetisierung',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    isPopular: true,
  },
  {
    id: 'esf-alpha',
    title: 'ESF+ Alpha: Grundbildung & Alltagskompetenzen',
    link: '/esfplusalpha',
    category: 'GRUNDBILDUNG',
    categoryLabel: 'Alphabetisierung',
    description: 'Niedrigschwellige Grundbildung für Erwachsene mit Unterstützung des Europäischen Sozialfonds (ESF+). Lesen, Schreiben, einfache Mathematik und digitale Alltagskompetenzen.',
    targetAudience: 'Erwachsene mit Förderbedarf in Grundbildung',
    requirements: 'Keine formellen Voraussetzungen nötig',
    costsInfo: 'Vollständig gebührenfrei dank Europäischer Union (ESF+) & Land RLP',
    fundingType: 'esf',
    fundingLabel: 'ESF+ Förderung (Kostenlos)',
    level: ['Alphabetisierung', 'A1'],
    schedule: 'Flexible Vormittags- und Nachmittagsmodule',
    duration: 'Laufender Moduleinstieg möglich',
    badge: '100% Kostenlos',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    isPopular: true,
  },
  {
    id: 'but-nachhilfe',
    title: 'Kostenlose Lernförderung & Nachhilfe (BuT)',
    link: '/kostenlose-lernfoerderung_b',
    category: 'NACHHILFE',
    categoryLabel: 'Schüler & Nachhilfe',
    description: 'Gezielte, individuelle Nachhilfe in Kleingruppen für alle Schulfächer (Mathematik, Deutsch, Englisch etc.) über das Bildungs- und Teilhabepaket (BuT). Notenverbesserung und Versetzungsabsicherung.',
    targetAudience: 'Schülerinnen & Schüler der Klassen 1 bis 13 (Grundschule bis Abitur)',
    requirements: 'BuT-Berechtigung (Leistungsbezug: Bürgergeld, Wohngeld, Kinderzuschlag)',
    costsInfo: '100% kostenlos über das BuT-Gutscheinsystem der Stadt Ludwigshafen / Jobcenter',
    fundingType: 'but',
    fundingLabel: 'BuT (100% Kostenlos)',
    level: ['Schule', 'Grundschule', 'Sek I', 'Sek II'],
    schedule: 'Mo. - Fr. 14:00 - 19:00 Uhr & Sa. 10:00 - 14:00 Uhr',
    duration: 'Begleitend zum gesamten Schuljahr',
    badge: 'BuT Kostenlos',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    isPopular: true,
  },
  {
    id: 'telc-pruefungen',
    title: 'telc Sprachprüfungen & Prüfungszentrum',
    link: '/telc-pruefungen',
    category: 'PRUEFUNG',
    categoryLabel: 'telc Prüfungen',
    description: 'Offiziell lizenziertes telc Prüfungszentrum. Wir nehmen anerkannte Sprachprüfungen für A1, A2, B1 (DTZ), B2 und C1 ab. Ideal für Einbürgerung, Berufsausübung und Hochschulzulassung.',
    targetAudience: 'Alle Personen, die ein international anerkanntes Sprachzertifikat benötigen',
    requirements: 'Rechtzeitige Anmeldung (mindestens 30 Tage vor Prüfungstermin)',
    costsInfo: 'Prüfungsgebühren nach telc Richtlinien oder im Integrationskurs inbegriffen',
    fundingType: 'bamf',
    fundingLabel: 'Offizielles Prüfungszentrum',
    level: ['A1', 'A2', 'B1', 'B2', 'C1'],
    schedule: 'Regelmäßige monatliche Prüfungssamstage',
    duration: 'Schriftliche & Mündliche Prüfung an einem Tag',
    badge: 'telc Zentrum',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    isPopular: true,
  },
  {
    id: 'abiturvorbereitung',
    title: 'Abitur- & Abschlussprüfungsvorbereitung',
    link: '/abiturvorbereitung',
    category: 'NACHHILFE',
    categoryLabel: 'Schüler & Nachhilfe',
    description: 'Intensives Training für zentrale Prüfungen: Mittlere Reife, Fachabitur und Abitur. Schließen von Wissenslücken, Klausurtraining, Altklausuren und Prüfungsstrategien unter erfahrener Anleitung.',
    targetAudience: 'Abschlussklassen an Gymnasien, IGS, Realschulen Plus und Fachoberschulen',
    requirements: 'Voranmeldung zur individuellen Bedarfsanalyse',
    costsInfo: 'Kostenübernahme über BuT möglich oder günstige Monatstarife',
    fundingType: 'but',
    fundingLabel: 'BuT / Privat',
    level: ['Schule', 'Sek I', 'Sek II', 'Abitur'],
    schedule: 'Nachmittags & Intensiv-Wochenenden',
    duration: '3 bis 6 Monate gezielte Vorbereitung',
    badge: 'Erfolgsquote >90%',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    isPopular: false,
  },
  {
    id: 'blockunterricht',
    title: 'Ferienkurse & Blockunterricht',
    link: '/blockunterricht',
    category: 'NACHHILFE',
    categoryLabel: 'Schüler & Nachhilfe',
    description: 'Kompaktkurse in den Oster-, Sommer- und Herbstferien. Ideal, um Versäumnisse aus dem Schuljahr strukturiert aufzuholen und mit Selbstvertrauen ins neue Halbjahr zu starten.',
    targetAudience: 'Klassenstufen 1 bis 13',
    requirements: 'Offen für alle Schüler',
    costsInfo: 'BuT-Förderung anrechenbar oder Feriencamp-Pauschale',
    fundingType: 'but',
    fundingLabel: 'BuT / Feriencamp',
    level: ['Schule', 'Grundschule', 'Sek I', 'Sek II'],
    schedule: 'Täglich 3-4 Stunden in den Schulferien',
    duration: '1 bis 2 Wochen Kompaktblock',
    badge: 'Ferienprogramm',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    isPopular: false,
  },
  {
    id: 'land-sprachkurse',
    title: 'Landesgeförderte Sprachkurse Rheinland-Pfalz',
    link: '/deutsch-grundbildung/sprachkurse',
    category: 'SPRACHE',
    categoryLabel: 'Sprachkurse',
    description: 'Niedrigschwellige Deutschkurse zur gesellschaftlichen Teilhabe, gefördert durch das Land Rheinland-Pfalz. Für Menschen, die keinen direkten BAMF-Zugang haben.',
    targetAudience: 'Bürgerinnen & Bürger mit Migrationshintergrund in Ludwigshafen & RLP',
    requirements: 'Wohnsitz in Rheinland-Pfalz',
    costsInfo: 'Gefördert durch Landesmittel, geringer oder kein Eigenanteil',
    fundingType: 'land',
    fundingLabel: 'Landesförderung RLP',
    level: ['A1', 'A2'],
    schedule: 'Vormittags & Nachmittags',
    duration: 'Je nach Kursabschnitt (100 - 300 UE)',
    badge: 'Land RLP',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    isPopular: false,
  },
  {
    id: 'privat-beruf',
    title: 'Privatkurse, Einzelunterricht & Firmenkurse',
    link: '/deutsch-grundbildung/privatkurse',
    category: 'SPRACHE',
    categoryLabel: 'Sprachkurse',
    description: 'Maßgeschneiderte Sprachschulungen für Führungskräfte, Unternehmen, Pflege- und Fachkräfte. Flexibler Stundenplan, fachspezifischer Wortschatz und individuelles Lerntempo.',
    targetAudience: 'Berufstätige, Firmenkunden, medizinisches Personal, Privatpersonen',
    requirements: 'Individuelle Terminabsprache',
    costsInfo: 'Transparente Stundensätze oder Firmenpauschalen nach Vereinbarung',
    fundingType: 'private',
    fundingLabel: 'Privat & Firmen',
    level: ['A1', 'A2', 'B1', 'B2', 'C1'],
    schedule: 'Höchst flexibel: Vor Ort, Online oder In-House beim Kunden',
    duration: 'Frei wählbar nach individuellem Ziel',
    badge: 'Maßgeschneidert',
    badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    isPopular: false,
  },
  {
    id: 'orientierung-lid',
    title: 'Orientierungskurs & Leben in Deutschland (LiD)',
    link: '/deutsch-grundbildung/integrationskurse',
    category: 'INTEGRATION',
    categoryLabel: 'Integrationskurse',
    description: '100 Unterrichtsstunden zu deutscher Geschichte, Politik, Rechtssystem, Grundwerten und Kultur. Schließt mit dem bundesweiten Test "Leben in Deutschland" (Einbürgerungstest) ab.',
    targetAudience: 'Integrationskursteilnehmer sowie Einbürgerungsbewerber',
    requirements: 'Ausreichende Deutschkenntnisse (mindestens Niveau B1 empfohlen)',
    costsInfo: 'Im BAMF-Integrationskurs enthalten oder günstige Modulteilnahme',
    fundingType: 'bamf',
    fundingLabel: 'BAMF / Einbürgerung',
    level: ['B1', 'B2'],
    schedule: 'Vormittags oder Blockseminar',
    duration: '100 Unterrichtsstunden (ca. 4-5 Wochen)',
    badge: 'Einbürgerungstest',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    isPopular: false,
  },
];

interface Props {
  initialCourses?: any[];
}

export default function AdvancedCourseExplorer({ initialCourses = [] }: Props) {
  // Merge dynamic DB courses with default catalog
  const allCourses: CourseItem[] = useMemo(() => {
    const formattedDbCourses: CourseItem[] = (initialCourses || []).map((db: any) => {
      let fundingType: CourseItem['fundingType'] = 'private';
      const costsLower = (db.costsInfo || '').toLowerCase();
      if (costsLower.includes('bamf')) fundingType = 'bamf';
      else if (costsLower.includes('but') || costsLower.includes('kostenlos')) fundingType = 'but';
      else if (costsLower.includes('esf')) fundingType = 'esf';

      return {
        id: db.id,
        title: db.title,
        link: db.design?.slug ? `/kurse/${db.design.slug}` : `/kurse/${db.id}`,
        category: db.category || 'ANDERE',
        categoryLabel: db.category === 'INTEGRATION' ? 'Integrationskurse' :
                       db.category === 'GRUNDBILDUNG' ? 'Alphabetisierung' :
                       db.category === 'NACHHILFE' ? 'Schüler & Nachhilfe' :
                       db.category === 'SPRACHE' ? 'Sprachkurse' : 'Bildungsangebot',
        description: db.description || '',
        targetAudience: db.targetAudience || 'Interessierte Teilnehmende',
        requirements: db.requirements || 'Persönliche Beratung',
        costsInfo: db.costsInfo || 'Auf Anfrage',
        fundingType,
        fundingLabel: db.costsInfo || 'Verfügbar',
        level: db.design?.level ? db.design.level.split(',').map((l: string) => l.trim()) : ['A1', 'A2', 'B1'],
        schedule: db.design?.schedule || (db.startDate ? `Ab ${new Date(db.startDate).toLocaleDateString('de-DE')}` : 'Laufender Einstieg'),
        duration: db.endDate ? `Bis ${new Date(db.endDate).toLocaleDateString('de-DE')}` : 'Flexibel',
        badge: 'Aktuelles Angebot',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        isPopular: false
      };
    });

    // Deduplicate or append
    return [...defaultCatalogCourses, ...formattedDbCourses];
  }, [initialCourses]);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedFunding, setSelectedFunding] = useState<string>('ALL');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'title-asc' | 'title-desc' | 'level-asc' | 'level-desc'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inquiryCourse, setInquiryCourse] = useState<CourseItem | null>(null);

  // Category Tabs
  const categories = [
    { id: 'ALL', label: 'Alle Angebote', icon: Sparkles, count: allCourses.length },
    { id: 'INTEGRATION', label: 'Integrationskurse (BAMF)', icon: GraduationCap },
    { id: 'GRUNDBILDUNG', label: 'Alphabetisierung & ESF+', icon: BookOpen },
    { id: 'NACHHILFE', label: 'Schüler & Nachhilfe (BuT)', icon: Users2 },
    { id: 'PRUEFUNG', label: 'telc Prüfungen', icon: Award },
    { id: 'SPRACHE', label: 'Sprach- & Privatkurse', icon: Languages },
  ];

  // Levels
  const levelOptions = [
    { id: 'ALL', label: 'Alle Niveaus & Zielgruppen' },
    { id: 'A1', label: 'A1 (Anfänger ohne Vorkenntnisse)' },
    { id: 'A2', label: 'A2 (Grundlegende Sprachkenntnisse)' },
    { id: 'B1', label: 'B1 (Selbstständige Sprachverwendung / DTZ)' },
    { id: 'B2', label: 'B2 (Berufssprachkurs / Fachkräfte)' },
    { id: 'C1', label: 'C1 (Fortgeschrittenes Hochschulniveau)' },
    { id: 'Alphabetisierung', label: 'Alphabetisierung (Schriftlos)' },
    { id: 'Schule', label: 'Schule (Klasse 1-13 / Abitur)' },
  ];

  // Funding Options
  const fundingOptions = [
    { id: 'ALL', label: 'Alle Finanzierungsarten' },
    { id: 'free_or_but', label: 'Kostenlos (BuT / 100% gefördert)' },
    { id: 'bamf', label: 'BAMF gefördert' },
    { id: 'esf', label: 'ESF+ Förderung' },
    { id: 'private', label: 'Selbstzahler / Privat / Firmen' },
  ];

  // Schedule Options
  const scheduleOptions = [
    { id: 'ALL', label: 'Alle Kurszeiten' },
    { id: 'vormittag', label: 'Vormittagskurse (Mo-Fr)' },
    { id: 'nachmittag', label: 'Nachmittags & Abends' },
    { id: 'ferien', label: 'Ferien- & Intensivkurse' },
    { id: 'samstag', label: 'Samstags / Wochenendtermine' },
  ];

  // Filter and Sort Pipeline
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];

    // 1. Text Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.targetAudience && c.targetAudience.toLowerCase().includes(q)) ||
        (c.requirements && c.requirements.toLowerCase().includes(q)) ||
        (c.costsInfo && c.costsInfo.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.level && c.level.some(lvl => lvl.toLowerCase().includes(q)))
      );
    }

    // 2. Category Tab
    if (selectedCategory !== 'ALL') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // 3. Level Filter
    if (selectedLevel !== 'ALL') {
      result = result.filter(c => c.level && c.level.includes(selectedLevel));
    }

    // 4. Funding Filter
    if (selectedFunding !== 'ALL') {
      if (selectedFunding === 'free_or_but') {
        result = result.filter(c => c.fundingType === 'but' || c.fundingType === 'esf' || c.costsInfo?.toLowerCase().includes('kostenlos'));
      } else if (selectedFunding === 'bamf') {
        result = result.filter(c => c.fundingType === 'bamf');
      } else if (selectedFunding === 'esf') {
        result = result.filter(c => c.fundingType === 'esf');
      } else if (selectedFunding === 'private') {
        result = result.filter(c => c.fundingType === 'private');
      }
    }

    // 5. Schedule Filter
    if (selectedSchedule !== 'ALL') {
      if (selectedSchedule === 'vormittag') {
        result = result.filter(c => c.schedule?.toLowerCase().includes('vormittag'));
      } else if (selectedSchedule === 'nachmittag') {
        result = result.filter(c => c.schedule?.toLowerCase().includes('nachmittag') || c.schedule?.toLowerCase().includes('abend'));
      } else if (selectedSchedule === 'ferien') {
        result = result.filter(c => c.schedule?.toLowerCase().includes('ferien') || c.title.toLowerCase().includes('ferien') || c.title.toLowerCase().includes('block'));
      } else if (selectedSchedule === 'samstag') {
        result = result.filter(c => c.schedule?.toLowerCase().includes('samstag') || c.schedule?.toLowerCase().includes('wochenende'));
      }
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.title.localeCompare(b.title, 'de');
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title, 'de');
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title, 'de');
      }
      if (sortBy === 'level-asc') {
        const lvlOrder: Record<string, number> = { 'Alphabetisierung': 1, 'A1': 2, 'A2': 3, 'B1': 4, 'B2': 5, 'C1': 6, 'Schule': 7 };
        const aVal = Math.min(...(a.level || []).map(l => lvlOrder[l] || 99));
        const bVal = Math.min(...(b.level || []).map(l => lvlOrder[l] || 99));
        return aVal - bVal;
      }
      if (sortBy === 'level-desc') {
        const lvlOrder: Record<string, number> = { 'Alphabetisierung': 1, 'A1': 2, 'A2': 3, 'B1': 4, 'B2': 5, 'C1': 6, 'Schule': 7 };
        const aVal = Math.max(...(a.level || []).map(l => lvlOrder[l] || 0));
        const bVal = Math.max(...(b.level || []).map(l => lvlOrder[l] || 0));
        return bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [allCourses, searchTerm, selectedCategory, selectedLevel, selectedFunding, selectedSchedule, sortBy]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'ALL' || selectedLevel !== 'ALL' || selectedFunding !== 'ALL' || selectedSchedule !== 'ALL';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedFunding('ALL');
    setSelectedSchedule('ALL');
    setSortBy('recommended');
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Control Hub (Search Bar + Category Tabs + Filters + Sorting) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700/80 p-5 md:p-7 space-y-6">
        
        {/* Top Row: Search Input + Sort Dropdown + Grid/List Switcher */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kursname, Sprachniveau (z. B. B1, BuT, BAMF, telc) oder Stichwort suchen..."
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm md:text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:bg-gray-900 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 transition-colors"
                title="Suchbegriff löschen"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sorting + View Mode */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl">
              <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">Sortieren:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="recommended">Empfohlen</option>
                <option value="title-asc">Name (A → Z)</option>
                <option value="title-desc">Name (Z → A)</option>
                <option value="level-asc">Niveau (A1 → C1)</option>
                <option value="level-desc">Niveau (C1 → A1)</option>
              </select>
            </div>

            {/* Grid vs List Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-xs font-bold' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'
                }`}
                title="Kachelansicht"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-xs font-bold' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'
                }`}
                title="Listenansicht"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 border-b border-gray-100 dark:border-gray-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm dark:shadow-none ring-2 ring-primary/20'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/80 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-gray-500 dark:text-gray-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Detailed Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* Level / Target */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Sprachniveau / Zielgruppe
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {levelOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Funding / Cost */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Förderung & Kosten
            </label>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {fundingOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Unterrichtszeiten
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {scheduleOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Reset Button */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-primary font-bold">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'}
            </span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-medium">
                Suche: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium">
                Kategorie: {categories.find(c => c.id === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory('ALL')} className="hover:opacity-80"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedLevel !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-medium">
                Niveau: {selectedLevel}
                <button onClick={() => setSelectedLevel('ALL')} className="hover:text-amber-950"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedFunding !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                Förderung: {fundingOptions.find(f => f.id === selectedFunding)?.label}
                <button onClick={() => setSelectedFunding('ALL')} className="hover:text-emerald-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSchedule !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-medium">
                Zeit: {scheduleOptions.find(s => s.id === selectedSchedule)?.label}
                <button onClick={() => setSelectedSchedule('ALL')} className="hover:text-purple-900"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Alle Filter zurücksetzen</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Results List / Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center max-w-lg mx-auto shadow-sm dark:shadow-none">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Keine passenden Kurse gefunden</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Für Ihre aktuellen Filtereinstellungen wurden keine Angebote gefunden. Bitte passen Sie Ihre Suchbegriffe an oder setzen Sie die Filter zurück.
          </p>
          <button
            onClick={resetAllFilters}
            className="flatsome-button bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm dark:shadow-none"
          >
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/90 hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Card Top Header */}
                <div className="p-6 pb-4 flex-1 flex flex-col">
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {course.categoryLabel}
                    </span>
                    {course.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${course.badgeColor || 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors leading-snug mb-3">
                    <Link href={course.link} className="focus:outline-none">
                      {course.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Level Pills */}
                  {course.level && course.level.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      <span className="text-[11px] font-medium text-gray-400">Niveaus:</span>
                      {course.level.map((lvl, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700/60">
                          {lvl}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Specs List */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    {course.schedule && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Zeiten:</strong> {course.schedule}</span>
                      </div>
                    )}
                    {course.costsInfo && (
                      <div className="flex items-start gap-2">
                        <Euro className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Kosten:</strong> {course.costsInfo}</span>
                      </div>
                    )}
                    {course.targetAudience && (
                      <div className="flex items-start gap-2">
                        <Users2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1"><strong>Zielgruppe:</strong> {course.targetAudience}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setInquiryCourse(course)}
                    className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-white dark:bg-gray-900 border border-transparent hover:border-gray-200 dark:border-gray-700"
                  >
                    Schnellanfrage
                  </button>

                  <Link
                    href={course.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-xl transition-all shadow-xs group-hover:gap-1.5"
                  >
                    <span>Details & Anmeldung</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs divide-y divide-gray-100">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-5 md:p-6 hover:bg-blue-50/20 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {course.categoryLabel}
                  </span>
                  {course.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${course.badgeColor || 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                      {course.badge}
                    </span>
                  )}
                  {course.level && course.level.map((lvl, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                      {lvl}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                  <Link href={course.link}>
                    {course.title}
                  </Link>
                </h3>

                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap pt-1">
                  {course.schedule && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {course.schedule}
                    </span>
                  )}
                  {course.costsInfo && (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <Euro className="w-3.5 h-3.5" />
                      {course.costsInfo}
                    </span>
                  )}
                </div>
              </div>

              {/* List Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setInquiryCourse(course)}
                  className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800"
                >
                  Anfrage
                </button>
                <Link
                  href={course.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <span>Details ansehen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Quick Consultation / Help Banner */}
      <div className="bg-linear-to-r from-primary to-[#092B3B] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md dark:shadow-none">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Kostenfreie Beratung & Einstufung</span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold">Nicht sicher, welcher Kurs zu Ihnen passt?</h4>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Wir unterstützen Sie gerne persönlich bei der Antragstellung (BAMF-Berechtigungsschein, Jobcenter, BuT-Antrag) und führen vor Ort eine professionelle Einstufung durch.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <a
            href="tel:062130737271"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-900/10 hover:bg-white dark:bg-gray-900/20 text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
          >
            <Phone className="w-4 h-4 text-amber-300" />
            <span>0621 3073 7271</span>
          </a>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-accent hover:bg-red-700 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm dark:shadow-none"
          >
            <span>Beratungstermin vereinbaren</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. Instant Inquiry Modal */}
      {inquiryCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Unverbindliche Anfrage</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{inquiryCourse.title}</h3>
              </div>
              <button
                onClick={() => setInquiryCourse(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50/60 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
              <p><strong>Gewähltes Angebot:</strong> {inquiryCourse.title}</p>
              <p><strong>Finanzierung:</strong> {inquiryCourse.costsInfo || 'BAMF / BuT / Privat'}</p>
              <p><strong>Zeiten:</strong> {inquiryCourse.schedule || 'Nach Absprache'}</p>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              Sie können uns direkt telefonisch kontaktieren oder das Kontaktformular mit vorausgefülltem Betreff aufrufen:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="tel:062130737271"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>Telefonisch anfragen</span>
              </a>

              <Link
                href={`/kontakt?kurs=${encodeURIComponent(inquiryCourse.title)}`}
                onClick={() => setInquiryCourse(null)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs transition-colors shadow-sm dark:shadow-none"
              >
                <Mail className="w-4 h-4" />
                <span>Zum Kontaktformular</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
