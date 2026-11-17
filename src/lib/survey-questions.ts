// Standart kurs-sonu memnuniyet anketi şablonu (Lehrer + Kurs).
// Alman yetişkin eğitimi (Erwachsenenbildung/VHS) kurumlarında yaygın kullanılan
// Kirkpatrick Level-1 ("Reaction") değerlendirme yapısı + NPS sorusu temel alınmıştır.
// Admin paneli "Standart şablona sıfırla" dediğinde bu liste yeniden oluşturulur.

export type SurveyQuestionSeed = {
  section: "LEHRER" | "KURS";
  type: "RATING_5" | "NPS_0_10" | "TEXT" | "YES_NO";
  prompt: string;
  translations: { tr: string; en: string; ar: string };
  isRequired: boolean;
  order: number;
};

export const STANDARD_SURVEY_QUESTIONS: SurveyQuestionSeed[] = [
  // ─── LEHRER (Eğitmen değerlendirmesi) ────────────────────────────────────
  {
    section: "LEHRER",
    type: "RATING_5",
    prompt: "Der Dozent/die Dozentin war fachlich kompetent.",
    translations: {
      tr: "Eğitmen alanında yeterliydi.",
      en: "The instructor was professionally competent.",
      ar: "كان المدرّس/ة ملمًا بالمادة بشكل كافٍ.",
    },
    isRequired: true,
    order: 1,
  },
  {
    section: "LEHRER",
    type: "RATING_5",
    prompt: "Der Unterricht wurde verständlich erklärt.",
    translations: {
      tr: "Ders anlaşılır şekilde anlatıldı.",
      en: "The lessons were explained clearly.",
      ar: "تم شرح الدروس بشكل واضح.",
    },
    isRequired: true,
    order: 2,
  },
  {
    section: "LEHRER",
    type: "RATING_5",
    prompt: "Der Dozent/die Dozentin ging auf Fragen und individuelle Bedürfnisse ein.",
    translations: {
      tr: "Eğitmen sorulara ve bireysel ihtiyaçlara önem verdi.",
      en: "The instructor addressed questions and individual needs.",
      ar: "استجاب المدرّس/ة للأسئلة والاحتياجات الفردية.",
    },
    isRequired: true,
    order: 3,
  },
  {
    section: "LEHRER",
    type: "RATING_5",
    prompt: "Der Unterricht war gut strukturiert, die Zeit wurde sinnvoll genutzt.",
    translations: {
      tr: "Ders iyi yapılandırılmıştı, zaman verimli kullanıldı.",
      en: "The lesson was well structured and time was used well.",
      ar: "كان الدرس منظّمًا جيدًا وتم استخدام الوقت بشكل فعّال.",
    },
    isRequired: true,
    order: 4,
  },
  {
    section: "LEHRER",
    type: "RATING_5",
    prompt: "Ich wurde respektvoll und fair behandelt.",
    translations: {
      tr: "Bana karşı saygılı ve adil davranıldı.",
      en: "I was treated respectfully and fairly.",
      ar: "تمت معاملتي باحترام وعدل.",
    },
    isRequired: true,
    order: 5,
  },
  {
    section: "LEHRER",
    type: "TEXT",
    prompt: "Was hat Ihnen am Unterricht besonders gut gefallen?",
    translations: {
      tr: "Derste en çok neyi beğendiniz?",
      en: "What did you like most about the teaching?",
      ar: "ما الذي أعجبك أكثر في التدريس؟",
    },
    isRequired: false,
    order: 6,
  },
  {
    section: "LEHRER",
    type: "TEXT",
    prompt: "Was könnte der Dozent/die Dozentin verbessern?",
    translations: {
      tr: "Eğitmen neyi geliştirebilir?",
      en: "What could the instructor improve?",
      ar: "ما الذي يمكن للمدرّس/ة تحسينه؟",
    },
    isRequired: false,
    order: 7,
  },

  // ─── KURS (Kurs değerlendirmesi) ─────────────────────────────────────────
  {
    section: "KURS",
    type: "RATING_5",
    prompt: "Der Kurs hat meine Erwartungen erfüllt.",
    translations: {
      tr: "Kurs beklentilerimi karşıladı.",
      en: "The course met my expectations.",
      ar: "لبّت الدورة توقعاتي.",
    },
    isRequired: true,
    order: 1,
  },
  {
    section: "KURS",
    type: "RATING_5",
    prompt: "Die Kursinhalte waren praxisrelevant und nützlich für mich.",
    translations: {
      tr: "Kurs içeriği benim için pratik ve faydalıydı.",
      en: "The course content was practical and useful to me.",
      ar: "كان محتوى الدورة عمليًا ومفيدًا لي.",
    },
    isRequired: true,
    order: 2,
  },
  {
    section: "KURS",
    type: "RATING_5",
    prompt: "Das Lerntempo war angemessen.",
    translations: {
      tr: "Öğrenme hızı uygundu.",
      en: "The learning pace was appropriate.",
      ar: "كانت سرعة التعلم مناسبة.",
    },
    isRequired: true,
    order: 3,
  },
  {
    section: "KURS",
    type: "RATING_5",
    prompt: "Die Kursmaterialien, Räume und Ausstattung waren angemessen.",
    translations: {
      tr: "Kurs materyalleri, mekan ve donanım uygundu.",
      en: "The course materials, rooms and equipment were adequate.",
      ar: "كانت مواد الدورة والقاعات والمعدات مناسبة.",
    },
    isRequired: true,
    order: 4,
  },
  {
    section: "KURS",
    type: "RATING_5",
    prompt: "Die Organisation des Kurses (Termine, Kommunikation, Anmeldung) war zufriedenstellend.",
    translations: {
      tr: "Kursun organizasyonu (tarihler, iletişim, kayıt) tatmin ediciydi.",
      en: "The course organisation (schedule, communication, registration) was satisfactory.",
      ar: "كان تنظيم الدورة (المواعيد، التواصل، التسجيل) مُرضيًا.",
    },
    isRequired: true,
    order: 5,
  },
  {
    section: "KURS",
    type: "NPS_0_10",
    prompt: "Wie wahrscheinlich ist es, dass Sie diesen Kurs weiterempfehlen? (0 = sehr unwahrscheinlich, 10 = sehr wahrscheinlich)",
    translations: {
      tr: "Bu kursu başka birine önerme olasılığınız nedir? (0 = hiç önermem, 10 = kesinlikle öneririm)",
      en: "How likely are you to recommend this course? (0 = not at all likely, 10 = extremely likely)",
      ar: "ما مدى احتمال أن توصي بهذه الدورة؟ (0 = غير محتمل على الإطلاق، 10 = محتمل جدًا)",
    },
    isRequired: true,
    order: 6,
  },
  {
    section: "KURS",
    type: "TEXT",
    prompt: "Was hat Ihnen am Kurs am besten gefallen?",
    translations: {
      tr: "Kursta en çok neyi beğendiniz?",
      en: "What did you like most about the course?",
      ar: "ما الذي أعجبك أكثر في الدورة؟",
    },
    isRequired: false,
    order: 7,
  },
  {
    section: "KURS",
    type: "TEXT",
    prompt: "Was sollte am Kurs verbessert werden?",
    translations: {
      tr: "Kursta ne geliştirilmeli?",
      en: "What should be improved about the course?",
      ar: "ما الذي ينبغي تحسينه في الدورة؟",
    },
    isRequired: false,
    order: 8,
  },
];

// Açık uçlu cevaplarda admin'e "bu yanıta öncelikli bak" uyarısı düşürmek için basit
// anahtar kelime taraması (ML/duygu analizi değil — kasıtlı olarak basit ve şeffaf).
const FLAG_KEYWORDS_DE = [
  "schlecht", "furchtbar", "katastrophe", "unfreundlich", "respektlos", "diskriminier",
  "rassis", "sexis", "beschwerde", "nie wieder", "unprofessionell", "unfair", "beleidig",
];
const FLAG_KEYWORDS_TR = [
  "kötü", "berbat", "felaket", "saygısız", "ayrımcı", "ırkçı", "şikayet", "asla", "adil değil", "hakaret",
];
const FLAG_KEYWORDS_EN = [
  "bad", "terrible", "awful", "disrespect", "discriminat", "racis", "sexis", "complain", "never again", "unprofessional", "unfair", "insult",
];

export function containsFlagKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return [...FLAG_KEYWORDS_DE, ...FLAG_KEYWORDS_TR, ...FLAG_KEYWORDS_EN].some((kw) => lower.includes(kw));
}
