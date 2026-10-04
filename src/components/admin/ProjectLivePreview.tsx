"use client";

import Image from 'next/image';
import { ArrowLeft, Target, Users, Calendar, Mail, User, Activity, MapPin, Briefcase } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal, FadeIn } from '@/components/ui/animations';

export default function ProjectLivePreview({ project }: { project: any }) {
  const {
    title,
    description,
    imageUrl,
    status,
    startDate,
    endDate,
    goals,
    targetGroup,
    location,
    results,
    budget,
    fundingSource,
    partners,
    contactPerson,
    actionText,
    actionUrl,
  } = project;

  // Format dates for display
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch {
      return null;
    }
  };

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-xl overflow-y-auto overflow-x-hidden shadow-lg" style={{ maxHeight: 'calc(100vh - 140px)' }}>
      {/* Live Preview Header */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500 sticky top-0 z-50">
        <span className="font-semibold text-gray-700">Canlı Önizleme (Proje Detay Sayfası)</span>
        <span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded">/projekte/{project.slug || 'yeni-proje'}</span>
      </div>

      <article className="bg-gray-50 dark:bg-gray-800 pb-20 w-full" style={{ pointerEvents: 'none' }}>
        {/* Hero Section */}
        <div className="relative h-[400px] w-full bg-primary overflow-hidden">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageUrl} 
                alt={title || "Proje"}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
          )}

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 pb-12 w-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {status || 'AKTIV'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white max-w-4xl leading-tight mb-4">
                {title || 'Proje Başlığı'}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="text-primary" /> Proje Hakkında
                </h2>
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: description || '<p class="text-gray-400 italic">Genel açıklama metni...</p>' }}
                />
              </section>

              {/* Goals */}
              {goals && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Target className="text-primary" /> Hedeflerimiz
                  </h2>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: goals }}
                  />
                </section>
              )}

              {/* Results */}
              {results && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity className="text-primary" /> Beklenen Sonuçlar
                  </h2>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: results }}
                  />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Proje Özeti</h3>
                <ul className="space-y-4">
                  {(formattedStart || formattedEnd) && (
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Tarih</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formattedStart} {formattedEnd ? `- ${formattedEnd}` : ''}
                        </p>
                      </div>
                    </li>
                  )}
                  {targetGroup && (
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Hedef Kitle</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{targetGroup}</p>
                      </div>
                    </li>
                  )}
                  {location && (
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Lokasyon</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
                      </div>
                    </li>
                  )}
                  {fundingSource && (
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Fon Sağlayıcı</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{fundingSource}</p>
                      </div>
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                {(actionText || actionUrl) && (
                  <div className="mt-8">
                    <button className="w-full py-3 bg-primary text-white rounded-lg font-bold text-center">
                      {actionText || "Daha Fazla Bilgi"}
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Person */}
              {contactPerson && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Proje Sorumlusu</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 relative">
                      {contactPerson.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={contactPerson.imageUrl} alt={contactPerson.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{contactPerson.name}</p>
                      <p className="text-sm text-primary">{contactPerson.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// Dummy icon components since I don't want to import them all
function FileText(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>; }
