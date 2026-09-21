"use client";

import React, { useState } from "react";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { 
  Plus, GripVertical, Trash2, Settings, ChevronDown, ChevronUp, 
  Save, X, Eye, EyeOff, Copy, ExternalLink, Sliders, Type, 
  LayoutGrid, Image as ImageIcon, HelpCircle, BarChart3, 
  Code, Megaphone, Check, CheckCircle2, SplitSquareVertical, 
  Maximize2, Monitor, Palette, Star, Send, User, Award, Play, 
  Building, Download, Sparkles, Search, Filter, Layers, Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { AVAILABLE_ICONS } from "@/components/common/DynamicIcon";

interface Section {
  id: string;
  type: string;
  content: any;
  design: any;
  order: number;
  isHidden?: boolean;
}

interface PageProps {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  isPublished: boolean;
  parentId?: string | null;
  order?: number;
  parent?: { id: string; title: string; slug: string } | null;
  children?: { id: string; title: string; slug: string; order: number }[];
}

interface ParentOption {
  id: string;
  title: string;
  slug: string;
  parentId?: string | null;
}

export default function PageBuilder({ 
  page, 
  initialSections, 
  availableParents = [] 
}: { 
  page: PageProps; 
  initialSections: any[]; 
  availableParents?: ParentOption[];
}) {
  const router = useRouter();

  // Page meta state
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [description, setDescription] = useState(page.description || "");
  const [isPublished, setIsPublished] = useState(page.isPublished);
  const [parentId, setParentId] = useState<string | null>(page.parentId || null);
  const [order, setOrder] = useState<number>(page.order ?? 0);

  // Sections state
  const [sections, setSections] = useState<Section[]>(
    initialSections.sort((a, b) => a.order - b.order).map(s => ({
      ...s,
      content: typeof s.content === 'string' ? JSON.parse(s.content) : (s.content || {}),
      design: typeof s.design === 'string' ? JSON.parse(s.design) : (s.design || {}),
    }))
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sections.length > 0 ? sections[0].id : null
  );
  const [activeSubTab, setActiveSubTab] = useState<Record<string, 'content' | 'design'>>({});
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sectionSearch, setSectionSearch] = useState('');
  const [sectionCategory, setSectionCategory] = useState<'all' | 'form' | 'promo' | 'content' | 'social' | 'media'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper for subtabs
  const getSubTab = (id: string) => activeSubTab[id] || 'content';
  const setSubTab = (id: string, tab: 'content' | 'design') => {
    setActiveSubTab(prev => ({ ...prev, [id]: tab }));
  };

  // Section CRUD
  const addSection = (type: string) => {
    const newId = `sec_${Date.now()}`;
    const newSection: Section = {
      id: newId,
      type,
      content: getDefaultContent(type),
      design: getDefaultDesign(type),
      order: sections.length,
      isHidden: false
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
    setIsAddModalOpen(false);
  };

  const duplicateSection = (index: number) => {
    const source = sections[index];
    const newId = `sec_${Date.now()}`;
    const cloned: Section = {
      ...source,
      id: newId,
      content: JSON.parse(JSON.stringify(source.content)),
      design: JSON.parse(JSON.stringify(source.design)),
      order: index + 1
    };
    const updated = [...sections];
    updated.splice(index + 1, 0, cloned);
    updated.forEach((s, idx) => s.order = idx);
    setSections(updated);
    setActiveSectionId(newId);
  };

  const removeSection = (id: string) => {
    if (confirm("Bu bölümü silmek istediğinize emin misiniz?")) {
      const updated = sections.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx }));
      setSections(updated);
      if (activeSectionId === id) {
        setActiveSectionId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const toggleHideSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isHidden: !s.isHidden } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
    } else if (direction === 'down' && index < newSections.length - 1) {
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
    }
    newSections.forEach((s, i) => { s.order = i; });
    setSections(newSections);
  };

  const updateSectionData = (id: string, field: 'content' | 'design', subfield: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          [field]: {
            ...s[field],
            [subfield]: value
          } 
        };
      }
      return s;
    }));
  };

  // Card Grid / Features / Stats / FAQ Array Helpers
  const updateArrayItem = (secId: string, arrayKey: string, index: number, field: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        const list = [...(s.content[arrayKey] || [])];
        list[index] = { ...list[index], [field]: value };
        return { ...s, content: { ...s.content, [arrayKey]: list } };
      }
      return s;
    }));
  };

  const addArrayItem = (secId: string, arrayKey: string, defaultItem: any) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        const list = [...(s.content[arrayKey] || []), defaultItem];
        return { ...s, content: { ...s.content, [arrayKey]: list } };
      }
      return s;
    }));
  };

  const removeArrayItem = (secId: string, arrayKey: string, index: number) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        const list = [...(s.content[arrayKey] || [])];
        list.splice(index, 1);
        return { ...s, content: { ...s.content, [arrayKey]: list } };
      }
      return s;
    }));
  };

  // Save changes
  const savePage = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          isPublished,
          parentId,
          order,
          sections
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData?.details ? `Hata: ${errorData.details}` : (errorData?.error || "Kaydetme sırasında bir hata oluştu."));
      }
    } catch (e: any) {
      console.error(e);
      alert(`Sunucu ile iletişim hatası: ${e?.message || e}`);
    } finally {
      setIsSaving(false);
    }
  };

  const pageUrl = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">{title}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                {pageUrl}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {isPublished ? 'Yayında' : 'Taslak'}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode & Save Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center mr-2">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              title="Sadece Düzenleyici"
            >
              <Sliders size={14} />
              <span className="hidden sm:inline">Düzenle</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              title="Bölünmüş Görünüm"
            >
              <SplitSquareVertical size={14} />
              <span className="hidden sm:inline">Bölünmüş</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              title="Tam Önizleme"
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Önizleme</span>
            </button>
          </div>

          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="Canlı Sayfayı Aç"
          >
            <ExternalLink size={16} />
          </a>

          <button
            onClick={savePage}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isSaving ? 'Kaydediliyor...' : saveSuccess ? 'Kaydedildi ✓' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Page Meta Details Box */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Sayfa & Hiyerarşi Ayarları</h3>
            <p className="text-xs text-gray-500">Sayfanın başlığını, URL yolunu, üst sayfasını (ebeveyn) ve sıralamasını düzenleyin.</p>
          </div>
          {/* Breadcrumb Preview */}
          <div className="flex items-center text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
            <span className="font-semibold mr-1.5">Hiyerarşi:</span>
            <span>🏠 Startseite</span>
            {parentId && availableParents.find(p => p.id === parentId) && (
              <>
                <span className="mx-1 text-blue-400">›</span>
                <span className="font-medium">{availableParents.find(p => p.id === parentId)?.title}</span>
              </>
            )}
            <span className="mx-1 text-blue-400">›</span>
            <span className="font-bold underline">{title || 'Bu Sayfa'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sayfa Başlığı</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Örn: Ana Sayfa"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">URL (Slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={slug === 'home'}
              className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500 font-mono text-xs"
              placeholder="sayfa-adi"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Üst Sayfa (Parent)</label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              disabled={slug === 'home'}
              className="w-full border rounded-lg p-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">(Yok - Kök / Ana Sayfa)</option>
              {availableParents
                .filter(p => p.id !== page.id && p.slug !== 'home')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    📁 {p.title} (/{p.slug})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sıralama (Order)</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Açıklama (SEO / Meta)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Sayfanın arama motorlarında görünecek kısa açıklaması"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Yayın Durumu</label>
            <div className="pt-1.5 flex items-center space-x-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {isPublished ? 'Yayında' : 'Taslak (Gizli)'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area: Split or Full Views */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Editor Column */}
        {viewMode !== 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                Sayfa Bölümleri ({sections.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary-light text-white text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm font-medium"
              >
                <Plus size={16} /> Bölüm Ekle
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-700 mb-1">Bu sayfada henüz bölüm yok</h4>
                <p className="text-sm text-gray-500 mb-4">Aşağıdaki butona basarak ilk bölümünüzü ekleyin.</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg font-medium"
                >
                  Bölüm Ekle
                </button>
              </div>
            ) : (
              sections.map((section, index) => {
                const isActive = activeSectionId === section.id;
                const currentSubTab = getSubTab(section.id);

                return (
                  <div 
                    key={section.id} 
                    className={`bg-white rounded-xl border transition-all ${
                      isActive ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-gray-200 shadow-sm'
                    } ${section.isHidden ? 'opacity-60 bg-gray-50' : ''}`}
                  >
                    {/* Header */}
                    <div className="p-3.5 flex items-center justify-between gap-3 select-none">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                          {getSectionLabel(section.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {section.content?.title || section.content?.eyebrow || `Bölüm #${index + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button 
                          onClick={() => toggleHideSection(section.id)}
                          className={`p-1.5 rounded hover:bg-gray-100 ${section.isHidden ? 'text-amber-600' : 'text-gray-400'}`}
                          title={section.isHidden ? "Görünür Yap" : "Gizle"}
                        >
                          {section.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-20"
                          title="Yukarı Taşı"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-20"
                          title="Aşağı Taşı"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={() => duplicateSection(index)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400"
                          title="Klonla (Çoğalt)"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => setActiveSectionId(isActive ? null : section.id)}
                          className={`p-1.5 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                          title="Ayarları Aç/Kapat"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Edit Drawer */}
                    {isActive && (
                      <div className="border-t border-gray-200 p-5 bg-slate-50/50">
                        {/* Tab Switcher: İçerik vs Tasarım */}
                        <div className="flex border-b border-gray-200 mb-5">
                          <button
                            type="button"
                            onClick={() => setSubTab(section.id, 'content')}
                            className={`pb-2.5 px-4 text-sm font-semibold border-b-2 flex items-center gap-1.5 ${
                              currentSubTab === 'content'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <Type size={16} /> İçerik
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubTab(section.id, 'design')}
                            className={`pb-2.5 px-4 text-sm font-semibold border-b-2 flex items-center gap-1.5 ${
                              currentSubTab === 'design'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <Palette size={16} /> Tasarım & Stil
                          </button>
                        </div>

                        {/* CONTENT TAB */}
                        {currentSubTab === 'content' && (
                          <div className="space-y-4">
                            {/* HERO */}
                            {section.type === 'HERO' && (
                              <div className="space-y-4">
                                <Input label="Üst Rozet / Kicker (Opsiyonel)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                <Input label="Ana Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea label="Alt Başlık" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Arkaplan Görsel URL</label><ImageUploadInput value={section.content?.imageUrl || ""} onChange={v => updateSectionData(section.id, 'content', 'imageUrl', v)} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input label="1. Buton Metni" value={section.content?.buttonText} onChange={v => updateSectionData(section.id, 'content', 'buttonText', v)} />
                                  <Input label="1. Buton Linki" value={section.content?.buttonLink} onChange={v => updateSectionData(section.id, 'content', 'buttonLink', v)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input label="2. Buton Metni (Opsiyonel)" value={section.content?.secondaryButtonText} onChange={v => updateSectionData(section.id, 'content', 'secondaryButtonText', v)} />
                                  <Input label="2. Buton Linki" value={section.content?.secondaryButtonLink} onChange={v => updateSectionData(section.id, 'content', 'secondaryButtonLink', v)} />
                                </div>
                              </div>
                            )}

                            {/* CARD_GRID */}
                            {section.type === 'CARD_GRID' && (
                              <div className="space-y-4">
                                <Input label="Üst Başlık (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sütun Sayısı</label>
                                  <select 
                                    value={section.content?.columns || 3} 
                                    onChange={e => updateSectionData(section.id, 'content', 'columns', parseInt(e.target.value))}
                                    className="border rounded-lg p-2 text-sm bg-white"
                                  >
                                    <option value={2}>2 Sütun</option>
                                    <option value={3}>3 Sütun</option>
                                    <option value={4}>4 Sütun</option>
                                  </select>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Kartlar ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        title: 'Yeni Kart',
                                        description: 'Açıklama...',
                                        linkText: 'Daha Fazla',
                                        linkUrl: '/',
                                        icon: 'BookOpen'
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Kart Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((card: any, cIdx: number) => (
                                    <div key={cIdx} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', cIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                                        <input
                                          type="text"
                                          placeholder="Kart Başlığı"
                                          value={card.title || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', cIdx, 'title', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-medium"
                                        />
                                        <div>
                                          <select
                                            value={card.icon || 'Info'}
                                            onChange={e => updateArrayItem(section.id, 'items', cIdx, 'icon', e.target.value)}
                                            className="w-full border rounded px-2 py-1.5 text-sm"
                                          >
                                            {AVAILABLE_ICONS.map(ic => (
                                              <option key={ic} value={ic}>{ic}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <input
                                          type="text"
                                          placeholder="Rozet / Tag (Örn: BAMF)"
                                          value={card.badge || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', cIdx, 'badge', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Kart Açıklaması"
                                          rows={2}
                                          value={card.description || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', cIdx, 'description', v)}
                                        />
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Hedef Link (/kurse)"
                                          value={card.linkUrl || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', cIdx, 'linkUrl', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Link Metni (Mehr erfahren)"
                                          value={card.linkText || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', cIdx, 'linkText', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* BANNER */}
                            {section.type === 'BANNER' && (
                              <div className="space-y-4">
                                <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                <Input label="Ana Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea label="Alt Açıklama" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <Input label="Bilgi Kutusu / Uyarı Metni" value={section.content?.noticeText} onChange={v => updateSectionData(section.id, 'content', 'noticeText', v)} />
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Arkaplan Görsel URL</label><ImageUploadInput value={section.content?.imageUrl || ""} onChange={v => updateSectionData(section.id, 'content', 'imageUrl', v)} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <Input label="Buton 1 Metin" value={section.content?.buttonText} onChange={v => updateSectionData(section.id, 'content', 'buttonText', v)} />
                                  <Input label="Buton 1 Link" value={section.content?.buttonLink} onChange={v => updateSectionData(section.id, 'content', 'buttonLink', v)} />
                                  <label className="flex items-center space-x-2 text-xs text-gray-600 mt-6">
                                    <input
                                      type="checkbox"
                                      checked={section.content?.buttonExternal ?? false}
                                      onChange={e => updateSectionData(section.id, 'content', 'buttonExternal', e.target.checked)}
                                      className="rounded text-blue-600"
                                    />
                                    <span>Yeni Sekmede Aç</span>
                                  </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input label="Buton 2 Metin" value={section.content?.secondaryButtonText} onChange={v => updateSectionData(section.id, 'content', 'secondaryButtonText', v)} />
                                  <Input label="Buton 2 Link" value={section.content?.secondaryButtonLink} onChange={v => updateSectionData(section.id, 'content', 'secondaryButtonLink', v)} />
                                </div>
                              </div>
                            )}

                            {/* IMAGE_TEXT */}
                            {section.type === 'IMAGE_TEXT' && (
                              <div className="space-y-4">
                                <Input label="Üst Başlık (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                <Input label="Ana Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <RichTextEditor label="Ana Metin" value={section.content?.text} onChange={v => updateSectionData(section.id, 'content', 'text', v)} />
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Görsel URL</label><ImageUploadInput value={section.content?.imageUrl || ""} onChange={v => updateSectionData(section.id, 'content', 'imageUrl', v)} /></div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Görsel Konumu</label>
                                  <select 
                                    value={section.content?.imagePosition || 'left'} 
                                    onChange={e => updateSectionData(section.id, 'content', 'imagePosition', e.target.value)}
                                    className="border rounded-lg p-2 text-sm bg-white"
                                  >
                                    <option value="left">Solda Görsel, Sağda Metin</option>
                                    <option value="right">Solda Metin, Sağda Görsel</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input label="Aksiyon Buton Metni" value={section.content?.buttonText} onChange={v => updateSectionData(section.id, 'content', 'buttonText', v)} />
                                  <Input label="Aksiyon Buton Linki" value={section.content?.buttonLink} onChange={v => updateSectionData(section.id, 'content', 'buttonLink', v)} />
                                </div>
                              </div>
                            )}

                            {/* TEXT */}
                            {section.type === 'TEXT' && (
                              <div className="space-y-4">
                                <Input label="Üst Başlık (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                <Input label="Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea label="Vurgulu Giriş Paragrafı (Lead Text)" value={section.content?.leadText} onChange={v => updateSectionData(section.id, 'content', 'leadText', v)} />
                                <RichTextEditor rows={8} label="Ana İçerik (HTML veya Düz Metin)" value={section.content?.text} onChange={v => updateSectionData(section.id, 'content', 'text', v)} />
                              </div>
                            )}

                            {/* FEATURES */}
                            {section.type === 'FEATURES' && (
                              <div className="space-y-4">
                                <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea label="Alt Açıklama" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Özellikler</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', { title: 'Yeni Başlık', text: 'Açıklama...', icon: 'Award' })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Özellik Ekle
                                    </button>
                                  </div>
                                  {(section.content?.items || []).map((item: any, iIdx: number) => (
                                    <div key={iIdx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', iIdx)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                                        <input
                                          type="text"
                                          placeholder="Başlık"
                                          value={item.title || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', iIdx, 'title', e.target.value)}
                                          className="border rounded px-2.5 py-1 text-sm font-medium"
                                        />
                                        <select
                                          value={item.icon || 'Award'}
                                          onChange={e => updateArrayItem(section.id, 'items', iIdx, 'icon', e.target.value)}
                                          className="border rounded px-2 py-1 text-sm"
                                        >
                                          {AVAILABLE_ICONS.map(ic => (
                                            <option key={ic} value={ic}>{ic}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Açıklama"
                                          rows={2}
                                          value={item.text || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', iIdx, 'text', v)}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* STATS */}
                            {section.type === 'STATS' && (
                              <div className="space-y-4">
                                <Input label="Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <Input label="Alt Başlık" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">İstatistikler</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', { number: '100+', label: 'Açıklama', icon: 'Award' })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Sayaç Ekle
                                    </button>
                                  </div>
                                  {(section.content?.items || []).map((item: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
                                      <input
                                        type="text"
                                        placeholder="Sayı (Örn: 20+)"
                                        value={item.number || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', sIdx, 'number', e.target.value)}
                                        className="w-28 border rounded px-2 py-1 text-sm font-bold text-primary"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Etiket (Örn: Yıllık Deneyim)"
                                        value={item.label || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', sIdx, 'label', e.target.value)}
                                        className="flex-1 border rounded px-2 py-1 text-sm"
                                      />
                                      <select
                                        value={item.icon || 'Award'}
                                        onChange={e => updateArrayItem(section.id, 'items', sIdx, 'icon', e.target.value)}
                                        className="w-32 border rounded px-2 py-1 text-sm"
                                      >
                                        {AVAILABLE_ICONS.map(ic => (
                                          <option key={ic} value={ic}>{ic}</option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', sIdx)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* FAQ */}
                            {section.type === 'FAQ' && (
                              <div className="space-y-4">
                                <Input label="Başlık" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <Input label="Alt Başlık" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Sorular & Cevaplar</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', { question: 'Soru başlığı?', answer: 'Cevap metni...' })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Soru Ekle
                                    </button>
                                  </div>
                                  {(section.content?.items || []).map((item: any, qIdx: number) => (
                                    <div key={qIdx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', qIdx)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <input
                                        type="text"
                                        placeholder="Soru"
                                        value={item.question || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', qIdx, 'question', e.target.value)}
                                        className="w-full border rounded px-2.5 py-1 text-sm font-semibold"
                                      />
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Cevap"
                                          rows={3}
                                          value={item.answer || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', qIdx, 'answer', v)}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* HTML */}
                            {section.type === 'HTML' && (
                              <div className="space-y-4">
                                <Input label="Bölüm Başlığı (İsteğe Bağlı)" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                <TextArea rows={6} label="Özel HTML / Kod / Iframe" value={section.content?.code} onChange={v => updateSectionData(section.id, 'content', 'code', v)} />
                              </div>
                            )}

                            {/* 🌟 FORM */}
                            {section.type === 'FORM' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Form Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Form Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                  <h5 className="text-xs font-bold text-gray-700 uppercase">Alan Etiketleri (Labels)</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input label="İsim Alanı Etiketi" value={section.content?.nameLabel} onChange={v => updateSectionData(section.id, 'content', 'nameLabel', v)} />
                                    <Input label="E-Posta Alanı Etiketi" value={section.content?.emailLabel} onChange={v => updateSectionData(section.id, 'content', 'emailLabel', v)} />
                                    <Input label="Telefon Alanı Etiketi" value={section.content?.phoneLabel} onChange={v => updateSectionData(section.id, 'content', 'phoneLabel', v)} />
                                    <Input label="Açılır Liste (Select) Etiketi" value={section.content?.selectLabel} onChange={v => updateSectionData(section.id, 'content', 'selectLabel', v)} />
                                    <Input label="Mesaj Alanı Etiketi" value={section.content?.messageLabel} onChange={v => updateSectionData(section.id, 'content', 'messageLabel', v)} />
                                    <Input label="Gönder Butonu Metni" value={section.content?.submitText} onChange={v => updateSectionData(section.id, 'content', 'submitText', v)} />
                                  </div>
                                  <Input label="KVKK / GDPR Onay Metni" value={section.content?.consentText} onChange={v => updateSectionData(section.id, 'content', 'consentText', v)} />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                  <h5 className="text-xs font-bold text-gray-700 uppercase">Başarı Mesajı (Form Gönderilince)</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input label="Başarı Başlığı" value={section.content?.successTitle} onChange={v => updateSectionData(section.id, 'content', 'successTitle', v)} />
                                    <Input label="Başarı Açıklaması" value={section.content?.successMessage} onChange={v => updateSectionData(section.id, 'content', 'successMessage', v)} />
                                  </div>
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-bold text-blue-900 uppercase">Yan Panel İletişim Kutusu</h5>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={section.content?.showContactInfo !== false} 
                                        onChange={e => updateSectionData(section.id, 'content', 'showContactInfo', e.target.checked)}
                                        className="rounded text-blue-600"
                                      />
                                      <span>İletişim Kutusunu Göster</span>
                                    </label>
                                  </div>
                                  {section.content?.showContactInfo !== false && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                      <Input label="Kutu Üst Başlık" value={section.content?.contactEyebrow} onChange={v => updateSectionData(section.id, 'content', 'contactEyebrow', v)} />
                                      <Input label="Kutu Ana Başlık" value={section.content?.contactTitle} onChange={v => updateSectionData(section.id, 'content', 'contactTitle', v)} />
                                      <div className="sm:col-span-2">
                                        <Input label="Kısa Bilgi Metni" value={section.content?.contactText} onChange={v => updateSectionData(section.id, 'content', 'contactText', v)} />
                                      </div>
                                      <Input label="Adres" value={section.content?.address} onChange={v => updateSectionData(section.id, 'content', 'address', v)} />
                                      <Input label="Telefon" value={section.content?.phone} onChange={v => updateSectionData(section.id, 'content', 'phone', v)} />
                                      <Input label="E-Posta" value={section.content?.email} onChange={v => updateSectionData(section.id, 'content', 'email', v)} />
                                      <Input label="Çalışma Saatleri" value={section.content?.hours} onChange={v => updateSectionData(section.id, 'content', 'hours', v)} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 🌟 TESTIMONIALS */}
                            {section.type === 'TESTIMONIALS' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Yorumlar ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        name: 'Yeni Katılımcı',
                                        role: 'Kurs Mezunu',
                                        quote: 'Eğitimden çok memnun kaldım.',
                                        stars: 5,
                                        badge: 'Doğrulanmış',
                                        avatarUrl: ''
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Yorum Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((item: any, qIdx: number) => (
                                    <div key={qIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', qIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                                        <input
                                          type="text"
                                          placeholder="İsim / Rumuz"
                                          value={item.name || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', qIdx, 'name', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-medium"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Unvan / Kurs Adı"
                                          value={item.role || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', qIdx, 'role', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Rozet (Örn: telc B1)"
                                          value={item.badge || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', qIdx, 'badge', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Yorum / Deneyim Metni"
                                          rows={2}
                                          value={item.quote || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', qIdx, 'quote', v)}
                                        />
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Fotoğraf URL (İsteğe Bağlı)"
                                          value={item.avatarUrl || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', qIdx, 'avatarUrl', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <div>
                                          <label className="text-xs text-gray-500 mr-2">Yıldız:</label>
                                          <select
                                            value={item.stars || 5}
                                            onChange={e => updateArrayItem(section.id, 'items', qIdx, 'stars', parseInt(e.target.value))}
                                            className="border rounded px-2 py-1 text-sm bg-white"
                                          >
                                            <option value={5}>⭐⭐⭐⭐⭐ (5 Yıldız)</option>
                                            <option value={4}>⭐⭐⭐⭐ (4 Yıldız)</option>
                                            <option value={3}>⭐⭐⭐ (3 Yıldız)</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🌟 TIMELINE */}
                            {section.type === 'TIMELINE' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Aşamalar ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        stepNumber: (section.content?.items?.length || 0) + 1,
                                        title: 'Yeni Adım',
                                        description: 'Aşama detayı buraya gelecek.',
                                        icon: 'CheckCircle2',
                                        badge: 'Adım'
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Aşama Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((step: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', sIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pr-8">
                                        <input
                                          type="number"
                                          placeholder="No"
                                          value={step.stepNumber ?? sIdx + 1}
                                          onChange={e => updateArrayItem(section.id, 'items', sIdx, 'stepNumber', parseInt(e.target.value))}
                                          className="border rounded px-2.5 py-1.5 text-sm w-20 font-bold"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Adım Başlığı"
                                          value={step.title || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', sIdx, 'title', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-medium col-span-2"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Rozet (Örn: Başlangıç)"
                                          value={step.badge || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', sIdx, 'badge', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Adım Açıklaması"
                                          rows={2}
                                          value={step.description || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', sIdx, 'description', v)}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 mr-2">İkon:</label>
                                        <select
                                          value={step.icon || 'CheckCircle2'}
                                          onChange={e => updateArrayItem(section.id, 'items', sIdx, 'icon', e.target.value)}
                                          className="border rounded px-2 py-1 text-sm bg-white"
                                        >
                                          {AVAILABLE_ICONS.map(ic => (
                                            <option key={ic} value={ic}>{ic}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🌟 TEAM_GRID */}
                            {section.type === 'TEAM_GRID' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Ekip Üyeleri ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        name: 'Yeni Eğitmen',
                                        role: 'Öğretmen / Danışman',
                                        bio: 'Eğitim geçmişi ve uzmanlık alanı.',
                                        email: 'info@lernzirkel-online.de',
                                        badge: 'Uzman',
                                        imageUrl: ''
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Üye Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((m: any, mIdx: number) => (
                                    <div key={mIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', mIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                                        <input
                                          type="text"
                                          placeholder="Ad Soyad"
                                          value={m.name || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', mIdx, 'name', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-bold"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Unvan / Pozisyon"
                                          value={m.role || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', mIdx, 'role', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Rozet (Örn: DaF Uzmanı)"
                                          value={m.badge || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', mIdx, 'badge', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <textarea
                                        rows={2}
                                        placeholder="Kısa Biyografi..."
                                        value={m.bio || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', mIdx, 'bio', e.target.value)}
                                        className="w-full border rounded px-2.5 py-1.5 text-sm text-gray-600"
                                      />
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Fotoğraf URL"
                                          value={m.imageUrl || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', mIdx, 'imageUrl', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="email"
                                          placeholder="E-Posta Adresi"
                                          value={m.email || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', mIdx, 'email', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🌟 PRICING */}
                            {section.type === 'PRICING' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Paketler ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        title: 'Yeni Paket',
                                        price: '0 €',
                                        period: 'Aylık',
                                        badge: 'Popüler',
                                        isFeatured: false,
                                        description: 'Paket açıklaması.',
                                        features: ['Özellik 1', 'Özellik 2', 'Özellik 3'],
                                        buttonText: 'Başvur',
                                        buttonLink: '/kontakt'
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Paket Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((p: any, pIdx: number) => (
                                    <div key={pIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', pIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pr-8">
                                        <input
                                          type="text"
                                          placeholder="Paket Adı"
                                          value={p.title || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'title', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-bold sm:col-span-2"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Fiyat (Örn: 0 €)"
                                          value={p.price || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'price', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-bold text-emerald-700"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Periyot (Örn: Aylık)"
                                          value={p.period || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'period', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <input
                                          type="text"
                                          placeholder="Rozet (Örn: Destekli)"
                                          value={p.badge || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'badge', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm flex-1"
                                        />
                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={p.isFeatured ?? false}
                                            onChange={e => updateArrayItem(section.id, 'items', pIdx, 'isFeatured', e.target.checked)}
                                            className="rounded text-blue-600"
                                          />
                                          <span>Öne Çıkan Vurgu (Featured)</span>
                                        </label>
                                      </div>
                                      <div className="mt-2">
                                        <RichTextEditor
                                          label="Paket Açıklaması"
                                          rows={2}
                                          value={p.description || ''}
                                          onChange={v => updateArrayItem(section.id, 'items', pIdx, 'description', v)}
                                        />
                                      </div>
                                      <textarea
                                        rows={3}
                                        placeholder="Özellikler (Her satıra bir özellik yazın)..."
                                        value={Array.isArray(p.features) ? p.features.join('\n') : (p.features || '')}
                                        onChange={e => updateArrayItem(section.id, 'items', pIdx, 'features', e.target.value.split('\n'))}
                                        className="w-full border rounded px-2.5 py-1.5 text-sm text-gray-600 font-mono text-xs"
                                      />
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Buton Metni (Başvur)"
                                          value={p.buttonText || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'buttonText', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Buton Linki (/kontakt)"
                                          value={p.buttonLink || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', pIdx, 'buttonLink', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🌟 VIDEO_SHOWCASE */}
                            {section.type === 'VIDEO_SHOWCASE' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />
                                <Input label="YouTube / Video URL" value={section.content?.videoUrl} onChange={v => updateSectionData(section.id, 'content', 'videoUrl', v)} />
                                <Input label="Yan Panel Başlığı" value={section.content?.leadTitle} onChange={v => updateSectionData(section.id, 'content', 'leadTitle', v)} />
                                <RichTextEditor label="Yan Panel Metni" value={section.content?.text} onChange={v => updateSectionData(section.id, 'content', 'text', v)} />
                                <div className="space-y-3 pt-2">
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Önemli Kazanımlar (Her satıra bir madde)</label>
                                  <textarea
                                    rows={3}
                                    placeholder="Madde 1&#10;Madde 2&#10;Madde 3"
                                    value={Array.isArray(section.content?.highlights) ? section.content.highlights.join('\n') : (section.content?.highlights || '')}
                                    onChange={e => updateSectionData(section.id, 'content', 'highlights', e.target.value.split('\n'))}
                                    className="w-full border rounded px-2.5 py-1.5 text-sm text-gray-600 font-mono text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Buton Metni" value={section.content?.buttonText} onChange={v => updateSectionData(section.id, 'content', 'buttonText', v)} />
                                  <Input label="Buton Linki" value={section.content?.buttonLink} onChange={v => updateSectionData(section.id, 'content', 'buttonLink', v)} />
                                </div>
                              </div>
                            )}

                            {/* 🌟 LOGO_CLOUD */}
                            {section.type === 'LOGO_CLOUD' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <Input label="Alt Açıklama" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Partnerler ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        name: 'Yeni Partner',
                                        logoUrl: '',
                                        linkUrl: ''
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Partner Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((part: any, partIdx: number) => (
                                    <div key={partIdx} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                                      <input
                                        type="text"
                                        placeholder="Partner Adı (Örn: BAMF)"
                                        value={part.name || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', partIdx, 'name', e.target.value)}
                                        className="border rounded px-2.5 py-1 text-sm font-semibold flex-1"
                                      />
                                      <div className="col-span-full mt-2"><ImageUploadInput placeholder="Logo Görsel URL" value={part.logoUrl || ''} onChange={v => updateArrayItem(section.id, 'items', partIdx, 'logoUrl', v)} /></div>
                                      <input
                                        type="text"
                                        placeholder="Web Sitesi URL"
                                        value={part.linkUrl || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', partIdx, 'linkUrl', e.target.value)}
                                        className="border rounded px-2.5 py-1 text-sm flex-1"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', partIdx)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🌟 DOWNLOADS */}
                            {section.type === 'DOWNLOADS' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Üst Etiket (Eyebrow)" value={section.content?.eyebrow} onChange={v => updateSectionData(section.id, 'content', 'eyebrow', v)} />
                                  <Input label="Bölüm Başlığı" value={section.content?.title} onChange={v => updateSectionData(section.id, 'content', 'title', v)} />
                                </div>
                                <TextArea label="Bölüm Açıklaması" value={section.content?.subtitle} onChange={v => updateSectionData(section.id, 'content', 'subtitle', v)} />

                                <div className="space-y-3 pt-2">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-gray-800">Dosyalar ({section.content?.items?.length || 0})</label>
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem(section.id, 'items', {
                                        title: 'Başvuru Formu (PDF)',
                                        description: 'Dosya açıklaması buraya yazılacak.',
                                        fileSize: '250 KB',
                                        downloadUrl: '/downloads/form.pdf',
                                        buttonText: 'İndir (PDF)'
                                      })}
                                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200"
                                    >
                                      + Dosya Ekle
                                    </button>
                                  </div>

                                  {(section.content?.items || []).map((doc: any, dIdx: number) => (
                                    <div key={dIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.id, 'items', dIdx)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                      >
                                        <X size={16} />
                                      </button>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                                        <input
                                          type="text"
                                          placeholder="Belge Başlığı"
                                          value={doc.title || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', dIdx, 'title', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm font-bold sm:col-span-2"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Dosya Boyutu (Örn: 240 KB)"
                                          value={doc.fileSize || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', dIdx, 'fileSize', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                      <textarea
                                        rows={2}
                                        placeholder="Dosya Açıklaması..."
                                        value={doc.description || ''}
                                        onChange={e => updateArrayItem(section.id, 'items', dIdx, 'description', e.target.value)}
                                        className="w-full border rounded px-2.5 py-1.5 text-sm text-gray-600"
                                      />
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="İndirme Linki (/downloads/...)"
                                          value={doc.downloadUrl || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', dIdx, 'downloadUrl', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Buton Metni (İndir PDF)"
                                          value={doc.buttonText || ''}
                                          onChange={e => updateArrayItem(section.id, 'items', dIdx, 'buttonText', e.target.value)}
                                          className="border rounded px-2.5 py-1.5 text-sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* DESIGN TAB */}
                        {currentSubTab === 'design' && (
                          <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between border-b pb-3">
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                  <Sparkles size={16} className="text-amber-500" />
                                  Bölüm Görünüm & Tasarım Ayarları
                                </h4>
                                <p className="text-xs text-gray-500">Royal renk şemaları, gradientler, SVG dalga ayırıcılar ve tipografi kontrolleri.</p>
                              </div>
                            </div>

                            {/* 1-Click Royal Presets */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                👑 1-Tıkla Royal Stil Hazır Şablonları
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                                {[
                                  { name: 'Royal Navy', bg: '#0F4761', text: '#ffffff', btnBg: '#e63946', btnColor: '#ffffff', desc: 'Kurumsal koyu mavi' },
                                  { name: 'Deep Night', bg: '#0B132B', text: '#ffffff', btnBg: '#3B82F6', btnColor: '#ffffff', desc: 'Modern gece siyahı' },
                                  { name: 'Temiz Beyaz', bg: '#ffffff', text: '#111827', btnBg: '#0F4761', btnColor: '#ffffff', desc: 'Sade aydınlık' },
                                  { name: 'Soft Gri', bg: '#F8FAFC', text: '#1E293B', btnBg: '#2563EB', btnColor: '#ffffff', desc: 'Hafif gri zemin' },
                                  { name: 'Zümrüt', bg: '#064E3B', text: '#ECFDF5', btnBg: '#10B981', btnColor: '#ffffff', desc: 'Prestij yeşili' },
                                  { name: 'Sıcak Gün', bg: '#FFF7ED', text: '#7C2D12', btnBg: '#EA580C', btnColor: '#ffffff', desc: 'Samimi turuncu' },
                                ].map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => {
                                      updateSectionData(section.id, 'design', 'backgroundColor', preset.bg);
                                      updateSectionData(section.id, 'design', 'textColor', preset.text);
                                      updateSectionData(section.id, 'design', 'buttonBg', preset.btnBg);
                                      updateSectionData(section.id, 'design', 'buttonColor', preset.btnColor);
                                    }}
                                    className="p-2.5 rounded-lg border border-gray-200 text-left hover:border-blue-500 hover:shadow-sm transition-all group"
                                  >
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: preset.bg }}></span>
                                      <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600">{preset.name}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 block truncate">{preset.desc}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t">
                              {/* Background color */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Düz Arka Plan Rengi</label>
                                <div className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="color"
                                    value={safeHex(section.design?.backgroundColor, "#ffffff")}
                                    onChange={e => updateSectionData(section.id, 'design', 'backgroundColor', e.target.value)}
                                    className="h-8 w-8 rounded border cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={section.design?.backgroundColor || ''}
                                    onChange={e => updateSectionData(section.id, 'design', 'backgroundColor', e.target.value)}
                                    placeholder="bg-white veya #ffffff"
                                    className="flex-1 border rounded px-2.5 py-1.5 text-xs font-mono"
                                  />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { label: 'Beyaz', val: 'bg-white' },
                                    { label: 'Açık Gri', val: 'bg-gray-50' },
                                    { label: 'Mavi (Koyu)', val: '#0F4761' },
                                    { label: 'Açık Mavi', val: '#e8f4f8' },
                                    { label: 'Koyu', val: '#111827' },
                                  ].map(preset => (
                                    <button
                                      key={preset.val}
                                      type="button"
                                      onClick={() => updateSectionData(section.id, 'design', 'backgroundColor', preset.val)}
                                      className="text-[11px] px-2 py-0.5 border rounded bg-gray-50 hover:bg-gray-100"
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Text color */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Metin Rengi</label>
                                <div className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="color"
                                    value={safeHex(section.design?.textColor, "#111827")}
                                    onChange={e => updateSectionData(section.id, 'design', 'textColor', e.target.value)}
                                    className="h-8 w-8 rounded border cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={section.design?.textColor || ''}
                                    onChange={e => updateSectionData(section.id, 'design', 'textColor', e.target.value)}
                                    placeholder="text-gray-900 veya #111827"
                                    className="flex-1 border rounded px-2.5 py-1.5 text-xs font-mono"
                                  />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { label: 'Koyu', val: 'text-gray-900' },
                                    { label: 'Beyaz', val: 'text-white' },
                                    { label: 'Gri', val: 'text-gray-600' },
                                  ].map(preset => (
                                    <button
                                      key={preset.val}
                                      type="button"
                                      onClick={() => updateSectionData(section.id, 'design', 'textColor', preset.val)}
                                      className="text-[11px] px-2 py-0.5 border rounded bg-gray-50 hover:bg-gray-100"
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Gradient Background */}
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Lüks Gradient Arka Plan (CSS veya Tailwind sınıfı)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Örn: bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900"
                                  value={section.design?.gradient || ''}
                                  onChange={e => updateSectionData(section.id, 'design', 'gradient', e.target.value)}
                                  className="w-full border rounded px-2.5 py-1.5 text-xs font-mono mb-2"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { label: 'Gradient Yok', val: '' },
                                    { label: 'Gece Mavisi', val: 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950' },
                                    { label: 'Lernzirkel Okyanus', val: 'bg-gradient-to-r from-[#0F4761] via-[#155a7a] to-[#0A3245]' },
                                    { label: 'Zümrüt Yeşili', val: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950' },
                                    { label: 'Kraliyet Moru', val: 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900' },
                                    { label: 'Açık İnci', val: 'bg-gradient-to-b from-gray-50 via-white to-blue-50/40' },
                                  ].map(g => (
                                    <button
                                      key={g.label}
                                      type="button"
                                      onClick={() => updateSectionData(section.id, 'design', 'gradient', g.val)}
                                      className="text-[11px] px-2 py-0.5 border rounded bg-gray-50 hover:bg-gray-100"
                                    >
                                      {g.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Top / Bottom Wave Dividers */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Üst Şekil / Dalga Ayırıcı (SVG)</label>
                                <select
                                  value={section.design?.dividerTop || 'none'}
                                  onChange={e => updateSectionData(section.id, 'design', 'dividerTop', e.target.value)}
                                  className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                  <option value="none">Ayırıcı Yok</option>
                                  <option value="wave">Akıcı Dalga (Wave)</option>
                                  <option value="curve">Yumuşak Kavis (Curve)</option>
                                  <option value="slant">Eğimli Çizgi (Slant)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Şekil / Dalga Ayırıcı (SVG)</label>
                                <select
                                  value={section.design?.dividerBottom || 'none'}
                                  onChange={e => updateSectionData(section.id, 'design', 'dividerBottom', e.target.value)}
                                  className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                  <option value="none">Ayırıcı Yok</option>
                                  <option value="wave">Akıcı Dalga (Wave)</option>
                                  <option value="curve">Yumuşak Kavis (Curve)</option>
                                  <option value="slant">Eğimli Çizgi (Slant)</option>
                                </select>
                              </div>

                              {/* Padding */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">İç Boşluk (Padding Y)</label>
                                <select
                                  value={section.design?.padding || 'py-16'}
                                  onChange={e => updateSectionData(section.id, 'design', 'padding', e.target.value)}
                                  className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                  <option value="py-0">Boşluksuz (0px)</option>
                                  <option value="py-8">Kompakt (32px)</option>
                                  <option value="py-12">Orta-Küçük (48px)</option>
                                  <option value="py-16">Standart (64px)</option>
                                  <option value="py-24">Geniş (96px)</option>
                                  <option value="py-32">Çok Geniş (128px)</option>
                                </select>
                              </div>

                              {/* Container Width */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Maksimum Genişlik</label>
                                <select
                                  value={section.design?.containerWidth || 'max-w-7xl'}
                                  onChange={e => updateSectionData(section.id, 'design', 'containerWidth', e.target.value)}
                                  className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                  <option value="max-w-4xl">Dar (Makale formatı)</option>
                                  <option value="max-w-5xl">Orta (Metin + İçerik)</option>
                                  <option value="max-w-6xl">Standart Genişlik</option>
                                  <option value="max-w-7xl">Geniş (Varsayılan)</option>
                                  <option value="w-full">Tam Ekran (100% Genişlik)</option>
                                </select>
                              </div>

                              {/* Alignment */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Metin Hizası</label>
                                <select
                                  value={section.design?.textAlign || 'text-left'}
                                  onChange={e => updateSectionData(section.id, 'design', 'textAlign', e.target.value)}
                                  className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                  <option value="text-left">Sola Hizalı</option>
                                  <option value="text-center">Ortalanmış</option>
                                  <option value="text-right">Sağa Hizalı</option>
                                </select>
                              </div>

                              {/* Button Styling */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Buton Rengi</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={safeHex(section.design?.buttonBg, "#e63946")}
                                    onChange={e => updateSectionData(section.id, 'design', 'buttonBg', e.target.value)}
                                    className="h-8 w-8 rounded border cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={section.design?.buttonBg || ''}
                                    onChange={e => updateSectionData(section.id, 'design', 'buttonBg', e.target.value)}
                                    placeholder="#e63946"
                                    className="flex-1 border rounded px-2.5 py-1.5 text-xs font-mono"
                                  />
                                </div>
                              </div>

                              {/* Overlay for Hero/Banner */}
                              {(section.type === 'HERO' || section.type === 'BANNER') && (
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Görsel Karartma / Filtre</label>
                                  <select
                                    value={section.design?.overlayOpacity || 'bg-black/50'}
                                    onChange={e => updateSectionData(section.id, 'design', 'overlayOpacity', e.target.value)}
                                    className="w-full border rounded-lg p-2 text-sm bg-white"
                                  >
                                    <option value="bg-black/0">Yok (%0)</option>
                                    <option value="bg-black/20">Açık (%20)</option>
                                    <option value="bg-black/40">Orta-Hafif (%40)</option>
                                    <option value="bg-black/50">Standart (%50)</option>
                                    <option value="bg-black/70">Koyu (%70)</option>
                                    <option value="bg-black/85">Çok Koyu (%85)</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick Add Button below list */}
            {sections.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <Plus size={18} />
                  Yeni Bölüm Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Preview Column */}
        {viewMode !== 'editor' && (
          <div className={`${viewMode === 'preview' ? 'w-full' : 'sticky top-24 self-start max-h-[calc(100vh-140px)] overflow-y-auto'}`}>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Canlı Önizleme (Gerçek Zamanlı)</span>
                <span className="font-mono">{pageUrl}</span>
              </div>
              <div className="overflow-x-hidden">
                {sections.filter(s => !s.isHidden).map((sec) => (
                  <SectionRenderer key={sec.id} section={sec} />
                ))}
                {sections.filter(s => !s.isHidden).length === 0 && (
                  <div className="p-16 text-center text-gray-400">
                    Görüntülenecek aktif bölüm bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={22} />
                  Yeni Bölüm Seçin (17 Blok)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Sayfanıza eklemek istediğiniz royal seviye içerik veya form bloğunu seçin.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-3 shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={sectionSearch}
                  onChange={(e) => setSectionSearch(e.target.value)}
                  placeholder="Bölüm ara... (örn: form, referans, fiyat, video, harita, öğretmen)"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                />
                {sectionSearch && (
                  <button
                    onClick={() => setSectionSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full px-1.5 py-0.5"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Tüm Bölümler (17)' },
                  { id: 'form', label: 'Form & Kayıt' },
                  { id: 'promo', label: 'Pazarlama & CTA' },
                  { id: 'content', label: 'İçerik & Bilgi' },
                  { id: 'social', label: 'Güven & Kadro' },
                  { id: 'media', label: 'Medya & Dosyalar' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSectionCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      sectionCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto p-1 flex-1 pr-2">
              {[
                { type: 'HERO', category: 'promo', label: 'Kapak / Hero', desc: 'Görsel veya renk arkaplanlı, dikkat çekici giriş alanı.', icon: Maximize2, tag: 'Temel' },
                { type: 'FORM', category: 'form', label: 'Etkileşimli Form (Başvuru / İletişim)', desc: 'Ön kayıt, danışmanlık veya kurs başvurusu için canlı form.', icon: Send, tag: 'Yeni & Popüler' },
                { type: 'CARD_GRID', category: 'content', label: 'Kart Izgarası (Grid)', desc: 'İkonlu ve linkli hizmet, proje, kategori kartları.', icon: LayoutGrid, tag: 'Çok Yönlü' },
                { type: 'BANNER', category: 'promo', label: 'Vurgulu Banner / CTA', desc: 'Duyuru bandı veya harekete geçirici çağrı alanı.', icon: Megaphone, tag: 'Dönüşüm' },
                { type: 'IMAGE_TEXT', category: 'content', label: 'Resim & Metin (2 Kolon)', desc: 'Görsel ve yanında detaylı açıklama, madde işaretleri.', icon: ImageIcon, tag: 'Klasik' },
                { type: 'TEXT', category: 'content', label: 'Metin & Paragraf', desc: 'Başlık ve zengin metin gövdesi içeren sade blok.', icon: Type, tag: 'Sade' },
                { type: 'FEATURES', category: 'content', label: 'Öne Çıkan Özellikler', desc: 'İkonlu kutucuklarla değer ve nitelik sunumu.', icon: CheckCircle2, tag: 'Avantajlar' },
                { type: 'STATS', category: 'social', label: 'İstatistik Sayaçları', desc: 'Rakamlar ve başarı metrikleri göstergesi.', icon: BarChart3, tag: 'Metrikler' },
                { type: 'FAQ', category: 'content', label: 'Sıkça Sorulan Sorular', desc: 'Açılır-kapanır akordeon soru ve cevaplar.', icon: HelpCircle, tag: 'Akordeon' },
                { type: 'TESTIMONIALS', category: 'social', label: 'Öğrenci & Veli Yorumları', desc: '5 yıldızlı değerlendirmeler ve öğrenci başarı deneyimleri.', icon: Star, tag: 'Sosyal Kanıt' },
                { type: 'TIMELINE', category: 'content', label: 'Süreç & Adımlar (Timeline)', desc: 'Kayıttan mezuniyete numaralı aşamalar ve yol haritası.', icon: Clock, tag: 'Rehber' },
                { type: 'TEAM_GRID', category: 'social', label: 'Eğitmenler & Kadro', desc: 'Öğretmenler, danışmanlar ve yönetim ekibi tanıtım kartları.', icon: User, tag: 'Ekip' },
                { type: 'PRICING', category: 'promo', label: 'Kurs Paketleri & Fiyatlandırma', desc: 'Dönemsel fiyat tabloları, özellik maddeleri ve kayıt butonu.', icon: Award, tag: 'Katalog' },
                { type: 'VIDEO_SHOWCASE', category: 'media', label: 'Tanıtım Videosu & Vitrin', desc: 'YouTube/Vimeo video gömme ve yan panelde avantaj maddeleri.', icon: Play, tag: 'Video' },
                { type: 'LOGO_CLOUD', category: 'social', label: 'Partner & Akreditasyonlar', desc: 'BAMF, ESF+, sınav merkezleri ve çözüm ortakları logoları.', icon: Building, tag: 'Resmi' },
                { type: 'DOWNLOADS', category: 'media', label: 'İndirilebilir Belgeler (PDF)', desc: 'Ders programları, broşür ve başvuru formları listesi.', icon: Download, tag: 'Evraklar' },
                { type: 'HTML', category: 'media', label: 'Özel Kod / Embed (Harita vb.)', desc: 'Google Harita, özel widget veya dış iframe ekleme.', icon: Code, tag: 'Gelişmiş' },
              ]
                .filter(item => {
                  if (sectionCategory !== 'all' && item.category !== sectionCategory) return false;
                  if (sectionSearch.trim()) {
                    const q = sectionSearch.toLowerCase();
                    return item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => addSection(opt.type)}
                      className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex items-start space-x-3 relative"
                    >
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-gray-900 group-hover:text-blue-700 text-sm truncate">
                            {opt.label}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700 shrink-0">
                            {opt.tag}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value?: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <input 
        type="text" 
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string, value?: string, onChange: (v: string) => void, rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <textarea 
        rows={rows}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function safeHex(val?: string, fallback = "#ffffff") {
  return val && /^#[0-9A-Fa-f]{6}$/i.test(val) ? val : fallback;
}

function getSectionLabel(type: string) {
  switch(type) {
    case 'HERO': return 'Hero / Kapak';
    case 'CARD_GRID': return 'Kart Izgarası';
    case 'BANNER': return 'Banner / CTA';
    case 'IMAGE_TEXT': return 'Görsel & Metin';
    case 'TEXT': return 'Metin Alanı';
    case 'FEATURES': return 'Özellikler';
    case 'STATS': return 'İstatistikler';
    case 'FAQ': return 'Sıkça Sorulanlar';
    case 'HTML': return 'Özel HTML';
    case 'FORM': return 'İletişim & Başvuru Formu';
    case 'TESTIMONIALS': return 'Öğrenci & Veli Yorumları';
    case 'TIMELINE': return 'Süreç / Yol Haritası';
    case 'TEAM_GRID': return 'Eğitmenler & Ekip';
    case 'PRICING': return 'Fiyat & Kurs Paketleri';
    case 'VIDEO_SHOWCASE': return 'Tanıtım Videosu & Vitrin';
    case 'LOGO_CLOUD': return 'Partner & Akreditasyonlar';
    case 'DOWNLOADS': return 'İndirilebilir Belgeler (PDF)';
    default: return type;
  }
}

function getDefaultContent(type: string) {
  switch(type) {
    case 'HERO': 
      return { 
        title: "Bölüm Başlığı", 
        subtitle: "Açıklayıcı alt başlık ve mesajınız buraya gelecek.", 
        eyebrow: "Hoş Geldiniz",
        buttonText: "Daha Fazla Bilgi", 
        buttonLink: "/kontakt",
        secondaryButtonText: "İncele",
        secondaryButtonLink: "/kurse"
      };
    case 'FORM':
      return {
        eyebrow: "Online Başvuru",
        title: "Ücretsiz Ön Kayıt & Danışmanlık",
        subtitle: "Uzman danışmanlarımız size en uygun eğitim programını belirlemek için 24 saat içinde dönüş yapsın.",
        badge: "Hızlı Yanıt Garantisi",
        submitButtonText: "Başvuruyu Gönder",
        successMessage: "Tebrikler! Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
        fields: [
          { name: "name", label: "Adınız Soyadınız", type: "text", placeholder: "Örn: Ahmet Yılmaz", required: true },
          { name: "email", label: "E-Posta Adresiniz", type: "email", placeholder: "adiniz@ornek.com", required: true },
          { name: "phone", label: "Telefon Numaranız", type: "tel", placeholder: "+49 170 0000000", required: true },
          { name: "course", label: "İlgilendiğiniz Program", type: "select", placeholder: "Seçiniz", options: ["Almanca Entegrasyon Kursu (BAMF)", "B1/B2 Mesleki Dil Kursu", "Okul Takviye & Nachhilfe", "Matematik / Fen Dersi", "Özel Birebir Ders"], required: true },
          { name: "message", label: "Notunuz / Sorunuz (Opsiyonel)", type: "textarea", placeholder: "Varsa hedefinizi veya sormak istediklerinizi belirtebilirsiniz...", required: false }
        ]
      };
    case 'TESTIMONIALS':
      return {
        eyebrow: "Başarı Hikayeleri",
        title: "Öğrencilerimiz ve Velilerimiz Ne Diyor?",
        subtitle: "Lernzirkel ile hedeflerine ulaşan yüzlerce başarılı öğrencimizin samimi değerlendirmeleri.",
        items: [
          { name: "Emre K.", role: "B1 Telc Mezunu", comment: "Lernzirkel sayesinde 6 ayda B1 sertifikamı aldım. Eğitmenlerin sabrı ve pedagojik yaklaşımı harikaydı!", rating: 5, avatarUrl: "", badge: "Sınav Başarısı" },
          { name: "Fatma Y.", role: "Gymnasium Öğrencisi Velisi", comment: "Oğlumun matematik notları 4'ten 2'ye yükseldi. Düzenli takip ve veli bilgilendirmeleri çok profesyonelce.", rating: 5, avatarUrl: "", badge: "Veli Yorumu" },
          { name: "Alexander S.", role: "Mesleki Almanca Kursiyeri", comment: "İş hayatımda ihtiyacım olan Almancayı burada kazandım. Herkese gönül rahatlığıyla tavsiye ederim.", rating: 5, avatarUrl: "", badge: "Kariyer" }
        ]
      };
    case 'TIMELINE':
      return {
        eyebrow: "Adım Adım Yol Haritası",
        title: "Lernzirkel'de Başarıya Giden 4 Adım",
        subtitle: "Kayıt anından sertifika gününüze kadar her aşamada yanınızdayız.",
        items: [
          { stepNumber: 1, title: "Seviye Tespiti & Danışmanlık", description: "Mevcut dil veya ders seviyeniz ücretsiz analiz edilir ve size özel program çizilir.", badge: "1. Gün", icon: "HelpCircle" },
          { stepNumber: 2, title: "Resmi Evrak & Kayıt", description: "BAMF, Jobcenter veya doğrudan kayıt işlemleri rehberliğimizde hızla tamamlanır.", badge: "Kayıt", icon: "CheckCircle2" },
          { stepNumber: 3, title: "İnteraktif Eğitim Süreci", description: "Modern materyaller, deneyimli eğitmenler ve düzenli deneme sınavlarıyla eğitim.", badge: "Eğitim", icon: "BookOpen" },
          { stepNumber: 4, title: "Sınav Başarısı & Sertifika", description: "Resmi Telc/Goethe sertifikanızı alarak hedefinize gururla ulaşın.", badge: "Mezuniyet", icon: "Award" }
        ]
      };
    case 'TEAM_GRID':
      return {
        eyebrow: "Kadromuz",
        title: "Alanında Uzman Eğitmenlerimiz",
        subtitle: "Pedagojik formasyona sahip, deneyimli öğretmenlerimizle başarı tesadüf değildir.",
        items: [
          { name: "Dr. Thomas Müller", role: "Almanca Bölüm Başkanı", bio: "15 yılı aşkın DaF/DaZ eğitim tecrübesi ve Telc sınav denetçisi.", badge: "DaF Uzmanı", email: "t.mueller@lernzirkel-online.de", imageUrl: "" },
          { name: "Elif Demir", role: "Matematik & Fen Danışmanı", bio: "Abitur ve Realschule sınav hazırlığında yüzlerce öğrenciye derece yaptırdı.", badge: "STEM", email: "e.demir@lernzirkel-online.de", imageUrl: "" },
          { name: "Michael Weber", role: "Entegrasyon Danışmanı", bio: "BAMF süreçleri, resmi kayıtlar ve kariyer yönlendirme uzmanı.", badge: "Danışman", email: "m.weber@lernzirkel-online.de", imageUrl: "" }
        ]
      };
    case 'PRICING':
      return {
        eyebrow: "Şeffaf Fiyatlandırma",
        title: "Eğitim ve Kurs Paketlerimiz",
        subtitle: "Bütçenize ve hedefinize uygun esnek ödeme seçenekleri ve devlet destekli programlar.",
        items: [
          {
            title: "BAMF Entegrasyon",
            price: "0 €*",
            period: "veya 229€ / Modül",
            description: "Devlet teşvikli resmi Almanca ve Hayat Bilgisi kursu.",
            features: ["600 Ders Saati Dil Eğitimi", "100 Ders Saati Oryantasyon", "Ücretsiz Telc DTZ Sınavı", "Ders Kitapları Dahil"],
            isFeatured: false,
            buttonText: "Şartları İncele",
            buttonLink: "/kontakt"
          },
          {
            title: "Yoğun Grup Dersi",
            price: "189 €",
            period: "aylık",
            description: "Maksimum 6-8 kişilik sınıflarda hızlı ve odaklanmış ilerleme.",
            features: ["Haftada 6 Saat Canlı Ders", "Birebir Soru Çözüm Saati", "Online Çalışma Materyalleri", "Haftalık İlerleme Raporu", "Veli Bilgilendirme Sistemi"],
            isFeatured: true,
            badge: "En Çok Tercih Edilen",
            buttonText: "Hemen Kaydol",
            buttonLink: "/kontakt"
          },
          {
            title: "Birebir Özel Ders",
            price: "35 €",
            period: "ders başı (45 dk)",
            description: "Tamamen öğrencinin hızına ve okul müfredatına özel bireysel eğitim.",
            features: ["Kişiye Özel Müfredat", "Esnek Ders Gün ve Saatleri", "Sınav Öncesi Hızlandırma", "Tüm Branşlarda (Mat, Alm, İng)", "Bireysel Öğretmen Desteği"],
            isFeatured: false,
            buttonText: "Özel Ders Planla",
            buttonLink: "/kontakt"
          }
        ]
      };
    case 'VIDEO_SHOWCASE':
      return {
        eyebrow: "Kurumumuzu Tanıyın",
        title: "Lernzirkel ile Tanışın: Eğitimde Fark Yaratan Yaklaşım",
        subtitle: "Sınıflarımız, eğitmenlerimiz ve ders işleme atmosferimizi izleyin.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        leadTitle: "Neden Lernzirkel Fark Yaratır?",
        text: "Modern dersliklerimiz, sıcak atmosferimiz ve her öğrenciye gösterdiğimiz özenle öğrenmeyi kolay ve kalıcı hale getiriyoruz.",
        highlights: [
          "Modern ve interaktif akıllı tahtalar",
          "Sakin ve odaklanmayı artıran çalışma ortamı",
          "Ücretsiz çay-kahve ve mola dinlenme alanları",
          "Merkezi konum ve kolay ulaşım imkanı"
        ],
        buttonText: "Ziyaret Randevusu Alın",
        buttonLink: "/kontakt"
      };
    case 'LOGO_CLOUD':
      return {
        eyebrow: "İş Birliklerimiz & Akreditasyonlar",
        title: "Güvenilir Resmi Ortaklarımız",
        subtitle: "Resmi kurumlar, sınav merkezleri ve eğitim ortaklarımızla kalite garantisi.",
        items: [
          { name: "BAMF - Bundesamt für Migration und Flüchtlinge", logoUrl: "", linkUrl: "https://www.bamf.de" },
          { name: "Telc Language Tests", logoUrl: "", linkUrl: "https://www.telc.net" },
          { name: "Europäischer Sozialfonds (ESF+)", logoUrl: "", linkUrl: "https://www.esf.de" },
          { name: "Goethe-Institut Partner", logoUrl: "", linkUrl: "https://www.goethe.de" },
          { name: "IHK Akrediteli", logoUrl: "", linkUrl: "https://www.ihk.de" }
        ]
      };
    case 'DOWNLOADS':
      return {
        eyebrow: "Kaynaklar & Belgeler",
        title: "Faydalı Dokümanlar ve Başvuru Formları",
        subtitle: "Kayıt işlemleri, ders programları ve bilgilendirici kılavuzları tek tıkla indirin.",
        items: [
          {
            title: "2026 Kurs & Seminer Takvimi (PDF)",
            description: "Tüm A1-C1 kurslarının başlangıç tarihleri ve sınav takvimi.",
            fileSize: "1.2 MB",
            downloadUrl: "#",
            buttonText: "İndir (PDF)"
          },
          {
            title: "BAMF Kurs Katılım Başvuru Formu",
            description: "Entegrasyon ve mesleki dil kursları için resmi başvuru kılavuzu.",
            fileSize: "450 KB",
            downloadUrl: "#",
            buttonText: "Formu İndir"
          },
          {
            title: "Okul Takviye (Nachhilfe) Bilgilendirme Broşürü",
            description: "İlkokul, Realschule ve Gymnasium öğrencileri için rehberlik kitapçığı.",
            fileSize: "850 KB",
            downloadUrl: "#",
            buttonText: "Broşürü İndir"
          }
        ]
      };
    case 'CARD_GRID':
      return {
        eyebrow: "Hizmetlerimiz",
        title: "Sunduğumuz Programlar",
        subtitle: "İhtiyacınıza uygun eğitim ve destek programları.",
        columns: 3,
        items: [
          { title: "Program 1", description: "Detaylı açıklama buraya yazılacaktır.", linkText: "Detaylar", linkUrl: "/", icon: "BookOpen" },
          { title: "Program 2", description: "Detaylı açıklama buraya yazılacaktır.", linkText: "Detaylar", linkUrl: "/", icon: "Users" },
          { title: "Program 3", description: "Detaylı açıklama buraya yazılacaktır.", linkText: "Detaylar", linkUrl: "/", icon: "Award" }
        ]
      };
    case 'TEXT': 
      return { 
        eyebrow: "",
        title: "Başlık", 
        leadText: "Önemli giriş vurgusu...",
        text: "<p>Buraya detaylı metin içeriğinizi yazabilirsiniz.</p>" 
      };
    case 'IMAGE_TEXT': 
      return { 
        eyebrow: "Hakkımızda",
        title: "Misyonumuz ve Amacımız", 
        text: "Kurumumuz hakkında açıklama metni...", 
        imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80", 
        imagePosition: "left",
        buttonText: "İletişime Geçin",
        buttonLink: "/kontakt"
      };
    case 'FEATURES': 
      return { 
        title: "Neden Biz?", 
        subtitle: "Öne çıkan avantajlarımız", 
        items: [
          { title: "Uzman Eğitmenler", text: "Deneyimli ve alanında uzman kadro.", icon: "GraduationCap" },
          { title: "Birebir İlgi", text: "Her öğrenciye özel rehberlik ve destek.", icon: "HeartHandshake" },
          { title: "Resmi Sertifika", text: "Tüm dünyada geçerli sertifikalar.", icon: "Award" }
        ] 
      };
    case 'STATS':
      return {
        title: "Rakamlarla Biz",
        subtitle: "Yıllardır büyüyen başarımız",
        items: [
          { number: "20+", label: "Yıllık Tecrübe", icon: "Clock" },
          { number: "5000+", label: "Mezun Öğrenci", icon: "GraduationCap" },
          { number: "35+", label: "Uzman Eğitmen", icon: "Users" },
          { number: "%98", label: "Sınav Başarısı", icon: "Award" }
        ]
      };
    case 'FAQ':
      return {
        title: "Sıkça Sorulan Sorular",
        subtitle: "Merak ettiğiniz her şey",
        items: [
          { question: "Kurslara nasıl kayıt olabilirim?", answer: "Kayıt için web sitemizdeki iletişim formunu doldurabilir veya bizi arayabilirsiniz." },
          { question: "Kurs ücretleri ve burs imkanları nelerdir?", answer: "BAMF ve ESF+ destekli kurslarımızda şartları sağlayan kursiyerler için eğitimler ücretsizdir." }
        ]
      };
    case 'BANNER': 
      return { 
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80", 
        eyebrow: "Duyuru", 
        title: "Yeni Dönem Kayıtlarımız Başladı!", 
        subtitle: "Kontenjanlar dolmadan yerinizi ayırtın.", 
        buttonText: "Kayıt Ol", 
        buttonLink: "/kontakt" 
      };
    case 'HTML':
      return {
        title: "Özel Kod Alanı",
        code: "<div class='text-center p-4 bg-gray-100 rounded'>Özel içerik</div>"
      };
    default: 
      return {};
  }
}

function getDefaultDesign(type: string) {
  if (type === 'HERO' || type === 'BANNER') {
    return { 
      backgroundColor: "#0F4761",
      textColor: "#ffffff",
      overlayOpacity: 'bg-black/50', 
      textAlign: 'text-center', 
      minHeight: 'min-h-[480px]', 
      padding: 'py-20',
      containerWidth: 'max-w-6xl',
      buttonBg: '#e63946',
      buttonColor: '#ffffff'
    };
  }
  if (type === 'FORM') {
    return {
      backgroundColor: "#F8FAFC",
      textColor: "#1E293B",
      padding: "py-20",
      containerWidth: "max-w-4xl",
      textAlign: "text-center",
      buttonBg: "#0F4761",
      buttonColor: "#ffffff"
    };
  }
  if (type === 'PRICING' || type === 'TESTIMONIALS') {
    return {
      backgroundColor: "#F8FAFC",
      textColor: "#0F172A",
      padding: "py-20",
      containerWidth: "max-w-7xl",
      textAlign: "text-center",
      buttonBg: "#0F4761",
      buttonColor: "#ffffff"
    };
  }
  return {
    backgroundColor: "bg-white",
    textColor: "text-gray-900",
    padding: "py-16",
    containerWidth: "max-w-7xl",
    textAlign: "text-left"
  };
}
