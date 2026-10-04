import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle2, 
  GraduationCap, Euro, FileText, Sparkles, Phone, Mail
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Find course by slug or ID
  const courses = await prisma.course.findMany();
  const course = courses.find((c) => c.id === resolvedParams.slug);

  if (!course) {
    return { title: 'Kurs nicht gefunden | Lernzirkel Ludwigshafen' };
  }

  return {
    title: `${course.title} | Lernzirkel Ludwigshafen e.V.`,
    description: course.description.substring(0, 160),
    openGraph: {
      images: [],
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const courses = await prisma.course.findMany();
  const course = courses.find((c) => c.id === resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const design: any = {};
  const categoryLabels: Record<string, string> = {
    INTEGRATION: 'Integrationskurs',
    SPRACHE: 'Sprachkurs',
    NACHHILFE: 'Nachhilfe',
    GRUNDBILDUNG: 'Grundbildung',
    BERUFSBEZOGEN: 'Berufsbezogene Deutschförderung (DeuFöV)',
    PRUEFUNGSVORBEREITUNG: 'Prüfungsvorbereitung',
    ALPHABETISIERUNG: 'Alphabetisierung',
    ERSTORIENTIERUNG: 'Erstorientierung',
    FRAUENKURSE: 'Frauen- & MiA-Kurse',
    FERIENKURSE: 'Ferienkurse',
    WEITERBILDUNG: 'Weiterbildung',
    ANDERE: 'Andere',
  };

  const highlightColor = design.highlightColor || '#0F4761';
  const features = design.features ? design.features.split(',').map((f: string) => f.trim()).filter(Boolean) : [];
  
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 mb-12">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Link href="/kurse" className="inline-flex items-center text-gray-500 hover:text-primary font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Zurück zur Kursübersicht
          </Link>
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: highlightColor }}
                >
                  <GraduationCap size={14} className="mr-1.5" />
                  {categoryLabels[course.category] || course.category}
                </span>
                {design.level && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200 shadow-sm">
                    {design.level}
                  </span>
                )}
                {!course.isActive && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-red-800 bg-red-100 shadow-sm">
                    Inaktiv (Archiviert)
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {course.title}
              </h1>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {(course.startDate || course.endDate) && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>{formatDate(course.startDate) || 'Laufend'} - {formatDate(course.endDate) || 'Offen'}</span>
                  </div>
                )}
                {design.schedule && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span>{design.schedule}</span>
                  </div>
                )}
                {design.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span>{design.location}</span>
                  </div>
                )}
              </div>
            </div>

            {design.imageUrl && (
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shrink-0 border border-gray-100">
                <img src={design.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="text-primary" /> Kursbeschreibung
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {course.description}
              </div>
            </section>

            {features.length > 0 && (
              <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Sparkles className="text-primary" /> Kursinhalte & Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Target Audience & Requirements */}
            <section className="grid md:grid-cols-2 gap-6">
              {course.targetAudience && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="text-primary" size={20} /> Zielgruppe
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{course.targetAudience}</p>
                </div>
              )}
              {course.requirements && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="text-primary" size={20} /> Voraussetzungen
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{course.requirements}</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Teilnahme & Anmeldung</h3>
              
              <div className="space-y-4 mb-8">
                {course.costsInfo && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Euro className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase">Kosten & Förderung</div>
                      <div className="font-medium text-gray-900">{course.costsInfo}</div>
                    </div>
                  </div>
                )}
                {design.instructor && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <User className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase">Ansprechpartner</div>
                      <div className="font-medium text-gray-900">{design.instructor}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link 
                  href={design.linkUrl || `/kontakt?kurs=${encodeURIComponent(course.title)}`}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: highlightColor }}
                >
                  {design.linkText || 'Jetzt anmelden'}
                </Link>
                <div className="text-center">
                  <span className="text-xs text-gray-500">oder kontaktieren Sie uns direkt:</span>
                </div>
                <a href="tel:062130737271" className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-colors border border-gray-200">
                  <Phone size={16} /> 0621 307 372 71
                </a>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </main>
  );
}
