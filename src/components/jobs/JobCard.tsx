'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  MapPin, 
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function JobCard({ job }: { job: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        {job.type === 'LEHRER' ? <GraduationCap size={80} /> : <Briefcase size={80} />}
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            job.type === 'LEHRER' ? 'bg-blue-50 text-blue-700' :
            job.type === 'PRAKTIKANT' ? 'bg-emerald-50 text-emerald-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {job.type === 'LEHRER' ? 'Lehrkraft' : job.type === 'PRAKTIKANT' ? 'Praktikum' : 'Stellenangebot'}
          </span>
          {job.location && (
            <span className="flex items-center text-gray-500 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {job.location}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors pr-12">{job.title}</h3>
      </div>
      
      <div className="flex-grow">
        <div className={`prose prose-sm text-gray-600 mb-6 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-4' : ''}`}>
          {job.description}
        </div>
        
        {job.requirements && (
          <div className="mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
              <Sparkles className="w-4 h-4 mr-2 text-amber-500" /> Profil & Anforderungen
            </h4>
            <div className={`prose prose-sm text-gray-600 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {job.requirements}
            </div>
          </div>
        )}
      </div>
      
      {/* Weiterlesen Toggle */}
      <div className="mb-4 flex justify-center">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1 py-1 px-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          {isExpanded ? (
            <>Weniger anzeigen <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Weiterlesen <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>
      
      <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center font-medium">
          <Clock className="w-3.5 h-3.5 mr-1" /> Vollzeit / Teilzeit
        </span>
        <Link 
          href={`/kontakt?betreff=Bewerbung: ${encodeURIComponent(job.title)}`} 
          className="inline-flex items-center justify-center bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-light transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group/btn relative z-10"
        >
          <span>Jetzt bewerben</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
