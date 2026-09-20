export type SupportedLanguage = 'de' | 'tr' | 'en' | 'ar';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    description: 'Offiziell (BAMF & Behörden)'
  },
  {
    code: 'tr',
    name: 'Türkisch',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    description: 'Topluluk & Veli Bilgilendirme'
  },
  {
    code: 'en',
    name: 'Englisch',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    description: 'International & Exchange'
  },
  {
    code: 'ar',
    name: 'Arabisch',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    description: 'دورات الاندماج واللغة'
  }
];

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    // Top Bar & General
    'topbar.phone': 'Telefon',
    'topbar.email': 'E-Mail',
    'topbar.donate': 'Spenden',
    'topbar.contact': 'Kontakt',
    'topbar.careers': 'Stellenangebote',
    'topbar.news': 'Aktuelles',
    'topbar.tagline': 'Bildung, Beratung & Soziale Projekte in Ludwigshafen',
    'header.cta': 'Kontakt & Anmeldung',
    'header.allOffers': 'Alle Angebote zu "{category}" ansehen',
    'header.menu': 'Menü',
    'header.close': 'Schließen',
    'lang.select': 'Sprache wählen',
    'lang.active': 'Aktive Sprache',

    // Quick links & Actions
    'btn.moreInfo': 'Mehr erfahren',
    'btn.apply': 'Jetzt anmelden',
    'btn.contactUs': 'Kontakt aufnehmen',
    'btn.download': 'Herunterladen (PDF)',
    'btn.viewCourses': 'Kurse ansehen',
    'btn.submit': 'Absenden',
    'btn.back': 'Zurück',

    // Forms
    'form.fullName': 'Vollständiger Name',
    'form.email': 'E-Mail-Adresse',
    'form.phone': 'Telefonnummer',
    'form.interest': 'Gewünschter Kurs / Bereich',
    'form.message': 'Ihre Nachricht oder Frage',
    'form.submit': 'Anfrage absenden',
    'form.successTitle': 'Vielen Dank!',
    'form.successDesc': 'Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    'form.newSubmission': 'Neue Anfrage senden',

    // Nav Categories
    'nav.deutsch': 'Deutsch & Grundbildung',
    'nav.kinder': 'Kinder & Jugendliche',
    'nav.beratung': 'Beratung',
    'nav.projekte': 'Projekte',
    'nav.ueberUns': 'Über uns',

    // Footer
    'footer.about': 'Über Lernzirkel',
    'footer.quickLinks': 'Schnellzugriff',
    'footer.contact': 'Kontakt & Anfahrt',
    'footer.legal': 'Impressum & Datenschutz',
    'footer.rights': 'Alle Rechte vorbehalten.'
  },

  tr: {
    // Top Bar & General
    'topbar.phone': 'Telefon',
    'topbar.email': 'E-Posta',
    'topbar.donate': 'Bağış Yap',
    'topbar.contact': 'İletişim',
    'topbar.careers': 'Kariyer & İş İlanları',
    'topbar.news': 'Güncel Haberler',
    'topbar.tagline': 'Ludwigshafen\'de Eğitim, Danışmanlık ve Sosyal Projeler',
    'header.cta': 'İletişim & Ön Kayıt',
    'header.allOffers': '"{category}" ile ilgili tüm programları gör',
    'header.menu': 'Menü',
    'header.close': 'Kapat',
    'lang.select': 'Dil Seçin',
    'lang.active': 'Aktif Dil',

    // Quick links & Actions
    'btn.moreInfo': 'Detaylı Bilgi',
    'btn.apply': 'Hemen Başvur',
    'btn.contactUs': 'İletişime Geçin',
    'btn.download': 'İndir (PDF)',
    'btn.viewCourses': 'Kursları İncele',
    'btn.submit': 'Gönder',
    'btn.back': 'Geri',

    // Forms
    'form.fullName': 'Adınız Soyadınız',
    'form.email': 'E-Posta Adresiniz',
    'form.phone': 'Telefon Numaranız',
    'form.interest': 'İlgilendiğiniz Program / Alan',
    'form.message': 'Notunuz veya Sorunuz',
    'form.submit': 'Başvuruyu Gönder',
    'form.successTitle': 'Tebrikler, Başvurunuz Alındı!',
    'form.successDesc': 'Talebiniz başarıyla kaydedildi. Danışmanlarımız 24 saat içerisinde sizinle iletişime geçecektir.',
    'form.newSubmission': 'Yeni Başvuru Yap',

    // Nav Categories
    'nav.deutsch': 'Almanca & Temel Eğitim',
    'nav.kinder': 'Çocuklar & Gençler',
    'nav.beratung': 'Danışmanlık',
    'nav.projekte': 'Projeler',
    'nav.ueberUns': 'Hakkımızda',

    // Footer
    'footer.about': 'Lernzirkel Hakkında',
    'footer.quickLinks': 'Hızlı Menü',
    'footer.contact': 'İletişim & Ulaşım',
    'footer.legal': 'Künye & Gizlilik Bildirimi',
    'footer.rights': 'Tüm hakları saklıdır.'
  },

  en: {
    // Top Bar & General
    'topbar.phone': 'Phone',
    'topbar.email': 'Email',
    'topbar.donate': 'Donate',
    'topbar.contact': 'Contact',
    'topbar.careers': 'Careers & Jobs',
    'topbar.news': 'Latest News',
    'topbar.tagline': 'Education, Counseling & Social Projects in Ludwigshafen',
    'header.cta': 'Contact & Registration',
    'header.allOffers': 'View all offers for "{category}"',
    'header.menu': 'Menu',
    'header.close': 'Close',
    'lang.select': 'Select Language',
    'lang.active': 'Active Language',

    // Quick links & Actions
    'btn.moreInfo': 'Learn More',
    'btn.apply': 'Register Now',
    'btn.contactUs': 'Contact Us',
    'btn.download': 'Download (PDF)',
    'btn.viewCourses': 'Explore Courses',
    'btn.submit': 'Submit',
    'btn.back': 'Back',

    // Forms
    'form.fullName': 'Full Name',
    'form.email': 'Email Address',
    'form.phone': 'Phone Number',
    'form.interest': 'Desired Program / Subject',
    'form.message': 'Your Message or Question',
    'form.submit': 'Send Inquiry',
    'form.successTitle': 'Thank You!',
    'form.successDesc': 'Your inquiry has been received. Our advisors will contact you within 24 hours.',
    'form.newSubmission': 'Send Another Inquiry',

    // Nav Categories
    'nav.deutsch': 'German & Basic Education',
    'nav.kinder': 'Children & Youth',
    'nav.beratung': 'Counseling',
    'nav.projekte': 'Projects',
    'nav.ueberUns': 'About Us',

    // Footer
    'footer.about': 'About Lernzirkel',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact & Directions',
    'footer.legal': 'Imprint & Privacy Policy',
    'footer.rights': 'All rights reserved.'
  },

  ar: {
    // Top Bar & General
    'topbar.phone': 'الهاتف',
    'topbar.email': 'البريد الإلكتروني',
    'topbar.donate': 'تبرع الآن',
    'topbar.contact': 'اتصل بنا',
    'topbar.careers': 'فرص العمل',
    'topbar.news': 'آخر الأخبار',
    'topbar.tagline': 'التعليم والاستشارات والمشاريع الاجتماعية في لودفيغسهافن',
    'header.cta': 'التسجيل والاستفسار',
    'header.allOffers': 'عرض جميع العروض الخاصة بـ "{category}"',
    'header.menu': 'القائمة',
    'header.close': 'إغلاق',
    'lang.select': 'اختر اللغة',
    'lang.active': 'اللغة الحالية',

    // Quick links & Actions
    'btn.moreInfo': 'مزيد من المعلومات',
    'btn.apply': 'سجل الآن',
    'btn.contactUs': 'تواصل معنا',
    'btn.download': 'تحميل (PDF)',
    'btn.viewCourses': 'استعراض الدورات',
    'btn.submit': 'إرسال',
    'btn.back': 'رجوع',

    // Forms
    'form.fullName': 'الاسم الكامل',
    'form.email': 'البريد الإلكتروني',
    'form.phone': 'رقم الهاتف',
    'form.interest': 'الدورة / البرنامج المطلوب',
    'form.message': 'ملاحظاتك أو استفسارك',
    'form.submit': 'إرسال الطلب',
    'form.successTitle': 'شكراً جزيلاً!',
    'form.successDesc': 'تم استلام طلبك بنجاح. سيتواصل معك مستشارونا خلال 24 ساعة.',
    'form.newSubmission': 'إرسال طلب جديد',

    // Nav Categories
    'nav.deutsch': 'اللغة الألمانية والتعليم الأساسي',
    'nav.kinder': 'الأطفال والشباب',
    'nav.beratung': 'الاستشارات والتوجيه',
    'nav.projekte': 'المشاريع',
    'nav.ueberUns': 'من نحن',

    // Footer
    'footer.about': 'عن الجمعية',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'العنوان والاتصال',
    'footer.legal': 'بيانات النشر والخصوصية',
    'footer.rights': 'جميع الحقوق محفوظة.'
  }
};
