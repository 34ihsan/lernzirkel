'use client';

import React, { useState, useEffect } from 'react';
import { 
  DesignConfig, 
  DesignColors, 
  DesignTypography, 
  DesignGeometry, 
  DesignButtons, 
  THEME_PRESETS, 
  AVAILABLE_FONTS, 
  DEFAULT_DESIGN_CONFIG 
} from '@/lib/design-defaults';
import { updateDesignSettings } from '@/actions/admin';
import { 
  Save, Sparkles, Palette, Type, Box, Sliders, 
  CheckCircle, Globe, Code2, RefreshCw, Eye, 
  Laptop, Tablet, Smartphone, ArrowRight, ShieldCheck, 
  Check, Star, Award, Layers, Phone, Mail, MapPin, 
  Clock, MessageSquare, ExternalLink, Share2, Building2
} from 'lucide-react';
import SocialLinksBar, {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
  TwitterIcon,
  TikTokIcon,
  WhatsAppIcon
} from '../common/SocialLinksBar';

interface Props {
  initialSiteName: string;
  initialDescription: string;
  initialDesignConfig: DesignConfig | null;
  fallbackColors: {
    primaryColor: string;
    primaryLight: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    foregroundColor: string;
    mutedColor: string;
  };
}

export default function DesignEditorClient({
  initialSiteName,
  initialDescription,
  initialDesignConfig,
  fallbackColors,
}: Props) {
  const [siteName, setSiteName] = useState(initialSiteName || "Lernzirkel Ludwigshafen e.V.");
  const [description, setDescription] = useState(initialDescription || "Bildung, Beratung und soziale Projekte");

  // Merge initial with defaults
  const [config, setConfig] = useState<DesignConfig>(() => {
    if (initialDesignConfig && initialDesignConfig.colors) {
      return {
        ...DEFAULT_DESIGN_CONFIG,
        ...initialDesignConfig,
        colors: {
          ...DEFAULT_DESIGN_CONFIG.colors,
          ...initialDesignConfig.colors,
        },
        typography: {
          ...DEFAULT_DESIGN_CONFIG.typography,
          ...initialDesignConfig.typography,
        },
        geometry: {
          ...DEFAULT_DESIGN_CONFIG.geometry,
          ...initialDesignConfig.geometry,
        },
        buttons: {
          ...DEFAULT_DESIGN_CONFIG.buttons,
          ...initialDesignConfig.buttons,
        },
        social: {
          ...DEFAULT_DESIGN_CONFIG.social,
          ...initialDesignConfig.social,
        },
        contact: {
          ...DEFAULT_DESIGN_CONFIG.contact,
          ...initialDesignConfig.contact,
        }
      };
    }
    // Fallback if no designConfig exists yet
    return {
      ...DEFAULT_DESIGN_CONFIG,
      colors: {
        ...DEFAULT_DESIGN_CONFIG.colors,
        primary: fallbackColors.primaryColor || DEFAULT_DESIGN_CONFIG.colors.primary,
        primaryLight: fallbackColors.primaryLight || DEFAULT_DESIGN_CONFIG.colors.primaryLight,
        secondary: fallbackColors.secondaryColor || DEFAULT_DESIGN_CONFIG.colors.secondary,
        accent: fallbackColors.accentColor || DEFAULT_DESIGN_CONFIG.colors.accent,
        background: fallbackColors.backgroundColor || DEFAULT_DESIGN_CONFIG.colors.background,
        foreground: fallbackColors.foregroundColor || DEFAULT_DESIGN_CONFIG.colors.foreground,
        muted: fallbackColors.mutedColor || DEFAULT_DESIGN_CONFIG.colors.muted,
      }
    };
  });

  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography' | 'geometry' | 'buttons' | 'branding' | 'css'>('presets');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apply a preset theme
  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setConfig({
      activePreset: preset.id,
      colors: { ...preset.colors },
      typography: { ...preset.typography },
      geometry: { ...preset.geometry },
      buttons: { ...preset.buttons },
      customCss: config.customCss
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateDesignSettings({
        siteName,
        description,
        designConfig: config
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      alert('Tasarım ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Helper for radius px
  const getRadiusPx = (r: DesignGeometry['borderRadius']) => {
    switch (r) {
      case 'none': return '0px';
      case 'subtle': return '6px';
      case 'smooth': return '12px';
      case 'rounded': return '18px';
      case 'organic': return '28px';
      default: return '12px';
    }
  };

  const getButtonRadiusPx = (s: DesignButtons['shape']) => {
    switch (s) {
      case 'sharp': return '0px';
      case 'rounded': return '10px';
      case 'pill': return '9999px';
      default: return '9999px';
    }
  };

  const getCardShadowCss = (s: DesignGeometry['cardShadow']) => {
    switch (s) {
      case 'flat': return '0 1px 3px rgba(0,0,0,0.05)';
      case 'subtle': return '0 4px 12px rgba(0,0,0,0.05)';
      case 'royal': return '0 12px 32px -4px rgba(15, 71, 97, 0.12), 0 4px 12px rgba(0,0,0,0.04)';
      case 'floating': return '0 20px 40px -8px rgba(0,0,0,0.2), 0 8px 16px -4px rgba(0,0,0,0.1)';
      default: return '0 12px 32px -4px rgba(15, 71, 97, 0.12)';
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-[1680px] mx-auto">
      {/* Top Studio Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F4761] to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-full bg-white/5 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="bg-amber-400/20 text-amber-300 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-400/30 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" /> Royal Elite Studio
            </span>
            <span className="text-xs text-blue-200">Global Tasarım & Tema Sistemi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Tasarım Stüdyosu & Tema Yöneticisi
          </h1>
          <p className="text-xs md:text-sm text-blue-100/80 max-w-2xl mt-1">
            Lernzirkel Ludwigshafen için kurumsal renkleri, modern Google fontlarını, buton mikro-etkileşimlerini ve hazır kraliyet temalarını tek tıkla özelleştirin.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {savedSuccess && (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle size={15} className="text-emerald-400" />
              Tüm Değişiklikler Kaydedildi!
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm('Tüm tasarım ayarlarını varsayılan Lernzirkel temasına döndürmek istediğinize emin misiniz?')) {
                setConfig(DEFAULT_DESIGN_CONFIG);
              }
            }}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/10"
            title="Varsayılan temaya döndür"
          >
            <RefreshCw size={14} /> Sıfırla
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Navigation Tabs & Settings (7 cols) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Studio Category Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'presets'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Sparkles size={15} /> Kraliyet Temaları
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('colors')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'colors'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Palette size={15} /> Renkler & Armoni
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('typography')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'typography'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Type size={15} /> Tipografi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('geometry')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'geometry'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Box size={15} /> Geometri & Gölgeler
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('buttons')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'buttons'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Sliders size={15} /> Butonlar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'branding'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Globe size={15} /> Site Kimliği
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('css')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'css'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Code2 size={15} /> Özel CSS
            </button>
          </div>

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    1. Hazır Kraliyet Temaları (Tek Tıkla Uygula)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Özenle tasarlanmış renk paletleri, tipografi ve buton stillerini sitenize anında uygulayın.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_PRESETS.map((preset) => {
                  const isActive = config.activePreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {preset.badge}
                        </span>
                        {isActive && (
                          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-xs border border-blue-200">
                            <Check size={13} className="text-blue-600" /> Aktif Tema
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-gray-900 mb-1">{preset.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{preset.description}</p>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex-1 h-6 rounded-md shadow-inner" style={{ backgroundColor: preset.colors.primary }} title={`Primary: ${preset.colors.primary}`} />
                        <div className="flex-1 h-6 rounded-md shadow-inner" style={{ backgroundColor: preset.colors.primaryLight }} title={`Light: ${preset.colors.primaryLight}`} />
                        <div className="flex-1 h-6 rounded-md shadow-inner" style={{ backgroundColor: preset.colors.secondary }} title={`Secondary: ${preset.colors.secondary}`} />
                        <div className="flex-1 h-6 rounded-md shadow-inner" style={{ backgroundColor: preset.colors.accent }} title={`Accent: ${preset.colors.accent}`} />
                        <div className="flex-1 h-6 rounded-md shadow-inner border border-gray-200" style={{ backgroundColor: preset.colors.background }} title={`Background: ${preset.colors.background}`} />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>Font: <strong>{preset.typography.headingFont}</strong> / {preset.typography.bodyFont}</span>
                        <span>Köşe: <strong>{preset.geometry.borderRadius}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLORS */}
          {activeTab === 'colors' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  2. Kapsamlı Renk Paleti & Armoni
                </h2>
                <p className="text-xs text-gray-500">
                  Sitenin tüm bileşenlerinde kullanılan renkleri bağımsız ve hassas şekilde yönetin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Primary */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Ana Renk (Primary)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.primary }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Logo, ana menü, birincil butonlar ve marka vurguları.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.primary}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primary: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.primary}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primary: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Primary Light */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Açık Ana Renk (Light)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.primaryLight }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Buton hover halleri, gradient geçişleri ve ikon arkaplanları.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.primaryLight}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primaryLight: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.primaryLight}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primaryLight: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Primary Dark */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Koyu Ana Renk (Dark)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.primaryDark }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Footer arkaplanı, koyu kartlar ve derin gölgeler.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.primaryDark}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primaryDark: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.primaryDark}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, primaryDark: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">İkincil Renk (Secondary)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.secondary }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Hafif arkaplan tonları, rozet zeminleri ve şeritler.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.secondary}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, secondary: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.secondary}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, secondary: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Vurgu & Aksiyon Rengi (Accent)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.accent }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Bağış, Spenden, acil duyurular ve özel aksiyonlar.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.accent}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, accent: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.accent}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, accent: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Background */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Sayfa Arkaplanı (Background)</label>
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: config.colors.background }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Tüm web sitesinin ana zemin rengi.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.background}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, background: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.background}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, background: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Surface (Card) */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Kart & Yüzey (Surface)</label>
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: config.colors.surface }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Kartların, kutuların ve menü pencerelerinin zemin rengi.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.surface}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, surface: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.surface}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, surface: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Foreground (Text) */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Metin Rengi (Foreground)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.foreground }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Ana başlıklar ve standart gövde metni rengi.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.foreground}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, foreground: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.foreground}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, foreground: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Muted */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Sönük Metin (Muted)</label>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.muted }} />
                  </div>
                  <p className="text-[11px] text-gray-500">Açıklama yazıları, tarihler ve yardımcı ipuçları.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.muted}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, muted: e.target.value }
                      })}
                      className="h-9 w-9 rounded-lg border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.colors.muted}
                      onChange={(e) => setConfig({
                        ...config,
                        activePreset: undefined,
                        colors: { ...config.colors, muted: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Type className="w-5 h-5 text-blue-600" />
                  3. Tipografi & Google Fonts Entegrasyonu
                </h2>
                <p className="text-xs text-gray-500">
                  Lernzirkel'in resmi kurumsal karakterine uygun, yüksek okunaklı modern font ailesi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Heading Font */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">Başlık Yazı Tipi (Heading Font)</label>
                  <select
                    value={config.typography.headingFont}
                    onChange={(e) => setConfig({
                      ...config,
                      activePreset: undefined,
                      typography: { ...config.typography, headingFont: e.target.value }
                    })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white font-medium"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500">H1, H2, H3 ana başlıklar ve kart başlıkları.</p>
                </div>

                {/* Body Font */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">Gövde Yazı Tipi (Body Font)</label>
                  <select
                    value={config.typography.bodyFont}
                    onChange={(e) => setConfig({
                      ...config,
                      activePreset: undefined,
                      typography: { ...config.typography, bodyFont: e.target.value }
                    })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white font-medium"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500">Paragraflar, menü bağlantıları ve listeler.</p>
                </div>

                {/* Base Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-800">Temel Yazı Boyutu (Base Size)</label>
                    <span className="text-xs font-bold text-blue-600">{config.typography.baseSize}px</span>
                  </div>
                  <div className="flex gap-2">
                    {[14, 15, 16, 17, 18].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          typography: { ...config.typography, baseSize: size }
                        })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          config.typography.baseSize === size
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heading Weight */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">Başlık Kalınlığı (Weight)</label>
                  <select
                    value={config.typography.headingWeight}
                    onChange={(e) => setConfig({
                      ...config,
                      typography: { ...config.typography, headingWeight: e.target.value as any }
                    })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white font-medium"
                  >
                    <option value="semibold">Yarı Kalın (Semibold - 600)</option>
                    <option value="bold">Kalın (Bold - 700)</option>
                    <option value="extrabold">Ekstra Kalın (Extrabold - 800)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GEOMETRY & SHADOWS */}
          {activeTab === 'geometry' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600" />
                  4. Geometri, Köşe Yuvarlama & Gölgeler
                </h2>
                <p className="text-xs text-gray-500">
                  Kartlar, kutular ve paneller için köşe yarıçapı ve derinlik efekti.
                </p>
              </div>

              <div className="space-y-4">
                {/* Border Radius Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Genel Köşe Yuvarlama (Corner Radius)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'none', label: 'Keskin (0px)', val: 'none' },
                      { id: 'subtle', label: 'Zarif (6px)', val: 'subtle' },
                      { id: 'smooth', label: 'Modern (12px)', val: 'smooth' },
                      { id: 'rounded', label: 'Yumuşak (18px)', val: 'rounded' },
                      { id: 'organic', label: 'Organik (28px)', val: 'organic' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          geometry: { ...config.geometry, borderRadius: item.val as any }
                        })}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                          config.geometry.borderRadius === item.val
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div 
                          className="w-10 h-7 border-2 border-current bg-white shadow-xs" 
                          style={{ borderRadius: getRadiusPx(item.val as any) }}
                        />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Shadow */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Kart & Yüzey Gölge Derinliği (Elevation)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'flat', label: 'Düz / Minimal', sub: 'Hafif çizgi' },
                      { id: 'subtle', label: 'Hafif Zarafet', sub: 'Zarif yumuşak gölge' },
                      { id: 'royal', label: 'Kraliyet Derinlik', sub: 'Önerilen prestij gölge' },
                      { id: 'floating', label: '3D Havada', sub: 'Yüksek kontrast & derinlik' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          geometry: { ...config.geometry, cardShadow: item.id as any }
                        })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          config.geometry.cardShadow === item.id
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glassmorphism Toggle */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-blue-900">Buzlu Cam / Akrilik Efekti (Glassmorphism)</h3>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Navbar ve kartlarda yarı saydam arka plan ve arka plan bulanıklığı (`backdrop-blur`) aktif olur.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.geometry.enableGlassmorphism}
                      onChange={(e) => setConfig({
                        ...config,
                        geometry: { ...config.geometry, enableGlassmorphism: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BUTTONS */}
          {activeTab === 'buttons' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  5. Buton Tasarımı & Mikro-Etkileşimler
                </h2>
                <p className="text-xs text-gray-500">
                  CTA ve eylem butonlarının şekli, yazı formatı ve fare üzerine gelindiğindeki hareketleri.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Button Shape */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Buton Şekli (Shape)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pill', label: 'Tam Oval (Pill)' },
                      { id: 'rounded', label: 'Yuvarlatılmış' },
                      { id: 'sharp', label: 'Köşeli' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          buttons: { ...config.buttons, shape: s.id as any }
                        })}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          config.buttons.shape === s.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Transform */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Yazı Formatı (Text Case)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        buttons: { ...config.buttons, transform: 'uppercase' }
                      })}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        config.buttons.transform === 'uppercase'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      BÜYÜK HARF
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        buttons: { ...config.buttons, transform: 'none' }
                      })}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        config.buttons.transform === 'none'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Standart Başlık
                    </button>
                  </div>
                </div>

                {/* Hover Effect */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Hover Animasyonu</label>
                  <select
                    value={config.buttons.hoverEffect}
                    onChange={(e) => setConfig({
                      ...config,
                      buttons: { ...config.buttons, hoverEffect: e.target.value as any }
                    })}
                    className="w-full border rounded-xl p-2.5 text-xs bg-white font-medium"
                  >
                    <option value="lift">Hafif Yukarı Yükselme (Lift - TranslateY)</option>
                    <option value="glow">Neon Parıltı Halkası (Glow Ring)</option>
                    <option value="scale">Hafif Büyüme (Scale 102%)</option>
                    <option value="none">Sade (Yalnızca Renk Geçişi)</option>
                  </select>
                </div>

                {/* Drop Shadow Toggle */}
                <div className="flex flex-col justify-center">
                  <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={config.buttons.hasShadow}
                      onChange={(e) => setConfig({
                        ...config,
                        buttons: { ...config.buttons, hasShadow: e.target.checked }
                      })}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>Butonlarda Vurgulu Gölge / Derinlik Kullan</span>
                  </label>
                  <p className="text-[11px] text-gray-500 mt-1 pl-6">
                    Buton altına kendi renginde zarif bir gölge bırakır.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BRANDING, SOCIAL & CONTACT */}
          {activeTab === 'branding' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  6. Genel Kurum Kimliği, Sosyal Medya & İletişim Bilgileri
                </h2>
                <p className="text-xs text-gray-500">
                  Site genelinde, arama motorlarında, Header üst barında ve Footer'da otomatik gösterilecek merkezi bilgileri yönetin.
                </p>
              </div>

              {/* 1. Kurumsal Kimlik & SEO */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Kurumsal Kimlik & SEO</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Site / Kurum Adı</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full border bg-white rounded-xl p-2.5 text-sm font-semibold"
                      placeholder="Lernzirkel Ludwigshafen e.V."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Açıklama / Slogan (SEO Description)</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border bg-white rounded-xl p-2.5 text-xs text-gray-700"
                      placeholder="Bildung, Beratung und soziale Projekte..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. Sosyal Medya Hesapları & Görünürlük */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>2. Sosyal Medya Hesapları</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center space-x-1.5 text-xs font-semibold text-blue-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.social?.showInHeader ?? true}
                        onChange={(e) => setConfig({
                          ...config,
                          social: { ...config.social, showInHeader: e.target.checked }
                        })}
                        className="rounded text-blue-600 h-4 w-4"
                      />
                      <span>Üst Barda (Header) Göster</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs font-semibold text-blue-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.social?.showInFooter ?? true}
                        onChange={(e) => setConfig({
                          ...config,
                          social: { ...config.social, showInFooter: e.target.checked }
                        })}
                        className="rounded text-blue-600 h-4 w-4"
                      />
                      <span>Alt Bilgide (Footer) Göster</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instagram */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <InstagramIcon size={14} className="text-pink-600" /> Instagram Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.instagram || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <FacebookIcon size={14} className="text-blue-600" /> Facebook Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.facebook || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <LinkedinIcon size={14} className="text-sky-600" /> LinkedIn Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.linkedin || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <YoutubeIcon size={14} className="text-red-600" /> YouTube Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.youtube || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/@lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* Twitter / X */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <TwitterIcon size={14} className="text-slate-800" /> X (Twitter) Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.twitter || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, twitter: e.target.value }
                      })}
                      placeholder="https://x.com/lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <TikTokIcon size={14} className="text-black" /> TikTok Linki
                    </label>
                    <input
                      type="url"
                      value={config.social?.tiktok || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, tiktok: e.target.value }
                      })}
                      placeholder="https://tiktok.com/@lernzirkel"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <WhatsAppIcon size={14} className="text-emerald-600" /> WhatsApp İletişim Numarası veya Linki
                    </label>
                    <input
                      type="text"
                      value={config.social?.whatsapp || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        social: { ...config.social, whatsapp: e.target.value }
                      })}
                      placeholder="0621 3073 7271 veya +49 176 1234567"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Ziyaretçiler tıkladığında doğrudan WhatsApp sohbeti başlatılır.</p>
                  </div>
                </div>
              </div>

              {/* 3. Merkezi İletişim Bilgileri (Header & Footer Otomatik Senkronizasyon) */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>3. Merkezi Adres & İletişim Bilgileri</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Header & Footer Otomatik Senkronize
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin size={13} className="text-emerald-600" /> Kurum Adresi (Sokak, No, Posta Kodu, Şehir)
                    </label>
                    <input
                      type="text"
                      value={config.contact?.address || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        contact: { ...config.contact, address: e.target.value }
                      })}
                      placeholder="Prinzregentenstraße 47, 67063 Ludwigshafen am Rhein"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-emerald-600" /> Telefon Numarası
                    </label>
                    <input
                      type="text"
                      value={config.contact?.phone || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        contact: { ...config.contact, phone: e.target.value }
                      })}
                      placeholder="0621 3073 7271"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-emerald-600" /> E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      value={config.contact?.email || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        contact: { ...config.contact, email: e.target.value }
                      })}
                      placeholder="info@lernzirkel-online.de"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-emerald-600" /> Çalışma Saatleri (Özet)
                    </label>
                    <input
                      type="text"
                      value={config.contact?.workingHours || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        contact: { ...config.contact, workingHours: e.target.value }
                      })}
                      placeholder="Mo. - Fr.: 09:00 - 17:00 Uhr"
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <ExternalLink size={13} className="text-emerald-600" /> Google Maps Linki (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={config.contact?.mapsUrl || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        contact: { ...config.contact, mapsUrl: e.target.value }
                      })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full border bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOM CSS */}
          {activeTab === 'css' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  7. Özel CSS Kuralları (Custom CSS Overrides)
                </h2>
                <p className="text-xs text-gray-500">
                  İleri düzey tasarımcılar için sitenin tamamına etki eden özel CSS kuralları ekleyebilirsiniz.
                </p>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={config.customCss || ''}
                  onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                  placeholder={`/* Örnek Özel CSS */\n.hero-title { letter-spacing: -0.03em; }\n.custom-badge { backdrop-filter: blur(10px); }`}
                  className="w-full font-mono text-xs p-4 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Bu alana yazılan CSS doğrudan sitenin &lt;head&gt; bölümüne güvenli şekilde dahil edilir.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Live Interactive Preview (5 cols) */}
        <div className="xl:col-span-5 xl:sticky xl:top-6 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Eye size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Canlı İnteraktif Önizleme</h3>
                  <p className="text-[11px] text-gray-400">Yaptığınız değişiklikler anında yansır</p>
                </div>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    previewDevice === 'desktop' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Masaüstü görünümü"
                >
                  <Laptop size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    previewDevice === 'tablet' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Tablet görünümü"
                >
                  <Tablet size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    previewDevice === 'mobile' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Mobil görünümü"
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>

            {/* Live Canvas Window */}
            <div 
              className={`mx-auto transition-all overflow-hidden border border-gray-200 rounded-2xl p-4 shadow-inner ${
                previewDevice === 'mobile' ? 'max-w-[320px]' : previewDevice === 'tablet' ? 'max-w-[440px]' : 'w-full'
              }`}
              style={{
                backgroundColor: config.colors.background,
                color: config.colors.foreground,
                fontFamily: config.typography.bodyFont,
                fontSize: `${config.typography.baseSize}px`,
              }}
            >
              {/* Color Palette Bar */}
              <div className="flex items-center gap-1 mb-3.5 pb-2 border-b border-gray-200/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Palet:</span>
                <span className="w-4 h-4 rounded-md shadow-xs" style={{ backgroundColor: config.colors.primary }} title="Primary" />
                <span className="w-4 h-4 rounded-md shadow-xs" style={{ backgroundColor: config.colors.primaryLight }} title="Light" />
                <span className="w-4 h-4 rounded-md shadow-xs" style={{ backgroundColor: config.colors.secondary }} title="Secondary" />
                <span className="w-4 h-4 rounded-md shadow-xs" style={{ backgroundColor: config.colors.accent }} title="Accent" />
                <span className="w-4 h-4 rounded-md shadow-xs border border-gray-300" style={{ backgroundColor: config.colors.surface }} title="Surface" />
              </div>

              {/* Mini Header & Top Bar Preview */}
              <div 
                className="rounded-lg p-2 flex items-center justify-between text-[11px] text-white/90 mb-3 transition-all"
                style={{ 
                  backgroundColor: config.colors.primary,
                  borderRadius: getRadiusPx(config.geometry.borderRadius)
                }}
              >
                <div className="flex items-center gap-2 truncate text-[10px]">
                  <span className="flex items-center gap-1">
                    <Phone size={10} /> {config.contact?.phone || '0621 3073 7271'}
                  </span>
                  <span className="opacity-40">|</span>
                  <span className="hidden sm:flex items-center gap-1 truncate">
                    <Mail size={10} /> {config.contact?.email || 'info@lernzirkel-online.de'}
                  </span>
                </div>
                {config.social?.showInHeader !== false && (
                  <SocialLinksBar social={config.social} variant="header" iconSize={12} className="scale-90" />
                )}
              </div>

              {/* Sample Mini Hero */}
              <div 
                className="p-5 text-center relative overflow-hidden transition-all mb-4"
                style={{
                  borderRadius: getRadiusPx(config.geometry.borderRadius),
                  backgroundColor: config.colors.primary,
                  color: '#ffffff',
                  boxShadow: getCardShadowCss(config.geometry.cardShadow)
                }}
              >
                <span 
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 bg-white/20 text-white border border-white/30"
                >
                  BAMF & AZAV ZERTIFIZIERT
                </span>
                <h4 
                  className="text-lg font-black tracking-tight leading-snug mb-1"
                  style={{ fontFamily: config.typography.headingFont }}
                >
                  {siteName}
                </h4>
                <p className="text-xs text-white/80 max-w-xs mx-auto mb-4 line-clamp-2">
                  {description}
                </p>

                {/* Live Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    className={`text-xs px-4 py-2 font-bold transition-all ${
                      config.buttons.hoverEffect === 'lift' ? 'hover:-translate-y-0.5' : ''
                    } ${config.buttons.hoverEffect === 'scale' ? 'hover:scale-105' : ''}`}
                    style={{
                      borderRadius: getButtonRadiusPx(config.buttons.shape),
                      backgroundColor: config.colors.accent,
                      color: '#ffffff',
                      textTransform: config.buttons.transform,
                      boxShadow: config.buttons.hasShadow ? `0 6px 16px ${config.colors.accent}55` : 'none'
                    }}
                  >
                    Kurs Buchen <ArrowRight size={12} className="inline ml-1" />
                  </button>
                  <button
                    type="button"
                    className="text-xs px-3.5 py-2 font-bold transition-all border border-white/40 bg-white/10 hover:bg-white/20 text-white"
                    style={{
                      borderRadius: getButtonRadiusPx(config.buttons.shape),
                      textTransform: config.buttons.transform
                    }}
                  >
                    Mehr Erfahren
                  </button>
                </div>
              </div>

              {/* Sample Course Card */}
              <div
                className="p-4 transition-all relative group"
                style={{
                  borderRadius: getRadiusPx(config.geometry.borderRadius),
                  backgroundColor: config.colors.surface,
                  boxShadow: getCardShadowCss(config.geometry.cardShadow),
                  border: `1px solid ${config.colors.border || '#e2e8f0'}`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: config.colors.secondary,
                      color: config.colors.primary
                    }}
                  >
                    Integrationskurs
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: config.colors.accent }}>
                    Kostenfrei*
                  </span>
                </div>

                <h5 
                  className="text-sm font-bold mb-1 leading-snug"
                  style={{ 
                    fontFamily: config.typography.headingFont,
                    color: config.colors.foreground
                  }}
                >
                  Deutsch als Zweitsprache (B1)
                </h5>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: config.colors.muted }}>
                  Offizieller BAMF-Kurs für Migrantinnen und Migranten in Ludwigshafen.
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: config.colors.muted }}>
                    Başlangıç: Hemen
                  </span>
                  <button
                    type="button"
                    className="text-xs font-bold px-3 py-1.5 transition-all text-white"
                    style={{
                      borderRadius: getButtonRadiusPx(config.buttons.shape),
                      backgroundColor: config.colors.primary,
                      textTransform: config.buttons.transform
                    }}
                  >
                    Anmelden
                  </button>
                </div>
              </div>

              {/* Mini Footer Preview with central contact & social */}
              <div 
                className="mt-4 p-3.5 rounded-xl border border-gray-200/80 bg-slate-900 text-slate-200 text-xs space-y-2.5 transition-all"
                style={{
                  borderRadius: getRadiusPx(config.geometry.borderRadius),
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-white text-xs block">{siteName}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                      {config.contact?.address || 'Prinzregentenstraße 47, 67063 Ludwigshafen'}
                    </span>
                  </div>
                  {config.social?.showInFooter !== false && (
                    <SocialLinksBar social={config.social} variant="footer" iconSize={13} className="scale-90 origin-right" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>© {new Date().getFullYear()} {siteName}</span>
                  <span>{config.contact?.workingHours || 'Mo-Fr: 09:00 - 17:00'}</span>
                </div>
              </div>

              {/* Micro Status Footnote */}
              <div className="mt-3 pt-2 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Gerçek zamanlı CSS simülatörü devrede</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
