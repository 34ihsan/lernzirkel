export const modelConfig: Record<string, { label: string; fields: { name: string; label: string; type: 'text' | 'textarea' | 'date' | 'boolean' | 'enum' | 'image' | 'color'; options?: string[], isDesign?: boolean }[] }> = {
  News: {
    label: "Haberler",
    fields: [
      { name: "title", label: "Başlık", type: "text" },
      { name: "titleColor", label: "Başlık Rengi", type: "color", isDesign: true },
      { name: "titleSize", label: "Başlık Boyutu (Örn: 24px, 2rem, vs)", type: "text", isDesign: true },
      { name: "content", label: "İçerik", type: "textarea" },
      { name: "contentColor", label: "İçerik Metin Rengi", type: "color", isDesign: true },
      { name: "contentSize", label: "İçerik Metin Boyutu (Örn: 16px, 1rem)", type: "text", isDesign: true },
      { name: "publishDate", label: "Yayın Tarihi", type: "date" },
      { name: "archiveDate", label: "Arşiv Tarihi", type: "date" },
      { name: "imageUrl", label: "Görsel URL", type: "image" },
      { name: "imageLayout", label: "Görsel Konumu", type: "enum", options: ["Üstte (Tam Genişlik)", "Solda", "Sağda", "Metin İçinde (Inline)"], isDesign: true },
      { name: "imageSize", label: "Görsel Boyutu / Ebatı (Örn: 100%, 300px)", type: "text", isDesign: true },
      { name: "linkUrl", label: "Yönlendirme Linki (Opsiyonel)", type: "text", isDesign: true },
      { name: "linkText", label: "Buton Yazısı (Link varsa)", type: "text", isDesign: true }
    ]
  },
  Course: {
    label: "Kurslar",
    fields: [
      { name: "title", label: "Kurs Adı", type: "text" },
      { name: "category", label: "Kategori", type: "enum", options: ["INTEGRATION", "SPRACHE", "NACHHILFE", "GRUNDBILDUNG", "BERUFSBEZOGEN", "PRUEFUNGSVORBEREITUNG", "ALPHABETISIERUNG", "ERSTORIENTIERUNG", "FRAUENKURSE", "FERIENKURSE", "WEITERBILDUNG", "ANDERE"] },
      { name: "level", label: "Niveau / Seviye (Örn: A1, B2)", type: "text", isDesign: true },
      { name: "slug", label: "Özel URL Uzantısı (Boş bırakılırsa başlık kullanılır)", type: "text", isDesign: true },
      { name: "imageUrl", label: "Görsel (Kapak Fotoğrafı)", type: "image", isDesign: true },
      { name: "description", label: "Açıklama", type: "textarea" },
      { name: "schedule", label: "Kurs Gün ve Saatleri", type: "text", isDesign: true },
      { name: "location", label: "Eğitim Yeri (Örn: Online, Merkez Bina)", type: "text", isDesign: true },
      { name: "instructor", label: "Eğitmen / Sorumlu", type: "text", isDesign: true },
      { name: "targetAudience", label: "Hedef Kitle", type: "text" },
      { name: "requirements", label: "Gereksinimler", type: "text" },
      { name: "costsInfo", label: "Ücret Bilgisi", type: "text" },
      { name: "features", label: "Öne Çıkan Özellikler (Virgülle ayırın)", type: "text", isDesign: true },
      { name: "linkUrl", label: "Kayıt / Başvuru Linki (Opsiyonel)", type: "text", isDesign: true },
      { name: "linkText", label: "Buton Metni", type: "text", isDesign: true },
      { name: "highlightColor", label: "Vurgu Rengi", type: "color", isDesign: true },
      { name: "startDate", label: "Başlangıç Tarihi", type: "date" },
      { name: "endDate", label: "Bitiş Tarihi", type: "date" },
      { name: "isActive", label: "Aktif mi?", type: "boolean" }
    ]
  },
  Project: {
    label: "Projeler",
    fields: [
      { name: "title", label: "Proje Adı", type: "text" },
      { name: "status", label: "Durum", type: "enum", options: ["AKTIV", "ABGESCHLOSSEN"] },
      { name: "startDate", label: "Başlangıç Tarihi", type: "date" },
      { name: "endDate", label: "Bitiş Tarihi", type: "date" },
      { name: "budget", label: "Bütçe", type: "text" },
      { name: "fundingSource", label: "Fon Sağlayıcı", type: "text" },
      { name: "description", label: "Açıklama", type: "textarea" },
      { name: "goals", label: "Hedefler", type: "textarea" },
      { name: "targetGroup", label: "Hedef Kitle", type: "text" },
      { name: "imageUrl", label: "Görsel URL", type: "image" }
    ]
  },
  TeamMember: {
    label: "Ekip Üyeleri",
    fields: [
      { name: "name", label: "Ad Soyad", type: "text" },
      { name: "role", label: "Rol / Unvan", type: "text" },
      { name: "email", label: "E-Posta", type: "text" },
      { name: "photoUrl", label: "Fotoğraf URL", type: "image" }
    ]
  },
  GalleryImage: {
    label: "Galeri Görselleri",
    fields: [
      { name: "title", label: "Başlık", type: "text" },
      { name: "category", label: "Kategori", type: "text" },
      { name: "imageUrl", label: "Görsel URL", type: "image" }
    ]
  }
};
