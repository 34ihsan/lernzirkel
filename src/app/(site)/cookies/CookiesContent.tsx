'use client';

import React from 'react';
import LegalPage from "@/components/common/LegalPage";
import { LEGAL } from "@/lib/legal-data";
import { useLanguage } from "@/context/LanguageContext";

export default function CookiesContent() {
  const { language } = useLanguage();

  const content = {
    de: {
      title: "Cookie-Richtlinie (Cookie Policy)",
      subtitle: "Transparenz und Kontrolle über Ihre Daten: Erfahren Sie, wie und warum wir Cookies sowie ähnliche Technologien einsetzen.",
      sections: [
        {
          id: "einfuehrung",
          title: "Was sind Cookies und ähnliche Technologien?",
          content: (
            <>
              <p>
                Cookies sind kleine Textdateien, die beim Aufruf unserer Website über Ihren Browser auf Ihrem Endgerät gespeichert werden. Sie dienen dazu, die Website nutzbar zu machen, die Sicherheit zu gewährleisten und Ihr Nutzererlebnis zu personalisieren.
              </p>
              <p>
                Neben klassischen Cookies setzen wir möglicherweise auch ähnliche Technologien ein, wie z.B. <strong>Local Storage</strong>, <strong>Session Storage</strong> oder Web Beacons. In dieser Richtlinie fassen wir all diese Technologien unter dem Begriff „Cookies“ zusammen.
              </p>
            </>
          ),
        },
        {
          id: "kategorien",
          title: "Kategorien der verwendeten Cookies",
          content: (
            <>
              <p>
                Wir unterteilen die auf unserer Website verwendeten Cookies in vier Hauptkategorien. Sie haben die volle Kontrolle darüber, welche nicht-essenziellen Cookies Sie zulassen möchten.
              </p>
              
              <h4 className="font-bold mt-6 mb-2 text-slate-800 dark:text-slate-200">A. Unbedingt erforderliche Cookies (Technisch notwendig)</h4>
              <p className="mb-4">
                Diese Cookies sind für die grundlegende Funktionalität der Website zwingend erforderlich. Sie ermöglichen grundlegende Funktionen wie die Seitennavigation und die Speicherung Ihrer Datenschutzeinstellungen. Ohne diese Cookies kann die Website nicht ordnungsgemäß funktionieren. Für den Einsatz dieser Cookies ist gemäß § 25 Abs. 2 Nr. 2 TDDDG keine Einwilligung erforderlich.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">B. Analyse- und Leistungs-Cookies</h4>
              <p className="mb-4">
                Diese Cookies sammeln anonymisierte Informationen darüber, wie Besucher unsere Website nutzen. Diese Daten helfen uns, die Leistung der Website zu messen und zu verbessern. Diese Cookies werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">C. Funktionale Cookies</h4>
              <p className="mb-4">
                Funktionale Cookies ermöglichen es der Website, erweiterte Funktionalitäten bereitzustellen, z. B. die Speicherung Ihrer Sprachauswahl. Sie können von uns oder von Drittanbietern gesetzt werden. Ohne Ihre Einwilligung stehen diese Funktionen möglicherweise nicht vollständig zur Verfügung.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">D. Marketing- und Targeting-Cookies</h4>
              <p>
                Marketing-Cookies werden verwendet, um Besuchern webseitenübergreifend zu folgen. Das Ziel ist es, Werbeanzeigen einzublenden, die für den einzelnen Benutzer relevant sind. <em>(Hinweis: Aktuell verzichten wir standardmäßig auf den Einsatz von Marketing-Cookies, behalten uns jedoch das Recht vor, diese nach erfolgter Einwilligung zu nutzen.)</em>
              </p>
            </>
          ),
        },
        {
          id: "rechtsgrundlage",
          title: "Rechtsgrundlage der Datenverarbeitung",
          content: (
            <p>
              Die Speicherung von Informationen erfolgt auf Grundlage von <strong>§ 25 Abs. 1 TDDDG</strong> (Einwilligung) bzw. <strong>§ 25 Abs. 2 Nr. 2 TDDDG</strong> (technische Notwendigkeit). <br /><br />
              Die anschließende Verarbeitung personenbezogener Daten erfolgt für erforderliche Cookies auf Grundlage unseres berechtigten Interesses (<strong>Art. 6 Abs. 1 lit. f DSGVO</strong>). Bei allen anderen Cookies erfolgt die Verarbeitung ausschließlich auf Grundlage Ihrer jederzeit widerrufbaren Einwilligung (<strong>Art. 6 Abs. 1 lit. a DSGVO</strong>).
            </p>
          ),
        },
        {
          id: "drittanbieter",
          title: "Dienste von Drittanbietern & Datenübermittlung",
          content: (
            <>
              <p>
                Wir behalten uns vor, zur Optimierung unseres Angebots Dienste externer Drittanbieter einzubinden (z. B. Kartendienste, Analysetools). Soweit diese Dienste Cookies setzen, geschieht dies nur mit Ihrer Zustimmung.
              </p>
              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">Haftungsausschluss für Drittanbieter & Drittstaaten</h4>
              <p>
                Einige Drittanbieter (z. B. Google, Meta) haben ihren Sitz in Ländern außerhalb des Europäischen Wirtschaftsraums (EWR), insbesondere in den USA. Wenn Sie zustimmen, willigen Sie gemäß <strong>Art. 49 Abs. 1 lit. a DSGVO</strong> ausdrücklich ein, dass Ihre Daten in den USA verarbeitet werden dürfen.
                <br /><br />
                <strong>Der Lernzirkel Ludwigshafen e.V. übernimmt keine Haftung</strong> für die weitere Verarbeitung oder Nutzung Ihrer Daten durch diese Drittanbieter.
              </p>
            </>
          ),
        },
        {
          id: "verwaltung",
          title: "Verwaltung Ihrer Cookie-Präferenzen",
          content: (
            <>
              <p>
                Sie haben das Recht, Ihre Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen oder anzupassen.
              </p>
              <p className="mt-2">
                Sie können Ihre Einstellungen über unser Cookie-Banner jederzeit ändern.
              </p>
            </>
          ),
        },
        {
          id: "kontakt",
          title: "Kontakt",
          content: (
            <p>
              Bei Fragen wenden Sie sich an: <br /><br />
              <strong>{LEGAL.name}</strong><br />
              E-Mail: <a href={`mailto:${LEGAL.email}`} className="text-primary hover:underline">{LEGAL.email}</a><br /><br />
              Weitere Informationen finden Sie in unserer <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>.
            </p>
          ),
        },
      ]
    },
    tr: {
      title: "Çerez Politikası (Cookie Policy)",
      subtitle: "Verileriniz üzerinde şeffaflık ve kontrol: Çerezleri ve benzeri teknolojileri nasıl ve neden kullandığımızı öğrenin.",
      sections: [
        {
          id: "giris",
          title: "Çerezler ve Benzeri Teknolojiler Nelerdir?",
          content: (
            <>
              <p>
                Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, tablet, akıllı telefon vb.) kaydedilen küçük metin dosyalarıdır. Web sitesinin kullanılabilmesini sağlamak, güvenliği garanti etmek ve kullanıcı deneyiminizi kişiselleştirmek için kullanılırlar.
              </p>
              <p>
                Klasik çerezlerin yanı sıra <strong>Local Storage</strong>, <strong>Session Storage</strong> veya Web Beacon gibi benzer teknolojiler de kullanabiliriz. Bu politikada tüm bu teknolojileri kolaylık sağlamak amacıyla "Çerezler" başlığı altında topluyoruz.
              </p>
            </>
          ),
        },
        {
          id: "kategoriler",
          title: "Kullanılan Çerez Kategorileri",
          content: (
            <>
              <p>
                Web sitemizde kullanılan çerezleri dört ana kategoriye ayırıyoruz. Hangi temel olmayan çerezlere izin vereceğiniz konusunda tam kontrole sahipsiniz.
              </p>
              
              <h4 className="font-bold mt-6 mb-2 text-slate-800 dark:text-slate-200">A. Zorunlu Çerezler (Teknik olarak gerekli)</h4>
              <p className="mb-4">
                Bu çerezler, web sitesinin temel işlevleri için kesinlikle gereklidir. Sayfada gezinme ve gizlilik ayarlarınızın kaydedilmesi gibi temel işlevleri sağlarlar. Bu çerezler olmadan web sitesi düzgün çalışamaz. TDDDG § 25 paragraf 2 uyarınca bu çerezler için onay gerekmez.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">B. Analiz ve Performans Çerezleri</h4>
              <p className="mb-4">
                Bu çerezler, ziyaretçilerin web sitemizi nasıl kullandığı hakkında anonimleştirilmiş bilgiler toplar. Bu veriler, web sitesinin performansını ölçmemize ve iyileştirmemize yardımcı olur. Bu çerezler yalnızca sizin açık onayınız ile yerleştirilir.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">C. İşlevsel Çerezler</h4>
              <p className="mb-4">
                İşlevsel çerezler, web sitesinin dil seçiminiz gibi genişletilmiş işlevler sunmasını sağlar. Bizim tarafımızdan veya üçüncü taraf sağlayıcılar tarafından yerleştirilebilirler. Onayınız olmadan bu işlevler tam olarak kullanılamayabilir.
              </p>

              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">D. Pazarlama ve Hedefleme Çerezleri</h4>
              <p>
                Pazarlama çerezleri, ziyaretçileri web siteleri genelinde izlemek için kullanılır. Amaç, bireysel kullanıcı için alakalı reklamlar göstermektir. <em>(Not: Şu anda varsayılan olarak pazarlama çerezleri kullanmaktan kaçınıyoruz, ancak onay alındıktan sonra bunları kullanma hakkımızı saklı tutuyoruz.)</em>
              </p>
            </>
          ),
        },
        {
          id: "yasal-dayanak",
          title: "Veri İşlemenin Yasal Dayanağı",
          content: (
            <p>
              Kullanıcı cihazında bilgi depolamak veya bilgilere erişmek, <strong>TDDDG § 25 paragraf 1</strong> (Onay) veya <strong>TDDDG § 25 paragraf 2</strong> (Teknik zorunluluk) temeline dayanır. <br /><br />
              Zorunlu çerezler için kişisel verilerin işlenmesi, web sitesinin güvenli sunumu için meşru menfaatimize (<strong>GDPR Madde 6(1)(f)</strong>) dayanmaktadır. Diğer tüm çerezlerde (Analiz, İşlevsel, Pazarlama) işlem, yalnızca dilediğiniz zaman iptal edebileceğiniz onayınıza (<strong>GDPR Madde 6(1)(a)</strong>) dayalı olarak gerçekleşir.
            </p>
          ),
        },
        {
          id: "ucuncu-taraflar",
          title: "Üçüncü Taraf Hizmetleri ve Veri Aktarımı",
          content: (
            <>
              <p>
                Hizmetlerimizi optimize etmek amacıyla harici üçüncü taraf hizmetleri (ör. harita hizmetleri, analiz araçları) entegre etme hakkımızı saklı tutarız. Bu hizmetler çerez yerleştiriyorsa, bu yalnızca sizin onayınızla gerçekleşir.
              </p>
              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">Üçüncü Taraflar ve Üçüncü Ülkeler İçin Sorumluluk Reddi</h4>
              <p>
                Bazı üçüncü taraf sağlayıcılar (ör. Google, Meta), Avrupa Ekonomik Alanı (EEA) dışında, özellikle ABD'de bulunmaktadır. Onay verirseniz, verilerinizin ABD'de işlenmesine <strong>GDPR Madde 49(1)(a)</strong> uyarınca açıkça izin vermiş olursunuz.
                <br /><br />
                <strong>Lernzirkel Ludwigshafen e.V.</strong>, verilerinizin etki alanımız dışına çıktıktan sonra bu üçüncü taraf sağlayıcılar tarafından daha fazla işlenmesi veya kullanılması konusunda <strong>hiçbir sorumluluk kabul etmez.</strong>
              </p>
            </>
          ),
        },
        {
          id: "yonetim",
          title: "Çerez Tercihlerinizin Yönetimi",
          content: (
            <>
              <p>
                Verdiğiniz onayı dilediğiniz zaman geleceğe yönelik olarak iptal etme veya değiştirme hakkına sahipsiniz.
              </p>
              <p className="mt-2">
                Ayarlarınızı istediğiniz zaman Çerez Banner'ımız üzerinden değiştirebilirsiniz.
              </p>
            </>
          ),
        },
        {
          id: "iletisim",
          title: "İletişim",
          content: (
            <p>
              Sorularınız için bizimle iletişime geçebilirsiniz: <br /><br />
              <strong>{LEGAL.name}</strong><br />
              E-Posta: <a href={`mailto:${LEGAL.email}`} className="text-primary hover:underline">{LEGAL.email}</a><br /><br />
              Daha fazla bilgi için <a href="/datenschutz" className="text-primary hover:underline">Gizlilik Politikamızı</a> inceleyebilirsiniz.
            </p>
          ),
        },
      ]
    },
    en: {
      title: "Cookie Policy",
      subtitle: "Transparency and control over your data: Learn how and why we use cookies and similar technologies.",
      sections: [
        {
          id: "intro",
          title: "What are cookies and similar technologies?",
          content: (
            <>
              <p>
                Cookies are small text files stored on your device when you visit our website. They are used to make the website functional, ensure security, and personalize your experience.
              </p>
            </>
          ),
        },
        {
          id: "categories",
          title: "Categories of cookies used",
          content: (
            <>
              <h4 className="font-bold mt-6 mb-2 text-slate-800 dark:text-slate-200">A. Strictly Necessary Cookies</h4>
              <p className="mb-4">Required for basic website functionality. No consent is required for these.</p>
              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">B. Analytics Cookies</h4>
              <p className="mb-4">Collect anonymous information to help us improve the website. Used only with your consent.</p>
              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">C. Functional Cookies</h4>
              <p className="mb-4">Enable advanced functionalities like language preferences.</p>
              <h4 className="font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">D. Marketing Cookies</h4>
              <p>Used to track visitors across websites for advertising purposes. (Currently not used by default, but we reserve the right to use them with consent).</p>
            </>
          ),
        },
        {
          id: "disclaimer",
          title: "Third-Party Disclaimer",
          content: (
            <p>
              <strong>Lernzirkel Ludwigshafen e.V. assumes no liability</strong> for the processing of your data by third-party providers (e.g. in the USA) once it leaves our sphere of influence.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          content: (
            <p>
              Email: <a href={`mailto:${LEGAL.email}`} className="text-primary hover:underline">{LEGAL.email}</a>
            </p>
          ),
        }
      ]
    },
    ar: {
      title: "سياسة ملفات تعريف الارتباط",
      subtitle: "الشفافية والتحكم في بياناتك: تعرف على كيفية وسبب استخدامنا لملفات تعريف الارتباط.",
      sections: [
        {
          id: "intro",
          title: "ما هي ملفات تعريف الارتباط؟",
          content: <p>ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك...</p>,
        },
        {
          id: "contact",
          title: "اتصل بنا",
          content: (
            <p>البريد الإلكتروني: <a href={`mailto:${LEGAL.email}`} className="text-primary hover:underline">{LEGAL.email}</a></p>
          ),
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content] || content['de'];

  return (
    <LegalPage
      slug="cookies"
      title={currentContent.title}
      subtitle={currentContent.subtitle}
      lastUpdated={LEGAL.lastUpdated}
      sections={currentContent.sections}
    />
  );
}
