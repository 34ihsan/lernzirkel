'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const bannerContent = {
  tr: {
    title: 'Çerezleri kullanıyoruz',
    message: 'Web sitemizin düzgün çalışmasını sağlamak, içerikleri kişiselleştirmek ve trafiğimizi analiz etmek için çerezler ve benzer teknolojiler kullanıyoruz. Daha fazla bilgi için lütfen inceleyin:',
    policyText: 'Çerez Politikası',
    btnAccept: 'Tümünü Kabul Et',
    btnDecline: 'Sadece Zorunlu',
    btnSettings: 'Ayarları Yönet',
    btnSave: 'Ayarları Kaydet',
    necessaryTitle: 'Zorunlu Çerezler',
    necessaryBadge: 'Daima Aktif',
    necessaryDesc: 'Web sitesinin temel işlevlerini yerine getirebilmesi için gereklidir. Güvenlik, ağ yönetimi ve erişilebilirlik gibi temel özellikleri sağlar.',
    analyticsTitle: 'Analiz ve Performans',
    analyticsDesc: 'Ziyaretçilerin web sitemizle nasıl etkileşime girdiğini anlamamıza yardımcı olur. Bu veriler sitemizi geliştirmek için anonim olarak toplanır.',
    functionalTitle: 'İşlevsel Çerezler',
    functionalDesc: 'Sitenin dil tercihleri, bölge ayarları gibi kişiselleştirilmiş özellikleri hatırlamasını sağlar.',
    marketingTitle: 'Pazarlama ve Hedefleme',
    marketingDesc: 'İlgi alanlarınıza uygun içerik ve reklamlar sunmak için kullanılır. Üçüncü taraf ortaklarımız tarafından yerleştirilebilir.'
  },
  de: {
    title: 'Wir verwenden Cookies',
    message: 'Wir nutzen Cookies und ähnliche Technologien, um die ordnungsgemäße Funktion unserer Website zu gewährleisten, Inhalte zu personalisieren und unseren Datenverkehr zu analysieren. Weitere Informationen finden Sie in unserer',
    policyText: 'Cookie-Richtlinie',
    btnAccept: 'Alle akzeptieren',
    btnDecline: 'Nur Notwendige',
    btnSettings: 'Einstellungen verwalten',
    btnSave: 'Auswahl speichern',
    necessaryTitle: 'Notwendige Cookies',
    necessaryBadge: 'Immer aktiv',
    necessaryDesc: 'Erforderlich für die grundlegende Funktionalität der Website, einschließlich Sicherheit, Netzwerkmanagement und Zugänglichkeit.',
    analyticsTitle: 'Analyse & Leistung',
    analyticsDesc: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um das Nutzererlebnis kontinuierlich zu verbessern.',
    functionalTitle: 'Funktionale Cookies',
    functionalDesc: 'Ermöglichen der Website, erweiterte Funktionalität und Personalisierung bereitzustellen (z.B. Spracheinstellungen).',
    marketingTitle: 'Marketing & Tracking',
    marketingDesc: 'Werden verwendet, um Besuchern relevante Werbung und Kampagnen basierend auf ihren Interessen anzuzeigen.'
  },
  en: {
    title: 'We use cookies',
    message: 'We use cookies and similar technologies to ensure our website functions properly, personalize content, and analyze our traffic. For more information, please see our',
    policyText: 'Cookie Policy',
    btnAccept: 'Accept All',
    btnDecline: 'Necessary Only',
    btnSettings: 'Manage Settings',
    btnSave: 'Save Preferences',
    necessaryTitle: 'Strictly Necessary',
    necessaryBadge: 'Always Active',
    necessaryDesc: 'Required for basic website functionality, including security, network management, and accessibility.',
    analyticsTitle: 'Analytics & Performance',
    analyticsDesc: 'Help us understand how visitors interact with the website to continuously improve the user experience.',
    functionalTitle: 'Functional Cookies',
    functionalDesc: 'Enable the website to provide enhanced functionality and personalization (e.g. language preferences).',
    marketingTitle: 'Marketing & Tracking',
    marketingDesc: 'Used to track visitors across websites for advertising purposes.'
  },
  ar: {
    title: 'نحن نستخدم ملفات تعريف الارتباط',
    message: 'نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لضمان عمل موقعنا بشكل صحيح وتخصيص المحتوى وتحليل حركة المرور لدينا. لمزيد من المعلومات، يرجى الاطلاع على',
    policyText: 'سياسة ملفات تعريف الارتباط',
    btnAccept: 'قبول الكل',
    btnDecline: 'الضرورية فقط',
    btnSettings: 'إدارة الإعدادات',
    btnSave: 'حفظ الإعدادات',
    necessaryTitle: 'ضرورية جداً',
    necessaryBadge: 'نشط دائماً',
    necessaryDesc: 'مطلوبة لوظائف الموقع الأساسية بما في ذلك الأمان وإدارة الشبكة وسهولة الوصول.',
    analyticsTitle: 'التحليلات والأداء',
    analyticsDesc: 'تساعدنا على فهم كيفية تفاعل الزوار مع الموقع لتحسين تجربة المستخدم.',
    functionalTitle: 'وظيفية',
    functionalDesc: 'تمكن الموقع من توفير وظائف متقدمة وتخصيص (مثل تفضيلات اللغة).',
    marketingTitle: 'التسويق والتتبع',
    marketingDesc: 'تُستخدم لتتبع الزوار عبر المواقع لأغراض إعلانية.'
  }
};

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const { language } = useLanguage();
  
  const content = bannerContent[language as keyof typeof bannerContent] || bannerContent['de'];

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    localStorage.setItem('cookie-preferences', JSON.stringify({ necessary: true, analytics: true, marketing: true, functional: true }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    localStorage.setItem('cookie-consent', 'necessary-only');
    localStorage.setItem('cookie-preferences', JSON.stringify({ necessary: true, analytics: false, marketing: false, functional: false }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden pointer-events-auto flex flex-col">
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-primary dark:text-sky-400">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white">
                    {content.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
                  {content.message}{' '}
                  <Link href="/cookies" className="text-primary dark:text-sky-400 hover:underline font-semibold whitespace-nowrap">
                    {content.policyText}
                  </Link>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {content.btnSettings}
                  {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeclineAll}
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700"
                >
                  {content.btnDecline}
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {content.btnAccept}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                >
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{content.necessaryTitle}</h4>
                          <span className="text-xs font-bold text-slate-500 uppercase px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">{content.necessaryBadge}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {content.necessaryDesc}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col gap-2 relative overflow-hidden ${preferences.analytics ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`} onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}>
                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${preferences.analytics ? 'bg-primary' : 'bg-transparent'}`}></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{content.analyticsTitle}</h4>
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${preferences.analytics ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-transparent'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {content.analyticsDesc}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col gap-2 relative overflow-hidden ${preferences.functional ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`} onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}>
                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${preferences.functional ? 'bg-primary' : 'bg-transparent'}`}></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{content.functionalTitle}</h4>
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${preferences.functional ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-transparent'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {content.functionalDesc}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col gap-2 relative overflow-hidden ${preferences.marketing ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`} onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}>
                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${preferences.marketing ? 'bg-primary' : 'bg-transparent'}`}></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{content.marketingTitle}</h4>
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${preferences.marketing ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-transparent'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {content.marketingDesc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSavePreferences} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                        {content.btnSave}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
