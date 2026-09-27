"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Info, AlertTriangle, Megaphone, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type AnnouncementType = {
  id: string;
  title: string;
  message: string;
  isCloseable: boolean;
  targetScope: string;
  targetPageSlugs: string[];
  type: string;
  position: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontSize: string;
  fontWeight: string;
  padding: string;
  icon: string;
  animation: string;
  animationSpeed?: string;
  duration?: number;
  isInline?: boolean;
  linkUrl?: string | null;
  linkText?: string | null;
  translations?: any | null;
};

export default function AnnouncementBanner({ 
  announcements 
}: { 
  announcements: AnnouncementType[] 
}) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [activeAnnouncements, setActiveAnnouncements] = useState<AnnouncementType[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const [activeIndices, setActiveIndices] = useState({
    banner: 0,
    stickyTop: 0,
    stickyBottom: 0,
  });

  // Component mount olduğunda localStorage'dan kapatılan duyuruları al
  useEffect(() => {
    const stored = localStorage.getItem("dismissed_announcements_v2");
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse dismissed announcements", e);
      }
    }
    setMounted(true);
  }, []);

  // Sayfa veya dismiss listesi değiştiğinde aktif duyuruları hesapla
  useEffect(() => {
    if (!mounted) return;

    // Geçerli URL'nin slug'ını çıkar
    // Örn: /hakkimizda -> hakkimizda. Ana sayfa -> ""
    const currentSlug = pathname.replace(/^\//, "").split("/")[0] || "";

    const filtered = announcements.filter(ann => {
      // 1. Kullanıcı kapatmış mı?
      if (dismissedIds.includes(ann.id)) return false;

      // 2. Kapsam eşleşiyor mu?
      if (ann.targetScope === "ALL") return true;
      if (ann.targetScope === "HOME") return currentSlug === "";
      if (ann.targetScope === "SELECTED") {
        return ann.targetPageSlugs.includes(currentSlug);
      }
      return false;
    });
    
    console.log("Active announcements:", filtered, "All:", announcements);

    setActiveAnnouncements(filtered);
  }, [pathname, announcements, dismissedIds, mounted]);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_announcements_v2", JSON.stringify(newDismissed));
  };

  // --- KATEGORİLENDİRME (Çoklu Duyuru Yönetimi İçin) ---
  const banners = activeAnnouncements.filter(a => a.type === "banner");
  const stickyTop = activeAnnouncements.filter(a => a.type === "sticky-bar" && a.position === "top");
  const stickyBottom = activeAnnouncements.filter(a => a.type === "sticky-bar" && a.position === "bottom");
  const toasts = activeAnnouncements.filter(a => a.type === "toast");
  const popups = activeAnnouncements.filter(a => a.type === "popup");

  const [visiblePopupId, setVisiblePopupId] = useState<string | null>(null);

  useEffect(() => {
    // Popup Gecikme Mantığı
    let popupTimer: NodeJS.Timeout;
    if (popups.length > 0) {
      const currentPopup = popups[0];
      if (visiblePopupId !== currentPopup.id) {
        // duration = 3 veya 5 saniye olarak ayarlanmıştı
        const delayMs = (currentPopup.duration || 3) * 1000;
        popupTimer = setTimeout(() => {
          setVisiblePopupId(currentPopup.id);
        }, delayMs);
      }
    } else {
      setVisiblePopupId(null);
    }

    // Timer for banners
    let bannerTimer: NodeJS.Timeout;
    if (banners.length > 1) {
      const currentBanner = banners[activeIndices.banner % banners.length];
      const durationMs = (currentBanner?.duration || 7) * 1000;
      bannerTimer = setTimeout(() => {
        setActiveIndices(prev => ({ ...prev, banner: prev.banner + 1 }));
      }, durationMs);
    }

    // Timer for sticky top
    let stickyTopTimer: NodeJS.Timeout;
    if (stickyTop.length > 1) {
      const currentSticky = stickyTop[activeIndices.stickyTop % stickyTop.length];
      const durationMs = (currentSticky?.duration || 7) * 1000;
      stickyTopTimer = setTimeout(() => {
        setActiveIndices(prev => ({ ...prev, stickyTop: prev.stickyTop + 1 }));
      }, durationMs);
    }

    // Timer for sticky bottom
    let stickyBottomTimer: NodeJS.Timeout;
    if (stickyBottom.length > 1) {
      const currentSticky = stickyBottom[activeIndices.stickyBottom % stickyBottom.length];
      const durationMs = (currentSticky?.duration || 7) * 1000;
      stickyBottomTimer = setTimeout(() => {
        setActiveIndices(prev => ({ ...prev, stickyBottom: prev.stickyBottom + 1 }));
      }, durationMs);
    }

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(bannerTimer);
      clearTimeout(stickyTopTimer);
      clearTimeout(stickyBottomTimer);
    };
  }, [banners, stickyTop, stickyBottom, popups, activeIndices, visiblePopupId]);

  // Hydration hatasını önlemek için mount olana kadar render etmiyoruz
  if (!mounted || activeAnnouncements.length === 0) return null;

  const renderIcon = (icon: string, size = 18) => {
    if (icon === 'info') return <Info size={size} className={size === 18 ? "shrink-0 mt-0.5" : ""} />;
    if (icon === 'warning') return <AlertTriangle size={size} className={size === 18 ? "shrink-0 mt-0.5" : ""} />;
    if (icon === 'megaphone') return <Megaphone size={size} className={size === 18 ? "shrink-0 mt-0.5" : ""} />;
    return null;
  };

  const renderLink = (ann: AnnouncementType) => {
    if (!ann.linkUrl) return null;
    return (
      <a 
        href={ann.linkUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="shrink-0 px-4 py-1 ml-3 rounded-full font-medium text-sm transition-all hover:scale-105 z-20 relative shadow-sm inline-block" 
        style={{ backgroundColor: ann.textColor, color: ann.backgroundColor }}
      >
        {getTranslatedText(ann, 'linkText') || 'Tıklayın'}
      </a>
    );
  };

  const getTranslatedText = (ann: AnnouncementType, key: 'title' | 'message' | 'linkText') => {
    if (ann.translations && typeof ann.translations === 'object') {
      const translation = ann.translations[language];
      if (translation && translation[key]) {
        return translation[key];
      }
    }
    return ann[key];
  };

  const getCommonStyle = (ann: AnnouncementType) => {
    let animationDuration = undefined;
    if (ann.animation === 'marquee') {
      animationDuration = ann.animationSpeed === 'slow' ? '30s' : ann.animationSpeed === 'fast' ? '10s' : '20s';
    } else if (ann.animation === 'shimmer') {
      animationDuration = ann.animationSpeed === 'slow' ? '5s' : ann.animationSpeed === 'fast' ? '1.5s' : '3s';
    } else if (ann.animation === 'pulse') {
      animationDuration = ann.animationSpeed === 'slow' ? '3s' : ann.animationSpeed === 'fast' ? '1s' : '2s';
    }

    return {
      backgroundColor: ann.backgroundColor,
      color: ann.textColor,
      fontSize: ann.fontSize,
      fontWeight: ann.fontWeight,
      padding: ann.padding,
      animationDuration: animationDuration,
    };
  };

  // Select the currently active announcements for rotating types
  const currentBanner = banners.length > 0 ? banners[activeIndices.banner % banners.length] : null;
  const currentStickyTop = stickyTop.length > 0 ? stickyTop[activeIndices.stickyTop % stickyTop.length] : null;
  const currentStickyBottom = stickyBottom.length > 0 ? stickyBottom[activeIndices.stickyBottom % stickyBottom.length] : null;

  return (
    <>
      {/* 1. Banners (Rotasyon - Tek tek gösterilir) */}
      {currentBanner && (
        <div 
          key={currentBanner.id + activeIndices.banner}
          style={{
            ...getCommonStyle(currentBanner),
            borderBottom: /^#[0-9A-Fa-f]{6}$/.test(currentBanner.borderColor) && currentBanner.position === 'top' ? `1px solid ${currentBanner.borderColor}` : 'none',
            borderTop: /^#[0-9A-Fa-f]{6}$/.test(currentBanner.borderColor) && currentBanner.position === 'bottom' ? `1px solid ${currentBanner.borderColor}` : 'none',
          }}
          className={`w-full flex justify-center items-center overflow-hidden relative group animate-in fade-in zoom-in-95 duration-500 ${currentBanner.animation === 'pulse' ? 'animate-pulse' : ''} ${currentBanner.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
        >
          <div 
            style={currentBanner.animation === 'marquee' ? { animationDuration: getCommonStyle(currentBanner).animationDuration } : {}}
            className={`container mx-auto flex ${currentBanner.isInline !== false ? 'flex-row items-center justify-center whitespace-nowrap' : 'flex-col md:flex-row items-center justify-center md:text-left text-center'} gap-3 px-4 relative ${currentBanner.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
          >
            {currentBanner.icon !== 'none' && (
              <div className="flex items-center shrink-0">
                {renderIcon(currentBanner.icon)}
              </div>
            )}
            <div 
              dangerouslySetInnerHTML={{ __html: getTranslatedText(currentBanner, 'message') || "" }} 
              className={`${currentBanner.isInline !== false ? '[&>*]:inline [&>*]:m-0 shrink-0' : 'flex-1 max-w-4xl'}`}
            />
            {renderLink(currentBanner)}
            {currentBanner.isCloseable && (
              <button 
                onClick={() => handleDismiss(currentBanner.id)}
                className={`${currentBanner.isInline !== false ? 'shrink-0 ml-2' : 'absolute right-4 md:relative md:right-0'} p-1 opacity-70 hover:opacity-100 transition-opacity z-20`}
                aria-label="Kapat"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Sticky Top (Rotasyon - Yukarıda tek gösterilir) */}
      {currentStickyTop && (
        <div className="relative w-full z-[60] flex flex-col shadow-md">
          <div 
            key={currentStickyTop.id + activeIndices.stickyTop}
            style={{
              ...getCommonStyle(currentStickyTop),
              borderBottom: /^#[0-9A-Fa-f]{6}$/.test(currentStickyTop.borderColor) ? `1px solid ${currentStickyTop.borderColor}` : 'none',
            }}
            className={`w-full flex justify-center items-center overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-500 ${currentStickyTop.animation === 'pulse' ? 'animate-pulse' : ''} ${currentStickyTop.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
          >
            <div 
              style={currentStickyTop.animation === 'marquee' ? { animationDuration: getCommonStyle(currentStickyTop).animationDuration } : {}}
              className={`container mx-auto flex ${currentStickyTop.isInline !== false ? 'flex-row items-center justify-center whitespace-nowrap' : 'flex-col md:flex-row items-center justify-between md:text-left text-center'} gap-3 px-4 py-1 ${currentStickyTop.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
            >
              <div className={`flex ${currentStickyTop.isInline !== false ? 'flex-row items-center justify-center shrink-0' : 'flex-col md:flex-row items-center justify-start overflow-hidden w-full max-w-4xl'} space-x-3`}>
                {currentStickyTop.icon !== 'none' && <div className="shrink-0">{renderIcon(currentStickyTop.icon)}</div>}
                <div dangerouslySetInnerHTML={{ __html: getTranslatedText(currentStickyTop, 'message') || "" }} className={`${currentStickyTop.isInline !== false ? '[&>*]:inline [&>*]:m-0 shrink-0' : 'md:whitespace-normal'}`} />
              </div>
              <div className={`flex items-center shrink-0 ${currentStickyTop.isInline !== false ? 'ml-0' : 'mt-2 md:mt-0'}`}>
                {renderLink(currentStickyTop)}
                {currentStickyTop.isCloseable && (
                  <button onClick={() => handleDismiss(currentStickyTop.id)} className="p-1 ml-4 opacity-70 hover:opacity-100 transition-opacity z-20 shrink-0" aria-label="Kapat">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sticky Bottom (Rotasyon - Aşağıda tek gösterilir) */}
      {currentStickyBottom && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div 
            key={currentStickyBottom.id + activeIndices.stickyBottom}
            style={{
              ...getCommonStyle(currentStickyBottom),
              borderTop: /^#[0-9A-Fa-f]{6}$/.test(currentStickyBottom.borderColor) ? `1px solid ${currentStickyBottom.borderColor}` : 'none',
            }}
            className={`w-full flex justify-center items-center overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-500 ${currentStickyBottom.animation === 'pulse' ? 'animate-pulse' : ''} ${currentStickyBottom.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
          >
            <div 
              style={currentStickyBottom.animation === 'marquee' ? { animationDuration: getCommonStyle(currentStickyBottom).animationDuration } : {}}
              className={`container mx-auto flex ${currentStickyBottom.isInline !== false ? 'flex-row items-center justify-center whitespace-nowrap' : 'flex-col md:flex-row items-center justify-between md:text-left text-center'} gap-3 px-4 py-1 ${currentStickyBottom.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
            >
              <div className={`flex ${currentStickyBottom.isInline !== false ? 'flex-row items-center justify-center shrink-0' : 'flex-col md:flex-row items-center justify-start overflow-hidden w-full max-w-4xl'} space-x-3`}>
                {currentStickyBottom.icon !== 'none' && <div className="shrink-0">{renderIcon(currentStickyBottom.icon)}</div>}
                <div dangerouslySetInnerHTML={{ __html: getTranslatedText(currentStickyBottom, 'message') || "" }} className={`${currentStickyBottom.isInline !== false ? '[&>*]:inline [&>*]:m-0 shrink-0' : 'md:whitespace-normal'}`} />
              </div>
              <div className={`flex items-center shrink-0 ${currentStickyBottom.isInline !== false ? 'ml-0' : 'mt-2 md:mt-0'}`}>
                {renderLink(currentStickyBottom)}
                {currentStickyBottom.isCloseable && (
                  <button onClick={() => handleDismiss(currentStickyBottom.id)} className="p-1 ml-4 opacity-70 hover:opacity-100 transition-opacity z-20 shrink-0" aria-label="Kapat">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Toasts (İstiflenmiş bildirimler - Dinamik bottom pozisyonu) */}
      {toasts.map((ann, index) => (
        <div 
          key={ann.id}
          style={{
            ...getCommonStyle(ann),
            border: /^#[0-9A-Fa-f]{6}$/.test(ann.borderColor) ? `1px solid ${ann.borderColor}` : 'none',
            bottom: `calc(24px + ${index * 80}px)` // Her toast bir öncekinden 80px daha yukarıda çıkar
          }}
          className={`fixed right-6 z-[60] rounded-lg shadow-xl max-w-sm w-[calc(100%-48px)] md:w-full flex items-start space-x-3 overflow-hidden group animate-in slide-in-from-bottom-5 fade-in duration-300 transition-all ${ann.animation === 'pulse' ? 'animate-pulse' : ''} ${ann.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
        >
          <div 
            style={ann.animation === 'marquee' ? { animationDuration: getCommonStyle(ann).animationDuration } : {}}
            className={`flex flex-col space-y-2 w-full ${ann.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
          >
            <div className="flex flex-row items-start space-x-3 w-full">
              {ann.icon !== 'none' && <div className="shrink-0 mt-0.5">{renderIcon(ann.icon)}</div>}
              <div dangerouslySetInnerHTML={{ __html: getTranslatedText(ann, 'message') || "" }} className="flex-1 text-sm leading-relaxed [&>p]:inline [&>p]:m-0" />
            </div>
            {ann.linkUrl && (
              <div className="pl-8 pb-1">
                {renderLink(ann)}
              </div>
            )}
          </div>
          {ann.isCloseable && (
            <button 
              onClick={() => handleDismiss(ann.id)}
              className="shrink-0 opacity-70 hover:opacity-100 p-0.5 ml-2 relative z-20"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {/* 5. Popups (Kuyruk sistemi - Aynı anda sadece 1 adet gösterilir) */}
      {popups.length > 0 && (() => {
        const ann = popups[0]; // Kuyruktaki ilk popup'ı al
        if (visiblePopupId !== ann.id) return null; // Timer dolmadıysa gösterme

        return (
          <div key={ann.id} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 group">
            <div className="absolute inset-0 bg-black/60 animate-in fade-in duration-300" onClick={() => ann.isCloseable && handleDismiss(ann.id)} />
            
            <div 
              style={{
                ...getCommonStyle(ann),
                border: /^#[0-9A-Fa-f]{6}$/.test(ann.borderColor) ? `1px solid ${ann.borderColor}` : 'none',
              }}
              className={`relative rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 ${ann.animation === 'pulse' ? 'animate-pulse' : ''} ${ann.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
            >
              {ann.isCloseable && (
                <button 
                  onClick={() => handleDismiss(ann.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-20"
                >
                  <X size={16} />
                </button>
              )}
              
              <div 
                style={ann.animation === 'marquee' ? { animationDuration: getCommonStyle(ann).animationDuration } : {}}
                className={`flex flex-col items-center text-center space-y-4 ${ann.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
              >
                {ann.icon !== 'none' && (
                  <div className="p-3 bg-black/5 rounded-full shrink-0">
                    {renderIcon(ann.icon, 32)}
                  </div>
                )}
                
                {ann.title && (
                  <h3 className="text-xl font-bold">{getTranslatedText(ann, 'title')}</h3>
                )}
                
                <div dangerouslySetInnerHTML={{ __html: getTranslatedText(ann, 'message') || "" }} className="text-base leading-relaxed [&>p]:inline [&>p]:m-0" />
                
                {ann.linkUrl && (
                  <div className="pt-2">
                    {renderLink(ann)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
