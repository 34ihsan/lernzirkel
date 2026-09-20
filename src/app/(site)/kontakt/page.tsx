import React from 'react';
import prisma from '@/lib/prisma';
import { DEFAULT_DESIGN_CONFIG, DesignConfig } from '@/lib/design-defaults';
import { FooterConfig, defaultFooterConfig } from '@/lib/site-defaults';
import SmartContactForm from '@/components/forms/SmartContactForm';
import SocialLinksBar from '@/components/common/SocialLinksBar';
import EmailObfuscator from '@/components/common/EmailObfuscator';
import { MapPin, Phone, Clock, ExternalLink, Share2 } from 'lucide-react';

export const revalidate = 0; // always dynamic to reflect admin design updates immediately

export default async function KontaktPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  const design = (settings?.designConfig as unknown as DesignConfig) || DEFAULT_DESIGN_CONFIG;
  const footerConfig = (settings?.footerConfig as unknown as FooterConfig) || defaultFooterConfig;
  const contact = design?.contact || DEFAULT_DESIGN_CONFIG.contact;
  const social = design?.social || DEFAULT_DESIGN_CONFIG.social;
  const openingHours = footerConfig?.openingHours || defaultFooterConfig.openingHours;
  const departments = (openingHours?.departments && openingHours.departments.length > 0)
    ? openingHours.departments
    : (defaultFooterConfig.openingHours?.departments || []);

  const address = contact?.address || "Ludwigsplatz 9a, 67059 Ludwigshafen am Rhein";
  const phone = contact?.phone || "0621 3073 7271";
  const email = contact?.email || "info@lernzirkel-online.de";
  const workingHours = contact?.workingHours || "Mo. - Fr.: 09:00 - 17:00 Uhr";
  const mapsUrl = contact?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Kontakt & Anmeldung</h1>
          <p className="text-lg text-gray-600">Wir sind für Sie da. Schreiben Sie uns eine Nachricht oder rufen Sie uns an.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Contact Form (Left) */}
          <div className="lg:col-span-3">
            <SmartContactForm />
          </div>

          {/* Contact Info (Right) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Kontaktdaten</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <h5 className="font-bold text-gray-100">Adresse</h5>
                    <p className="text-primary-light text-sm">{address}</p>
                    {mapsUrl && (
                      <a 
                        href={mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-white mt-1 underline transition-colors"
                      >
                        Auf Google Maps ansehen <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <h5 className="font-bold text-gray-100">Telefon</h5>
                    <a 
                      href={`tel:${phone.replace(/\s+/g, '')}`} 
                      className="text-primary-light hover:text-white text-sm transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 mr-4 shrink-0 flex items-center justify-center text-accent font-bold text-xl">@</div>
                  <div>
                    <h5 className="font-bold text-gray-100">E-Mail</h5>
                    <EmailObfuscator 
                      user={email.split('@')[0]} 
                      domain={email.split('@')[1]} 
                      className="text-primary-light hover:text-white text-sm" 
                      showIcon={false} 
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Accounts */}
              {social && (
                <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white/90">
                    <Share2 size={13} className="text-accent" />
                    <span>Folgen Sie uns</span>
                  </div>
                  <SocialLinksBar social={social} variant="footer" />
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flatsome-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <Clock className="w-5 h-5 text-primary mr-2" /> {openingHours?.title || "Öffnungszeiten & Erreichbarkeit"}
              </h3>
              {workingHours && (
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Zentrale Erreichbarkeit
                  </span>
                  <p className="text-sm text-gray-800 font-medium">{workingHours}</p>
                </div>
              )}
              <ul className="space-y-4 text-sm text-gray-600">
                {departments.map((dept, idx) => (
                  <li key={dept.id || idx} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-semibold text-gray-800">{dept.name}</span>
                      <div className="text-right text-xs sm:text-sm space-y-0.5">
                        {dept.hours?.map((h, hIdx) => {
                          if (h.isClosed || (!h.openTime && !h.closeTime)) return null;
                          return (
                            <div key={hIdx} className="text-gray-600">
                              <span className="font-medium text-gray-500 mr-1.5">{h.day}:</span>
                              <span className="font-semibold text-gray-800">{h.openTime} - {h.closeTime} Uhr</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {dept.note && (
                      <p className="text-xs text-accent font-medium mt-1">
                        {dept.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
