'use client';

import { Image as ImageIcon } from 'lucide-react';

interface GalleryImagePreviewProps {
  data: Record<string, string>;
}

export default function GalleryImagePreview({ data }: GalleryImagePreviewProps) {
  const title = data.title || 'Başlık';
  const imageUrl = data.imageUrl || '';
  const category = data.category || '';
  const hasImage = imageUrl.trim().length > 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 font-sans">
      <div className="bg-[#0F4761] h-8 flex items-center px-4">
        <span className="text-white text-xs font-bold tracking-widest opacity-70">LERNZIRKEL — ÖNİZLEME</span>
      </div>

      <div className="p-6">
        {/* Galeri grid context açıklaması */}
        <p className="text-xs text-gray-400 mb-4 text-center">Galeri içindeki görünüm ↓</p>

        {/* Galeri kartı — site tasarımına uygun */}
        <div className="flatsome-card overflow-hidden group cursor-pointer">
          {/* Görsel */}
          <div className="relative h-52 bg-[#e8f4f8] flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <ImageIcon size={48} className="text-[#0F4761] opacity-30" />
            )}

            {/* Overlay hover efekti */}
            <div className="absolute inset-0 bg-[#0F4761]/0 group-hover:bg-[#0F4761]/20 transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm uppercase tracking-wider">
                Vergrößern
              </span>
            </div>
          </div>

          {/* Alt bilgi */}
          <div className="p-4">
            {category && (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-[#e8f4f8] text-[#0F4761] mb-2">
                {category}
              </span>
            )}
            <h3 className="font-bold text-[#333333] text-sm leading-snug">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
