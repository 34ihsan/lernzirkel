export interface KnowledgeTopic {
  id: string;
  topic: string;
  keywords: string;
  answer: string;
  suggestions?: string[];
  isActive: boolean;
  category?: string;
  updatedAt?: string;
}

export interface AIConfig {
  aiEnabled: boolean;
  provider: "builtin" | "gemini" | "openai";
  apiKey?: string;
  model?: string;
  customInstructions?: string;
  allowedLanguages?: string[];
  knowledgeTopics?: KnowledgeTopic[];
}

export const DEFAULT_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: "c1-deutschkurs",
    topic: "C1 Deutschkurs (İleri Seviye & Mesleki Almanca)",
    keywords: "c1, c1 kursu, c1 başlangıç, c1 ne zaman, c1 kurs, c1 deutsch, c1 anmeldung, c1 kayıt",
    answer: "Lernzirkel Ludwigshafen e.V. bünyesinde C1 Deutschkurslarımız (Akademik & Mesleki Almanca) düzenli dönemlerle açılmaktadır. Yeni C1 grubumuz önümüzdeki ay başında hafta içi yoğun programla (09:00 - 13:00) başlamaktadır. Kursa katılım için geçerli bir B2 sertifikası gereklidir. İş arayanlar veya mesleki denklik sürecinde olanlar için Jobcenter veya Agentur für Arbeit üzerinden %100 masraf muafiyeti (0€) sağlanabilmektedir. Ön kayıt için sitemizdeki başvuru formunu doldurabilir veya Ludwigsplatz 9a adresimize uğrayabilirsiniz.",
    suggestions: ["0€ Destek Başvurusu", "B2 Sertifikası Şartları", "Adres ve Saatler"],
    category: "Kurslar",
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bamf-integrationskurs",
    topic: "BAMF Entegrasyon Kursları & 0€ Ücretsiz Destek",
    keywords: "bamf, entegrasyon, integrasyon, a1, a2, b1, ücretsiz kurs, entegrasyon kursu, kurs ücreti, masraf",
    answer: "Resmi BAMF onaylı Entegrasyon Kurslarımız A1 seviyesinden B1 seviyesine kadar 600 ders saati dil eğitimi ve 100 ders saati Orientierungskurs (Leben in Deutschland / Vatandaşlık Testi) içerir. Jobcenter'dan Bürgergeld, belediyeden Wohngeld, Kinderzuschlag veya AsylbLG alan kursiyerlerimiz için eğitim %100 DEVLET DESTEKLİ (Tamamen Ücretsiz - 0€) karşılanmaktadır. 0€ Destek Sihirbazımız üzerinden anında hak sahipliğinizi test edip ön kayıt yapabilirsiniz.",
    suggestions: ["0€ Destek Başvurusu Yap", "Gerekli Belgeler", "Açılış Saatleri"],
    category: "BAMF",
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "telc-pruefungstermine",
    topic: "telc Sınav Tarihleri, Ücretler ve Sertifika",
    keywords: "telc, sınav, b1 sınavı, b2 sınavı, c1 sınavı, dtz, sınav tarihi, sertifika, sınav ücreti, vatandaşlık sınavı",
    answer: "Lernzirkel e.V., Ludwigshafen'da yetkili lisanslı telc sınav merkezidir. Kurumumuzda telc Deutsch A1, A2, B1 (DTZ), B2 ve C1 Hochschule sınavları her ay düzenli cumartesi günleri yapılmaktadır. Sertifikalarımız Alman vatandaşlığı, süresiz oturum ve üniversite başvurularında resmi olarak geçerlidir. Kontenjanlar hızla dolduğu için sınav tarihinden en az 30 gün önce kimlik veya pasaportunuzla Ludwigsplatz 9a merkezimize şahsen gelerek kaydolmanız tavsiye edilir.",
    suggestions: ["Sınav Tarihlerini Gör", "Vatandaşlık İçin Hangi Sınav?", "WhatsApp ile Yaz"],
    category: "Sınavlar",
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "but-kostenlose-nachhilfe",
    topic: "Ücretsiz Okul Takviyesi & Nachhilfe (BuT)",
    keywords: "nachhilfe, ders, takviye, okul, matematik, almanca, ingilizce, but, çocuk, ilkokul, lise, abitur",
    answer: "1. sınıftan 13. sınıfa (Abitur) kadar tüm öğrencilerimize Matematik, Almanca ve İngilizce branşlarında birebir ve küçük grup takviyeleri sağlıyoruz. Aileniz Bürgergeld veya Wohngeld alıyorsa, Bildung und Teilhabe (BuT) hakkı kapsamında tüm dersler ve materyaller %100 ÜCRETSİZDİR; ödeme doğrudan Jobcenter veya belediye tarafından yapılır. Okuldan alacağınız talep formuyla bize başvurmanız yeterlidir.",
    suggestions: ["BuT Başvurusu Nasıl Yapılır?", "Ders Saatleri", "Yetkiliyle Görüş"],
    category: "Nachhilfe",
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
];
