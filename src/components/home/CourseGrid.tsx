'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HomeCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  design: unknown;
}

const CATEGORY_LABELS: Record<string, string> = {
  INTEGRATION: 'Integrationskurse',
  SPRACHE: 'Deutschkurse',
  NACHHILFE: 'Nachhilfe',
  GRUNDBILDUNG: 'Grundbildung',
  BERUFSBEZOGEN: 'Berufsbezogene Förderung',
  PRUEFUNGSVORBEREITUNG: 'Prüfungsvorbereitung',
  ALPHABETISIERUNG: 'Alphabetisierung (ESF+)',
  ERSTORIENTIERUNG: 'Erstorientierung',
  FRAUENKURSE: 'Frauen- & MiA-Kurse',
  FERIENKURSE: 'Ferienkurse',
  WEITERBILDUNG: 'Weiterbildung',
  ANDERE: 'Weitere Angebote',
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  INTEGRATION: GraduationCap,
  SPRACHE: BookOpen,
  NACHHILFE: Users,
  GRUNDBILDUNG: BookOpen,
  ALPHABETISIERUNG: GraduationCap,
  PRUEFUNGSVORBEREITUNG: Sparkles,
};

export default function CourseGrid({ courses }: { courses: HomeCourse[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const availableCategories = Array.from(new Set(courses.map((c) => c.category)));

  const filteredCourses = activeFilter === 'all'
    ? courses
    : courses.filter((c) => c.category === activeFilter);

  if (courses.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-4">Aktuelle Kurse & Angebote</h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Finden Sie den passenden Kurs für Ihr Sprachniveau oder die richtige Unterstützung für Ihre Kinder.
          </p>

          {availableCategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white shadow-md dark:shadow-none'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                }`}
              >
                Alle Kurse
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === cat
                      ? 'bg-primary text-white shadow-md dark:shadow-none'
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course) => {
              const design = (course.design as { level?: string } | null) || {};
              const Icon = CATEGORY_ICONS[course.category] || BookOpen;

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm dark:shadow-none hover:shadow-lg p-6 flex flex-col transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/5 text-primary rounded-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                      {design.level || CATEGORY_LABELS[course.category] || course.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-2">{course.title}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                    {course.description}
                  </p>
                  <Link
                    href={`/kurse/${course.id}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
