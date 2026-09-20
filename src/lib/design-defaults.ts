export interface DesignColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface DesignTypography {
  bodyFont: string; // e.g. 'Inter', 'Plus Jakarta Sans', 'Outfit', 'Poppins', 'Montserrat', 'Roboto'
  headingFont: string; // e.g. 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 'Poppins', 'Montserrat'
  baseSize: number; // 14, 15, 16, 17, 18
  headingWeight: 'semibold' | 'bold' | 'extrabold';
  letterSpacing: 'tight' | 'normal' | 'wide';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface DesignGeometry {
  borderRadius: 'none' | 'subtle' | 'smooth' | 'rounded' | 'organic'; // 0px, 6px, 10px, 16px, 24px
  cardShadow: 'flat' | 'subtle' | 'royal' | 'floating';
  enableGlassmorphism: boolean;
  borderWidth: 'none' | 'thin' | 'medium';
}

export interface DesignButtons {
  shape: 'pill' | 'rounded' | 'sharp'; // 9999px, 8px, 0px
  transform: 'uppercase' | 'none';
  hoverEffect: 'lift' | 'glow' | 'scale' | 'none';
  hasShadow: boolean;
  fontWeight: 'medium' | 'semibold' | 'bold';
}

export interface DesignSocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  whatsapp?: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
}

export interface DesignContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  mapsUrl?: string;
}

export interface DesignConfig {
  activePreset?: string;
  colors: DesignColors;
  typography: DesignTypography;
  geometry: DesignGeometry;
  buttons: DesignButtons;
  social?: DesignSocialLinks;
  contact?: DesignContactInfo;
  customCss?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  colors: DesignColors;
  typography: DesignTypography;
  geometry: DesignGeometry;
  buttons: DesignButtons;
}

export const AVAILABLE_FONTS = [
  { name: 'Inter', category: 'Modern & Tarafsız (Sans-Serif)', googleName: 'Inter:wght@400;500;600;700;800' },
  { name: 'Plus Jakarta Sans', category: 'Prestijli & Çağdaş (Sans-Serif)', googleName: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  { name: 'Outfit', category: 'Dinamik & Kurumsal (Sans-Serif)', googleName: 'Outfit:wght@400;500;600;700;800' },
  { name: 'Montserrat', category: 'Güçlü & Karizmatik (Sans-Serif)', googleName: 'Montserrat:wght@400;500;600;700;800' },
  { name: 'Poppins', category: 'Dost Canlısı & Geometrik (Sans-Serif)', googleName: 'Poppins:wght@400;500;600;700;800' },
  { name: 'Playfair Display', category: 'Kraliyet Zarafeti & Asil (Serif)', googleName: 'Playfair+Display:wght@500;600;700;800' },
  { name: 'Roboto', category: 'Klasik & Okunaklı (Sans-Serif)', googleName: 'Roboto:wght@400;500;700' }
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal-lernzirkel',
    name: 'Kraliyet Lernzirkel',
    badge: 'Resmi & Orijinal',
    description: 'Lernzirkel Ludwigshafen için özel hazırlanmış asil lacivert, gümüş mavi ve mercan kırmızısı armoni.',
    colors: {
      primary: '#0F4761',
      primaryLight: '#1a6d92',
      primaryDark: '#082c3d',
      secondary: '#e8f4f8',
      accent: '#e63946',
      background: '#fbfbfb',
      surface: '#ffffff',
      foreground: '#1e293b',
      muted: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      bodyFont: 'Inter',
      headingFont: 'Outfit',
      baseSize: 16,
      headingWeight: 'bold',
      letterSpacing: 'normal',
      lineHeight: 'normal'
    },
    geometry: {
      borderRadius: 'smooth',
      cardShadow: 'royal',
      enableGlassmorphism: true,
      borderWidth: 'thin'
    },
    buttons: {
      shape: 'pill',
      transform: 'uppercase',
      hoverEffect: 'lift',
      hasShadow: true,
      fontWeight: 'semibold'
    }
  },
  {
    id: 'sapphire-emerald',
    name: 'Modern Safir & Zümrüt',
    badge: 'Modern Eğitim',
    description: 'Avrupa standartlarında prestijli eğitim ve akademi kimliği, zümrüt başarı vurgusuyla.',
    colors: {
      primary: '#0A2540',
      primaryLight: '#19426d',
      primaryDark: '#051322',
      secondary: '#ECFDF5',
      accent: '#10B981',
      background: '#f8fafc',
      surface: '#ffffff',
      foreground: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      bodyFont: 'Plus Jakarta Sans',
      headingFont: 'Plus Jakarta Sans',
      baseSize: 16,
      headingWeight: 'extrabold',
      letterSpacing: 'tight',
      lineHeight: 'normal'
    },
    geometry: {
      borderRadius: 'rounded',
      cardShadow: 'royal',
      enableGlassmorphism: true,
      borderWidth: 'thin'
    },
    buttons: {
      shape: 'rounded',
      transform: 'none',
      hoverEffect: 'glow',
      hasShadow: true,
      fontWeight: 'bold'
    }
  },
  {
    id: 'burgundy-gold',
    name: 'Kraliyet Bordo & Altın',
    badge: 'Lüks & Prestij',
    description: 'Köklü vakıf, enstitü ve cemiyet asaletini yansıtan derin bordo ve sıcak antik altın tonları.',
    colors: {
      primary: '#581845',
      primaryLight: '#78225e',
      primaryDark: '#390f2d',
      secondary: '#FCFBF7',
      accent: '#C29B38',
      background: '#faf7f5',
      surface: '#ffffff',
      foreground: '#23151f',
      muted: '#735f6d',
      border: '#ebdcd6'
    },
    typography: {
      bodyFont: 'Inter',
      headingFont: 'Playfair Display',
      baseSize: 16,
      headingWeight: 'bold',
      letterSpacing: 'normal',
      lineHeight: 'relaxed'
    },
    geometry: {
      borderRadius: 'subtle',
      cardShadow: 'royal',
      enableGlassmorphism: false,
      borderWidth: 'thin'
    },
    buttons: {
      shape: 'rounded',
      transform: 'uppercase',
      hoverEffect: 'lift',
      hasShadow: true,
      fontWeight: 'semibold'
    }
  },
  {
    id: 'nordic-slate',
    name: 'Nordik Arduvaz & Buzul',
    badge: 'Minimalist Şıklık',
    description: 'İskandinav ferahlığı, berrak buzul mavisi ve modern gri tonlarıyla dingin okuma deneyimi.',
    colors: {
      primary: '#1E293B',
      primaryLight: '#334155',
      primaryDark: '#0f172a',
      secondary: '#F0F9FF',
      accent: '#0284C7',
      background: '#f8fafc',
      surface: '#ffffff',
      foreground: '#1e293b',
      muted: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      bodyFont: 'Inter',
      headingFont: 'Inter',
      baseSize: 16,
      headingWeight: 'bold',
      letterSpacing: 'tight',
      lineHeight: 'normal'
    },
    geometry: {
      borderRadius: 'smooth',
      cardShadow: 'subtle',
      enableGlassmorphism: true,
      borderWidth: 'thin'
    },
    buttons: {
      shape: 'pill',
      transform: 'none',
      hoverEffect: 'scale',
      hasShadow: false,
      fontWeight: 'medium'
    }
  },
  {
    id: 'midnight-luxury',
    name: 'Gece Asaleti (Lüks Koyu Mod)',
    badge: 'Koyu Tema',
    description: 'Gözü yormayan derin gece siyahı, elektrik siyan parıltısı ve amber altın vurgular.',
    colors: {
      primary: '#06B6D4',
      primaryLight: '#22d3ee',
      primaryDark: '#0891b2',
      secondary: '#1e293b',
      accent: '#F59E0B',
      background: '#0B0F19',
      surface: '#111827',
      foreground: '#f8fafc',
      muted: '#94a3b8',
      border: '#1f2937'
    },
    typography: {
      bodyFont: 'Outfit',
      headingFont: 'Outfit',
      baseSize: 16,
      headingWeight: 'bold',
      letterSpacing: 'normal',
      lineHeight: 'relaxed'
    },
    geometry: {
      borderRadius: 'rounded',
      cardShadow: 'floating',
      enableGlassmorphism: true,
      borderWidth: 'thin'
    },
    buttons: {
      shape: 'pill',
      transform: 'none',
      hoverEffect: 'glow',
      hasShadow: true,
      fontWeight: 'bold'
    }
  }
];

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  activePreset: 'royal-lernzirkel',
  colors: THEME_PRESETS[0].colors,
  typography: THEME_PRESETS[0].typography,
  geometry: THEME_PRESETS[0].geometry,
  buttons: THEME_PRESETS[0].buttons,
  social: {
    instagram: 'https://instagram.com/lernzirkel',
    facebook: 'https://facebook.com/lernzirkel',
    linkedin: 'https://linkedin.com/company/lernzirkel',
    youtube: '',
    twitter: '',
    tiktok: '',
    whatsapp: '0621 3073 7271',
    showInHeader: true,
    showInFooter: true
  },
  contact: {
    address: 'Prinzregentenstraße 47, 67063 Ludwigshafen am Rhein',
    phone: '0621 3073 7271',
    email: 'info@lernzirkel-online.de',
    workingHours: 'Mo. - Fr.: 09:00 - 17:00 Uhr',
    mapsUrl: 'https://maps.google.com/?q=Lernzirkel+Ludwigshafen'
  },
  customCss: ''
};
