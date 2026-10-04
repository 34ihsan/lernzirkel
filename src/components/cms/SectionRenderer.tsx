'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, CheckCircle2, ChevronDown, ExternalLink, 
  Star, Send, Check, Phone, Mail, MapPin, Clock, FileText, 
  Download, Play, User, Award, ShieldCheck, Heart, Sparkles, 
  HelpCircle, ChevronRight, Building, CheckCircle
} from "lucide-react";
import DynamicIcon from "@/components/common/DynamicIcon";
import { useLanguage } from "@/context/LanguageContext";

export default function SectionRenderer({ section }: { section: any }) {
  const { type, content = {}, design = {}, isHidden } = section;
  
  if (isHidden) return null;

  // Design styles
  const bgColor = design?.backgroundColor || "bg-white dark:bg-gray-900";
  const textColor = design?.textColor || "text-gray-900 dark:text-gray-100";
  const padding = design?.padding || "py-16";
  const containerWidth = design?.containerWidth || "max-w-7xl";
  const isCustomBg = design?.backgroundColor?.startsWith("#") || design?.backgroundColor?.startsWith("rgb");
  const isCustomText = design?.textColor?.startsWith("#") || design?.textColor?.startsWith("rgb");
  const hasGradient = Boolean(design?.gradient);

  const sectionStyle: React.CSSProperties = {
    ...(hasGradient ? { background: design.gradient } : isCustomBg ? { backgroundColor: design.backgroundColor } : {}),
    ...(isCustomText ? { color: design.textColor } : {}),
  };

  const renderDividerTop = () => {
    if (design?.dividerTop === 'wave') {
      return (
        <div className="w-full overflow-hidden leading-none absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 sm:h-12 text-white fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      );
    }
    return null;
  };

  const renderDividerBottom = () => {
    if (design?.dividerBottom === 'wave') {
      return (
        <div className="w-full overflow-hidden leading-none absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 sm:h-12 text-white fill-current">
            <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      );
    }
    return null;
  };

  switch (type) {
    case 'HERO': {
      const minH = design?.minHeight || 'min-h-[550px]';
      const overlay = design?.overlayOpacity || 'bg-black/50';
      const textAlign = design?.textAlign || 'text-center';
      const alignClass = textAlign === 'text-left' ? 'items-start text-left' : textAlign === 'text-right' ? 'items-end text-right' : 'items-center text-center';

      return (
        <section 
          className={`relative w-full ${minH} flex items-center justify-center ${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding} overflow-hidden`}
          style={sectionStyle}
        >
          {content.imageUrl && (
            <div 
              className={`absolute inset-0 bg-cover bg-center ${content.imageOverlayClass || 'mix-blend-overlay'}`}
              style={{ backgroundImage: `url('${content.imageUrl}')` }}
            />
          )}
          {content.imageUrl && <div className={`absolute inset-0 ${overlay}`} />}
          <div className={`relative z-10 ${containerWidth} mx-auto px-4 flex flex-col ${alignClass}`}>
            {content.eyebrow && (
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent font-bold rounded-full text-sm mb-4 tracking-wide uppercase">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-sm dark:shadow-none leading-tight">
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <p className="text-lg md:text-2xl mb-8 max-w-3xl opacity-90 font-light leading-relaxed">
                {content.subtitle}
              </p>
            )}
            {(content.buttonText || content.secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {content.buttonText && content.buttonLink && (
                  <Link 
                    href={content.buttonLink} 
                    className="flatsome-button text-base px-8 py-3.5 shadow-lg bg-accent text-white hover:bg-red-700"
                    style={design?.buttonBg ? { backgroundColor: design.buttonBg, color: design.buttonColor || '#ffffff' } : {}}
                  >
                    {content.buttonText}
                  </Link>
                )}
                {content.secondaryButtonText && content.secondaryButtonLink && (
                  <Link 
                    href={content.secondaryButtonLink} 
                    className="flatsome-button text-base px-8 py-3.5 bg-white dark:bg-gray-900 text-primary hover:bg-gray-100 dark:bg-gray-800/50 shadow-md dark:shadow-none"
                  >
                    {content.secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'CARD_GRID': {
      const cols = content.columns || 3;
      const gridColsClass = 
        cols === 2 ? 'md:grid-cols-2' : 
        cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 
        'md:grid-cols-2 lg:grid-cols-3';

      return (
        <section className={`${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
          <div className={`${containerWidth} mx-auto px-4`}>
            {(content.title || content.subtitle || content.eyebrow) && (
              <div className="text-center mb-12 max-w-3xl mx-auto">
                {content.eyebrow && (
                  <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">
                    {content.eyebrow}
                  </span>
                )}
                {content.title && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                    {content.title}
                  </h2>
                )}
                {content.subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {content.subtitle}
                  </p>
                )}
              </div>
            )}

            <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
              {(content.items || []).map((item: any, idx: number) => {
                const CardWrapper = item.linkUrl ? Link : 'div';
                const wrapperProps = item.linkUrl 
                  ? { 
                      href: item.linkUrl, 
                      target: item.isExternal ? '_blank' : undefined,
                      rel: item.isExternal ? 'noopener noreferrer' : undefined 
                    } 
                  : {};

                return (
                  <CardWrapper
                    key={idx}
                    {...(wrapperProps as any)}
                    className="flatsome-card p-6 flex flex-col group bg-white dark:bg-gray-900 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all border border-gray-100 dark:border-gray-800 rounded-xl"
                  >
                    {item.imageUrl && (
                      <div className="w-full h-44 relative mb-4 rounded-lg overflow-hidden">
                        <Image src={item.imageUrl} alt={item.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      {item.icon && (
                        <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <DynamicIcon name={item.icon} className="w-6 h-6" />
                        </div>
                      )}
                      {item.badge && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.title && (
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed flex-grow" dangerouslySetInnerHTML={{ __html: item.description }} />
                    )}
                    {item.linkText && (
                      <span className="text-primary text-sm flex items-center font-semibold mt-auto pt-2">
                        {item.linkText} 
                        {item.isExternal ? <ExternalLink className="w-4 h-4 ml-1" /> : <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                      </span>
                    )}
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'BANNER': {
      const overlayOpacity = design?.overlayOpacity || 'bg-black/60';
      const textAlign = design?.textAlign || 'text-center';
      const contentAlign = textAlign === 'text-left' ? 'items-start text-left' : textAlign === 'text-right' ? 'items-end text-right' : 'items-center text-center';
      const minH = design?.minHeight || 'min-h-[360px]';

      return (
        <section
          className={`relative ${minH} flex items-center justify-center overflow-hidden ${!isCustomBg ? bgColor : ''} ${padding}`}
          style={{
            ...sectionStyle,
            ...(content.imageUrl ? { backgroundImage: `url(${content.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {})
          }}
        >
          {content.imageUrl && <div className={`absolute inset-0 ${overlayOpacity}`} />}
          <div className={`relative z-10 w-full ${containerWidth} mx-auto px-6 flex flex-col ${contentAlign}`}>
            {content.eyebrow && (
              <span 
                className="inline-block px-3 py-1 bg-white dark:bg-gray-900/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 text-white"
              >
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2
                className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white drop-shadow-md dark:shadow-none"
              >
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p
                className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed text-gray-100 drop-shadow"
              >
                {content.subtitle}
              </p>
            )}

            {content.noticeText && (
              <div className="bg-white dark:bg-gray-900/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm mb-6 inline-flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-300 shrink-0" />
                <span>{content.noticeText}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {content.buttonText && content.buttonLink && (
                <Link
                  href={content.buttonLink}
                  target={content.buttonExternal ? "_blank" : undefined}
                  rel={content.buttonExternal ? "noopener noreferrer" : undefined}
                  className="flatsome-button bg-accent hover:bg-red-700 text-white shadow-lg text-base px-8 py-3.5 inline-flex items-center"
                >
                  {content.buttonText}
                  {content.buttonExternal && <ExternalLink className="w-4 h-4 ml-2" />}
                </Link>
              )}
              {content.secondaryButtonText && content.secondaryButtonLink && (
                <Link
                  href={content.secondaryButtonLink}
                  className="flatsome-button bg-white dark:bg-gray-900 text-primary hover:bg-gray-100 dark:bg-gray-800/50 shadow-md dark:shadow-none text-base px-8 py-3.5"
                >
                  {content.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      );
    }

    case 'IMAGE_TEXT': {
      const isRight = content.imagePosition === 'right';
      return (
        <section className={`${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
          <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className={`flex flex-col md:flex-row items-center gap-12 ${isRight ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full relative h-72 md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                {content.imageUrl ? (
                  <Image src={content.imageUrl} alt={content.title || "Image"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Görsel Alanı</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {content.eyebrow && (
                  <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">
                    {content.eyebrow}
                  </span>
                )}
                {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{content.title}</h2>}
                {content.text && (
                  <div className="prose max-w-none text-gray-700 dark:text-gray-300 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text }} />
                )}
                {Array.isArray(content.bullets) && content.bullets.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {content.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {content.buttonText && content.buttonLink && (
                  <Link href={content.buttonLink} className="flatsome-button bg-primary hover:bg-primary-light text-white">
                    {content.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'TEXT': {
      const align = design?.textAlign || 'text-left';
      return (
        <section className={`${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
          <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8 ${align}`}>
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">
                {content.eyebrow}
              </span>
            )}
            {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{content.title}</h2>}
            {content.leadText && <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 font-light leading-relaxed">{content.leadText}</p>}
            {content.text && (
              <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text }} />
            )}
          </div>
        </section>
      );
    }

    case 'FEATURES': {
      return (
        <section className={`${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
          <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
            {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary">{content.title}</h2>}
            {content.subtitle && <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">{content.subtitle}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                  {item.icon && (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <DynamicIcon name={item.icon} className="w-6 h-6" />
                    </div>
                  )}
                  {item.title && <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>}
                  {item.text && <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'STATS': {
      return (
        <section className={`${!isCustomBg ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
          <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
            {(content.title || content.subtitle) && (
              <div className="text-center mb-12">
                {content.title && <h2 className="text-3xl font-bold mb-2 text-primary">{content.title}</h2>}
                {content.subtitle && <p className="text-gray-600 dark:text-gray-400">{content.subtitle}</p>}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {(content.items || []).map((stat: any, idx: number) => (
                <div key={idx} className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none">
                  {stat.icon && (
                    <div className="flex justify-center mb-3 text-accent">
                      <DynamicIcon name={stat.icon} className="w-8 h-8" />
                    </div>
                  )}
                  <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">
                    {stat.number}{stat.suffix || ''}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'FAQ': {
      return <FaqSection content={content} isCustomBg={isCustomBg} hasGradient={hasGradient} bgColor={bgColor} textColor={textColor} isCustomText={isCustomText} padding={padding} containerWidth={containerWidth} sectionStyle={sectionStyle} renderDividerTop={renderDividerTop} renderDividerBottom={renderDividerBottom} />;
    }

    case 'HTML': {
      return (
        <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
          {renderDividerTop()}
          <div className={`${containerWidth} mx-auto px-4`}>
            {content.title && <h2 className="text-2xl font-bold mb-4 text-primary">{content.title}</h2>}
            <div dangerouslySetInnerHTML={{ __html: content.code || '' }} />
          </div>
          {renderDividerBottom()}
        </section>
      );
    }

    // ==========================================
    // 🌟 ELİT PRO ROYAL YENİ BLOK TÜRLERİ
    // ==========================================

    case 'FORM': {
      return (
        <InteractiveFormSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'TESTIMONIALS': {
      return (
        <TestimonialsSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'TIMELINE': {
      return (
        <TimelineSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'TEAM_GRID': {
      return (
        <TeamGridSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'PRICING': {
      return (
        <PricingSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'VIDEO_SHOWCASE': {
      return (
        <VideoShowcaseSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'LOGO_CLOUD': {
      return (
        <LogoCloudSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    case 'DOWNLOADS': {
      return (
        <DownloadsSection 
          content={content} 
          design={design} 
          sectionStyle={sectionStyle} 
          bgColor={bgColor} 
          textColor={textColor} 
          padding={padding} 
          containerWidth={containerWidth}
          isCustomBg={isCustomBg}
          hasGradient={hasGradient}
          renderDividerTop={renderDividerTop}
          renderDividerBottom={renderDividerBottom}
        />
      );
    }

    default:
      return (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 m-4 rounded-xl">
          Bölüm Tipi: {type}
        </div>
      );
  }
}

// ----------------------------------------------------
// 1. FAQ Subcomponent
// ----------------------------------------------------
function FaqSection({ content, isCustomBg, hasGradient, bgColor, textColor, isCustomText, padding, containerWidth, sectionStyle, renderDividerTop, renderDividerBottom }: any) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${!isCustomText ? textColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4 max-w-4xl`}>
        {content.eyebrow && (
          <span className="text-accent font-bold uppercase tracking-wider text-xs block text-center mb-2">
            {content.eyebrow}
          </span>
        )}
        {content.title && <h2 className="text-3xl font-bold mb-4 text-center text-primary">{content.title}</h2>}
        {content.subtitle && <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">{content.subtitle}</p>}
        <div className="space-y-4">
          {(content.items || []).map((faq: any, i: number) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-xs transition-all">
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-6 py-4.5 font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center hover:bg-gray-50 dark:bg-gray-800/80 transition"
              >
                <span className="text-base">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 ml-4 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
              </button>
              {openIndex === i && (
                <div 
                  className="px-6 py-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm leading-relaxed animate-in fade-in prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 2. Interactive Form Section
// ----------------------------------------------------
function InteractiveFormSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: content.defaultSubject || '',
    message: '',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const showSideInfo = content.showContactInfo !== false;

  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${showSideInfo ? 'lg:grid-cols-12 gap-8' : 'max-w-2xl mx-auto'} items-start`}>
          {/* Form Card */}
          <div className={`${showSideInfo ? 'lg:col-span-7' : 'w-full'} bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800`}>
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm dark:shadow-none">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {content.successTitle || t('form.successTitle', "Talebiniz Başarıyla Alındı!")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  {content.successMessage || t('form.successDesc', "Mesajınız bize ulaştı. Eğitim danışmanlarımız en kısa sürede sizinle iletişime geçecektir.")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-sm font-semibold transition-colors"
                >
                  {t('form.newSubmission', "Yeni Mesaj Gönder")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {content.nameLabel || t('form.fullName', "Adınız & Soyadınız")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Mehmet Yılmaz"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {content.emailLabel || t('form.email', "E-Posta Adresiniz")} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ornek@domain.de"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {content.phoneLabel || t('form.phone', "Telefon Numaranız")}
                    </label>
                    <input
                      type="tel"
                      placeholder="0621 / ..."
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {content.selectLabel || t('form.interest', "İlgilendiğiniz Alan")}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <option value="">Lütfen Seçiniz</option>
                      {(content.options || [
                        "Allgemeine Integrationskurse",
                        "Kostenlose Lernförderung (BuT)",
                        "ESF+ Alpha Förderprogramm",
                        "Migrationsfachdienst (MFD)",
                        "telc Sprachprüfung",
                        "Diğer / Genel Danışmanlık"
                      ]).map((opt: string, i: number) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    {content.messageLabel || t('form.message', "Mesajınız / Sorunuz")} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nasıl yardımcı olabiliriz? Lütfen kısaca belirtin..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent-check"
                    required
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="consent-check" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
                    {content.consentText || "Kişisel verilerimin KVKK ve GDPR kapsamında iletişim ve bilgilendirme amacıyla işlenmesini onaylıyorum."}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-sm shadow-md dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{content.submitText || t('form.submit', "Formu Gönder & Başvur")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Side Card */}
          {showSideInfo && (
            <div className="lg:col-span-5 space-y-6 bg-gradient-to-br from-[#0F4761] to-[#1a6d92] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <div>
                <span className="text-xs font-bold tracking-wider text-blue-200 uppercase mb-2 block">
                  {content.contactEyebrow || "Hızlı İletişim"}
                </span>
                <h3 className="text-2xl font-bold mb-3">
                  {content.contactTitle || "Bizimle Doğrudan Görüşün"}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {content.contactText || "Kurslarımız ve danışmanlık hizmetlerimiz hakkında yüz yüze veya telefonla bilgi alabilirsiniz."}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Adres</div>
                    <div className="text-sm font-semibold">{content.address || "Prinzregentenstraße 47, 67063 Ludwigshafen"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Telefon</div>
                    <a href={`tel:${content.phone || '06211234567'}`} className="text-sm font-semibold hover:underline">
                      {content.phone || "0621 / 123 45 67"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">E-Posta</div>
                    <a href={`mailto:${content.email || 'info@lernzirkel-online.de'}`} className="text-sm font-semibold hover:underline">
                      {content.email || "info@lernzirkel-online.de"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Çalışma Saatleri</div>
                    <div className="text-sm font-semibold">{content.hours || "Pzt - Cuma: 09:00 - 17:00"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 3. Testimonials Section (Öğrenci & Veli Yorumları)
// ----------------------------------------------------
function TestimonialsSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.items || []).map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.stars || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base italic leading-relaxed mb-6">
                  &ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;
                </div>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                {item.avatarUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border border-blue-100">
                    <Image src={item.avatarUrl} alt={item.name || "Kullanıcı"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                    {(item.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.role || item.course}</div>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full shrink-0 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 4. Timeline / Process Steps Section
// ----------------------------------------------------
function TimelineSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-14 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {(content.items || []).map((step: any, idx: number) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col relative group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md dark:shadow-none">
                  {step.stepNumber || idx + 1}
                </span>
                {step.icon && (
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <DynamicIcon name={step.icon} className="w-5 h-5" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1" dangerouslySetInnerHTML={{ __html: step.description }} />

              {step.badge && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit">
                  {step.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 5. Team Grid Section
// ----------------------------------------------------
function TeamGridSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(content.items || []).map((member: any, idx: number) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group"
            >
              <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800/50 overflow-hidden">
                {member.imageUrl ? (
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name || "Eğitmen"} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800/50">
                    <User size={64} className="opacity-40" />
                  </div>
                )}
                {member.badge && (
                  <div className="absolute top-3 left-3 bg-white dark:bg-gray-900/90 backdrop-blur-sm text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {member.badge}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-blue-700 mb-2">
                  {member.role}
                </div>
                {member.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {member.bio}
                  </p>
                )}

                {member.email && (
                  <a 
                    href={`mailto:${member.email}`}
                    className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Mail size={13} />
                    <span className="truncate">{member.email}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 6. Pricing & Course Fees Section
// ----------------------------------------------------
function PricingSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {(content.items || []).map((plan: any, idx: number) => {
            const isFeatured = plan.isFeatured;
            return (
              <div 
                key={idx}
                className={`rounded-3xl p-7 flex flex-col relative transition-all duration-300 ${
                  isFeatured 
                    ? 'bg-gradient-to-b from-[#0F4761] to-[#0A3042] text-white shadow-2xl scale-105 z-10 border-2 border-blue-400' 
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-4 ${
                    isFeatured ? 'bg-accent text-white shadow-sm dark:shadow-none' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                <h3 className={`text-xl font-bold mb-2 ${isFeatured ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                  {plan.title}
                </h3>
                {plan.description && (
                  <div className={`text-xs mb-6 ${isFeatured ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`} dangerouslySetInnerHTML={{ __html: plan.description }} />
                )}

                <div className="mb-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-xs ${isFeatured ? 'text-blue-200' : 'text-gray-400'}`}>
                      / {plan.period}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features || []).map((feat: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? 'text-green-300' : 'text-emerald-600'}`} />
                      <span className={isFeatured ? 'text-blue-50' : 'text-gray-600 dark:text-gray-400'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                {plan.buttonText && plan.buttonLink && (
                  <Link
                    href={plan.buttonLink}
                    className={`w-full py-3.5 rounded-xl font-bold text-center text-sm shadow-md dark:shadow-none hover:shadow-lg transition-all ${
                      isFeatured 
                        ? 'bg-accent hover:bg-red-700 text-white' 
                        : 'bg-primary hover:bg-primary-light text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 7. Video Showcase Section
// ----------------------------------------------------
function VideoShowcaseSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video border border-gray-100 dark:border-gray-800">
            {content.videoUrl ? (
              <iframe
                src={getEmbedUrl(content.videoUrl)}
                title={content.title || "Video"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-6 text-center">
                <Play size={48} className="mb-2 opacity-60" />
                <span className="text-sm">Video URL Eklenmedi</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            {content.leadTitle && (
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {content.leadTitle}
              </h3>
            )}
            {content.text && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {content.text}
              </p>
            )}

            {Array.isArray(content.highlights) && content.highlights.length > 0 && (
              <div className="space-y-3">
                {content.highlights.map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {content.buttonText && content.buttonLink && (
              <Link
                href={content.buttonLink}
                className="flatsome-button bg-primary hover:bg-primary-light text-white inline-flex items-center gap-2"
              >
                <span>{content.buttonText}</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 8. Logo Cloud / Partners Section
// ----------------------------------------------------
function LogoCloudSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-10 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {(content.items || []).map((partner: any, idx: number) => {
            const PartnerWrapper = partner.linkUrl ? 'a' : 'div';
            const wrapperProps = partner.linkUrl 
              ? { href: partner.linkUrl, target: '_blank', rel: 'noopener noreferrer' } 
              : {};

            return (
              <PartnerWrapper
                key={idx}
                {...(wrapperProps as any)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md dark:shadow-none hover:border-blue-200 transition-all duration-300 flex flex-col items-center justify-center text-center h-28 group"
              >
                {partner.logoUrl ? (
                  <div className="w-full h-12 relative grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
                    <Image src={partner.logoUrl} alt={partner.name || "Partner"} fill className="object-contain" />
                  </div>
                ) : (
                  <Building size={28} className="text-gray-400 group-hover:text-blue-600 transition-colors mb-1" />
                )}
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-700 transition-colors mt-2 line-clamp-1">
                  {partner.name}
                </span>
              </PartnerWrapper>
            );
          })}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}

// ----------------------------------------------------
// 9. Downloads & Documents Section
// ----------------------------------------------------
function DownloadsSection({ content, design, sectionStyle, bgColor, textColor, padding, containerWidth, isCustomBg, hasGradient, renderDividerTop, renderDividerBottom }: any) {
  return (
    <section className={`relative ${!isCustomBg && !hasGradient ? bgColor : ''} ${padding}`} style={sectionStyle}>
      {renderDividerTop && renderDividerTop()}
      <div className={`${containerWidth} mx-auto px-4`}>
        {(content.title || content.subtitle || content.eyebrow) && (
          <div className="text-center mb-10 max-w-3xl mx-auto">
            {content.eyebrow && (
              <span className="text-accent font-bold uppercase tracking-wider text-xs block mb-2">
                {content.eyebrow}
              </span>
            )}
            {content.title && (
              <h2 className="text-3xl font-bold text-primary mb-3">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.items || []).map((doc: any, idx: number) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  {doc.fileSize && (
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-2.5 py-1 rounded-full">
                      {doc.fileSize}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 transition-colors mb-2">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-6">
                    {doc.description}
                  </p>
                )}
              </div>

              <a
                href={doc.downloadUrl || '#'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:border-transparent group/btn"
              >
                <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                <span>{doc.buttonText || "İndir (PDF)"}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      {renderDividerBottom && renderDividerBottom()}
    </section>
  );
}
