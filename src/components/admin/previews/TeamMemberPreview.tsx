'use client';

import { User, Mail } from 'lucide-react';

interface TeamMemberPreviewProps {
  data: Record<string, string>;
}

export default function TeamMemberPreview({ data }: TeamMemberPreviewProps) {
  const name = data.name || 'Ad Soyad';
  const role = data.role || 'Unvan / Rol';
  const email = data.email || '';
  const photoUrl = data.photoUrl || '';
  const hasPhoto = photoUrl.trim().length > 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 font-sans">
      <div className="bg-[#0F4761] h-8 flex items-center px-4">
        <span className="text-white text-xs font-bold tracking-widest opacity-70">LERNZIRKEL — ÖNİZLEME</span>
      </div>

      <div className="p-6">
        {/* Team member card — site tasarımına uygun */}
        <div className="flatsome-card p-6 text-center flex flex-col items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e8f4f8] flex items-center justify-center mb-4 ring-4 ring-white shadow-md">
            {hasPhoto ? (
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <User size={40} className="text-[#0F4761]" />
            )}
          </div>

          {/* İsim */}
          <h3 className="text-xl font-bold text-[#0F4761] mb-1">{name}</h3>
          
          {/* Rol */}
          <p className="text-sm font-semibold text-[#e63946] uppercase tracking-wider mb-3">{role}</p>

          <div className="w-12 h-0.5 bg-gray-200 mb-4" />

          {/* E-posta */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center text-sm text-gray-500 hover:text-[#0F4761] transition-colors"
            >
              <Mail size={14} className="mr-2" />
              {email}
            </a>
          )}
        </div>

        {/* Context: Ekip listesinde nasıl görünür */}
        <p className="text-center text-xs text-gray-400 mt-4">↑ Ekip sayfasındaki kart görünümü</p>
      </div>
    </div>
  );
}
