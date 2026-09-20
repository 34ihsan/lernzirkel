'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COURSES = [
  { id: 1, title: 'Integrationskurs (BAMF)', category: 'deutsch', level: 'A1-B1', icon: BookOpen, desc: 'Lernen Sie Deutsch für den Alltag und Beruf.' },
  { id: 2, title: 'Alphabetisierung', category: 'alpha', level: 'A0', icon: GraduationCap, desc: 'Schreiben und Lesen lernen von Grund auf.' },
  { id: 3, title: 'ESF+ Alpha-Kurs', category: 'alpha', level: 'A0-A2', icon: BookOpen, desc: 'Geförderter Kurs für bessere Arbeitsmarktchancen.' },
  { id: 4, title: 'Nachhilfe (Mathe, Deutsch)', category: 'kinder', level: 'Schule', icon: Users, desc: 'Unterstützung für Schüler aller Klassenstufen.' },
  { id: 5, title: 'telc Prüfung B1/B2', category: 'pruefung', level: 'B1-B2', icon: BookOpen, desc: 'Zertifizierte Sprachprüfungen für Ihren Erfolg.' }
];

export default function CourseGrid() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCourses = activeFilter === 'all' 
    ? COURSES 
    : COURSES.filter(c => c.category === activeFilter);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-4">Aktuelle Kurse & Angebote</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Finden Sie den passenden Kurs für Ihr Sprachniveau oder die richtige Unterstützung für Ihre Kinder.
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'all', label: 'Alle Kurse' },
              { id: 'deutsch', label: 'Deutschkurse' },
              { id: 'alpha', label: 'Alphabetisierung (ESF+)' },
              { id: 'kinder', label: 'Kinder & Jugend' },
              { id: 'pruefung', label: 'telc Prüfungen' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === filter.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map(course => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg p-6 flex flex-col transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/5 text-primary rounded-lg">
                    <course.icon className="h-6 w-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow">{course.desc}</p>
                <Link 
                  href="/kurse" 
                  className="inline-flex items-center text-primary font-semibold hover:text-primary-light transition-colors"
                >
                  Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
