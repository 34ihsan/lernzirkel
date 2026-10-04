import { Calendar, Newspaper } from 'lucide-react';
import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Link from 'next/link';
import { 
  ArrowRight, BookOpen, Users, GraduationCap, LifeBuoy, 
  Info, HandHeart, Phone, FileText, Globe, School, 
  MessageCircle, HeartHandshake, Lightbulb, Users2, 
  Shield, Languages, FileCheck, CheckCircle
} from 'lucide-react';

export async function generateMetadata() {
  const page = await prisma.page.findUnique({
    where: { slug: 'home' }
  });
  if (page?.title) {
    return {
      title: page.title,
      description: page.description || undefined
    };
  }
  return {
    title: 'Lernzirkel Ludwigshafen e.V. | Bildung & Integration',
    description: 'Gemeinsam Potenziale entfalten – in Ludwigshafen und der Metropolregion Rhein-Neckar.'
  };
}

import TrustBanner from '@/components/home/TrustBanner';
import CourseGrid from '@/components/home/CourseGrid';
import AnimatedHero from '@/components/home/AnimatedHero';

export default async function Home() {
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (homePage && homePage.isPublished && homePage.sections.length > 0) {
    return (
      <article className="min-h-screen bg-background">
        {homePage.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticHome />;
}

async function StaticHome() {
  const now = new Date();
  const latestNews = await prisma.news.findMany({
    where: {
      publishDate: { lte: now },
      OR: [
        { archiveDate: null },
        { archiveDate: { gt: now } }
      ]
    },
    orderBy: { publishDate: 'desc' },
    take: 3
  }).catch(() => []);

  return (
    <>
      <AnimatedHero />

      {/* 2. Trust Banner (Zertifikate) */}
      <TrustBanner />

      {/* 3. Kurs Raster (Course Grid mit Filter) */}
      <CourseGrid />

      {/* 4. Über Uns */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Über Uns</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Wir stehen für Chancengleichheit, Vielfalt und Qualität. Lernen Sie unseren Verein, unsere Entstehung und unser Leitbild kennen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/ueber-uns" className="flatsome-card p-6 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all">
              <Info className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-foreground">Entstehung & Leitbild</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Erfahren Sie mehr über unsere Philosophie und Ziele.</p>
              <span className="text-primary text-sm flex items-center mt-auto font-semibold">Mehr erfahren <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Link>
            <Link href="/satzung" className="flatsome-card p-6 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all">
              <FileText className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-foreground">Satzung & Orga</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Die rechtlichen Grundlagen unseres Vereins.</p>
              <span className="text-primary text-sm flex items-center mt-auto font-semibold">Mehr erfahren <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Link>
            <Link href="/spenden" className="flatsome-card p-6 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all">
              <HandHeart className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-foreground">Spenden</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Unterstützen Sie unsere Arbeit für Chancengleichheit.</p>
              <span className="text-primary text-sm flex items-center mt-auto font-semibold">Jetzt spenden <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Link>
            <Link href="/kontakt" className="flatsome-card p-6 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all">
              <Phone className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-foreground">Kontakt & Öffnungszeiten</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">So erreichen Sie uns in Ludwigshafen.</p>
              <span className="text-primary text-sm flex items-center mt-auto font-semibold">Kontakt aufnehmen <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Integrationskurse & Sprachkurse */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Integrationskurse & Sprachkurse</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vom BAMF anerkannter Träger für Integrationskurse. Finden Sie den passenden Deutschkurs für Ihr Level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/kurse" className="flatsome-card border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center group hover:border-secondary transition-all">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Allgemeine Integrationskurse</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">Lernen Sie Deutsch für den Alltag und Beruf. Für Anfänger und Fortgeschrittene.</p>
              <span className="flatsome-button w-full text-center bg-gray-100 dark:bg-gray-800/50 text-primary group-hover:bg-primary group-hover:text-white">Mehr Details</span>
            </Link>
            <Link href="/deutsch-grundbildung" className="flatsome-card border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center group hover:border-secondary transition-all">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Languages className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Deutsch lernen (Grundbildung)</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">Integrationskurse mit Alphabetisierung. Schritt für Schritt zum Erfolg.</p>
              <span className="flatsome-button w-full text-center bg-gray-100 dark:bg-gray-800/50 text-primary group-hover:bg-primary group-hover:text-white">Mehr Details</span>
            </Link>
            <Link href="/esfplusalpha" className="flatsome-card border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center group hover:border-secondary transition-all">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Users2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">ESF+ Alpha</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">Geförderte Kurse für bessere Chancen auf dem Arbeitsmarkt.</p>
              <span className="flatsome-button w-full text-center bg-gray-100 dark:bg-gray-800/50 text-primary group-hover:bg-primary group-hover:text-white">Mehr Details</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. telc Prüfungen Banner */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <CheckCircle className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Offizielles telc Prüfungszentrum</h2>
            <p className="text-xl text-blue-100 mb-6">
              Wir bieten regelmäßig telc Prüfungen (A1-C1) an. Sichern Sie sich jetzt Ihren Prüfungstermin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/telc-pruefungen" className="flatsome-button bg-accent hover:bg-red-700 text-white">
                Informationen zu telc
              </Link>
              <a href="https://pruefungscenter.de" target="_blank" rel="noopener noreferrer" className="flatsome-button bg-white dark:bg-gray-900 text-primary hover:bg-gray-100 dark:bg-gray-800/50">
                Direkt Termin buchen
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl flex items-center justify-center">
              <div className="text-primary font-bold text-3xl flex items-center">
                <CheckCircle className="w-12 h-12 mr-3 text-secondary" />
                telc
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kurse / Angebote */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Kurse & Angebote</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Umfassende Nachhilfe, Crashkurse und Mentoring für Kinder und Jugendliche.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/kinder-jugendliche" className="flatsome-card p-5 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none">
              <BookOpen className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 text-foreground text-sm">Erfolg durch Nachhilfe</h3>
            </Link>
            <Link href="/blockunterricht" className="flatsome-card p-5 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none">
              <School className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 text-foreground text-sm">Blockunterricht</h3>
            </Link>
            <Link href="/kostenlose-lernfoerderung_b" className="flatsome-card p-5 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none">
              <HeartHandshake className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 text-foreground text-sm">Kostenlose Lernförderung</h3>
            </Link>
            <Link href="/abiturvorbereitung" className="flatsome-card p-5 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none">
              <GraduationCap className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 text-foreground text-sm">Abiturvorbereitung</h3>
            </Link>
            <Link href="/jugendbetreuung" className="flatsome-card p-5 flex flex-col items-center text-center group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none">
              <Users className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 text-foreground text-sm">Jugendbetreuung</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 5.5 Aktuelles */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-primary mb-4">Aktuelles aus dem Lernzirkel</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Neuigkeiten, Ankündigungen und Einblicke in unsere Vereinsarbeit.
                </p>
              </div>
              <Link href="/aktuelles" className="text-primary font-bold hover:underline mt-4 md:mt-0 flex items-center">
                Alle News ansehen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news: any) => (
                <Link href={`/aktuelles/${news.id}`} key={news.id} className="group flex flex-col bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800 hover:border-primary/20">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {news.imageUrl ? (
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/10 text-primary/30">
                        <Newspaper size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-400 mb-3 font-medium">
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(news.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <div className="mt-auto flex items-center text-primary font-semibold text-sm">
                      Weiterlesen <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Projekte & Wettbewerbe */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-primary mb-4">Projekte & Wettbewerbe</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Wir engagieren uns aktiv in verschiedenen sozialen und bildungsorientierten Projekten in der Region.
              </p>
            </div>
            <Link href="/projekte" className="text-primary font-bold hover:underline mt-4 md:mt-0 flex items-center">
              Alle Projekte ansehen <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/future-connect" className="flatsome-card p-6 flex items-start group border border-gray-100 dark:border-gray-800 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">Future Connect</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Generationen vernetzen für morgen.</p>
              </div>
            </Link>
            <Link href="/projekte/menschen-staerken" className="flatsome-card p-6 flex items-start group border border-gray-100 dark:border-gray-800 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Users2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">Menschen Stärken</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Patenschaftsprogramm für Geflüchtete.</p>
              </div>
            </Link>
            <Link href="/projekte/sprach-cafe" className="flatsome-card p-6 flex items-start group border border-gray-100 dark:border-gray-800 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">Sprach Café</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gemeinsam sprechen und lernen in lockerer Atmosphäre.</p>
              </div>
            </Link>
            <Link href="/projekte/konfliktmanagement" className="flatsome-card p-6 flex items-start group border border-gray-100 dark:border-gray-800 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">Umgang mit Konflikten</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Kompetenzen für Engagierte in Krisenzeiten.</p>
              </div>
            </Link>
            <Link href="/projekte/wettbewerbe/wir-sind-vielfalt" className="flatsome-card p-6 flex items-start group border border-gray-100 dark:border-gray-800 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">Wir Sind Vielfalt</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Wettbewerbe und gesellschaftliches Engagement.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Beratung & Migrationsfachdienst (MFD) */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto mb-4">
                <LifeBuoy className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">Beratung & Migrationsfachdienst</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Wir beraten und begleiten Sie kompetent auf Ihrem Bildungsweg und bei Fragen der Integration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/beratung" className="text-center group">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Migrationsfachdienst (MFD)</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Beratung für Migrantinnen und Migranten.</p>
                <span className="text-primary font-semibold text-sm inline-flex items-center">Mehr erfahren <ArrowRight className="w-4 h-4 ml-1" /></span>
              </Link>
              <Link href="/aol-yoes" className="text-center group">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">AÖL-YÖS-Beratung</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Beratung zur Weiterbildung und Studium.</p>
                <span className="text-primary font-semibold text-sm inline-flex items-center">Mehr erfahren <ArrowRight className="w-4 h-4 ml-1" /></span>
              </Link>
              <Link href="/bildungswege-in-ludwigshafen-_b" className="text-center group">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Bildungswege in LU</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Welche Möglichkeiten gibt es in Ludwigshafen?</p>
                <span className="text-primary font-semibold text-sm inline-flex items-center">Mehr erfahren <ArrowRight className="w-4 h-4 ml-1" /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
