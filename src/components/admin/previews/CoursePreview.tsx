'use client';

import { BookOpen, Calendar, Users, DollarSign, CheckCircle, MapPin, Clock, User, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  INTEGRATION: { label: 'Integrationskurs', color: '#0F4761' },
  SPRACHE: { label: 'Sprachkurs', color: '#1a6d92' },
  NACHHILFE: { label: 'Nachhilfe', color: '#e63946' },
  GRUNDBILDUNG: { label: 'Grundbildung', color: '#2d6a4f' },
  BERUFSBEZOGEN: { label: 'Berufsbezogene Deutschförderung (DeuFöV)', color: '#f59e0b' },
  PRUEFUNGSVORBEREITUNG: { label: 'Prüfungsvorbereitung', color: '#8b5cf6' },
  ALPHABETISIERUNG: { label: 'Alphabetisierung', color: '#10b981' },
  ERSTORIENTIERUNG: { label: 'Erstorientierung', color: '#0ea5e9' },
  FRAUENKURSE: { label: 'Frauen- & MiA-Kurse', color: '#ec4899' },
  FERIENKURSE: { label: 'Ferienkurse', color: '#f97316' },
  WEITERBILDUNG: { label: 'Weiterbildung', color: '#3b82f6' },
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
  
  // Design fields
  const imageUrl = data.imageUrl || '';
  const schedule = data.schedule || '';
  const location = data.location || '';
  const instructor = data.instructor || '';
  const features = data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [];
  const linkText = data.linkText || 'Jetzt anmelden';
  const highlightColor = data.highlightColor || CATEGORY_LABELS[category]?.color || '#0F4761';

  const cat = CATEGORY_LABELS[category] || CATEGORY_LABELS.ANDERE;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 font-sans flex flex-col group hover:shadow-2xl transition-all duration-300">
      <div className="bg-gray-900 h-8 flex items-center px-4 justify-between">
        <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">Lernzirkel — Önizleme</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </div>

      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img src={imageUrl} alt="Kurs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex gap-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-md"
                style={{ backgroundColor: highlightColor }}
              >
                <BookOpen size={12} className="mr-1.5" />
                {cat.label}
              </span>
              {data.level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-white/90 shadow-sm backdrop-blur-md">
                  {data.level}
                </span>
              )}
            </div>
            {isActive ? (
              <span className="inline-flex items-center text-xs text-white bg-green-500/90 backdrop-blur-md px-2 py-1 rounded font-semibold shadow-sm">
                <CheckCircle size={12} className="mr-1" /> Aktiv
              </span>
            ) : (
              <span className="inline-flex items-center text-xs text-white bg-gray-500/90 backdrop-blur-md px-2 py-1 rounded font-semibold shadow-sm">
                Inaktiv
              </span>
            )}
          </div>
        </div>
      )}

      <article className="p-6 flex flex-col flex-1">
        {!imageUrl && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: highlightColor }}
              >
                <BookOpen size={12} className="mr-1.5" />
                {cat.label}
              </span>
              {data.level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-gray-700 bg-gray-100 shadow-sm border border-gray-200">
                  {data.level}
                </span>
              )}
            </div>
            {isActive ? (
              <span className="inline-flex items-center text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                <CheckCircle size={12} className="mr-1" /> Aktiv
              </span>
            ) : (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Inaktiv</span>
            )}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': highlightColor } as React.CSSProperties}>{title}</h1>
        
        {/* Etiketler (Features) */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feat, i) => (
              <span key={i} className="inline-flex items-center text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <Sparkles size={10} className="mr-1 text-yellow-500" /> {feat}
              </span>
            ))}
          </div>
        )}

        <div className="w-12 h-1 rounded-full mb-5" style={{ backgroundColor: highlightColor }} />

        <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap flex-1">{description}</p>

        <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
          {(startDate || endDate) && (
            <div className="col-span-2 flex items-start">
              <Calendar size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-900">Datum</div>
                <div className="text-xs text-gray-600">
                  {startDate && <span>{startDate}</span>}
                  {startDate && endDate && <span> - </span>}
                  {endDate && <span>{endDate}</span>}
                </div>
              </div>
            </div>
          )}

          {schedule && (
            <div className="col-span-2 flex items-start">
              <Clock size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-900">Zeiten</div>
                <div className="text-xs text-gray-600">{schedule}</div>
              </div>
            </div>
          )}

          {location && (
            <div className="col-span-2 flex items-start">
              <MapPin size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-900">Ort</div>
                <div className="text-xs text-gray-600">{location}</div>
              </div>
            </div>
          )}

          {instructor && (
            <div className="flex items-start">
              <User size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-900">Dozent</div>
                <div className="text-xs text-gray-600">{instructor}</div>
              </div>
            </div>
          )}

          {costsInfo && (
            <div className="flex items-start">
              <DollarSign size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-900">Kosten</div>
                <div className="text-xs text-gray-600">{costsInfo}</div>
              </div>
            </div>
          )}
        </div>

        {(targetAudience || requirements) && (
          <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
            {targetAudience && (
              <div className="flex items-start">
                <Users size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
                <div className="text-sm text-gray-700"><strong className="text-gray-900">Für wen:</strong> {targetAudience}</div>
              </div>
            )}
            {requirements && (
              <div className="flex items-start">
                <CheckCircle size={16} className="text-gray-400 mt-0.5 mr-3 shrink-0" />
                <div className="text-sm text-gray-700"><strong className="text-gray-900">Voraussetzung:</strong> {requirements}</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          <button 
            className="w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: highlightColor }}
          >
            {linkText} <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </article>
    </div>
  );
}
