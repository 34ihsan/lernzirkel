'use client';

import { BookOpen, Calendar, Users, DollarSign, CheckCircle } from 'lucide-react';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  INTEGRATION: { label: 'Integrationskurs', color: '#0F4761' },
  SPRACHE: { label: 'Sprachkurs', color: '#1a6d92' },
  NACHHILFE: { label: 'Nachhilfe', color: '#e63946' },
  GRUNDBILDUNG: { label: 'Grundbildung', color: '#2d6a4f' },
  ANDERE: { label: 'Andere', color: '#6c757d' },
};

interface CoursePreviewProps {
  data: Record<string, string>;
}

export default function CoursePreview({ data }: CoursePreviewProps) {
  const title = data.title || 'Kurs Adı';
  const description = data.description || 'Kurs açıklaması burada görünecek...';
  const category = data.category || 'ANDERE';
  const targetAudience = data.targetAudience || '';
  const requirements = data.requirements || '';
  const costsInfo = data.costsInfo || '';
  const startDate = data.startDate ? new Date(data.startDate).toLocaleDateString('de-DE') : '';
  const endDate = data.endDate ? new Date(data.endDate).toLocaleDateString('de-DE') : '';
  const isActive = data.isActive === 'true' || data.isActive === 'on';

  const cat = CATEGORY_LABELS[category] || CATEGORY_LABELS.ANDERE;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 font-sans">
      <div className="bg-[#0F4761] h-8 flex items-center px-4">
        <span className="text-white text-xs font-bold tracking-widest opacity-70">LERNZIRKEL — ÖNİZLEME</span>
      </div>

      <article className="p-6">
        {/* Kategori badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: cat.color }}
          >
            <BookOpen size={12} className="mr-1" />
            {cat.label}
          </span>
          {isActive ? (
            <span className="inline-flex items-center text-xs text-green-600 font-semibold">
              <CheckCircle size={14} className="mr-1" /> Aktiv
            </span>
          ) : (
            <span className="text-xs text-gray-400">Inaktiv</span>
          )}
        </div>

        {/* Başlık */}
        <h1 className="text-2xl font-bold text-[#0F4761] mb-3 leading-tight">{title}</h1>
        <div className="w-16 h-1 rounded-full bg-[#e63946] mb-4" />

        {/* Açıklama */}
        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{description}</p>

        {/* Detay grid */}
        <div className="grid grid-cols-2 gap-4">
          {(startDate || endDate) && (
            <div className="bg-[#e8f4f8] rounded-lg p-3">
              <div className="flex items-center text-[#0F4761] font-semibold text-sm mb-1">
                <Calendar size={14} className="mr-2" /> Kurs Tarihleri
              </div>
              <p className="text-gray-700 text-sm">
                {startDate && <span>Başlangıç: {startDate}</span>}
                {startDate && endDate && <br />}
                {endDate && <span>Bitiş: {endDate}</span>}
              </p>
            </div>
          )}

          {targetAudience && (
            <div className="bg-[#e8f4f8] rounded-lg p-3">
              <div className="flex items-center text-[#0F4761] font-semibold text-sm mb-1">
                <Users size={14} className="mr-2" /> Hedef Kitle
              </div>
              <p className="text-gray-700 text-sm">{targetAudience}</p>
            </div>
          )}

          {costsInfo && (
            <div className="bg-[#e8f4f8] rounded-lg p-3">
              <div className="flex items-center text-[#0F4761] font-semibold text-sm mb-1">
                <DollarSign size={14} className="mr-2" /> Ücret Bilgisi
              </div>
              <p className="text-gray-700 text-sm">{costsInfo}</p>
            </div>
          )}

          {requirements && (
            <div className="bg-[#e8f4f8] rounded-lg p-3 col-span-2">
              <div className="flex items-center text-[#0F4761] font-semibold text-sm mb-1">
                <CheckCircle size={14} className="mr-2" /> Gereksinimler
              </div>
              <p className="text-gray-700 text-sm">{requirements}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button className="w-full py-3 rounded-full font-bold text-white text-sm uppercase tracking-wider transition-all"
            style={{ backgroundColor: '#0F4761' }}>
            Jetzt anmelden
          </button>
        </div>
      </article>
    </div>
  );
}
