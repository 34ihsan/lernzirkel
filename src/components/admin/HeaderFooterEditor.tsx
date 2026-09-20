'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import { 
  HeaderConfig, 
  FooterConfig, 
  defaultHeaderConfig, 
  defaultFooterConfig,
  DepartmentOpeningHoursItem,
  DepartmentOpeningHoursDay
} from '@/lib/site-defaults';
import { updateHeaderFooterSettings } from '@/actions/admin';
import { 
  Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, 
  Sliders, LayoutTemplate, Palette, CheckCircle, Info,
  ChevronDown, ChevronRight, ListTree, Sparkles, Layers,
  CornerDownRight, Eye, ShieldCheck, Upload, ImageIcon, Link as LinkIcon,
  Type, AlignLeft, AlignCenter, AlignRight, ArrowRight, Send, Mail, Phone, MousePointerClick, Clock, Copy, MapPin
} from 'lucide-react';
import DynamicIcon, { AVAILABLE_ICONS } from '@/components/common/DynamicIcon';
import Header from '@/components/layout/Header';

interface Props {
  initialHeader: HeaderConfig | null;
  initialFooter: FooterConfig | null;
}

export default function HeaderFooterEditor({ initialHeader, initialFooter }: Props) {
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [expandedSubmenuIndex, setExpandedSubmenuIndex] = useState<number | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);
  const [uploadingPartnerIdx, setUploadingPartnerIdx] = useState<number | null>(null);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setHeader(prev => ({ ...prev, logo: { ...prev.logo, imageUrl: data.url } }));
        }
      } else {
        alert('Dosya yüklenemedi.');
      }
    } catch (e) {
      alert('Hata oluştu.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFooterLogoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingFooterLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFooter(prev => ({
            ...prev,
            about: {
              ...prev.about,
              logoUrl: data.url,
              showLogo: true
            }
          }));
        }
      } else {
        alert('Dosya yüklenemedi.');
      }
    } catch (e) {
      alert('Hata oluştu.');
    } finally {
      setIsUploadingFooterLogo(false);
    }
  };

  const handlePartnerLogoUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingPartnerIdx(index);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFooter(prev => {
            const currentPartners = [...(prev.badges?.partners || [])];
            if (currentPartners[index]) {
              currentPartners[index] = { ...currentPartners[index], logoUrl: data.url };
            }
            return {
              ...prev,
              badges: {
                ...prev.badges,
                partners: currentPartners,
                items: currentPartners.map(p => p.name || 'Partner')
              }
            };
          });
        }
      } else {
        alert('Dosya yüklenemedi.');
      }
    } catch (e) {
      console.error(e);
      alert('Hata oluştu.');
    } finally {
      setUploadingPartnerIdx(null);
    }
  };

  // Smart merge: ensure all categories have their submenus even if initialHeader in DB has partial/missing children
  const initialNavLinks = (() => {
    const base = (initialHeader?.navLinks && initialHeader.navLinks.length > 0)
      ? initialHeader.navLinks
      : defaultHeaderConfig.navLinks;

    return (base || []).map(link => {
      if (link.children && link.children.length > 0) return link;
      const fallback = defaultHeaderConfig.navLinks?.find(
        def => def.label.trim().toLowerCase() === link.label.trim().toLowerCase() ||
               (link.url !== '/' && def.url.trim().toLowerCase() === link.url.trim().toLowerCase())
      );
      if (fallback?.children && fallback.children.length > 0) {
        return {
          ...link,
          children: fallback.children
        };
      }
      return link;
    });
  })();

  // Initial partners calculation
  const initialPartners = initialFooter?.badges?.partners && initialFooter.badges.partners.length > 0
    ? initialFooter.badges.partners
    : (initialFooter?.badges?.items && initialFooter.badges.items.length > 0
        ? initialFooter.badges.items.map(item => ({ name: item, logoUrl: '', url: '', width: 120, height: 40 }))
        : (defaultFooterConfig.badges?.partners || []));

  // Merge with defaults
  const [header, setHeader] = useState<HeaderConfig>({
    ...defaultHeaderConfig,
    ...initialHeader,
    topBar: { ...defaultHeaderConfig.topBar, ...initialHeader?.topBar },
    logo: { ...defaultHeaderConfig.logo, ...initialHeader?.logo },
    navLinks: initialNavLinks,
    ctaButton: { ...defaultHeaderConfig.ctaButton, ...initialHeader?.ctaButton },
    design: { ...defaultHeaderConfig.design, ...initialHeader?.design }
  });

  const [footer, setFooter] = useState<FooterConfig>({
    ...defaultFooterConfig,
    ...initialFooter,
    about: { ...defaultFooterConfig.about, ...initialFooter?.about },
    quickLinks: {
      title: initialFooter?.quickLinks?.title || defaultFooterConfig.quickLinks?.title,
      links: initialFooter?.quickLinks?.links?.length ? initialFooter.quickLinks.links : defaultFooterConfig.quickLinks?.links,
    },
    badges: {
      title: initialFooter?.badges?.title || defaultFooterConfig.badges?.title,
      showTitle: initialFooter?.badges?.showTitle ?? defaultFooterConfig.badges?.showTitle ?? true,
      items: initialFooter?.badges?.items?.length ? initialFooter.badges.items : defaultFooterConfig.badges?.items,
      partners: initialPartners,
    },
    donateBlock: { ...defaultFooterConfig.donateBlock, ...initialFooter?.donateBlock },
    openingHours: {
      title: initialFooter?.openingHours?.title || defaultFooterConfig.openingHours?.title || "Öffnungszeiten",
      showTitle: initialFooter?.openingHours?.showTitle ?? defaultFooterConfig.openingHours?.showTitle ?? true,
      departments: (initialFooter?.openingHours?.departments && initialFooter.openingHours.departments.length > 0)
        ? initialFooter.openingHours.departments
        : (defaultFooterConfig.openingHours?.departments || [])
    },
    legalLinks: initialFooter?.legalLinks?.length ? initialFooter.legalLinks : defaultFooterConfig.legalLinks,
    design: { ...defaultFooterConfig.design, ...initialFooter?.design }
  });

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateHeaderFooterSettings(header, footer);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Nav link helpers
  const updateNavLink = (index: number, field: string, value: any) => {
    const updated = [...(header.navLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setHeader({ ...header, navLinks: updated });
  };

  const addNavLink = () => {
    const updated = [...(header.navLinks || []), { label: "Yeni Menü", url: "/" }];
    setHeader({ ...header, navLinks: updated });
  };

  const removeNavLink = (index: number) => {
    const updated = (header.navLinks || []).filter((_, i) => i !== index);
    setHeader({ ...header, navLinks: updated });
  };

  const moveNavLink = (index: number, dir: -1 | 1) => {
    const items = [...(header.navLinks || [])];
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;
    setHeader({ ...header, navLinks: items });
  };

  const loadDefaultSubmenus = () => {
    if (confirm("Lernzirkel için hazırlanmış zengin alt menü şablonunu (Deutsch, Kinder & Jugend, Beratung, Projekte, Über uns) yüklemek istediğinize emin misiniz?")) {
      setHeader({ ...header, navLinks: defaultHeaderConfig.navLinks });
    }
  };

  // Submenu helpers
  const toggleSubmenuExpand = (index: number) => {
    setExpandedSubmenuIndex(expandedSubmenuIndex === index ? null : index);
  };

  const addSubNavLink = (parentIndex: number) => {
    const updated = [...(header.navLinks || [])];
    const currentChildren = updated[parentIndex].children || [];
    updated[parentIndex] = {
      ...updated[parentIndex],
      children: [
        ...currentChildren,
        {
          label: "Yeni Alt Sayfa",
          url: "/",
          description: "",
          icon: "GraduationCap",
          badge: ""
        }
      ]
    };
    setHeader({ ...header, navLinks: updated });
    setExpandedSubmenuIndex(parentIndex);
  };

  const updateSubNavLink = (parentIndex: number, subIndex: number, field: string, value: any) => {
    const updated = [...(header.navLinks || [])];
    const children = [...(updated[parentIndex].children || [])];
    children[subIndex] = { ...children[subIndex], [field]: value };
    updated[parentIndex] = { ...updated[parentIndex], children };
    setHeader({ ...header, navLinks: updated });
  };

  const removeSubNavLink = (parentIndex: number, subIndex: number) => {
    const updated = [...(header.navLinks || [])];
    const children = (updated[parentIndex].children || []).filter((_, i) => i !== subIndex);
    updated[parentIndex] = { ...updated[parentIndex], children };
    setHeader({ ...header, navLinks: updated });
  };

  const moveSubNavLink = (parentIndex: number, subIndex: number, dir: -1 | 1) => {
    const updated = [...(header.navLinks || [])];
    const children = [...(updated[parentIndex].children || [])];
    const target = subIndex + dir;
    if (target < 0 || target >= children.length) return;
    const temp = children[subIndex];
    children[subIndex] = children[target];
    children[target] = temp;
    updated[parentIndex] = { ...updated[parentIndex], children };
    setHeader({ ...header, navLinks: updated });
  };

  // Footer quick link helpers
  const updateFooterLink = (index: number, field: string, value: any) => {
    const updated = [...(footer.quickLinks?.links || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFooter({
      ...footer,
      quickLinks: { ...footer.quickLinks, links: updated }
    });
  };

  const addFooterLink = () => {
    const updated = [...(footer.quickLinks?.links || []), { label: "Yeni Bağlantı", url: "/" }];
    setFooter({
      ...footer,
      quickLinks: { ...footer.quickLinks, links: updated }
    });
  };

  const removeFooterLink = (index: number) => {
    const updated = (footer.quickLinks?.links || []).filter((_, i) => i !== index);
    setFooter({
      ...footer,
      quickLinks: { ...footer.quickLinks, links: updated }
    });
  };

  // Partner & Badge helpers
  const addPartner = () => {
    const currentPartners = [...(footer.badges?.partners || [])];
    const newPartner = { name: "Yeni Sertifika / Partner", logoUrl: "", url: "", width: 120, height: 40 };
    const updatedPartners = [...currentPartners, newPartner];
    setFooter({
      ...footer,
      badges: {
        ...footer.badges,
        partners: updatedPartners,
        items: updatedPartners.map(p => p.name)
      }
    });
  };

  const updatePartner = (index: number, field: string, val: any) => {
    const updatedPartners = [...(footer.badges?.partners || [])];
    if (updatedPartners[index]) {
      updatedPartners[index] = { ...updatedPartners[index], [field]: val };
      setFooter({
        ...footer,
        badges: {
          ...footer.badges,
          partners: updatedPartners,
          items: updatedPartners.map(p => p.name)
        }
      });
    }
  };

  const removePartner = (index: number) => {
    const updatedPartners = (footer.badges?.partners || []).filter((_, i) => i !== index);
    setFooter({
      ...footer,
      badges: {
        ...footer.badges,
        partners: updatedPartners,
        items: updatedPartners.map(p => p.name)
      }
    });
  };

  const movePartner = (index: number, dir: -1 | 1) => {
    const updatedPartners = [...(footer.badges?.partners || [])];
    const target = index + dir;
    if (target < 0 || target >= updatedPartners.length) return;
    const temp = updatedPartners[index];
    updatedPartners[index] = updatedPartners[target];
    updatedPartners[target] = temp;
    setFooter({
      ...footer,
      badges: {
        ...footer.badges,
        partners: updatedPartners,
        items: updatedPartners.map(p => p.name)
      }
    });
  };

  const loadDefaultPartners = () => {
    const defaults = defaultFooterConfig.badges?.partners || [];
    setFooter({
      ...footer,
      badges: {
        ...footer.badges,
        partners: defaults,
        items: defaults.map(p => p.name)
      }
    });
  };

  // Legal link helpers
  const addLegalLink = () => {
    const updated = [...(footer.legalLinks || []), { label: "Yeni Sayfa", url: "/" }];
    setFooter({ ...footer, legalLinks: updated });
  };

  const updateLegalLink = (index: number, field: string, value: any) => {
    const updated = [...(footer.legalLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFooter({ ...footer, legalLinks: updated });
  };

  const removeLegalLink = (index: number) => {
    const updated = (footer.legalLinks || []).filter((_, i) => i !== index);
    setFooter({ ...footer, legalLinks: updated });
  };

  // Department Opening Hours helpers
  const addDepartment = () => {
    const currentDepts = [...(footer.openingHours?.departments || [])];
    const newDept: DepartmentOpeningHoursItem = {
      id: `dept-${Date.now()}`,
      name: "Yeni Departman",
      note: "",
      hours: [
        { day: "Mo", openTime: "09:00", closeTime: "17:00", isClosed: false },
        { day: "Di", openTime: "09:00", closeTime: "17:00", isClosed: false },
        { day: "Mi", openTime: "09:00", closeTime: "17:00", isClosed: false },
        { day: "Do", openTime: "09:00", closeTime: "17:00", isClosed: false },
        { day: "Fr", openTime: "09:00", closeTime: "14:00", isClosed: false },
        { day: "Sa", openTime: "", closeTime: "", isClosed: true },
        { day: "So", openTime: "", closeTime: "", isClosed: true }
      ]
    };
    setFooter({
      ...footer,
      openingHours: {
        ...footer.openingHours,
        departments: [...currentDepts, newDept]
      }
    });
  };

  const updateDepartment = (index: number, field: string, value: any) => {
    const currentDepts = [...(footer.openingHours?.departments || [])];
    if (currentDepts[index]) {
      currentDepts[index] = { ...currentDepts[index], [field]: value };
      setFooter({
        ...footer,
        openingHours: {
          ...footer.openingHours,
          departments: currentDepts
        }
      });
    }
  };

  const updateDepartmentHour = (deptIndex: number, dayIndex: number, field: string, value: any) => {
    const currentDepts = [...(footer.openingHours?.departments || [])];
    if (currentDepts[deptIndex] && currentDepts[deptIndex].hours[dayIndex]) {
      const updatedHours = [...currentDepts[deptIndex].hours];
      updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
      currentDepts[deptIndex] = { ...currentDepts[deptIndex], hours: updatedHours };
      setFooter({
        ...footer,
        openingHours: {
          ...footer.openingHours,
          departments: currentDepts
        }
      });
    }
  };

  const copyHoursToWeekdays = (deptIndex: number, sourceDayIndex: number = 0) => {
    const currentDepts = [...(footer.openingHours?.departments || [])];
    if (currentDepts[deptIndex] && currentDepts[deptIndex].hours[sourceDayIndex]) {
      const src = currentDepts[deptIndex].hours[sourceDayIndex];
      const updatedHours = currentDepts[deptIndex].hours.map((h, i) => {
        if (i < 5) { // Mo - Fr
          return { ...h, openTime: src.openTime, closeTime: src.closeTime, isClosed: src.isClosed };
        }
        return h;
      });
      currentDepts[deptIndex] = { ...currentDepts[deptIndex], hours: updatedHours };
      setFooter({
        ...footer,
        openingHours: {
          ...footer.openingHours,
          departments: currentDepts
        }
      });
    }
  };

  const removeDepartment = (index: number) => {
    const currentDepts = (footer.openingHours?.departments || []).filter((_, i) => i !== index);
    setFooter({
      ...footer,
      openingHours: {
        ...footer.openingHours,
        departments: currentDepts
      }
    });
  };

  const moveDepartment = (index: number, dir: -1 | 1) => {
    const currentDepts = [...(footer.openingHours?.departments || [])];
    const target = index + dir;
    if (target < 0 || target >= currentDepts.length) return;
    const temp = currentDepts[index];
    currentDepts[index] = currentDepts[target];
    currentDepts[target] = temp;
    setFooter({
      ...footer,
      openingHours: {
        ...footer.openingHours,
        departments: currentDepts
      }
    });
  };

  const loadDefaultOpeningHours = () => {
    if (confirm("Lernzirkel için hazırlanmış standart departman çalışma saatlerini (Bildung & Nachhilfe, Sprache & Integration, MFD) yüklemek istediğinize emin misiniz?")) {
      setFooter({
        ...footer,
        openingHours: {
          ...defaultFooterConfig.openingHours,
          title: "Öffnungszeiten",
          showTitle: true
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar with Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Header & Footer Yönetimi</h1>
          <p className="text-sm text-gray-500">
            Sitenin tepe menüsünü, logoyu, altbilgi alanını, bağlantıları ve renkleri bu panelden özelleştirin.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {savedSuccess && (
            <span className="flex items-center text-sm font-medium text-emerald-600 animate-in fade-in">
              <CheckCircle className="w-4 h-4 mr-1.5" /> Kaydedildi!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-t-xl">
        <button
          onClick={() => setActiveTab('header')}
          className={`py-4 px-6 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'header'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutTemplate size={18} />
          <span>Header (Üst Menü & Bar)</span>
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`py-4 px-6 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'footer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sliders size={18} />
          <span>Footer (Alt Bilgi & Bağlantılar)</span>
        </button>
      </div>

      {/* HEADER TAB */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Top Bar Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">1. Üst İnce Şerit (Top Bar)</h2>
                <p className="text-xs text-gray-500">Sayfanın en üstünde yer alan iletişim ve hızlı bağlantı çubuğu.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={header.topBar?.enabled ?? true}
                  onChange={(e) => setHeader({ ...header, topBar: { ...header.topBar, enabled: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>

            {header.topBar?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon Numarası</label>
                  <input
                    type="text"
                    value={header.topBar?.phone || ''}
                    onChange={(e) => setHeader({ ...header, topBar: { ...header.topBar, phone: e.target.value } })}
                    placeholder="0621 / 123 45 67"
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">E-Posta Adresi</label>
                  <input
                    type="text"
                    value={header.topBar?.email || ''}
                    onChange={(e) => setHeader({ ...header, topBar: { ...header.topBar, email: e.target.value } })}
                    placeholder="info@lernzirkel-online.de"
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Slogan / Duyuru Metni (Opsiyonel)</label>
                  <input
                    type="text"
                    value={header.topBar?.tagline || ''}
                    onChange={(e) => setHeader({ ...header, topBar: { ...header.topBar, tagline: e.target.value } })}
                    placeholder="Eğitim ve Danışmanlık"
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div className="md:col-span-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Çok Dilli Seçici (Language Switcher)</h3>
                      <p className="text-xs text-gray-500">Üst şeritte ve mobil menüde 4 dilli bayrak seçici (🇩🇪 DE, 🇹🇷 TR, 🇬🇧 EN, 🇸🇦 AR).</p>
                    </div>
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={header.topBar?.showLanguage ?? true}
                        onChange={(e) => setHeader({
                          ...header,
                          topBar: { ...header.topBar, showLanguage: e.target.checked }
                        })}
                        className="rounded text-blue-600 h-4 w-4"
                      />
                      <span className="font-semibold text-xs text-gray-700">Dilleri Göster (DE, TR, EN, AR)</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-3 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Üst Bar Bağış Butonu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={header.topBar?.donateButton?.enabled ?? true}
                        onChange={(e) => setHeader({
                          ...header,
                          topBar: {
                            ...header.topBar,
                            donateButton: { ...header.topBar?.donateButton, enabled: e.target.checked, text: header.topBar?.donateButton?.text || 'Spenden', url: header.topBar?.donateButton?.url || '/spenden' }
                          }
                        })}
                        className="rounded text-blue-600 h-4 w-4"
                      />
                      <span>Buton Göster</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Buton Yazısı (Örn: Spenden)"
                      value={header.topBar?.donateButton?.text || ''}
                      onChange={(e) => setHeader({
                        ...header,
                        topBar: {
                          ...header.topBar,
                          donateButton: { ...header.topBar?.donateButton, text: e.target.value, enabled: true, url: header.topBar?.donateButton?.url || '/spenden' }
                        }
                      })}
                      className="border rounded-lg p-2.5 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Buton Linki (Örn: /spenden)"
                      value={header.topBar?.donateButton?.url || ''}
                      onChange={(e) => setHeader({
                        ...header,
                        topBar: {
                          ...header.topBar,
                          donateButton: { ...header.topBar?.donateButton, url: e.target.value, enabled: true, text: header.topBar?.donateButton?.text || 'Spenden' }
                        }
                      })}
                      className="border rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Tipografi, Boyut & Yükseklik Ayarları */}
                <div className="md:col-span-3 border-t pt-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900">Şerit Boyut & Tipografi Ayarları (Font Size, Yükseklik vb.)</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Canlı Değişir
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {/* Yazı Boyutu (Font Size) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-gray-700">Yazı Boyutu (Font Size)</label>
                        <span className="text-xs font-bold text-blue-600">{header.topBar?.fontSize || 13}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="10"
                          max="18"
                          step="1"
                          value={header.topBar?.fontSize || 13}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, fontSize: parseInt(e.target.value) || 13 }
                          })}
                          className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          min="10"
                          max="24"
                          value={header.topBar?.fontSize || 13}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, fontSize: parseInt(e.target.value) || 13 }
                          })}
                          className="w-14 border bg-white rounded-md px-2 py-1 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {[11, 12, 13, 14, 15].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setHeader({
                              ...header,
                              topBar: { ...header.topBar, fontSize: size }
                            })}
                            className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                              (header.topBar?.fontSize || 13) === size
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Şerit Yüksekliği (Height) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-gray-700">Şerit Yüksekliği (Height)</label>
                        <span className="text-xs font-bold text-blue-600">{header.topBar?.height || 40}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="30"
                          max="60"
                          step="2"
                          value={header.topBar?.height || 40}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, height: parseInt(e.target.value) || 40 }
                          })}
                          className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          min="24"
                          max="80"
                          value={header.topBar?.height || 40}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, height: parseInt(e.target.value) || 40 }
                          })}
                          className="w-14 border bg-white rounded-md px-2 py-1 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {[34, 38, 40, 44, 48].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setHeader({
                              ...header,
                              topBar: { ...header.topBar, height: h }
                            })}
                            className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                              (header.topBar?.height || 40) === h
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {h}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Yazı Kalınlığı (Font Weight) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Yazı Kalınlığı (Weight)</label>
                      <select
                        value={header.topBar?.fontWeight || 'normal'}
                        onChange={(e) => setHeader({
                          ...header,
                          topBar: { ...header.topBar, fontWeight: e.target.value as any }
                        })}
                        className="w-full border bg-white rounded-lg p-2 text-xs"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="medium">Orta / Medium (500)</option>
                        <option value="semibold">Yarı Kalın / Semibold (600)</option>
                        <option value="bold">Kalın / Bold (700)</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">İletişim ve bağlantıların kalınlık derecesi.</p>
                    </div>

                    {/* Dikey Dolgu (Padding Y) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-gray-700">Dikey Dolgu (Padding Y)</label>
                        <span className="text-xs font-bold text-blue-600">{header.topBar?.paddingY || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={header.topBar?.paddingY || 0}
                        onChange={(e) => setHeader({
                          ...header,
                          topBar: { ...header.topBar, paddingY: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>0px (Sıkı)</span>
                        <span>8px (Dengeli)</span>
                        <span>16px (Geniş)</span>
                      </div>
                    </div>

                    {/* Öğeler Arası Boşluk (Item Gap) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-gray-700">Öğeler Arası Boşluk (Gap)</label>
                        <span className="text-xs font-bold text-blue-600">{header.topBar?.itemGap || 20}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="8"
                          max="40"
                          step="2"
                          value={header.topBar?.itemGap || 20}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, itemGap: parseInt(e.target.value) || 20 }
                          })}
                          className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          min="6"
                          max="60"
                          value={header.topBar?.itemGap || 20}
                          onChange={(e) => setHeader({
                            ...header,
                            topBar: { ...header.topBar, itemGap: parseInt(e.target.value) || 20 }
                          })}
                          className="w-14 border bg-white rounded-md px-2 py-1 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {[12, 16, 20, 24, 28].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setHeader({
                              ...header,
                              topBar: { ...header.topBar, itemGap: g }
                            })}
                            className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                              (header.topBar?.itemGap || 20) === g
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {g}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dikey Ayrım Çizgileri (|) */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Ayrım Çizgileri (|)</label>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={header.topBar?.showDividers ?? true}
                            onChange={(e) => setHeader({
                              ...header,
                              topBar: { ...header.topBar, showDividers: e.target.checked }
                            })}
                            className="rounded text-blue-600 h-4 w-4"
                          />
                          <span className="text-xs font-semibold text-gray-800">Dikey Ayrım Çizgileri (|) Göster</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2">
                        Aktuelles, Stellenangebote, Telefon, E-posta, Çalışma Saatleri ve Sosyal Medya arasında zarif dikey çizgiler koyar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo & Main Branding */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">2. Logo ve Marka</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Görsel URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={header.logo?.imageUrl || ''}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, imageUrl: e.target.value } })}
                    placeholder="/logo.png"
                    className="flex-1 border rounded-lg p-2.5 text-sm"
                  />
                  <label className={`cursor-pointer border border-gray-300 rounded-md px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${isUploadingLogo ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {isUploadingLogo ? 'Yükleniyor...' : 'Dosya Seç'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isUploadingLogo}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-1">Dosya seçebilir veya tam URL girebilirsiniz.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Logo / Kurum Metni</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={header.logo?.text || ''}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, text: e.target.value } })}
                    placeholder="Lernzirkel"
                    className="flex-1 border rounded-lg p-2.5 text-sm"
                  />
                  <label className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 border rounded-lg px-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={header.logo?.showText ?? false}
                      onChange={(e) => setHeader({ ...header, logo: { ...header.logo, showText: e.target.checked } })}
                      className="rounded text-blue-600"
                    />
                    <span className="whitespace-nowrap text-xs font-medium">Metni Göster</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Görsel Genişliği (px)</label>
                <input
                  type="number"
                  min={80}
                  max={280}
                  value={header.logo?.width || 180}
                  onChange={(e) => setHeader({ ...header, logo: { ...header.logo, width: parseInt(e.target.value) || 180 } })}
                  placeholder="180"
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
                <p className="text-[11px] text-gray-400 mt-0.5">Önerilen: 160 - 200 px</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Görsel Yüksekliği (px)</label>
                <input
                  type="number"
                  min={28}
                  max={56}
                  value={header.logo?.height || 48}
                  onChange={(e) => setHeader({ ...header, logo: { ...header.logo, height: parseInt(e.target.value) || 48 } })}
                  placeholder="48"
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
                <p className="text-[11px] text-gray-400 mt-0.5">Navbar standartı: 44 - 50 px</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Logo Konumu & Hizalama (Masaüstü ve Mobil)
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setHeader({ ...header, logo: { ...header.logo, align: 'left' } })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
                      (header.logo?.align || 'left') === 'left'
                        ? 'bg-white text-blue-700 font-bold shadow-sm ring-1 ring-blue-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <AlignLeft size={14} /> Sol
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeader({ ...header, logo: { ...header.logo, align: 'center' } })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
                      header.logo?.align === 'center'
                        ? 'bg-white text-blue-700 font-bold shadow-sm ring-1 ring-blue-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <AlignCenter size={14} /> Orta
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeader({ ...header, logo: { ...header.logo, align: 'right' } })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
                      header.logo?.align === 'right'
                        ? 'bg-white text-blue-700 font-bold shadow-sm ring-1 ring-blue-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <AlignRight size={14} /> Sağ
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {(header.logo?.align || 'left') === 'left' && 'Klasik Düzen: Logo sol başta, Menü ortada, Buton sağda.'}
                  {header.logo?.align === 'center' && 'Modern Düzen: Menü solda, Logo ortada, Buton sağda.'}
                  {header.logo?.align === 'right' && 'Ters Düzen: Menü solda, Buton ortada, Logo sağ başta.'}
                </p>
              </div>
            </div>

            {/* Sol Sınır ve Nav Menü Koruma Alanı (Logo menüye asla girmez) */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sol Sayfa Sınırı & Nav Menü Güvenlik Kilidi</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Logo, <strong>sol sayfa kenarı ile navigasyon menüsü arasındaki</strong> ayrılmış özel koridorda konumlandırılır. Menü bağlantılarını sıkıştırmaz, menünün alanına taşmaz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sol Kenar Mesafesi (px)
                  </label>
                  <input
                    type="number"
                    value={header.logo?.marginLeft ?? 0}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, marginLeft: parseInt(e.target.value) || 0 } })}
                    placeholder="0"
                    className="w-full border bg-white rounded-lg p-2 text-sm"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Sol sayfa sınırından uzaklık</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Menü Emniyet Mesafesi (px)
                  </label>
                  <input
                    type="number"
                    value={header.logo?.marginRight ?? 20}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, marginRight: parseInt(e.target.value) || 0 } })}
                    placeholder="20"
                    className="w-full border bg-white rounded-lg p-2 text-sm"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Nav menü ile aradaki emniyet boşluğu</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Logo Tavan Genişliği (px)
                  </label>
                  <input
                    type="number"
                    min={120}
                    max={320}
                    value={header.logo?.maxWidth || 240}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, maxWidth: Math.max(120, parseInt(e.target.value) || 240) } })}
                    placeholder="240"
                    className="w-full border bg-white rounded-lg p-2 text-sm"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Önerilen: 200 - 260 px</p>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={header.logo?.showDivider ?? false}
                    onChange={(e) => setHeader({ ...header, logo: { ...header.logo, showDivider: e.target.checked } })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span>Logo ile Nav Menü Arasında Zarif Dikey Çizgi (Ayrım Sınırı) Göster</span>
                </label>
                <span className="text-[11px] text-blue-600 font-semibold bg-white px-2.5 py-1 rounded-full border border-blue-200 w-fit">
                  Önizlemede anlık görebilirsiniz
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links & Submenus */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ListTree className="w-5 h-5 text-blue-600" />
                  3. Menü Bağlantıları & Açılır Alt Menüler (Dropdown Submenu)
                </h2>
                <p className="text-xs text-gray-500">
                  Ana menü öğelerini ve her menünün altına açılan mega/dropdown alt menüleri, ikonları ve açıklamalarıyla yönetin.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadDefaultSubmenus}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  title="Lernzirkel için hazırlanan zengin alt menü şablonunu yükler"
                >
                  <Sparkles size={14} className="text-amber-500" /> Varsayılan Alt Menüleri Yükle
                </button>
                <button
                  type="button"
                  onClick={addNavLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={16} /> Yeni Menü Öğesi
                </button>
              </div>
            </div>

            {/* Menü Tipografi, Renk & Yerleşim Kontrol Paneli (%100 Kontrol) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border border-blue-100/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-gray-800">Menü Görünüm, Tipografi & Yerleşim Ayarları (100% Kontrol)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Tek Satır Kilidi Aktif (Asla Alt Satıra Kaymaz)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Menü Yazı Boyutu (Font Size) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Type size={13} className="text-blue-600" /> Yazı Boyutu (px)
                    </label>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {header.design?.navFontSize ? `${header.design.navFontSize}px` : 'Otomatik (Dinamik)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="18"
                      step="0.5"
                      value={header.design?.navFontSize || 13}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navFontSize: parseFloat(e.target.value) || 13 }
                      })}
                      className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="10"
                      max="20"
                      step="0.5"
                      value={header.design?.navFontSize || ''}
                      placeholder="Oto"
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navFontSize: e.target.value ? parseFloat(e.target.value) : undefined }
                      })}
                      className="w-14 border bg-white rounded-md px-1.5 py-1 text-xs text-center font-bold"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap pt-0.5">
                    {[11, 12, 13, 14, 15].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setHeader({
                          ...header,
                          design: { ...header.design, navFontSize: s }
                        })}
                        className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                          header.design?.navFontSize === s
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {s}px
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setHeader({
                        ...header,
                        design: { ...header.design, navFontSize: undefined }
                      })}
                      className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                        !header.design?.navFontSize
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                      title="Ekran genişliğine göre orantılı küçülen akıllı clamp"
                    >
                      Dinamik Oto
                    </button>
                  </div>
                </div>

                {/* 2. Menü Normal Yazı Rengi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Menü Yazı Rengi (Normal)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={header.design?.navText?.startsWith('#') ? header.design.navText : '#333333'}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navText: e.target.value }
                      })}
                      className="h-8 w-8 rounded border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={header.design?.navText || '#333333'}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navText: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {['#1e293b', '#333333', '#0F4761', '#475569'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setHeader({ ...header, design: { ...header.design, navText: c } })}
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Hover / Vurgu Rengi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Hover / Vurgu Rengi</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={header.design?.navHoverText?.startsWith('#') ? header.design.navHoverText : '#0F4761'}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navHoverText: e.target.value }
                      })}
                      className="h-8 w-8 rounded border p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={header.design?.navHoverText || '#0F4761'}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navHoverText: e.target.value }
                      })}
                      className="flex-1 border bg-white rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {['#0F4761', '#0284c7', '#2563eb', '#d97706'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setHeader({ ...header, design: { ...header.design, navHoverText: c } })}
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. Öğeler Arası Mesafe (Gap) & Font Weight */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-700">Öğeler Arası Boşluk (Gap)</label>
                    <span className="text-xs font-bold text-blue-700">{header.design?.navGap ?? 24}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="6"
                      max="36"
                      step="2"
                      value={header.design?.navGap ?? 24}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navGap: parseInt(e.target.value) || 24 }
                      })}
                      className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="4"
                      max="48"
                      value={header.design?.navGap ?? 24}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navGap: parseInt(e.target.value) || 24 }
                      })}
                      className="w-14 border bg-white rounded-md px-1.5 py-1 text-xs text-center font-bold"
                    />
                  </div>
                  <div className="pt-1">
                    <select
                      value={header.design?.navFontWeight || 'semibold'}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, navFontWeight: e.target.value as any }
                      })}
                      className="w-full border bg-white rounded-md p-1 text-xs"
                    >
                      <option value="normal">Yazı Kalınlığı: Normal (400)</option>
                      <option value="medium">Yazı Kalınlığı: Orta / Medium (500)</option>
                      <option value="semibold">Yazı Kalınlığı: Yarı Kalın / Semibold (600)</option>
                      <option value="bold">Yazı Kalınlığı: Kalın / Bold (700)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Alt Satır: Menü Yerleşimi & Yön Okları Seçeneği */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-blue-100/70">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Menü Yerleşimi (Layout)</label>
                  <select
                    value={header.design?.navLayout || 'space-between'}
                    onChange={(e) => setHeader({
                      ...header,
                      design: { ...header.design, navLayout: e.target.value as any }
                    })}
                    className="w-full border rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="space-between">Dengeli Dağılım (Menü Geniş Alanı Kaplar & Orantılı Dağılır)</option>
                    <option value="center">Ortalanmış (Menü Tam Merkezde Toplanır)</option>
                    <option value="left">Sola Yaslı (Logodan Sonra Güvenli Mesafeyle Başlar)</option>
                    <option value="right">Sağa Yaslı (Sağdaki Butona Yaklaşır)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center space-y-1">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={header.design?.showDropdownArrows ?? false}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, showDropdownArrows: e.target.checked }
                      })}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>Alt menüsü olan başlıklarda yön / aşağı ok (▼) simgesi göster</span>
                  </label>
                  <p className="text-[11px] text-gray-500 pl-6">
                    Kapalı tutulması önerilir; bu sayede menü fazladan 140px kazanır ve tek satıra rahatça sığar.
                  </p>
                </div>

                <div className="flex flex-col justify-center space-y-1">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={header.design?.showSearch ?? true}
                      onChange={(e) => setHeader({
                        ...header,
                        design: { ...header.design, showSearch: e.target.checked }
                      })}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>Site İçi Arama Butonunu (Menüde Arama & ⌘K / Strg+K) Göster</span>
                  </label>
                  <p className="text-[11px] text-gray-500 pl-6">
                    Ziyaretçilerin tüm kursları, sayfaları ve içerikleri tek tıkla veya klavye kısayoluyla anında aramasına olanak tanır.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {header.navLinks?.map((item, index) => {
                const isSubExpanded = expandedSubmenuIndex === index;
                const subCount = item.children?.length || 0;

                return (
                  <div 
                    key={index} 
                    className={`rounded-xl border transition-all ${isSubExpanded ? 'border-blue-400 bg-blue-50/20 shadow-md ring-2 ring-blue-100' : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'}`}
                  >
                    {/* Main Nav Item Row */}
                    <div className="p-3.5 flex flex-col md:flex-row items-start md:items-center gap-3">
                      {/* Move buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveNavLink(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                          title="Yukarı taşı"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveNavLink(index, 1)}
                          disabled={index === (header.navLinks?.length || 1) - 1}
                          className="p-1.5 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                          title="Aşağı taşı"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      {/* Input fields */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Menü Başlığı</label>
                          <input
                            type="text"
                            placeholder="Örn: Deutsch & Grundbildung"
                            value={item.label}
                            onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">URL / Rota</label>
                          <input
                            type="text"
                            placeholder="Örn: /deutsch-grundbildung"
                            value={item.url}
                            onChange={(e) => updateNavLink(index, 'url', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Rozet / Etiket (Opsiyonel)</label>
                          <input
                            type="text"
                            placeholder="Örn: Yeni, BAMF, telc"
                            value={item.badge || ''}
                            onChange={(e) => updateNavLink(index, 'badge', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-1 focus:ring-blue-500 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-3">
                          <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isExternal ?? false}
                              onChange={(e) => updateNavLink(index, 'isExternal', e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span>Yeni Sekme</span>
                          </label>
                          <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isHighlight ?? false}
                              onChange={(e) => updateNavLink(index, 'isHighlight', e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span>Vurgulu</span>
                          </label>
                        </div>
                      </div>

                      {/* Action buttons: Submenu Toggle & Delete */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button
                          type="button"
                          onClick={() => toggleSubmenuExpand(index)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isSubExpanded 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : subCount > 0 
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <ListTree size={14} />
                          <span>Alt Menü ({subCount})</span>
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeNavLink(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Bu menü öğesini sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED SUBMENU DRAWER */}
                    {isSubExpanded && (
                      <div className="p-4 border-t border-blue-100 bg-blue-50/40 space-y-3 rounded-b-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                              <CornerDownRight size={14} />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                "{item.label}" Alt Menüleri ({subCount})
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                Fare bu menünün üzerine geldiğinde açılacak alt başlıkları, açıklamaları ve ikonları buradan ekleyin.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubNavLink(index)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all"
                          >
                            <Plus size={14} /> Alt Menü Ekle
                          </button>
                        </div>

                        {/* Submenu List */}
                        {subCount === 0 ? (
                          <div className="bg-white p-6 text-center rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
                            <p className="text-xs font-medium">Henüz bir alt menü eklenmedi.</p>
                            <p className="text-[11px] text-gray-400">
                              Bu ana menünün altına açılır dropdown eklemek için yukarıdaki "Alt Menü Ekle" butonuna tıklayın.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {item.children?.map((sub, subIdx) => (
                              <div 
                                key={subIdx} 
                                className="bg-white p-3 rounded-xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center gap-3"
                              >
                                {/* Move buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => moveSubNavLink(index, subIdx, -1)}
                                    disabled={subIdx === 0}
                                    className="p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                                    title="Yukarı taşı"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveSubNavLink(index, subIdx, 1)}
                                    disabled={subIdx === (item.children?.length || 1) - 1}
                                    className="p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                                    title="Aşağı taşı"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                {/* Icon Preview & Selector */}
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                                    <DynamicIcon name={sub.icon || 'GraduationCap'} className="w-4 h-4" />
                                  </div>
                                  <select
                                    value={sub.icon || 'GraduationCap'}
                                    onChange={(e) => updateSubNavLink(index, subIdx, 'icon', e.target.value)}
                                    className="border rounded-lg px-2 py-1.5 text-xs bg-gray-50 focus:bg-white w-28"
                                    title="İkon seçin"
                                  >
                                    {AVAILABLE_ICONS.map((ic) => (
                                      <option key={ic} value={ic}>{ic}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Alt Menü Başlığı"
                                      value={sub.label}
                                      onChange={(e) => updateSubNavLink(index, subIdx, 'label', e.target.value)}
                                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-gray-50/50 focus:bg-white font-medium"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="URL (Örn: /kurse)"
                                      value={sub.url}
                                      onChange={(e) => updateSubNavLink(index, subIdx, 'url', e.target.value)}
                                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-gray-50/50 focus:bg-white font-mono"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Kısa Açıklama (Örn: BAMF kursları)"
                                      value={sub.description || ''}
                                      onChange={(e) => updateSubNavLink(index, subIdx, 'description', e.target.value)}
                                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-gray-50/50 focus:bg-white text-gray-600"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Rozet (Örn: BAMF)"
                                      value={sub.badge || ''}
                                      onChange={(e) => updateSubNavLink(index, subIdx, 'badge', e.target.value)}
                                      className="flex-1 border rounded-lg px-2.5 py-1.5 text-xs bg-gray-50/50 focus:bg-white"
                                    />
                                    <label className="flex items-center space-x-1 text-[11px] text-gray-600 cursor-pointer shrink-0">
                                      <input
                                        type="checkbox"
                                        checked={sub.isExternal ?? false}
                                        onChange={(e) => updateSubNavLink(index, subIdx, 'isExternal', e.target.checked)}
                                        className="rounded text-blue-600 h-3.5 w-3.5"
                                      />
                                      <span>Dış Link</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Delete sub item */}
                                <button
                                  type="button"
                                  onClick={() => removeSubNavLink(index, subIdx)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                  title="Alt menüyü sil"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header Action Button */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>4. Sağ Üst Aksiyon Butonu (Call to Action)</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${(header.ctaButton?.enabled ?? true) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      {(header.ctaButton?.enabled ?? true) ? 'Aktif' : 'Devre Dışı'}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Masaüstü ve mobil menüde ziyaretçileri doğrudan yönlendiren öne çıkan buton. Konumunu en sağa yaslayabilir, emniyet boşluklarını ve renk/stilini milimetrik olarak yönetebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Master Enable Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={header.ctaButton?.enabled ?? true}
                  onChange={(e) => setHeader({
                    ...header,
                    ctaButton: {
                      ...header.ctaButton,
                      enabled: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-bold text-gray-700 select-none">
                  {(header.ctaButton?.enabled ?? true) ? 'Butonu Göster' : 'Buton Gizli'}
                </span>
              </label>
            </div>

            {(header.ctaButton?.enabled ?? true) ? (
              <div className="space-y-6">
                {/* 1. Temel Bilgiler & Bağlantı */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    Temel Bilgiler & Bağlantı Hedefi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Buton Metni</label>
                      <input
                        type="text"
                        value={header.ctaButton?.text || ''}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, text: e.target.value }
                        })}
                        placeholder="Kontakt & Anmeldung"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5 block">Örn: Kontakt, Anmeldung, Bize Ulaşın</span>
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Buton Bağlantısı (URL)</label>
                      <input
                        type="text"
                        value={header.ctaButton?.url || ''}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, url: e.target.value }
                        })}
                        placeholder="/kontakt"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5 block">İç sayfa (/kontakt) veya dış bağlantı (https://...)</span>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-end">
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={header.ctaButton?.isExternal ?? false}
                          onChange={(e) => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, isExternal: e.target.checked }
                          })}
                          className="rounded text-blue-600 h-4 w-4"
                        />
                        <span className="truncate">Yeni Sekmede Aç</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Yerleşim & Konumlandırma Ayarları (Sağ Kenar Sınırı & Emniyet) */}
                <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      Yerleşim & Milimetrik Konumlandırma (Sağ Kenar Sınırı)
                    </h3>
                    <span className="text-[11px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
                      Masaüstü Navbar Düzeni
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">
                    Buton, sol logo ve orta menü bağlantılarından bağımsız olarak en sağ kenar koridoruna yerleştirilir. Menü ne kadar uzarsa uzasın butonun üzerine taşamaz.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hizalama Seçimi */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Masaüstü Hizalama Modu
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, align: 'far-right' }
                          })}
                          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                            (header.ctaButton?.align || 'far-right') === 'far-right'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <AlignRight className="w-4 h-4" />
                          <span>En Sağ (Önerilen)</span>
                          <span className="text-[10px] font-normal text-gray-500">Sayfa sınırına tam yaslı</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, align: 'attached' }
                          })}
                          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                            header.ctaButton?.align === 'attached'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <AlignCenter className="w-4 h-4" />
                          <span>Menüye Bitişik</span>
                          <span className="text-[10px] font-normal text-gray-500">Menünün sağ bitişiğinde</span>
                        </button>
                      </div>
                    </div>

                    {/* Sağ Kenar Mesafesi (px) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">Sağ Kenar Mesafesi (px)</label>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                          {header.ctaButton?.marginRight ?? 0} px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="2"
                        value={header.ctaButton?.marginRight ?? 0}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, marginRight: Number(e.target.value) }
                        })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        Sayfa sağ kenar sınırından içeriye olan uzaklık (0 = tam sınıra yaslı)
                      </span>
                    </div>

                    {/* Menü Emniyet Mesafesi (px) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">Menü Emniyet Mesafesi (px)</label>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                          {header.ctaButton?.marginLeft ?? 20} px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="2"
                        value={header.ctaButton?.marginLeft ?? 20}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, marginLeft: Number(e.target.value) }
                        })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        Navigasyon menüsü son öğesi ile buton arasındaki emniyet koridoru
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Görsel Tasarım & Stil Seçenekleri */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    Görsel Tasarım, Tema & Şekil
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tema / Renk Stili */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tasarım Teması</label>
                      <select
                        value={header.ctaButton?.style || 'primary'}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, style: e.target.value as any }
                        })}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="primary">Kurumsal Birincil (Primary - Mavi)</option>
                        <option value="accent">Vurgulu Kırmızı (Accent - Dikkat Çekici)</option>
                        <option value="outline">İnce Kenarlık (Outline - Zarif)</option>
                        <option value="custom">Özel Renkler (Custom)</option>
                      </select>
                      <span className="text-[10px] text-gray-500 mt-1 block">Butonun renk ve zemin şablonu</span>
                    </div>

                    {/* Şekil & Köşe Yuvarlaklığı */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buton Şekli</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, borderRadius: 'pill' }
                          })}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                            (header.ctaButton?.borderRadius || 'pill') === 'pill'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Tam Oval
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, borderRadius: 'rounded' }
                          })}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                            header.ctaButton?.borderRadius === 'rounded'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Kavisli
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeader({
                            ...header,
                            ctaButton: { ...header.ctaButton, borderRadius: 'square' }
                          })}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                            header.ctaButton?.borderRadius === 'square'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Köşeli
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">Köşe radyanı ve yumuşaklığı</span>
                    </div>

                    {/* İkon Seçimi */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buton İkonu</label>
                      <select
                        value={header.ctaButton?.icon || 'none'}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, icon: e.target.value as any }
                        })}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">İkon Yok</option>
                        <option value="arrow">İleri Ok (→)</option>
                        <option value="send">Gönder / Uçak (↗)</option>
                        <option value="mail">Mektup / E-posta (✉)</option>
                        <option value="phone">Telefon (📞)</option>
                        <option value="sparkles">Parıltı / Yıldız (✨)</option>
                      </select>
                      <span className="text-[10px] text-gray-500 mt-1 block">Buton metninin yanındaki zarif simge</span>
                    </div>
                  </div>

                  {/* Özel Renk Seçiciler (Yalnızca Custom seçildiyse) */}
                  {header.ctaButton?.style === 'custom' && (
                    <div className="pt-3 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Özel Arkaplan Rengi</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={header.ctaButton?.customBgColor || '#0F4761'}
                            onChange={(e) => setHeader({
                              ...header,
                              ctaButton: { ...header.ctaButton, customBgColor: e.target.value }
                            })}
                            className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={header.ctaButton?.customBgColor || '#0F4761'}
                            onChange={(e) => setHeader({
                              ...header,
                              ctaButton: { ...header.ctaButton, customBgColor: e.target.value }
                            })}
                            className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Özel Yazı Rengi</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={header.ctaButton?.customTextColor || '#ffffff'}
                            onChange={(e) => setHeader({
                              ...header,
                              ctaButton: { ...header.ctaButton, customTextColor: e.target.value }
                            })}
                            className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={header.ctaButton?.customTextColor || '#ffffff'}
                            onChange={(e) => setHeader({
                              ...header,
                              ctaButton: { ...header.ctaButton, customTextColor: e.target.value }
                            })}
                            className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Boyut & İç Dolgular (Padding & Font Size) */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    Boyut & İç Boşluklar (Padding)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Yatay Dolgu */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">Yatay Dolgu (Padding X)</label>
                        <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {header.ctaButton?.paddingX ?? 18} px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="36"
                        step="1"
                        value={header.ctaButton?.paddingX ?? 18}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, paddingX: Number(e.target.value) }
                        })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Butonun sağ ve sol iç genişliği</span>
                    </div>

                    {/* Dikey Dolgu */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">Dikey Dolgu (Padding Y)</label>
                        <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {header.ctaButton?.paddingY ?? 10} px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="18"
                        step="1"
                        value={header.ctaButton?.paddingY ?? 10}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, paddingY: Number(e.target.value) }
                        })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Butonun alt ve üst iç yüksekliği</span>
                    </div>

                    {/* Yazı Boyutu */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">Yazı Boyutu (Font Size)</label>
                        <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {header.ctaButton?.fontSize ?? 13} px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="11"
                        max="18"
                        step="1"
                        value={header.ctaButton?.fontSize ?? 13}
                        onChange={(e) => setHeader({
                          ...header,
                          ctaButton: { ...header.ctaButton, fontSize: Number(e.target.value) }
                        })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Metin puntoları</span>
                    </div>
                  </div>
                </div>

                {/* 5. Canlı Simülatör & Görsel Önizleme Kartı */}
                <div className="p-4 rounded-xl border border-gray-200 bg-linear-to-r from-gray-50 via-white to-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      Anlık Canlı Önizleme (Navbar Sağ Ucu Simülasyonu)
                    </h4>
                    <span className="text-[10px] text-gray-500">
                      Ayarlar anında yansıtılır
                    </span>
                  </div>

                  <div className="p-6 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-between overflow-x-auto">
                    {/* Sol taraf simülasyonu (Menü ucu) */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium select-none">
                      <span>... Über uns</span>
                      <span>ESF+ Alpha</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-[11px] text-blue-500 font-mono">
                        ← {header.ctaButton?.marginLeft ?? 20}px emniyet →
                      </span>
                    </div>

                    {/* Sağ taraf (Aksiyon Butonu) */}
                    <div 
                      className="flex items-center shrink-0"
                      style={{
                        marginRight: `${header.ctaButton?.marginRight ?? 0}px`
                      }}
                    >
                      {(() => {
                        const cta = header.ctaButton;
                        const ctaText = cta?.text || 'Kontakt & Anmeldung';
                        const ctaRadiusClass = 
                          cta?.borderRadius === 'square' ? 'rounded-md' :
                          cta?.borderRadius === 'rounded' ? 'rounded-xl' :
                          'rounded-full';

                        let ctaStyleClass = 'flatsome-button text-white shadow-sm';
                        if (cta?.style === 'accent') {
                          ctaStyleClass = 'bg-accent text-white shadow-sm';
                        } else if (cta?.style === 'outline') {
                          ctaStyleClass = 'border-2 border-primary text-primary bg-white';
                        } else if (cta?.style === 'custom') {
                          ctaStyleClass = 'shadow-sm';
                        }

                        const inlineStyle: React.CSSProperties = {
                          paddingLeft: `${cta?.paddingX ?? 18}px`,
                          paddingRight: `${cta?.paddingX ?? 18}px`,
                          paddingTop: `${cta?.paddingY ?? 10}px`,
                          paddingBottom: `${cta?.paddingY ?? 10}px`,
                          fontSize: `${cta?.fontSize ?? 13}px`,
                          ...(cta?.style === 'custom' ? {
                            backgroundColor: cta.customBgColor || '#0F4761',
                            color: cta.customTextColor || '#ffffff'
                          } : {})
                        };

                        return (
                          <div 
                            className={`font-bold transition-all flex items-center justify-center cursor-pointer select-none ${ctaRadiusClass} ${ctaStyleClass}`}
                            style={inlineStyle}
                          >
                            {cta?.icon === 'mail' && <Mail className="w-3.5 h-3.5 mr-1.5" />}
                            {cta?.icon === 'phone' && <Phone className="w-3.5 h-3.5 mr-1.5" />}
                            {cta?.icon === 'sparkles' && <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />}
                            <span>{ctaText}</span>
                            {cta?.icon === 'arrow' && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                            {cta?.icon === 'send' && <Send className="w-3.5 h-3.5 ml-1.5" />}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                Aksiyon butonu şu anda devre dışı. Aktif etmek için yukarıdaki "Butonu Göster" seçeneğini açabilirsiniz.
              </div>
            )}
          </div>

          {/* Header Styling */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">5. Header Tasarımı & Renkler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Üst Bar Arkaplan</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={header.design?.topBarBg?.startsWith('#') ? header.design.topBarBg : '#0F4761'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, topBarBg: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={header.design?.topBarBg || ''}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, topBarBg: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Üst Bar Yazı Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={header.design?.topBarText?.startsWith('#') ? header.design.topBarText : '#ffffff'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, topBarText: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={header.design?.topBarText || ''}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, topBarText: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ana Menü Arkaplan</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={header.design?.navBg?.startsWith('#') ? header.design.navBg : '#ffffff'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navBg: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={header.design?.navBg || ''}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navBg: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

                <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ana Menü Yazı Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={header.design?.navText?.startsWith('#') ? header.design.navText : '#333333'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navText: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={header.design?.navText || ''}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navText: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Menü Hover / Aktif Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={header.design?.navHoverText?.startsWith('#') ? header.design.navHoverText : '#0F4761'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navHoverText: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={header.design?.navHoverText || '#0F4761'}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navHoverText: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Menü Yazı Boyutu (px)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={10}
                    max={20}
                    step={0.5}
                    placeholder="Otomatik"
                    value={header.design?.navFontSize || ''}
                    onChange={(e) => setHeader({ ...header, design: { ...header.design, navFontSize: e.target.value ? parseFloat(e.target.value) : undefined } })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Boş bırakılırsa dinamik orantılanır.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Menü Yazı Kalınlığı</label>
                <select
                  value={header.design?.navFontWeight || 'semibold'}
                  onChange={(e) => setHeader({ ...header, design: { ...header.design, navFontWeight: e.target.value as any } })}
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                >
                  <option value="normal">Normal (400)</option>
                  <option value="medium">Orta / Medium (500)</option>
                  <option value="semibold">Yarı Kalın / Semibold (600)</option>
                  <option value="bold">Kalın / Bold (700)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Menü Yerleşimi (Layout)</label>
                <select
                  value={header.design?.navLayout || 'space-between'}
                  onChange={(e) => setHeader({ ...header, design: { ...header.design, navLayout: e.target.value as any } })}
                  className="w-full border rounded-lg p-2.5 text-sm bg-white"
                >
                  <option value="space-between">Dengeli / Aralıklı (Logo Sola, Menü Ortada, Buton Sağa)</option>
                  <option value="center">Ortalanmış Menü (Menü Ortada)</option>
                  <option value="left">Sola Yaslı (Logodan Sonra Güvenlik Mesafesiyle Başlar)</option>
                  <option value="right">Sağa Yaslı (Aksiyon Butonuna Yakın)</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">Geniş ekranlarda menünün logonun ve butonun etrafında nasıl hizalanacağını belirler.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Boşluk / Mesafe (Gap - px)</label>
                <input
                  type="number"
                  value={header.design?.navGap ?? 24}
                  onChange={(e) => setHeader({ ...header, design: { ...header.design, navGap: parseInt(e.target.value) || 0 } })}
                  placeholder="24"
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">Sola/Sağa yaslı durumlarda veya öğeler arası genel boşluk (Örn: 24 veya 32).</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={header.design?.isSticky ?? true}
                  onChange={(e) => setHeader({ ...header, design: { ...header.design, isSticky: e.target.checked } })}
                  className="rounded text-blue-600 h-4 w-4"
                />
                <span>Sayfa kaydırıldığında menü yukarıda sabit kalsın (Sticky Header)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={header.design?.showDropdownArrows ?? false}
                  onChange={(e) => setHeader({ ...header, design: { ...header.design, showDropdownArrows: e.target.checked } })}
                  className="rounded text-blue-600 h-4 w-4"
                />
                <span>Açılır menü yön oklarını (▼) göster</span>
              </label>
            </div>

            {/* Header Ekran Genişliği (Full Width vs Boxed) */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Header Genişliği & Kenar Düzeni (Layout Width)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHeader({
                    ...header,
                    design: { ...header.design, fullWidth: true }
                  })}
                  className={`p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                    (header.design?.fullWidth ?? true)
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-blue-100 rounded text-blue-700 mt-0.5 shrink-0">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Tam Genişlik (Kenardan Kenara - 100%)</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Logo sayfanın en soluna, aksiyon butonu en sağına tam yaslanır. Belirlediğiniz 0 px veya özel mesafe değerleri doğrudan sayfa sınırına uygulanır.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHeader({
                    ...header,
                    design: { ...header.design, fullWidth: false }
                  })}
                  className={`p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                    !(header.design?.fullWidth ?? true)
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-gray-100 rounded text-gray-700 mt-0.5 shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Kutulu / Sınırlı (Boxed - 1600px)</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Tüm header içeriği 1600px genişliğinde ortalanır. Geniş ekranlarda logonun solunda ve butonun sağında otomatik boşluk oluşur.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Live Interactive Header Preview */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">6. Canlı İnteraktif Header & Alt Menü Önizlemesi</h2>
                  <p className="text-xs text-gray-500">
                    Fareyi menü öğelerinin üzerine getirerek oluşturduğunuz açılır alt menülerin (dropdown), ikonların ve açıklamaların nasıl göründüğünü anlık test edin.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={13} /> Canlı Önizleme
              </span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-visible shadow-inner bg-gray-100/60 p-4">
              <div className="bg-white rounded-xl shadow-md overflow-visible relative min-h-[360px]">
                <Header config={header} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER TAB */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* About Column with Logo & Branding */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="border-b pb-3">
              <h2 className="text-lg font-bold text-gray-900">1. Tanıtım, Kurumsal Logo & İletişim Bilgileri (1. Sütun)</h2>
              <p className="text-xs text-gray-500 mt-0.5">Footer'ın en sol sütunundaki kurumsal logo, başlık, tanıtım metni ve iletişim alanlarını düzenleyin.</p>
            </div>

            {/* Sütun Başlığı & Logo Konfigürasyon Kutusu */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Logo & Sütun Başlığı Yerleşimi</span>
              </div>

              {/* Logo Görseli ve Dosya Yükleme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Logo Görsel URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={footer.about?.logoUrl || ''}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, logoUrl: e.target.value } })}
                      placeholder="/logo.png"
                      className="flex-1 border bg-white rounded-lg p-2.5 text-sm"
                    />
                    <label className={`cursor-pointer border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${isUploadingFooterLogo ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      {isUploadingFooterLogo ? 'Yükleniyor...' : 'Dosya Seç'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={isUploadingFooterLogo}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFooterLogoUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Görsel seçebilir veya /logo.png gibi bir adres belirtebilirsiniz.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sütun Başlık Metni</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={footer.about?.title || ''}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, title: e.target.value } })}
                      placeholder="Über den Lernzirkel"
                      className="flex-1 border bg-white rounded-lg p-2.5 text-sm"
                    />
                    <label className="flex items-center space-x-2 text-xs text-gray-700 bg-white border rounded-lg px-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={footer.about?.showTitle ?? true}
                        onChange={(e) => setFooter({ ...footer, about: { ...footer.about, showTitle: e.target.checked } })}
                        className="rounded text-blue-600 h-3.5 w-3.5"
                      />
                      <span className="whitespace-nowrap font-medium">Metni Göster</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo Görünürlük ve Yerleşim Parametreleri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Konumu (Yerleşim)</label>
                  <select
                    value={footer.about?.logoPosition || 'above-title'}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, logoPosition: e.target.value as any } })}
                    className="w-full border bg-white rounded-lg p-2 text-xs"
                  >
                    <option value="above-title">Başlığın Üstünde</option>
                    <option value="inline">Başlığın Yanında (Yatay)</option>
                    <option value="replace-title">Sadece Logo (Başlık Yerine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Genişliği (px)</label>
                  <input
                    type="number"
                    value={footer.about?.logoWidth || 160}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, logoWidth: parseInt(e.target.value) || 160 } })}
                    placeholder="160"
                    className="w-full border bg-white rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Yüksekliği (px)</label>
                  <input
                    type="number"
                    value={footer.about?.logoHeight || 52}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, logoHeight: parseInt(e.target.value) || 52 } })}
                    placeholder="52"
                    className="w-full border bg-white rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Alt Boşluk (px)</label>
                  <input
                    type="number"
                    value={footer.about?.logoMarginBottom ?? 16}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, logoMarginBottom: parseInt(e.target.value) || 0 } })}
                    placeholder="16"
                    className="w-full border bg-white rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.about?.showLogo ?? true}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, showLogo: e.target.checked } })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span>1. Sütunda Logoyu Aktif Et / Göster</span>
                </label>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 font-medium">Hizalama:</span>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="footerLogoAlign"
                      value="left"
                      checked={(footer.about?.logoAlign || 'left') === 'left'}
                      onChange={() => setFooter({ ...footer, about: { ...footer.about, logoAlign: 'left' } })}
                      className="text-blue-600"
                    />
                    <span>Sola Yaslı</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="footerLogoAlign"
                      value="center"
                      checked={footer.about?.logoAlign === 'center'}
                      onChange={() => setFooter({ ...footer, about: { ...footer.about, logoAlign: 'center' } })}
                      className="text-blue-600"
                    />
                    <span>Ortalanmış</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Diğer Bilgiler: Tanıtım Metni, Adres, Telefon, E-Posta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tanıtım Metni</label>
                <textarea
                  rows={3}
                  value={footer.about?.text || ''}
                  onChange={(e) => setFooter({ ...footer, about: { ...footer.about, text: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              {/* Adres & Google Maps Konum Yönetimi */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Adres & Google Maps Konum Ayarları
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Footer'da yer alacak kurum adresini girin ve ziyaretçilerin Maps üzerinde haritada görebilmesini sağlayın.
                      </p>
                    </div>
                  </div>

                  {footer.about?.address && (
                    <a
                      href={footer.about?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footer.about.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-xs transition-colors self-start sm:self-auto"
                      title="Bu adresi yeni sekmede Google Maps üzerinde aç"
                    >
                      <span>Google Maps'te Aç</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kurum Adresi</label>
                  <input
                    type="text"
                    value={footer.about?.address || ''}
                    onChange={(e) => setFooter({ ...footer, about: { ...footer.about, address: e.target.value } })}
                    placeholder="Örn: Ludwigsplatz 9a, 67059 Ludwigshafen"
                    className="w-full border bg-white rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Footer'da görüntülenir. Ziyaretçiler adrese veya yanındaki harita butonuna tıkladığında otomatik olarak bu konuma gider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Özel Google Maps Bağlantısı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={footer.about?.mapsUrl || ''}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, mapsUrl: e.target.value } })}
                      placeholder="Boş bırakılırsa yukarıdaki adresten otomatik üretilir"
                      className="w-full border bg-white rounded-lg p-2 text-xs font-mono"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Google İşletme profilinizin tam paylaşım linkini yapıştırabilirsiniz.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Haritada Göster Buton / Link Metni</label>
                    <input
                      type="text"
                      value={footer.about?.mapsLinkText ?? 'Auf Google Maps anzeigen'}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, mapsLinkText: e.target.value } })}
                      placeholder="Auf Google Maps anzeigen"
                      className="w-full border bg-white rounded-lg p-2 text-xs"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Adresin hemen yanında/altında beliren harita butonunun yazısı.</p>
                  </div>
                </div>

                {/* Switch Seçenekleri */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-5 text-xs">
                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={footer.about?.showMapsLink ?? true}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, showMapsLink: e.target.checked } })}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>"Haritada Göster" (Maps Link) Butonunu Göster</span>
                  </label>

                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={footer.about?.showMapEmbed ?? false}
                      onChange={(e) => setFooter({ ...footer, about: { ...footer.about, showMapEmbed: e.target.checked } })}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>Footer 1. Sütunda Gömülü Harita (Mini Map) Göster</span>
                  </label>

                  {(footer.about?.showMapEmbed ?? false) && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-[11px] text-gray-500 font-semibold">Harita Yüksekliği:</span>
                      <input
                        type="number"
                        min="100"
                        max="300"
                        step="10"
                        value={footer.about?.mapEmbedHeight || 160}
                        onChange={(e) => setFooter({ ...footer, about: { ...footer.about, mapEmbedHeight: parseInt(e.target.value) || 160 } })}
                        className="w-16 border bg-white rounded p-1 text-xs text-center font-bold"
                      />
                      <span className="text-[11px] text-gray-400">px</span>
                    </div>
                  )}
                </div>

                {/* Admin Canlı Google Maps Önizleme Kartı */}
                {footer.about?.address && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MapPin size={13} className="text-blue-600" />
                        <span>Canlı Harita Önizlemesi ({footer.about.address})</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Canlı Maps Senkronize
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-gray-100">
                      <iframe
                        title="Google Maps Admin Önizleme"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(footer.about.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon</label>
                <input
                  type="text"
                  value={footer.about?.phone || ''}
                  onChange={(e) => setFooter({ ...footer, about: { ...footer.about, phone: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">E-Posta</label>
                <input
                  type="text"
                  value={footer.about?.email || ''}
                  onChange={(e) => setFooter({ ...footer, about: { ...footer.about, email: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">2. Hızlı Erişim Bağlantıları (2. Sütun)</h2>
                <p className="text-xs text-gray-500">Footer'daki hızlı erişim menüsünü düzenleyin.</p>
              </div>
              <button
                type="button"
                onClick={addFooterLink}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Yeni Link Ekle
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sütun Başlığı</label>
              <input
                type="text"
                value={footer.quickLinks?.title || ''}
                onChange={(e) => setFooter({ ...footer, quickLinks: { ...footer.quickLinks, title: e.target.value } })}
                className="w-full max-w-sm border rounded-lg p-2.5 text-sm"
              />
            </div>

            <div className="space-y-3">
              {footer.quickLinks?.links?.map((link, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="Link Başlığı"
                    value={link.label}
                    onChange={(e) => updateFooterLink(idx, 'label', e.target.value)}
                    className="flex-1 border rounded px-3 py-1.5 text-sm bg-white"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateFooterLink(idx, 'url', e.target.value)}
                    className="flex-1 border rounded px-3 py-1.5 text-sm bg-white"
                  />
                  <label className="flex items-center space-x-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={link.isExternal ?? false}
                      onChange={(e) => updateFooterLink(idx, 'isExternal', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Dış Bağlantı</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeFooterLink(idx)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Badges / Certification bar */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">3. Sertifikalar & Destekçiler Bandı</h2>
                <p className="text-xs text-gray-500">
                  Footer üzerinde gösterilen partner logolarını, sertifika ve destekçi kurumları yerelden yükleyerek veya link ekleyerek yönetin.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadDefaultPartners}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors"
                  title="Örnek partnerleri (BAMF, AZAV, ESF+, vb.) geri yükle"
                >
                  Varsayılanları Yükle
                </button>
                <button
                  type="button"
                  onClick={addPartner}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus size={15} /> Yeni Logo / Partner Ekle
                </button>
              </div>
            </div>

            {/* Bant Başlığı ve Başlık Gösterimi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bant Başlığı Metni</label>
                <input
                  type="text"
                  value={footer.badges?.title || ''}
                  onChange={(e) => setFooter({ ...footer, badges: { ...footer.badges, title: e.target.value } })}
                  placeholder="Zertifiziert & Gefördert durch:"
                  className="w-full border bg-white rounded-lg p-2.5 text-sm"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.badges?.showTitle !== false}
                    onChange={(e) => setFooter({ ...footer, badges: { ...footer.badges, showTitle: e.target.checked } })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span>Bant Başlığını Göster</span>
                </label>
              </div>
            </div>

            {/* Partner Kartları Listesi */}
            <div className="space-y-3 pt-1">
              {(!footer.badges?.partners || footer.badges.partners.length === 0) ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                  <p className="text-sm font-medium">Henüz logo veya partner eklenmemiş.</p>
                  <button
                    type="button"
                    onClick={addPartner}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={14} /> İlk Partner Logosunu Ekle
                  </button>
                </div>
              ) : (
                footer.badges.partners.map((partner, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
                    {/* Kart Tepe Çubuğu: Sıra & Butonlar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-sm text-gray-800">
                          {partner.name || `Partner #${idx + 1}`}
                        </span>
                        {partner.logoUrl ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                            Görsel Yüklendi
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                            Metin Rozet
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => movePartner(idx, -1)}
                          disabled={idx === 0}
                          title="Yukarı Taşı"
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePartner(idx, 1)}
                          disabled={idx === (footer.badges?.partners?.length || 0) - 1}
                          title="Aşağı Taşı"
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePartner(idx)}
                          title="Sil"
                          className="p-1 text-red-500 hover:text-red-700 ml-1.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Kart Gövdesi: Local Logo Yükleme & Bilgiler */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Logo Görseli & Local Yükleme (5 Kolon) */}
                      <div className="md:col-span-5 space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">Logo Görseli (Local Yükle)</label>
                        
                        <div className="flex items-center gap-3">
                          {/* Görsel Önizleme Kutusu */}
                          <div className="w-20 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                            {partner.logoUrl ? (
                              <Image 
                                src={partner.logoUrl} 
                                alt={partner.name || "Logo"} 
                                width={72} 
                                height={44} 
                                className="object-contain max-h-12 w-auto" 
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            )}
                          </div>

                          {/* Dosya Seç Butonu & URL */}
                          <div className="flex-1 space-y-1.5">
                            <label className={`inline-flex items-center justify-center gap-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${uploadingPartnerIdx === idx ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-2xs'}`}>
                              <Upload size={14} className="text-blue-600" />
                              <span>{uploadingPartnerIdx === idx ? 'Yükleniyor...' : 'Localden Logo Seç'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                disabled={uploadingPartnerIdx === idx}
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePartnerLogoUpload(idx, file);
                                }}
                              />
                            </label>

                            {partner.logoUrl && (
                              <button
                                type="button"
                                onClick={() => updatePartner(idx, 'logoUrl', '')}
                                className="text-[11px] text-red-500 hover:text-red-700 block text-right w-full"
                              >
                                Logoyu Kaldır (Metin Yap)
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Manuel URL Girişi (opsiyonel) */}
                        <input
                          type="text"
                          placeholder="Logo Görsel Adresi (/uploads/... veya https://...)"
                          value={partner.logoUrl || ''}
                          onChange={(e) => updatePartner(idx, 'logoUrl', e.target.value)}
                          className="w-full border rounded-lg px-2.5 py-1.5 text-xs text-gray-600 bg-gray-50/50"
                        />
                      </div>

                      {/* Partner / Sertifika Bilgileri (7 Kolon) */}
                      <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Partner / Sertifika Adı</label>
                          <input
                            type="text"
                            placeholder="Örn: BAMF, telc, AZAV"
                            value={partner.name}
                            onChange={(e) => updatePartner(idx, 'name', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Web Bağlantısı (Opsiyonel URL)</label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              placeholder="https://www.bamf.de"
                              value={partner.url || ''}
                              onChange={(e) => updatePartner(idx, 'url', e.target.value)}
                              className="w-full border rounded-lg px-3 py-1.5 text-xs bg-white"
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Ziyaretçi logoya tıkladığında bu sayfaya yönlendirilir.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Genişlik (px)</label>
                          <input
                            type="number"
                            placeholder="120"
                            value={partner.width || 120}
                            onChange={(e) => updatePartner(idx, 'width', parseInt(e.target.value) || 120)}
                            className="w-full border rounded-lg px-2.5 py-1 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Yükseklik (px)</label>
                          <input
                            type="number"
                            placeholder="40"
                            value={partner.height || 40}
                            onChange={(e) => updatePartner(idx, 'height', parseInt(e.target.value) || 40)}
                            className="w-full border rounded-lg px-2.5 py-1 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Opening Hours & Departments */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  <span>4. Departmanlar & Çalışma Saatleri (Öffnungszeiten)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Footer ve İletişim sayfasında yer alan departman bazlı çalışma saatleri (Bildung, Dil Kursu, MFD vb.).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={loadDefaultOpeningHours}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Bildung & Nachhilfe, Sprache & Integration ve MFD şablonunu yükler"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Örnek Şablonu Yükle</span>
                </button>
                <button
                  type="button"
                  onClick={addDepartment}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus size={15} />
                  <span>Departman Ekle</span>
                </button>
              </div>
            </div>

            {/* Title & Visibility Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bölüm Başlığı (Almanca)
                </label>
                <input
                  type="text"
                  value={footer.openingHours?.title || ''}
                  onChange={(e) => setFooter({
                    ...footer,
                    openingHours: {
                      ...footer.openingHours,
                      title: e.target.value
                    }
                  })}
                  placeholder="Öffnungszeiten"
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                />
              </div>
              <div className="flex items-center sm:pt-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.openingHours?.showTitle ?? true}
                    onChange={(e) => setFooter({
                      ...footer,
                      openingHours: {
                        ...footer.openingHours,
                        showTitle: e.target.checked
                      }
                    })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span>Başlığı Footer'da Göster</span>
                </label>
              </div>
            </div>

            {/* Department List */}
            <div className="space-y-4">
              {(!footer.openingHours?.departments || footer.openingHours.departments.length === 0) ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Henüz departman çalışma saati tanımlanmadı</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Yukarıdaki "Örnek Şablonu Yükle" butonuna tıklayarak Bildung, Sprache ve MFD departmanlarını anında getirebilirsiniz.
                  </p>
                  <button
                    type="button"
                    onClick={loadDefaultOpeningHours}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-xs hover:bg-blue-700 transition-colors"
                  >
                    Örnek Departmanları Yükle
                  </button>
                </div>
              ) : (
                footer.openingHours.departments.map((dept, dIdx) => (
                  <div key={dIdx} className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 hover:border-gray-300 transition-colors">
                    {/* Header: Title + Reorder + Delete */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                          #{dIdx + 1}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {dept.name || 'İsimsiz Departman'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveDepartment(dIdx, -1)}
                          disabled={dIdx === 0}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded border border-gray-200 disabled:opacity-30 transition-colors"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDepartment(dIdx, 1)}
                          disabled={dIdx === (footer.openingHours?.departments?.length || 1) - 1}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded border border-gray-200 disabled:opacity-30 transition-colors"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDepartment(dIdx)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors ml-1"
                          title="Departmanı Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Department Name & Note Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Departman / Birim Adı
                        </label>
                        <input
                          type="text"
                          value={dept.name || ''}
                          onChange={(e) => updateDepartment(dIdx, 'name', e.target.value)}
                          placeholder="Örn: Bildung & Nachhilfe, Sprache & Integration, MFD"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Özel Not / Randevu Bilgisi (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={dept.note || ''}
                          onChange={(e) => updateDepartment(dIdx, 'note', e.target.value)}
                          placeholder="Örn: Nur nach Terminvereinbarung, Offene Sprechstunde"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Quick helper */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Günlük Çalışma Saatleri (7 Gün)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyHoursToWeekdays(dIdx, 0)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                        title="Pazartesi günü saatini Salı, Çarşamba, Perşembe ve Cuma günlerine eşitler"
                      >
                        <Copy size={13} />
                        <span>Pazartesi Saatini Mo-Fr'ye Kopyala</span>
                      </button>
                    </div>

                    {/* 7 Days Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {dept.hours?.map((hour, hIdx) => {
                        const dayLabels: Record<string, string> = {
                          Mo: 'Pzt (Mo)',
                          Di: 'Sal (Di)',
                          Mi: 'Çar (Mi)',
                          Do: 'Per (Do)',
                          Fr: 'Cum (Fr)',
                          Sa: 'Cmt (Sa)',
                          So: 'Paz (So)'
                        };
                        const label = dayLabels[hour.day] || hour.day;

                        return (
                          <div 
                            key={hIdx}
                            className={`p-2.5 rounded-lg border text-xs transition-colors ${
                              hour.isClosed 
                                ? 'bg-gray-100/80 border-gray-200 text-gray-400' 
                                : 'bg-white border-gray-200 shadow-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-gray-800">{label}</span>
                              <label className="flex items-center gap-1 cursor-pointer text-[11px] font-medium text-gray-500 hover:text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={hour.isClosed || false}
                                  onChange={(e) => updateDepartmentHour(dIdx, hIdx, 'isClosed', e.target.checked)}
                                  className="rounded text-red-600 h-3 w-3"
                                />
                                <span>Kapalı</span>
                              </label>
                            </div>

                            {hour.isClosed ? (
                              <div className="text-[11px] text-gray-400 italic py-1 text-center bg-gray-50 rounded">
                                Geschlossen (Kapalı)
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-1.5 items-center">
                                <div>
                                  <input
                                    type="text"
                                    value={hour.openTime || ''}
                                    onChange={(e) => updateDepartmentHour(dIdx, hIdx, 'openTime', e.target.value)}
                                    placeholder="14:00"
                                    className="w-full border rounded px-1.5 py-1 text-center font-mono text-xs bg-gray-50 focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={hour.closeTime || ''}
                                    onChange={(e) => updateDepartmentHour(dIdx, hIdx, 'closeTime', e.target.value)}
                                    placeholder="19:00"
                                    className="w-full border rounded px-1.5 py-1 text-center font-mono text-xs bg-gray-50 focus:bg-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Donate card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">5. Destek & Bağış Kartı</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kart Başlığı</label>
                <input
                  type="text"
                  value={footer.donateBlock?.title || ''}
                  onChange={(e) => setFooter({ ...footer, donateBlock: { ...footer.donateBlock, title: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={footer.donateBlock?.buttonText || ''}
                  onChange={(e) => setFooter({ ...footer, donateBlock: { ...footer.donateBlock, buttonText: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={footer.donateBlock?.text || ''}
                  onChange={(e) => setFooter({ ...footer, donateBlock: { ...footer.donateBlock, text: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Buton Hedef URL</label>
                <input
                  type="text"
                  value={footer.donateBlock?.buttonUrl || ''}
                  onChange={(e) => setFooter({ ...footer, donateBlock: { ...footer.donateBlock, buttonUrl: e.target.value } })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Legal and Copyright */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">6. Telif & Yasal Bağlantılar</h2>
                <p className="text-xs text-gray-500">{'{year}'} otomatik olarak geçerli yılı yansıtır.</p>
              </div>
              <button
                type="button"
                onClick={addLegalLink}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Yasal Link Ekle
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Telif Hakkı Metni</label>
              <input
                type="text"
                value={footer.copyright || ''}
                onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm"
              />
            </div>

            <div className="space-y-3">
              {footer.legalLinks?.map((link, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="Link Başlığı (Örn: Impressum)"
                    value={link.label}
                    onChange={(e) => updateLegalLink(idx, 'label', e.target.value)}
                    className="flex-1 border rounded px-3 py-1.5 text-sm bg-white"
                  />
                  <input
                    type="text"
                    placeholder="URL (Örn: /impressum)"
                    value={link.url}
                    onChange={(e) => updateLegalLink(idx, 'url', e.target.value)}
                    className="flex-1 border rounded px-3 py-1.5 text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeLegalLink(idx)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Styling */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">7. Footer Renkleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Arkaplan Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={footer.design?.backgroundColor?.startsWith('#') ? footer.design.backgroundColor : '#111111'}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, backgroundColor: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footer.design?.backgroundColor || ''}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, backgroundColor: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Metin Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={footer.design?.textColor?.startsWith('#') ? footer.design.textColor : '#9ca3af'}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, textColor: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footer.design?.textColor || ''}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, textColor: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Başlık Rengi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={footer.design?.headingColor?.startsWith('#') ? footer.design.headingColor : '#ffffff'}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, headingColor: e.target.value } })}
                    className="h-9 w-9 rounded border p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footer.design?.headingColor || ''}
                    onChange={(e) => setFooter({ ...footer, design: { ...footer.design, headingColor: e.target.value } })}
                    className="flex-1 border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Footer Preview */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">7. Canlı İnteraktif Footer Önizlemesi</h2>
                  <p className="text-xs text-gray-500">
                    Belirlediğiniz logo yerleşimi, başlık, iletişim bilgileri, hızlı linkler ve renklerin sitede nasıl görüneceğini anlık test edin.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={13} /> Canlı Önizleme
              </span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-gray-100/60 p-4">
              <div 
                className="rounded-xl p-8 text-sm transition-colors"
                style={{ 
                  backgroundColor: footer.design?.backgroundColor || '#111111',
                  color: footer.design?.textColor || '#9ca3af'
                }}
              >
                {/* Sertifikalar & Destekçiler Bandı (Canlı Önizleme) */}
                {footer.badges && ((footer.badges.partners && footer.badges.partners.length > 0) || (footer.badges.items && footer.badges.items.length > 0)) && (
                  <div className="bg-white rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center justify-center md:space-x-8 space-y-4 md:space-y-0 shadow-sm border border-gray-100 text-gray-800">
                    {footer.badges.showTitle !== false && (
                      <p className="font-bold uppercase tracking-wider text-center md:text-left text-gray-700 text-xs shrink-0">
                        {footer.badges.title || "Zertifiziert & Gefördert durch:"}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                      {footer.badges.partners && footer.badges.partners.length > 0 ? (
                        footer.badges.partners.map((partner, idx) => (
                          <div key={idx} className="flex items-center">
                            {partner.logoUrl ? (
                              <div className="p-1.5 rounded-lg bg-gray-50/90 border border-gray-100 flex items-center justify-center shadow-2xs hover:scale-105 transition-transform" title={partner.name}>
                                <Image
                                  src={partner.logoUrl}
                                  alt={partner.name || "Partner Logo"}
                                  width={partner.width || 100}
                                  height={partner.height || 36}
                                  className="object-contain max-h-9 w-auto"
                                  style={{
                                    maxWidth: partner.width ? `${partner.width}px` : '120px',
                                    maxHeight: partner.height ? `${partner.height}px` : '40px',
                                    height: 'auto'
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-8 px-3 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xs rounded-md shadow-2xs">
                                {partner.name}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        footer.badges.items?.map((b, i) => (
                          <div key={i} className="h-8 px-3 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xs rounded-md shadow-2xs">
                            {b}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Sütunlar Izgarası */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {/* 1. Sütun (Logo + Başlık + Tanıtım) */}
                  <div className={footer.about?.logoAlign === 'center' ? 'text-center md:text-left' : ''}>
                    {/* Logo */}
                    {footer.about?.showLogo !== false && footer.about?.logoUrl && (
                      <div 
                        className={`flex items-center ${
                          footer.about?.logoAlign === 'center' ? 'justify-center md:justify-start' : 'justify-start'
                        } ${footer.about?.logoPosition === 'inline' ? 'mb-4 gap-3' : ''}`}
                        style={{
                          marginBottom: footer.about?.logoPosition === 'inline' 
                            ? undefined 
                            : `${footer.about?.logoMarginBottom ?? 16}px`
                        }}
                      >
                        <Image 
                          src={footer.about.logoUrl} 
                          alt={footer.about.title || "Footer Logo"} 
                          width={footer.about.logoWidth || 160} 
                          height={footer.about.logoHeight || 52} 
                          className="object-contain max-h-16 w-auto"
                          style={{ 
                            maxWidth: footer.about.logoWidth ? `${footer.about.logoWidth}px` : '160px',
                            height: footer.about.logoHeight ? `${footer.about.logoHeight}px` : 'auto'
                          }}
                        />

                        {footer.about?.logoPosition === 'inline' && footer.about?.showTitle !== false && footer.about?.title && (
                          <h4 
                            className="font-bold text-base uppercase tracking-wider"
                            style={{ color: footer.design?.headingColor || '#ffffff' }}
                          >
                            {footer.about.title}
                          </h4>
                        )}
                      </div>
                    )}

                    {/* Başlık Metni */}
                    {footer.about?.logoPosition !== 'inline' && 
                     footer.about?.logoPosition !== 'replace-title' && 
                     footer.about?.showTitle !== false && (
                      <h4 
                        className="font-bold text-base mb-3 uppercase tracking-wider"
                        style={{ color: footer.design?.headingColor || '#ffffff' }}
                      >
                        {footer.about?.title || "Über den Lernzirkel"}
                      </h4>
                    )}

                    <p className="mb-3 leading-relaxed opacity-90 text-xs">
                      {footer.about?.text || "Kurum tanıtım ve misyon metni..."}
                    </p>

                    <div className="space-y-1.5 text-xs opacity-90">
                      {footer.about?.address && <div>📍 {footer.about.address}</div>}
                      {footer.about?.phone && <div>📞 {footer.about.phone}</div>}
                      {footer.about?.email && <div>✉️ {footer.about.email}</div>}
                    </div>
                  </div>

                  {/* 2. Sütun (Hızlı Erişim) */}
                  <div>
                    <h4 
                      className="font-bold text-base mb-3 uppercase tracking-wider"
                      style={{ color: footer.design?.headingColor || '#ffffff' }}
                    >
                      {footer.quickLinks?.title || "Schnellzugriff"}
                    </h4>
                    <ul className="space-y-1.5 text-xs opacity-90">
                      {footer.quickLinks?.links?.slice(0, 6).map((l, i) => (
                        <li key={i} className="hover:underline cursor-pointer">
                          › {l.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Sütun (Çalışma Saatleri) */}
                  <div>
                    <h4 
                      className="font-bold text-base mb-3 uppercase tracking-wider"
                      style={{ color: footer.design?.headingColor || '#ffffff' }}
                    >
                      {footer.openingHours?.title || "Öffnungszeiten"}
                    </h4>
                    <div className="space-y-2 text-xs opacity-90">
                      {footer.openingHours?.departments && footer.openingHours.departments.length > 0 ? (
                        footer.openingHours.departments.map((dept, dIdx) => (
                          <div key={dIdx} className="bg-white/5 p-2.5 rounded border border-white/10">
                            <div className="font-semibold text-white mb-1">{dept.name || 'Departman'}</div>
                            {dept.note && (
                              <div className="text-[10px] text-amber-300 font-medium italic mb-1">
                                {dept.note}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              {dept.hours?.map((h, hIdx) => {
                                if (h.isClosed || (!h.openTime && !h.closeTime)) return null;
                                return (
                                  <div key={hIdx} className="flex justify-between text-gray-300 text-[11px]">
                                    <span>{h.day}:</span>
                                    <span>{h.openTime} - {h.closeTime} Uhr</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white/5 p-2.5 rounded border border-white/10 text-gray-400 italic">
                          Henüz departman eklenmedi.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Sütun (Bağış Kartı) */}
                  <div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <h4 
                        className="font-bold text-sm mb-1.5"
                        style={{ color: footer.design?.headingColor || '#ffffff' }}
                      >
                        {footer.donateBlock?.title || "Unterstützen Sie uns"}
                      </h4>
                      <p className="text-xs opacity-80 mb-3">
                        {footer.donateBlock?.text || "Ihre Spende hilft uns, Bildungschancen zu ermöglichen."}
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">
                        {footer.donateBlock?.buttonText || "Jetzt spenden"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alt Çizgi & Telif */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-80">
                  <div>
                    {(footer.copyright || '© {year} Lernzirkel e.V.').replace('{year}', new Date().getFullYear().toString())}
                  </div>
                  <div className="flex items-center space-x-4">
                    {footer.legalLinks?.map((l, i) => (
                      <span key={i} className="hover:underline cursor-pointer">
                        {l.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
