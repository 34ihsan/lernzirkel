'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe, Heart, Phone, Mail, ChevronDown, ArrowRight, Send, Sparkles, Search } from 'lucide-react';
import EmailObfuscator from '../common/EmailObfuscator';
import DynamicIcon from '../common/DynamicIcon';
import LanguageSwitcher from '../common/LanguageSwitcher';
import SocialLinksBar from '../common/SocialLinksBar';
import SiteSearchModal from '../common/SiteSearchModal';
import LiveOpeningStatus from '../common/LiveOpeningStatus';
import { useLanguage } from '@/context/LanguageContext';
import { HeaderConfig, defaultHeaderConfig, NavLinkItem } from '@/lib/site-defaults';
import { DesignConfig } from '@/lib/design-defaults';

// Smart merger: ensures every category has its submenus even if DB has partial/missing children
function getEffectiveNavLinks(configuredLinks?: NavLinkItem[]): NavLinkItem[] {
  const baseLinks = (configuredLinks && configuredLinks.length > 0)
    ? configuredLinks
    : defaultHeaderConfig.navLinks;

  return (baseLinks || []).map(link => {
    // If it has children already defined, sanitize and ensure all default children are present
    if (link.children && link.children.length > 0) {
      // Fix outdated URLs (e.g. Leitbild url pointing to /ueber-uns instead of /ueber-uns/leitbild)
      const sanitizedChildren = link.children.map(child => {
        if (
          (child.label.toLowerCase().includes('leitbild') || child.url === '#leitbild' || (link.url === '/ueber-uns' && child.url === '/ueber-uns')) &&
          child.url !== '/ueber-uns/leitbild'
        ) {
          return { ...child, url: '/ueber-uns/leitbild' };
        }
        return child;
      });

      // For Über uns, ensure all 7 subpages exist if any were missing from DB
      if (link.label.trim().toLowerCase().includes('über uns') || link.url === '/ueber-uns') {
        const defaultUeberUns = defaultHeaderConfig.navLinks?.find(
          def => def.url === '/ueber-uns' || def.label.toLowerCase().includes('über uns')
        );
        if (defaultUeberUns?.children) {
          const existingUrls = new Set(sanitizedChildren.map(c => c.url));
          const existingLabels = new Set(sanitizedChildren.map(c => c.label.toLowerCase()));
          const missing = defaultUeberUns.children.filter(
            defChild => !existingUrls.has(defChild.url) && !existingLabels.has(defChild.label.toLowerCase())
          );
          if (missing.length > 0) {
            return {
              ...link,
              children: [...sanitizedChildren, ...missing]
            };
          }
        }
      }

      return {
        ...link,
        children: sanitizedChildren
      };
    }
    // Fallback to default submenus by matching label or url
    const fallback = defaultHeaderConfig.navLinks?.find(
      def => def.label.trim().toLowerCase() === link.label.trim().toLowerCase() ||
             (link.url !== '/' && def.url.trim().toLowerCase() === link.url.trim().toLowerCase())
    );
    if (fallback?.children && fallback.children.length > 0) {
      return {
        ...link,
        children: fallback.children
      };
    }
    return link;
  });
}

export default function Header({ 
  config, 
  designConfig 
}: { 
  config?: HeaderConfig;
  designConfig?: DesignConfig;
}) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<number | null>(null);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Global Ctrl+K / Cmd+K search shortcut & custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    const handleCustomOpen = () => setIsSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-site-search', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-site-search', handleCustomOpen);
    };
  }, []);

  const effectiveNavLinks = getEffectiveNavLinks(config?.navLinks);

  const header = {
    ...defaultHeaderConfig,
    ...config,
    topBar: { ...defaultHeaderConfig.topBar, ...config?.topBar },
    logo: { ...defaultHeaderConfig.logo, ...config?.logo },
    navLinks: effectiveNavLinks,
    ctaButton: { ...defaultHeaderConfig.ctaButton, ...config?.ctaButton },
    design: { ...defaultHeaderConfig.design, ...config?.design }
  };

  const handleDesktopMouseEnter = (idx: number) => {
    if (desktopTimerRef.current) {
      clearTimeout(desktopTimerRef.current);
      desktopTimerRef.current = null;
    }
    setActiveDesktopDropdown(idx);
  };

  const handleDesktopMouseLeave = () => {
    if (desktopTimerRef.current) {
      clearTimeout(desktopTimerRef.current);
    }
    // 200ms grace period: cursor can move smoothly between nav item and dropdown without flickering
    desktopTimerRef.current = setTimeout(() => {
      setActiveDesktopDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (desktopTimerRef.current) {
        clearTimeout(desktopTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (header.design?.isSticky === false) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [header.design?.isSticky]);

  const topBarBg = header.design?.topBarBg || '#0F4761';
  const topBarTextColor = header.design?.topBarText || '#ffffff';
  const navBg = header.design?.navBg || '#ffffff';
  const navTextColor = header.design?.navText || '#333333';
  const navHoverColor = header.design?.navHoverText || '#0F4761';
  const navActiveColor = header.design?.navActiveText || '#0F4761';
  const navFontSize = header.design?.navFontSize;
  const navFontWeight = header.design?.navFontWeight === 'bold' ? 700 : header.design?.navFontWeight === 'semibold' ? 600 : header.design?.navFontWeight === 'normal' ? 400 : 500;
  const logoAlign = header.logo?.align || 'left';
  const activePhone = header.topBar?.phone || designConfig?.contact?.phone;
  const activeEmail = header.topBar?.email || designConfig?.contact?.email;
  const activeTagline = header.topBar?.tagline || designConfig?.contact?.workingHours;

  const itemGap = header.topBar?.itemGap ?? 20;
  const showDividers = header.topBar?.showDividers ?? true;

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 ${
        header.design?.isSticky
          ? isScrolled 
            ? 'fixed top-0 shadow-md' 
            : 'relative'
          : 'relative'
      }`}
      style={{ backgroundColor: navBg }}
    >
      {/* Top Bar (İletişim, Hızlı Linkler, Dil & Bağış Butonu) */}
      {header.topBar?.enabled && (
        <div 
          className={`w-full border-b border-black/10 transition-all duration-300 ${
            isScrolled && header.design?.isSticky ? 'h-0 min-h-0 overflow-hidden opacity-0 py-0' : 'opacity-100'
          }`}
          style={{ 
            backgroundColor: topBarBg, 
            color: topBarTextColor,
            fontSize: header.topBar.fontSize ? `${header.topBar.fontSize}px` : '13px',
            fontWeight: header.topBar.fontWeight === 'bold' ? 700 : header.topBar.fontWeight === 'semibold' ? 600 : header.topBar.fontWeight === 'medium' ? 500 : 400,
            letterSpacing: header.topBar.letterSpacing === 'wide' ? '0.05em' : header.topBar.letterSpacing === 'tight' ? '-0.025em' : 'normal',
            height: isScrolled && header.design?.isSticky ? '0px' : (header.topBar.height ? `${header.topBar.height}px` : '40px'),
            minHeight: isScrolled && header.design?.isSticky ? '0px' : (header.topBar.height ? `${header.topBar.height}px` : '40px'),
            paddingTop: header.topBar.paddingY !== undefined ? `${header.topBar.paddingY}px` : undefined,
            paddingBottom: header.topBar.paddingY !== undefined ? `${header.topBar.paddingY}px` : undefined,
          }}
        >
          <div 
            className={`h-full flex items-center justify-between transition-all ${
              (header.design?.fullWidth !== false) ? 'w-full px-3 sm:px-4 lg:px-0' : 'container mx-auto px-4'
            }`}
            style={(header.design?.fullWidth !== false) ? {
              paddingLeft: `${header.logo?.marginLeft !== undefined ? header.logo.marginLeft : 16}px`,
              paddingRight: `${header.ctaButton?.marginRight !== undefined ? header.ctaButton.marginRight : 16}px`,
            } : undefined}
          >
            <div 
              className="flex items-center hidden lg:flex"
              style={{ gap: `${itemGap}px` }}
            >
              {header.topBar.links?.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && showDividers && (
                    <span className="opacity-25 select-none">|</span>
                  )}
                  <Link href={item.url} className="hover:opacity-80 transition-opacity whitespace-nowrap">
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
              {activePhone && (
                <>
                  {showDividers && (
                    <span className="opacity-25 select-none">|</span>
                  )}
                  <a href={`tel:${activePhone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity whitespace-nowrap">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{activePhone}</span>
                  </a>
                </>
              )}
              {activeEmail && (
                <>
                  {showDividers && (
                    <span className="opacity-25 select-none">|</span>
                  )}
                  <EmailObfuscator 
                    user={activeEmail.split('@')[0]} 
                    domain={activeEmail.split('@')[1]} 
                    className="hover:opacity-80 whitespace-nowrap" 
                    showIcon={true} 
                  />
                </>
              )}
            </div>

            <div 
              className="flex items-center"
              style={{ gap: `${Math.max(10, itemGap - 4)}px` }}
            >
              {/* Live Opening Status Indicator */}
              <LiveOpeningStatus className="text-white/95 hidden sm:inline-flex whitespace-nowrap shrink-0" />
              {showDividers && (
                <span className="opacity-25 select-none hidden sm:inline">|</span>
              )}

              {activeTagline && (
                <>
                  <span 
                    className="opacity-90 hidden lg:inline whitespace-nowrap"
                    style={{ fontSize: header.topBar.fontSize ? `${Math.max(10, header.topBar.fontSize - 1)}px` : undefined }}
                  >
                    {activeTagline}
                  </span>
                  {showDividers && (
                    <span className="opacity-25 select-none hidden md:inline">|</span>
                  )}
                </>
              )}
              {designConfig?.social && (designConfig.social.showInHeader ?? true) && (
                <>
                  <div className="hidden lg:flex items-center">
                    <SocialLinksBar social={designConfig.social} variant="header" />
                  </div>
                  {showDividers && (
                    <span className="opacity-25 select-none hidden md:inline">|</span>
                  )}
                </>
              )}
              {header.topBar.showLanguage !== false && (
                <LanguageSwitcher theme="dark" />
              )}
              {header.topBar.donateButton?.enabled && (
                <>
                  {showDividers && (
                    <span className="opacity-25 select-none">|</span>
                  )}
                  <Link 
                    href={header.topBar.donateButton.url || '/spenden'} 
                    className="flex items-center bg-accent text-white px-3 py-1 rounded hover:bg-red-700 transition-colors font-semibold shadow-xs whitespace-nowrap shrink-0"
                    style={{ fontSize: header.topBar.fontSize ? `${Math.max(10, header.topBar.fontSize - 1)}px` : '12px' }}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    {header.topBar.donateButton.text && header.topBar.donateButton.text !== 'Spenden'
                      ? header.topBar.donateButton.text
                      : t('topbar.donate', 'Spenden')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className={`w-full py-2.5 flex items-center justify-between gap-1 lg:gap-1 xl:gap-6 ${
        (header.design?.fullWidth !== false)
          ? 'w-full px-2 sm:px-4 lg:px-2 xl:px-4'
          : 'max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-4 xl:px-8'
      } ${logoAlign === 'center' ? 'relative' : ''}`}>
        {/* 1. Dedicated Logo Bay (Sol / Merkez / Sağ Esnek Konumlandırma) */}
        <div 
          className={`flex-shrink-0 flex items-center z-10 transition-all ${
            logoAlign === 'center' 
              ? 'order-1 lg:order-2 mx-auto lg:mx-0' 
              : logoAlign === 'right' 
                ? 'order-1 lg:order-3' 
                : 'order-1'
          }`}
          style={{
            marginLeft: header.logo?.marginLeft !== undefined 
              ? `${header.logo.marginLeft}px` 
              : ((header.design?.fullWidth !== false) ? '16px' : undefined),
            marginRight: header.logo?.marginRight !== undefined 
              ? `${Math.max(8, header.logo.marginRight)}px` 
              : '16px',
          }}
        >
          <Link 
            href="/" 
            className="flex items-center space-x-2.5 transition-opacity hover:opacity-90 shrink-0"
          >
            {header.logo?.imageUrl ? (
              <Image 
                src={header.logo.imageUrl} 
                alt={header.logo.text || "Lernzirkel Logo"} 
                width={160} 
                height={48} 
                className="h-10 sm:h-11 md:h-12 w-auto object-contain shrink-0"
                style={{ 
                  maxWidth: header.logo.width && header.logo.width > 60 ? `${Math.min(260, header.logo.width)}px` : '180px',
                  maxHeight: '48px'
                }}
                priority
              />
            ) : null}
            {(!header.logo?.imageUrl || header.logo?.showText) && (
              <span className="text-xl sm:text-2xl font-bold text-primary tracking-tight whitespace-nowrap">
                {header.logo?.text || "Lernzirkel"}
              </span>
            )}
          </Link>

          {header.logo?.showDivider && (
            <div className="hidden lg:block h-6 w-px bg-gray-300 ml-3 mr-1 shrink-0" />
          )}
        </div>

        {/* 2. Desktop Navigation (Artık taşmaları önlemek için wrap yapabilir ve zorunlu küçülür) */}
        <div 
          className={`hidden lg:flex items-center flex-1 min-w-0 px-1 overflow-visible no-scrollbar ${
            logoAlign === 'center' 
              ? 'order-2 lg:order-1' 
              : logoAlign === 'right' 
                ? 'order-2 lg:order-1' 
                : 'order-2'
          } ${
            header.design?.navLayout === 'left' ? 'justify-start' :
            header.design?.navLayout === 'right' ? 'justify-end' :
            header.design?.navLayout === 'space-between' ? 'justify-between' :
            'justify-center'
          }`}
        >
          <nav 
            className="flex items-center justify-center lg:flex-wrap xl:flex-nowrap overflow-visible no-scrollbar w-full" 
            style={{ 
              color: navTextColor,
              fontSize: `clamp(11px, 1vw, ${parseFloat(navFontSize?.toString() || '14')}px)`,
              fontWeight: navFontWeight,
              gap: `clamp(4px, 0.8vw, ${parseFloat(header.design?.navGap?.toString() || '16')}px)`,
              rowGap: '4px' // Add a small row gap in case it wraps to next line
            }}
          >
          {header.navLinks?.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExt = item.isExternal || item.url.startsWith('http');
            const isOpen = activeDesktopDropdown === idx;

            if (!hasChildren) {
              return isExt ? (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:opacity-85 transition-colors py-1 px-1 lg:px-2 flex items-center gap-1 rounded-md hover:bg-black/5 shrink text-center leading-tight break-words ${item.isHighlight ? 'text-accent font-bold' : ''}`}
                  style={{ color: item.isHighlight ? undefined : navTextColor }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  key={idx}
                  href={item.url}
                  className={`hover:opacity-85 transition-colors py-1 px-1 lg:px-2 flex items-center gap-1 rounded-md hover:bg-black/5 shrink text-center leading-tight break-words ${item.isHighlight ? 'text-accent font-bold' : ''}`}
                  style={{ color: item.isHighlight ? undefined : navTextColor }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            }

            // Item with Submenu Dropdown (Hover and Click Supported - Direction Arrow Removed for Clean Single Line)
            return (
              <div 
                key={idx} 
                className="relative py-1.5 group shrink"
                onMouseEnter={() => handleDesktopMouseEnter(idx)}
                onMouseLeave={handleDesktopMouseLeave}
              >
                <Link
                  href={item.url}
                  onClick={() => setActiveDesktopDropdown(null)}
                  className={`flex items-center gap-0.5 py-1 px-1 lg:px-2 rounded-md hover:bg-black/5 transition-all select-none shrink text-center leading-tight break-words ${
                    isOpen ? 'font-bold bg-black/5' : ''
                  } ${item.isHighlight ? 'text-accent font-bold' : ''}`}
                  style={{
                    color: isOpen ? navActiveColor : (item.isHighlight ? undefined : navTextColor)
                  }}
                >
                  <span>{item.label}</span>
                  {header.design?.showDropdownArrows && (
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 group-hover:opacity-100 ${
                        isOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </Link>

                {/* Invisible hover bridge to prevent premature closing */}
                <div className="absolute top-full left-0 w-full h-2 pointer-events-auto" />

                {/* Dropdown Floating Mega/Card Menu */}
                <div 
                  className={`absolute left-0 top-full pt-1 z-50 transition-all duration-200 ${
                    isOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
                      : 'opacity-0 translate-y-2 pointer-events-none invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:visible'
                  }`}
                  style={{ minWidth: '320px', maxWidth: '420px' }}
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-3 overflow-hidden ring-1 ring-black/5">
                    {/* Header category link helper */}
                    <div className="pb-2 mb-2 border-b border-gray-100 flex items-center justify-between px-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                        {item.label}
                      </span>
                      <Link 
                        href={item.url}
                        onClick={() => setActiveDesktopDropdown(null)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        {t('header.allOffers', 'Tümünü Gör').replace('{category}', item.label)} →
                      </Link>
                    </div>

                    {/* Submenu links */}
                    <div className="flex flex-col space-y-1">
                      {item.children?.map((sub, subIdx) => {
                        const isSubExt = sub.isExternal || sub.url.startsWith('http');
                        const subContent = (
                          <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group/sub">
                            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 group-hover/sub:bg-blue-600 group-hover/sub:text-white transition-colors mt-0.5">
                              <DynamicIcon name={sub.icon || 'GraduationCap'} className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-gray-900 group-hover/sub:text-blue-700 transition-colors">
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );

                        return (
                          <div key={subIdx} className="flex flex-col">
                            {isSubExt ? (
                              <a 
                                href={sub.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => setActiveDesktopDropdown(null)}
                              >
                                {subContent}
                              </a>
                            ) : (
                              <Link 
                                href={sub.url}
                                onClick={() => setActiveDesktopDropdown(null)}
                              >
                                {subContent}
                              </Link>
                            )}

                            {/* Nested Sub-items (Level 2: e.g. Wettbewerbe -> Wir sind Vielfalt & Bildungsmesse) */}
                            {sub.children && sub.children.length > 0 && (
                              <div className="border-l-2 border-blue-200/90 ml-6 pl-3 py-1 space-y-1 my-0.5">
                                {sub.children.map((child, cIdx) => {
                                  const isChildExt = child.isExternal || child.url.startsWith('http');
                                  const childContent = (
                                    <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-blue-50/80 transition-colors group/child">
                                      <div className="w-5 h-5 rounded-md bg-blue-100/60 text-blue-700 flex items-center justify-center shrink-0 group-hover/child:bg-blue-600 group-hover/child:text-white transition-colors mt-0.5">
                                        <DynamicIcon name={child.icon || 'Sparkles'} className="w-3 h-3" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-semibold text-[11px] text-gray-800 group-hover/child:text-blue-700 transition-colors">
                                            {child.label}
                                          </span>
                                          {child.badge && (
                                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                              {child.badge}
                                            </span>
                                          )}
                                        </div>
                                        {child.description && (
                                          <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                            {child.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );

                                  return isChildExt ? (
                                    <a
                                      key={cIdx}
                                      href={child.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setActiveDesktopDropdown(null)}
                                    >
                                      {childContent}
                                    </a>
                                  ) : (
                                    <Link
                                      key={cIdx}
                                      href={child.url}
                                      onClick={() => setActiveDesktopDropdown(null)}
                                    >
                                      {childContent}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        </div>

        {/* 3. Action Button & Mobile Toggle (Sağ Kenar Sınırı) */}
        {(() => {
          const cta = header.ctaButton;
          const ctaEnabled = cta?.enabled ?? true;
          const ctaAlign = cta?.align || 'far-right';
          const isCtaFarRight = ctaAlign !== 'attached';
          const ctaText = cta?.text && cta.text !== 'Kontakt' && cta.text !== 'Kontakt & Anmeldung'
            ? cta.text
            : t('header.cta', 'Kontakt & Anmeldung');
          const ctaUrl = cta?.url || '/kontakt';
          const isCtaExternal = cta?.isExternal || ctaUrl.startsWith('http');

          const ctaRadiusClass = 
            cta?.borderRadius === 'square' ? 'rounded-md' :
            cta?.borderRadius === 'rounded' ? 'rounded-xl' :
            'rounded-full';

          let ctaThemeClass = 'flatsome-button text-white shadow-sm hover:shadow-md';
          if (cta?.style === 'accent') {
            ctaThemeClass = 'bg-accent text-white hover:bg-red-700 shadow-sm hover:shadow-md';
          } else if (cta?.style === 'outline') {
            ctaThemeClass = 'border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all';
          } else if (cta?.style === 'custom') {
            ctaThemeClass = 'shadow-sm hover:shadow-md transition-all';
          }

          const ctaCustomStyle: React.CSSProperties = {
            paddingLeft: cta?.paddingX !== undefined ? `${cta.paddingX}px` : undefined,
            paddingRight: cta?.paddingX !== undefined ? `${cta.paddingX}px` : undefined,
            paddingTop: cta?.paddingY !== undefined ? `${cta.paddingY}px` : undefined,
            paddingBottom: cta?.paddingY !== undefined ? `${cta.paddingY}px` : undefined,
            fontSize: cta?.fontSize !== undefined ? `${cta.fontSize}px` : undefined,
            ...(cta?.style === 'custom' ? {
              backgroundColor: cta.customBgColor || '#0F4761',
              color: cta.customTextColor || '#ffffff'
            } : {})
          };

          const renderCtaIcon = () => {
            if (!cta?.icon || cta.icon === 'none') return null;
            switch (cta.icon) {
              case 'arrow':
                return <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />;
              case 'send':
                return <Send className="w-3.5 h-3.5 ml-1.5" />;
              case 'mail':
                return <Mail className="w-3.5 h-3.5 mr-1.5" />;
              case 'phone':
                return <Phone className="w-3.5 h-3.5 mr-1.5" />;
              case 'sparkles':
                return <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />;
              default:
                return null;
            }
          };

          return (
            <div 
              className={`flex items-center gap-1.5 xl:gap-2.5 shrink-0 z-10 ${
                isCtaFarRight ? 'ml-auto' : ''
              } ${
                logoAlign === 'center' 
                  ? 'order-3' 
                  : logoAlign === 'right' 
                    ? 'order-1 lg:order-2' 
                    : 'order-3'
              }`}
              style={{
                marginRight: cta?.marginRight !== undefined 
                  ? `${cta.marginRight}px` 
                  : ((header.design?.fullWidth !== false) ? '16px' : undefined),
                marginLeft: cta?.marginLeft !== undefined ? `${Math.max(4, cta.marginLeft - 10)}px` : undefined,
              }}
            >
              {/* Site Search Trigger (Desktop) */}
              {header.design?.showSearch !== false && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden lg:flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-primary hover:bg-gray-100 transition-all border border-gray-200 hover:border-gray-300 shadow-2xs"
                  title="Website durchsuchen (Strg+K / ⌘K)"
                  aria-label="Suche öffnen"
                >
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden lg:inline text-xs text-gray-500 font-medium">Suchen...</span>
                  <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded border border-gray-200">
                    ⌘K
                  </kbd>
                </button>
              )}

              {ctaEnabled && (
                <div className="hidden lg:flex items-center">
                  {isCtaExternal ? (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group text-[10px] lg:text-sm font-bold px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all whitespace-nowrap flex items-center justify-center ${ctaRadiusClass} ${ctaThemeClass}`}
                      style={ctaCustomStyle}
                    >
                      {(cta?.icon === 'mail' || cta?.icon === 'phone' || cta?.icon === 'sparkles') && renderCtaIcon()}
                      <span>{ctaText}</span>
                      {(cta?.icon === 'arrow' || cta?.icon === 'send') && renderCtaIcon()}
                    </a>
                  ) : (
                    <Link 
                      href={ctaUrl} 
                      className={`group text-[10px] lg:text-sm font-bold px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all whitespace-nowrap flex items-center justify-center ${ctaRadiusClass} ${ctaThemeClass}`}
                      style={ctaCustomStyle}
                    >
                      {(cta?.icon === 'mail' || cta?.icon === 'phone' || cta?.icon === 'sparkles') && renderCtaIcon()}
                      <span>{ctaText}</span>
                      {(cta?.icon === 'arrow' || cta?.icon === 'send') && renderCtaIcon()}
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Search Trigger */}
              {header.design?.showSearch !== false && (
                <button 
                  type="button"
                  className="lg:hidden p-2 text-foreground hover:text-primary focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Suche öffnen"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button 
                className="lg:hidden p-2 text-foreground focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menü öffnen"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          );
        })()}
      </div>

      {/* Mobile Menu Dropdown (Supports Responsive Hover & Tap Accordion) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-4 z-50 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Bar Trigger */}
          {header.design?.showSearch !== false && (
            <div className="pb-3 mb-3 border-b border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-gray-500">Kurse, Angebote & Seiten suchen...</span>
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 font-mono text-gray-400">
                  ⌘K
                </span>
              </button>
            </div>
          )}

          {/* Mobile Language Selector Pills */}
          {header.topBar?.showLanguage !== false && (
            <div className="pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                <span className="flex items-center gap-1.5 text-blue-800">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  {t('lang.select', 'Sprache wählen / Dil')}
                </span>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  DE • TR • EN • AR
                </span>
              </div>
              <LanguageSwitcher variant="pills" />
            </div>
          )}

          {header.navLinks?.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExt = item.isExternal || item.url.startsWith('http');
            const isSubOpen = openMobileSubmenu === idx;

            return (
              <div 
                key={idx} 
                className="border-b border-gray-100 py-1"
                onMouseEnter={() => {
                  // Responsive mouse hover expands submenu automatically
                  if (hasChildren) setOpenMobileSubmenu(idx);
                }}
              >
                <div 
                  className={`flex items-center justify-between py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                    isSubOpen ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMobileSubmenu(isSubOpen ? null : idx);
                    }
                  }}
                >
                  {isExt ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-semibold text-sm flex items-center gap-2 ${item.isHighlight ? 'text-accent' : 'text-gray-900'}`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  ) : !hasChildren ? (
                    <Link
                      href={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-semibold text-sm flex items-center gap-2 ${item.isHighlight ? 'text-accent' : 'text-gray-900'}`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div className={`font-semibold text-sm flex items-center gap-2 ${item.isHighlight ? 'text-accent' : 'text-gray-900'}`}>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMobileSubmenu(isSubOpen ? null : idx);
                      }}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Alt menüyü aç"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu Accordion */}
                {hasChildren && isSubOpen && (
                  <div className="pl-3 pr-2 py-2 space-y-1.5 bg-gray-50/90 rounded-xl mb-2 border-l-2 border-blue-500 animate-in fade-in duration-200">
                    {/* Direct link to main category page */}
                    <Link
                      href={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-bold text-blue-700 bg-blue-100/60 hover:bg-blue-100 transition-colors"
                    >
                      <span>👉 {t('header.allOffers', `Alle Angebote zu "${item.label}" ansehen`, { category: item.label })}</span>
                      <span>→</span>
                    </Link>

                    {item.children?.map((sub, subIdx) => {
                      const isSubExt = sub.isExternal || sub.url.startsWith('http');
                      return (
                        <div key={subIdx} className="flex flex-col">
                          {isSubExt ? (
                            <a
                              href={sub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between p-2 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-white transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                {sub.icon && <DynamicIcon name={sub.icon} className="w-4 h-4 text-blue-600 shrink-0" />}
                                <span className="font-medium">{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                                  {sub.badge}
                                </span>
                              )}
                            </a>
                          ) : (
                            <Link
                              href={sub.url}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between p-2 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-white transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                {sub.icon && <DynamicIcon name={sub.icon} className="w-4 h-4 text-blue-600 shrink-0" />}
                                <div>
                                  <div className="font-medium text-gray-900">{sub.label}</div>
                                  {sub.description && <div className="text-[11px] text-gray-500">{sub.description}</div>}
                                </div>
                              </div>
                              {sub.badge && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          )}

                          {/* Nested Sub-items on Mobile */}
                          {sub.children && sub.children.length > 0 && (
                            <div className="border-l-2 border-blue-300 ml-6 pl-2.5 space-y-1 my-1">
                              {sub.children.map((child, cIdx) => {
                                const isChildExt = child.isExternal || child.url.startsWith('http');
                                return isChildExt ? (
                                  <a
                                    key={cIdx}
                                    href={child.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-1.5 rounded-lg text-xs text-gray-700 hover:text-blue-600 hover:bg-white transition-all"
                                  >
                                    <div className="flex items-center gap-2">
                                      {child.icon && <DynamicIcon name={child.icon} className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                      <span className="font-medium text-gray-900">{child.label}</span>
                                    </div>
                                    {child.badge && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full shrink-0">
                                        {child.badge}
                                      </span>
                                    )}
                                  </a>
                                ) : (
                                  <Link
                                    key={cIdx}
                                    href={child.url}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-1.5 rounded-lg text-xs text-gray-700 hover:text-blue-600 hover:bg-white transition-all"
                                  >
                                    <div className="flex items-center gap-2">
                                      {child.icon && <DynamicIcon name={child.icon} className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                      <div>
                                        <div className="font-medium text-gray-900">{child.label}</div>
                                        {child.description && <div className="text-[10px] text-gray-500">{child.description}</div>}
                                      </div>
                                    </div>
                                    {child.badge && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full shrink-0">
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {(() => {
            const cta = header.ctaButton;
            const ctaEnabled = cta?.enabled ?? true;
            if (!ctaEnabled) return null;
            const ctaText = cta?.text && cta.text !== 'Kontakt' && cta.text !== 'Kontakt & Anmeldung'
              ? cta.text
              : t('header.cta', 'Kontakt & Anmeldung');
            const ctaUrl = cta?.url || '/kontakt';
            const isCtaExternal = cta?.isExternal || ctaUrl.startsWith('http');
            const ctaRadiusClass = 
              cta?.borderRadius === 'square' ? 'rounded-md' :
              cta?.borderRadius === 'rounded' ? 'rounded-xl' :
              'rounded-full';

            const ctaThemeClass = 
              cta?.style === 'accent' ? 'bg-accent text-white hover:bg-red-700' :
              cta?.style === 'outline' ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white' :
              cta?.style === 'custom' ? '' :
              'bg-primary text-white hover:bg-primary-light';

            const renderCtaIcon = () => {
              if (!cta?.icon || cta.icon === 'none') return null;
              switch (cta.icon) {
                case 'arrow':
                  return <ArrowRight className="w-4 h-4 ml-1.5" />;
                case 'send':
                  return <Send className="w-4 h-4 ml-1.5" />;
                case 'mail':
                  return <Mail className="w-4 h-4 mr-1.5" />;
                case 'phone':
                  return <Phone className="w-4 h-4 mr-1.5" />;
                case 'sparkles':
                  return <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />;
                default:
                  return null;
              }
            };

            const linkProps = {
              onClick: () => setMobileMenuOpen(false),
              className: `mt-4 text-center py-3 font-bold transition-colors shadow-sm flex items-center justify-center ${ctaRadiusClass} ${ctaThemeClass}`,
              style: cta?.style === 'custom' ? {
                backgroundColor: cta.customBgColor || '#0F4761',
                color: cta.customTextColor || '#ffffff'
              } : undefined
            };

            const content = (
              <>
                {(cta?.icon === 'mail' || cta?.icon === 'phone' || cta?.icon === 'sparkles') && renderCtaIcon()}
                <span>{ctaText}</span>
                {(cta?.icon === 'arrow' || cta?.icon === 'send') && renderCtaIcon()}
              </>
            );

            return isCtaExternal ? (
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer" {...linkProps}>
                {content}
              </a>
            ) : (
              <Link href={ctaUrl} {...linkProps}>
                {content}
              </Link>
            );
          })()}

          {designConfig?.social && (designConfig.social.showInHeader ?? true) && (
            <SocialLinksBar social={designConfig.social} variant="mobile" className="mt-4" />
          )}
        </div>
      )}

      {/* Global Site Search Modal */}
      <SiteSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
