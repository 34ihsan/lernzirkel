export type SupportedLanguage = 'de' | 'tr' | 'en' | 'ar' | 'ru' | 'uk' | 'prs';

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
  },
  {
    code: 'ru',
    name: 'Russisch',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    description: 'Миграционная служба и языковые курсы'
  },
  {
    code: 'uk',
    name: 'Ukrainisch',
    nativeName: 'Українська',
    flag: '🇺🇦',
    dir: 'ltr',
    description: 'Міграційна служба та мовні курси'
  },
  {
    code: 'prs',
    name: 'Dari',
    nativeName: 'دری',
    flag: '🇦🇫',
    dir: 'rtl',
    description: 'خدمات مهاجرت و کورس‌های زبان'
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
    'footer.rights': 'Alle Rechte vorbehalten.',

    // Accessibility
    'a11y.title': 'Barrierefreiheit',
    'a11y.textSize': 'Textgröße',
    'a11y.contrast': 'Kontrast',
    'a11y.highContrast': 'Hoher Kontrast',
    'a11y.language': 'Sprache',
    'a11y.easyLanguage': 'Leichte Sprache',
    'a11y.easyLangDesc': 'Aktiviert vereinfachte Texte für bessere Verständlichkeit.',

    // Cookie Banner
    'cookie.title': 'Wir verwenden Cookies',
    'cookie.message': 'Wir nutzen Cookies und ähnliche Technologien, um die ordnungsgemäße Funktion unserer Website zu gewährleisten, Inhalte zu personalisieren und unseren Datenverkehr zu analysieren. Weitere Informationen finden Sie in unserer',
    'cookie.policy': 'Cookie-Richtlinie',
    'cookie.accept': 'Alle akzeptieren',
    'cookie.decline': 'Ablehnen'
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
    'footer.rights': 'Tüm hakları saklıdır.',

    // Accessibility
    'a11y.title': 'Erişilebilirlik',
    'a11y.textSize': 'Metin Boyutu',
    'a11y.contrast': 'Kontrast',
    'a11y.highContrast': 'Yüksek Kontrast',
    'a11y.language': 'Dil Seçeneği',
    'a11y.easyLanguage': 'Sade Dil',
    'a11y.easyLangDesc': 'Daha iyi anlaşılabilirlik için basitleştirilmiş metinleri etkinleştirir.',

    // Cookie Banner
    'cookie.title': 'Çerezleri kullanıyoruz',
    'cookie.message': 'Web sitemizin düzgün çalışmasını sağlamak, içerikleri kişiselleştirmek ve trafiğimizi analiz etmek için çerezler ve benzer teknolojiler kullanıyoruz. Daha fazla bilgi için lütfen inceleyin:',
    'cookie.policy': 'Çerez Politikası',
    'cookie.accept': 'Tümünü kabul et',
    'cookie.decline': 'Reddet'
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
    'footer.rights': 'All rights reserved.',

    // Accessibility
    'a11y.title': 'Accessibility',
    'a11y.textSize': 'Text Size',
    'a11y.contrast': 'Contrast',
    'a11y.highContrast': 'High Contrast',
    'a11y.language': 'Language',
    'a11y.easyLanguage': 'Easy Language',
    'a11y.easyLangDesc': 'Enables simplified texts for better understanding.',

    // Cookie Banner
    'cookie.title': 'We use cookies',
    'cookie.message': 'We use cookies and similar technologies to ensure our website functions properly, personalize content, and analyze our traffic. For more information, please see our',
    'cookie.policy': 'Cookie Policy',
    'cookie.accept': 'Accept all',
    'cookie.decline': 'Decline'
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
    'footer.rights': 'جميع الحقوق محفوظة.',

    // Accessibility
    'a11y.title': 'إمكانية الوصول',
    'a11y.textSize': 'حجم النص',
    'a11y.contrast': 'التباين',
    'a11y.highContrast': 'تباين عالي',
    'a11y.language': 'اللغة',
    'a11y.easyLanguage': 'لغة مبسطة',
    'a11y.easyLangDesc': 'تفعيل نصوص مبسطة لتسهيل الفهم.',

    // Cookie Banner
    'cookie.title': 'نحن نستخدم ملفات تعريف الارتباط',
    'cookie.message': 'نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لضمان عمل موقعنا بشكل صحيح وتخصيص المحتوى وتحليل حركة المرور لدينا. لمزيد من المعلومات، يرجى الاطلاع على',
    'cookie.policy': 'سياسة ملفات تعريف الارتباط',
    'cookie.accept': 'قبول الكل',
    'cookie.decline': 'رفض'
  },

  ru: {
    // Top Bar & General
    'topbar.phone': 'Телефон',
    'topbar.email': 'Эл. почта',
    'topbar.donate': 'Поддержать',
    'topbar.contact': 'Контакты',
    'topbar.careers': 'Вакансии',
    'topbar.news': 'Новости',
    'topbar.tagline': 'Образование, консультации и социальные проекты в Людвигсхафене',
    'header.cta': 'Контакты и запись',
    'header.allOffers': 'Посмотреть все предложения по теме «{category}»',
    'header.menu': 'Меню',
    'header.close': 'Закрыть',
    'lang.select': 'Выберите язык',
    'lang.active': 'Текущий язык',

    // Quick links & Actions
    'btn.moreInfo': 'Узнать больше',
    'btn.apply': 'Записаться сейчас',
    'btn.contactUs': 'Связаться с нами',
    'btn.download': 'Скачать (PDF)',
    'btn.viewCourses': 'Посмотреть курсы',
    'btn.submit': 'Отправить',
    'btn.back': 'Назад',

    // Forms
    'form.fullName': 'Полное имя',
    'form.email': 'Адрес эл. почты',
    'form.phone': 'Номер телефона',
    'form.interest': 'Интересующий курс / направление',
    'form.message': 'Ваше сообщение или вопрос',
    'form.submit': 'Отправить заявку',
    'form.successTitle': 'Спасибо!',
    'form.successDesc': 'Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 24 часов.',
    'form.newSubmission': 'Отправить новую заявку',

    // Nav Categories
    'nav.deutsch': 'Немецкий язык и базовое образование',
    'nav.kinder': 'Дети и подростки',
    'nav.beratung': 'Консультации',
    'nav.projekte': 'Проекты',
    'nav.ueberUns': 'О нас',

    // Footer
    'footer.about': 'О Lernzirkel',
    'footer.quickLinks': 'Быстрые ссылки',
    'footer.contact': 'Контакты и как добраться',
    'footer.legal': 'Выходные данные и конфиденциальность',
    'footer.rights': 'Все права защищены.',

    // Accessibility
    'a11y.title': 'Доступность',
    'a11y.textSize': 'Размер текста',
    'a11y.contrast': 'Контраст',
    'a11y.highContrast': 'Высокий контраст',
    'a11y.language': 'Язык',
    'a11y.easyLanguage': 'Простой язык',
    'a11y.easyLangDesc': 'Включает упрощённые тексты для лучшего понимания.',

    // Cookie Banner
    'cookie.title': 'Мы используем файлы cookie',
    'cookie.message': 'Мы используем файлы cookie и аналогичные технологии для обеспечения корректной работы сайта, персонализации контента и анализа трафика. Подробнее см. в нашей',
    'cookie.policy': 'Политике использования файлов cookie',
    'cookie.accept': 'Принять все',
    'cookie.decline': 'Отклонить'
  },

  uk: {
    // Top Bar & General
    'topbar.phone': 'Телефон',
    'topbar.email': 'Ел. пошта',
    'topbar.donate': 'Підтримати',
    'topbar.contact': 'Контакти',
    'topbar.careers': 'Вакансії',
    'topbar.news': 'Новини',
    'topbar.tagline': 'Освіта, консультації та соціальні проєкти в Людвігсгафені',
    'header.cta': 'Контакти та запис',
    'header.allOffers': 'Переглянути всі пропозиції за темою «{category}»',
    'header.menu': 'Меню',
    'header.close': 'Закрити',
    'lang.select': 'Оберіть мову',
    'lang.active': 'Поточна мова',

    // Quick links & Actions
    'btn.moreInfo': 'Дізнатися більше',
    'btn.apply': 'Записатися зараз',
    'btn.contactUs': "Зв'язатися з нами",
    'btn.download': 'Завантажити (PDF)',
    'btn.viewCourses': 'Переглянути курси',
    'btn.submit': 'Надіслати',
    'btn.back': 'Назад',

    // Forms
    'form.fullName': "Повне ім'я",
    'form.email': 'Адреса ел. пошти',
    'form.phone': 'Номер телефону',
    'form.interest': 'Бажаний курс / напрям',
    'form.message': 'Ваше повідомлення або запитання',
    'form.submit': 'Надіслати заявку',
    'form.successTitle': 'Дякуємо!',
    'form.successDesc': "Вашу заявку успішно надіслано. Ми зв'яжемося з вами протягом 24 годин.",
    'form.newSubmission': 'Надіслати нову заявку',

    // Nav Categories
    'nav.deutsch': 'Німецька мова та базова освіта',
    'nav.kinder': 'Діти та молодь',
    'nav.beratung': 'Консультації',
    'nav.projekte': 'Проєкти',
    'nav.ueberUns': 'Про нас',

    // Footer
    'footer.about': 'Про Lernzirkel',
    'footer.quickLinks': 'Швидкі посилання',
    'footer.contact': 'Контакти та як дістатися',
    'footer.legal': 'Вихідні дані та конфіденційність',
    'footer.rights': 'Усі права захищено.',

    // Accessibility
    'a11y.title': 'Доступність',
    'a11y.textSize': 'Розмір тексту',
    'a11y.contrast': 'Контраст',
    'a11y.highContrast': 'Високий контраст',
    'a11y.language': 'Мова',
    'a11y.easyLanguage': 'Проста мова',
    'a11y.easyLangDesc': 'Вмикає спрощені тексти для кращого розуміння.',

    // Cookie Banner
    'cookie.title': 'Ми використовуємо файли cookie',
    'cookie.message': 'Ми використовуємо файли cookie та подібні технології, щоб забезпечити коректну роботу сайту, персоналізувати контент і аналізувати трафік. Докладніше див. у нашій',
    'cookie.policy': 'Політиці використання файлів cookie',
    'cookie.accept': 'Прийняти всі',
    'cookie.decline': 'Відхилити'
  },

  prs: {
    // Top Bar & General
    'topbar.phone': 'تلفون',
    'topbar.email': 'ایمیل',
    'topbar.donate': 'کمک مالی',
    'topbar.contact': 'تماس',
    'topbar.careers': 'فرصت‌های کاری',
    'topbar.news': 'تازه‌ترین خبرها',
    'topbar.tagline': 'آموزش، مشاوره و پروژه‌های اجتماعی در لودویگسهافن',
    'header.cta': 'تماس و ثبت‌نام',
    'header.allOffers': 'مشاهده همه برنامه‌های مربوط به «{category}»',
    'header.menu': 'مینو',
    'header.close': 'بستن',
    'lang.select': 'انتخاب زبان',
    'lang.active': 'زبان فعال',

    // Quick links & Actions
    'btn.moreInfo': 'معلومات بیشتر',
    'btn.apply': 'همین حالا ثبت‌نام کنید',
    'btn.contactUs': 'با ما تماس بگیرید',
    'btn.download': 'دانلود (PDF)',
    'btn.viewCourses': 'مشاهده کورس‌ها',
    'btn.submit': 'ارسال',
    'btn.back': 'بازگشت',

    // Forms
    'form.fullName': 'نام کامل',
    'form.email': 'آدرس ایمیل',
    'form.phone': 'شماره تلفون',
    'form.interest': 'کورس / بخش مورد نظر',
    'form.message': 'پیام یا سوال شما',
    'form.submit': 'ارسال درخواست',
    'form.successTitle': 'تشکر!',
    'form.successDesc': 'درخواست شما با موفقیت ارسال شد. مشاورین ما ظرف ۲۴ ساعت با شما تماس خواهند گرفت.',
    'form.newSubmission': 'ارسال درخواست جدید',

    // Nav Categories
    'nav.deutsch': 'زبان آلمانی و سواد پایه',
    'nav.kinder': 'کودکان و نوجوانان',
    'nav.beratung': 'مشاوره',
    'nav.projekte': 'پروژه‌ها',
    'nav.ueberUns': 'در باره ما',

    // Footer
    'footer.about': 'در باره Lernzirkel',
    'footer.quickLinks': 'لینک‌های سریع',
    'footer.contact': 'تماس و آدرس',
    'footer.legal': 'اطلاعات ناشر و حریم خصوصی',
    'footer.rights': 'تمام حقوق محفوظ است.',

    // Accessibility
    'a11y.title': 'دسترسی‌پذیری',
    'a11y.textSize': 'اندازه متن',
    'a11y.contrast': 'کنتراست',
    'a11y.highContrast': 'کنتراست بالا',
    'a11y.language': 'زبان',
    'a11y.easyLanguage': 'زبان ساده',
    'a11y.easyLangDesc': 'متن‌های ساده‌شده را برای درک بهتر فعال می‌کند.',

    // Cookie Banner
    'cookie.title': 'ما از کوکی استفاده می‌کنیم',
    'cookie.message': 'ما از کوکی‌ها و تکنالوژی‌های مشابه استفاده می‌کنیم تا عملکرد درست ویب‌سایت را تضمین کنیم، محتوا را شخصی‌سازی کنیم و ترافیک خود را تحلیل کنیم. برای معلومات بیشتر لطفاً به این مراجعه کنید:',
    'cookie.policy': 'پالیسی کوکی',
    'cookie.accept': 'پذیرفتن همه',
    'cookie.decline': 'رد کردن'
  }
};
