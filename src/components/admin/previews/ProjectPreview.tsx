'use client';

import { Target, Users, CheckCircle, Clock } from 'lucide-react';

interface ProjectPreviewProps {
  data: Record<string, string>;
}

export default function ProjectPreview({ data }: ProjectPreviewProps) {
  const title = data.title || 'Proje Adı';
  const description = data.description || 'Proje açıklaması burada görünecek...';
  const goals = data.goals || '';
  const targetGroup = data.targetGroup || '';
  const status = data.status || 'AKTIV';
  const imageUrl = data.imageUrl || '';
  const hasImage = imageUrl.trim().length > 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 font-sans">
      <div className="bg-[#0F4761] h-8 flex items-center px-4">
        <span className="text-white text-xs font-bold tracking-widest opacity-70">LERNZIRKEL — ÖNİZLEME</span>
      </div>

      {/* Hero görsel */}
      {hasImage && (
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${status === 'AKTIV' ? 'bg-green-600' : 'bg-gray-500'}`}
            >
              {status === 'AKTIV' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
              {status === 'AKTIV' ? 'Aktives Projekt' : 'Abgeschlossen'}
            </span>
          </div>
        </div>
      )}

      <article className="p-6">
        {!hasImage && (
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${status === 'AKTIV' ? 'bg-green-600' : 'bg-gray-500'}`}>
              {status === 'AKTIV' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
              {status === 'AKTIV' ? 'Aktives Projekt' : 'Abgeschlossen'}
            </span>
          </div>
        )}

        {/* Başlık */}
        <h1 className="text-2xl font-bold text-[#0F4761] mb-3 leading-tight">{title}</h1>
        <div className="w-16 h-1 rounded-full bg-[#e63946] mb-4" />

        {/* Açıklama */}
        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{description}</p>

        {/* Detaylar */}
        <div className="space-y-4">
          {goals && (
            <div className="border-l-4 border-[#0F4761] pl-4">
              <div className="flex items-center text-[#0F4761] font-semibold text-sm mb-1">
                <Target size={14} className="mr-2" /> Projektziele
              </div>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{goals}</p>
            </div>
          )}

          {targetGroup && (
            <div className="border-l-4 border-[#e63946] pl-4">
              <div className="flex items-center text-[#e63946] font-semibold text-sm mb-1">
                <Users size={14} className="mr-2" /> Zielgruppe
              </div>
              <p className="text-gray-600 text-sm">{targetGroup}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="flatsome-button text-sm px-5 py-2 w-full" style={{ backgroundColor: '#0F4761' }}>
            Mehr erfahren →
          </button>
        </div>
      </article>
    </div>
  );
}
