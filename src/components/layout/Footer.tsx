import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, ChevronRight, Heart, ExternalLink } from 'lucide-react';
import EmailObfuscator from '../common/EmailObfuscator';
import SocialLinksBar from '../common/SocialLinksBar';
import LiveStatusBadge from '../common/LiveStatusBadge';
import prisma from '@/lib/prisma';
import { FooterConfig, defaultFooterConfig } from '@/lib/site-defaults';
import { DesignConfig } from '@/lib/design-defaults';

export default async function Footer({ 
  config,
  designConfig 
}: { 
  config?: FooterConfig;
  designConfig?: DesignConfig;
}) {
  // Fetch departments with their opening hours
  const departments = await prisma.department.findMany({
    include: {
      openingHours: {
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  }).catch(() => []);

  const footer = {
    ...defaultFooterConfig,
    ...config,
    about: { ...defaultFooterConfig.about, ...config?.about },
    quickLinks: {
      title: config?.quickLinks?.title || defaultFooterConfig.quickLinks?.title,
      links: config?.quickLinks?.links?.length ? config.quickLinks.links : defaultFooterConfig.quickLinks?.links,
    },
    badges: {
      title: config?.badges?.title || defaultFooterConfig.badges?.title,
      items: config?.badges?.items?.length ? config.badges.items : defaultFooterConfig.badges?.items,
      partners: config?.badges?.partners?.length ? config.badges.partners : defaultFooterConfig.badges?.partners,
      showTitle: config?.badges?.showTitle ?? defaultFooterConfig.badges?.showTitle,
    },
    donateBlock: { ...defaultFooterConfig.donateBlock, ...config?.donateBlock },
    openingHours: {
      title: config?.openingHours?.title || defaultFooterConfig.openingHours?.title,
      showTitle: config?.openingHours?.showTitle ?? defaultFooterConfig.openingHours?.showTitle ?? true,
      departments: (config?.openingHours?.departments && config.openingHours.departments.length > 0)
        ? config.openingHours.departments
        : defaultFooterConfig.openingHours?.departments
    },
    legalLinks: config?.legalLinks?.length ? config.legalLinks : defaultFooterConfig.legalLinks,
    design: { ...defaultFooterConfig.design, ...config?.design }
  };

  const currentYear = new Date().getFullYear();
  const copyrightText = (footer.copyright || defaultFooterConfig.copyright || '').replace('{year}', currentYear.toString());

  return (
    <footer 
      className="text-sm pt-16 pb-8"
      style={{ 
        backgroundColor: footer.design?.backgroundColor || '#111111',
        color: footer.design?.textColor || '#9ca3af'
      }}
    >
      <div className="container mx-auto px-4">
        
        {/* Zertifikate & Partner Banner */}
        {footer.badges && ((footer.badges.partners && footer.badges.partners.length > 0) || (footer.badges.items && footer.badges.items.length > 0)) && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-6 md:space-y-0 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200">
            {footer.badges.showTitle !== false && (
              <p className="font-bold uppercase tracking-wider text-center md:text-left text-gray-700 dark:text-gray-300 text-xs sm:text-sm shrink-0">
                {footer.badges.title || "Zertifiziert & Gefördert durch:"}
              </p>
            )}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {footer.badges.partners && footer.badges.partners.length > 0 ? (
                footer.badges.partners.map((partner, idx) => {
                  const content = partner.logoUrl ? (
                    <div className="flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/90 hover:bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name || "Partner Logo"}
                        width={partner.width || 120}
                        height={partner.height || 40}
                        className="object-contain max-h-12 w-auto transition-transform hover:scale-105"
                        style={{
                          maxWidth: partner.width ? `${partner.width}px` : '140px',
                          maxHeight: partner.height ? `${partner.height}px` : '48px',
                          height: 'auto'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-10 px-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-md shadow-xs hover:bg-gray-200 transition-colors">
                      {partner.name}
                    </div>
                  );

                  return partner.url ? (
                    <a
                      key={idx}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={partner.name}
                      className="inline-block transition-opacity hover:opacity-90"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={idx}>{content}</div>
                  );
                })
              ) : (
                footer.badges.items?.map((badge, idx) => (
                  <div key={idx} className="h-10 px-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-md shadow-xs">
                    {badge}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Spalte 1: Über uns & Kontakt */}
          <div className={footer.about?.logoAlign === 'center' ? 'text-center md:text-left' : ''}>
            {/* Logo Rendering */}
            {footer.about?.showLogo !== false && footer.about?.logoUrl && (
              <div 
                className={`flex items-center ${
                  footer.about?.logoAlign === 'center' ? 'justify-center md:justify-start' : 'justify-start'
                } ${footer.about?.logoPosition === 'inline' ? 'mb-4 gap-3' : ''}`}
                style={{
                  marginBottom: footer.about?.logoPosition === 'inline' 
                    ? undefined 
                    : `${footer.about?.logoMarginBottom ?? 16}px`
                }}
              >
                <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                  <Image 
                    src={footer.about.logoUrl} 
                    alt={footer.about.title || "Lernzirkel Logo"} 
                    width={footer.about.logoWidth || 160} 
                    height={footer.about.logoHeight || 52} 
                    className="object-contain max-h-16 w-auto"
                    style={{ 
                      maxWidth: footer.about.logoWidth ? `${footer.about.logoWidth}px` : '160px',
                      height: footer.about.logoHeight ? `${footer.about.logoHeight}px` : 'auto'
                    }}
                  />
                </Link>

                {footer.about?.logoPosition === 'inline' && footer.about?.showTitle !== false && footer.about?.title && (
                  <h4 
                    className="font-bold text-lg uppercase tracking-wider"
                    style={{ color: footer.design?.headingColor || '#ffffff' }}
                  >
                    {footer.about.title}
                  </h4>
                )}
              </div>
            )}

            {/* Title Rendering (when not inline and not replace-title) */}
            {footer.about?.logoPosition !== 'inline' && 
             footer.about?.logoPosition !== 'replace-title' && 
             footer.about?.showTitle !== false && (
              <h4 
                className="font-bold text-lg mb-4 uppercase tracking-wider"
                style={{ color: footer.design?.headingColor || '#ffffff' }}
              >
                {footer.about?.title || "Über den Lernzirkel"}
              </h4>
            )}
            <p className="mb-4 leading-relaxed opacity-90">
              {footer.about?.text}
            </p>
            <div className="flex flex-col space-y-3 opacity-90">
              {(() => {
                const address = footer.about?.address || designConfig?.contact?.address;
                if (!address) return null;
                const mapsUrl = footer.about?.mapsUrl || designConfig?.contact?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                const showMapsLink = footer.about?.showMapsLink ?? true;
                const mapsLinkText = footer.about?.mapsLinkText || 'Auf Google Maps anzeigen';
                const showMapEmbed = footer.about?.showMapEmbed ?? false;
                const mapEmbedHeight = footer.about?.mapEmbedHeight || 160;

                return (
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 shrink-0 text-primary-light mt-0.5" /> 
                      <div>
                        <a 
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-white transition-colors block"
                          title="Auf Google Maps öffnen"
                        >
                          {address}
                        </a>

                        {showMapsLink && (
                          <a 
                            href={mapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-primary-light hover:text-white hover:underline bg-white dark:bg-gray-900/5 hover:bg-white dark:bg-gray-900/10 px-2.5 py-1 rounded-md transition-all border border-white/10"
                            title="Auf Google Maps anzeigen"
                          >
                            <MapPin size={11} className="text-accent" />
                            <span>{mapsLinkText}</span>
                            <ExternalLink size={10} className="opacity-70" />
                          </a>
                        )}
                      </div>
                    </div>

                    {showMapEmbed && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 shadow-sm dark:shadow-none bg-black/30">
                        <iframe
                          title="Google Maps"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height={mapEmbedHeight}
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full contrast-105"
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
              {(footer.about?.phone || designConfig?.contact?.phone) && (
                <a 
                  href={`tel:${(footer.about?.phone || designConfig?.contact?.phone || '').replace(/\s+/g, '')}`} 
                  className="flex items-center hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 mr-3 shrink-0 text-primary-light" /> 
                  {footer.about?.phone || designConfig?.contact?.phone}
                </a>
              )}
              {(footer.about?.email || designConfig?.contact?.email) && (
                <EmailObfuscator 
                  user={(footer.about?.email || designConfig?.contact?.email || '').split('@')[0]} 
                  domain={(footer.about?.email || designConfig?.contact?.email || '').split('@')[1]} 
                  className="hover:text-white" 
                />
              )}
              {designConfig?.contact?.workingHours && (
                <span className="flex items-center text-xs text-gray-400 pt-1">
                  <Clock className="w-4 h-4 mr-2.5 shrink-0 text-primary-light" />
                  {designConfig.contact.workingHours}
                </span>
              )}
            </div>

            {/* Social Media Links in Footer */}
            {designConfig?.social && (designConfig.social.showInFooter ?? true) && (
              <div className="pt-4 mt-4 border-t border-gray-800/80">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Social Media:
                </p>
                <SocialLinksBar social={designConfig.social} variant="footer" />
              </div>
            )}
          </div>

          {/* Spalte 2: Wichtige Links */}
          <div>
            <h4 
              className="font-bold text-lg mb-4 uppercase tracking-wider"
              style={{ color: footer.design?.headingColor || '#ffffff' }}
            >
              {footer.quickLinks?.title || "Schnellzugriff"}
            </h4>
            <ul className="space-y-2">
              {footer.quickLinks?.links?.map((link, i) => {
                const isExt = link.isExternal || link.url.startsWith('http');
                return (
                  <li key={i}>
                    {isExt ? (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors group">
                        <ChevronRight className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-light transition-colors" />
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.url} className="flex items-center hover:text-white transition-colors group">
                        <ChevronRight className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-light transition-colors" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Spalte 3: Öffnungszeiten nach Abteilungen */}
          <div className="lg:col-span-2">
            {(footer.openingHours?.showTitle !== false) && (
              <h4 
                className="font-bold text-lg mb-4 uppercase tracking-wider flex items-center gap-2"
                style={{ color: footer.design?.headingColor || '#ffffff' }}
              >
                <Clock className="w-5 h-5 text-accent opacity-90" />
                <span>{footer.openingHours?.title || "Öffnungszeiten"}</span>
              </h4>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(() => {
                const effectiveDepartments = (footer.openingHours?.departments && footer.openingHours.departments.length > 0)
                  ? footer.openingHours.departments
                  : (departments && departments.length > 0)
                    ? departments.map(d => ({
                        id: d.id,
                        name: d.name,
                        note: d.openingHours.find(h => h.note)?.note || '',
                        hours: d.openingHours.map(h => {
                          const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
                          return {
                            day: dayNames[h.dayOfWeek - 1] || 'Mo',
                            openTime: h.openTime || '',
                            closeTime: h.closeTime || '',
                            isClosed: h.isClosed
                          };
                        })
                      }))
                    : (defaultFooterConfig.openingHours?.departments || []);

                return effectiveDepartments.map((dept, idx) => (
                  <div key={dept.id || idx} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-white mb-2.5 border-b border-gray-700/70 pb-2 flex items-center justify-between text-sm">
                        <span>{dept.name}</span>
                        {dept.hours && dept.hours.length > 0 && (
                          <LiveStatusBadge hours={dept.hours} />
                        )}
                      </h5>
                      <ul className="space-y-1.5 text-gray-300 text-xs sm:text-sm">
                        {dept.hours?.map((h, hIdx) => {
                          if (h.isClosed || (!h.openTime && !h.closeTime)) return null;
                          return (
                            <li key={hIdx} className="flex justify-between items-center text-xs">
                              <span className="font-medium text-gray-400">{h.day}:</span> 
                              <span className="font-semibold text-gray-200">{h.openTime} - {h.closeTime} Uhr</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {dept.note && (
                      <div className="mt-3 pt-2 border-t border-gray-700/50 text-[11px] text-accent font-medium italic">
                        {dept.note}
                      </div>
                    )}
                  </div>
                ));
              })()}

              {footer.donateBlock && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col justify-center items-center text-center">
                  <Heart className="w-8 h-8 text-accent mb-2 opacity-80" />
                  <h5 className="font-bold text-white mb-1">{footer.donateBlock.title || "Unterstützen Sie uns"}</h5>
                  <p className="text-xs text-gray-400 mb-3">{footer.donateBlock.text}</p>
                  <Link href={footer.donateBlock.buttonUrl || "/spenden"} className="text-accent hover:text-white transition-colors underline underline-offset-4 font-semibold text-xs">
                    {footer.donateBlock.buttonText || "Jetzt spenden"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400">
          <p>{copyrightText}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {footer.legalLinks?.map((item, idx) => (
              <Link key={idx} href={item.url} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
