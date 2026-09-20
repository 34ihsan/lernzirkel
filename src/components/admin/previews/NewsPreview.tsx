'use client';

import { Calendar, Newspaper } from 'lucide-react';

interface NewsPreviewProps {
  data: Record<string, string>;
}

export default function NewsPreview({ data }: NewsPreviewProps) {
  const title = data.title || 'Haber Başlığı';
  const content = data.content || 'Haber içeriği burada görünecek...';
  const imageUrl = data.imageUrl || '';
  const publishDate = data.publishDate
    ? new Date(data.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  // Design fields
  const titleColor = data.titleColor || '#0F4761';
  const titleSize = data.titleSize || '1.75rem';
  const contentColor = data.contentColor || '#333333';
  const contentSize = data.contentSize || '1rem';
  const imageLayout = data.imageLayout || 'Üstte (Tam Genişlik)';
  const imageSize = data.imageSize || '100%';
  const hasImage = imageUrl.trim().length > 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 font-sans">
      {/* Simüle edilmiş site header şeridi */}
      <div className="bg-[#0F4761] h-8 flex items-center px-4">
        <span className="text-white text-xs font-bold tracking-widest opacity-70">LERNZIRKEL — ÖNİZLEME</span>
      </div>

      <article className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-4">
          <span>Anasayfa</span>
          <span>/</span>
          <span>Haberler</span>
          <span>/</span>
          <span className="text-[#0F4761]">{title.substring(0, 30)}{title.length > 30 ? '...' : ''}</span>
        </div>

        {/* Görsel Üstte */}
        {hasImage && imageLayout === 'Üstte (Tam Genişlik)' && (
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={title}
              style={{ width: imageSize, maxWidth: '100%' }}
              className="object-cover w-full max-h-64"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* Başlık & Meta */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
            <Newspaper size={14} />
            <span>Haberler</span>
            <span>•</span>
            <Calendar size={14} />
            <span>{publishDate}</span>
          </div>

          <h1
            style={{ color: titleColor, fontSize: titleSize }}
            className="font-bold leading-tight mb-3"
          >
            {title}
          </h1>

          <div className="w-16 h-1 rounded-full bg-[#e63946] mb-4" />
        </div>

        {/* İçerik — görsel solda/sağda */}
        {hasImage && (imageLayout === 'Solda' || imageLayout === 'Sağda') ? (
          <div className={`flex gap-4 ${imageLayout === 'Sağda' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="shrink-0 rounded-lg overflow-hidden bg-gray-100" style={{ width: imageSize }}>
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full max-h-48"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <p
              style={{ color: contentColor, fontSize: contentSize }}
              className="leading-relaxed whitespace-pre-wrap flex-1"
            >
              {content}
            </p>
          </div>
        ) : (
          <div>
            {hasImage && imageLayout === 'Metin İçinde (Inline)' && (
              <div className="float-right ml-4 mb-2 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={title}
                  style={{ width: imageSize }}
                  className="object-cover max-h-40"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <p
              style={{ color: contentColor, fontSize: contentSize }}
              className="leading-relaxed whitespace-pre-wrap"
            >
              {content}
            </p>
          </div>
        )}

        {/* Footer tag */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f4f8] text-[#0F4761]">
            Haberler
          </span>
        </div>
      </article>
    </div>
  );
}
