import React from 'react';
import Image from 'next/image';

export default function TrustBanner() {
  const partners = [
    { name: "BAMF", logoUrl: "https://via.placeholder.com/150x60?text=BAMF+Logo" },
    { name: "AZAV Zertifiziert", logoUrl: "https://via.placeholder.com/150x60?text=AZAV+Zertifiziert" },
    { name: "ESF Plus", logoUrl: "https://via.placeholder.com/150x60?text=ESF+Plus" },
    { name: "Stadt Ludwigshafen", logoUrl: "https://via.placeholder.com/150x60?text=Stadt+Ludwigshafen" }
  ];

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Zertifiziert & Gefördert durch:
        </span>
        <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((p, idx) => (
            <div key={idx} className="flex items-center justify-center">
              {/* Note: In a real scenario, you'd use real SVGs or PNGs from /public */}
              <Image 
                src={p.logoUrl} 
                alt={p.name} 
                width={120} 
                height={40} 
                className="object-contain h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
