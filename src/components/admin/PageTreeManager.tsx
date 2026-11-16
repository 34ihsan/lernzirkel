'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderTree, Plus, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown,
  CornerDownRight, ChevronRight, ChevronDown, Search, Layers,
  CheckCircle2, FileText, Globe, Sliders, RefreshCw, Sparkles, FolderPlus,
  MoveRight, Info, AlertCircle, Copy, XCircle
} from 'lucide-react';
import { reorderPage, updatePageHierarchy, syncPageHierarchy } from '@/actions/admin';

export interface PageNode {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  isPublished: boolean;
  parentId?: string | null;
  order: number;
  sectionsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastEditedByName?: string | null;
  lastEditedAt?: string | Date | null;
  parent?: { id: string; title: string; slug: string } | null;
  children?: PageNode[];
}

type BulkResult = { success: boolean; error?: string; count?: number; deletedCount?: number; skippedHome?: boolean };

interface Props {
  pages: PageNode[];
  systemSlugs: string[];
  onDeletePageAction: (id: string) => Promise<void>;
  onDuplicatePageAction: (id: string) => Promise<{ success: boolean; newId?: string; error?: string }>;
  onBulkSetPublishedAction: (ids: string[], isPublished: boolean) => Promise<BulkResult>;
  onBulkDeletePagesAction: (ids: string[]) => Promise<BulkResult>;
}

// Basit göreceli zaman gösterimi — ek bir npm paketi gerekmeden.
function relativeTime(value?: string | Date | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'az önce';
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} gün önce`;
  return date.toLocaleDateString('de-DE');
}

export default function PageTreeManager({ pages, systemSlugs, onDeletePageAction, onDuplicatePageAction, onBulkSetPublishedAction, onBulkDeletePagesAction }: Props) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({});
  const [movingPageId, setMovingPageId] = useState<string | null>(null);
  const [selectedNewParentId, setSelectedNewParentId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      try {
        const res = await onDuplicatePageAction(id);
        if (res.success && res.newId) {
          showFeedback('Sayfa kopyalandı, düzenleyiciye yönlendiriliyorsunuz.');
          router.push(`/admin/pages/${res.newId}`);
        } else {
          showFeedback(res.error || 'Sayfa kopyalanamadı.', 'error');
        }
      } catch (err: any) {
        showFeedback(err?.message || 'Sayfa kopyalanamadı.', 'error');
      }
    });
  };

  const handleBulkPublish = (isPublished: boolean) => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      try {
        const res = await onBulkSetPublishedAction(ids, isPublished);
        if (res.success) {
          showFeedback(`${res.count ?? ids.length} sayfa ${isPublished ? 'yayına alındı' : 'taslağa çevrildi'}.`);
          clearSelection();
        } else {
          showFeedback(res.error || 'Toplu güncelleme başarısız.', 'error');
        }
      } catch (err: any) {
        showFeedback(err?.message || 'Toplu güncelleme başarısız.', 'error');
      }
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (!confirm(`${ids.length} sayfayı silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        const res = await onBulkDeletePagesAction(ids);
        if (res.success) {
          showFeedback(
            `${res.deletedCount ?? 0} sayfa silindi.${res.skippedHome ? ' Ana sayfa silinemediği için atlandı.' : ''}`
          );
          clearSelection();
        } else {
          showFeedback(res.error || 'Toplu silme başarısız.', 'error');
        }
      } catch (err: any) {
        showFeedback(err?.message || 'Toplu silme başarısız.', 'error');
      }
    });
  };

  // Toggle expand/collapse
  const toggleCollapse = (id: string) => {
    setCollapsedParents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Reorder siblings
  const handleReorder = (pageId: string, dir: 'up' | 'down') => {
    startTransition(async () => {
      try {
        const res = await reorderPage(pageId, dir);
        if (res.success) {
          showFeedback('Sıralama güncellendi.');
        }
      } catch (err: any) {
        showFeedback(err?.message || 'Sıralama değiştirilemedi.', 'error');
      }
    });
  };

  // Move page under another parent
  const handleReparent = (pageId: string) => {
    startTransition(async () => {
      try {
        const res = await updatePageHierarchy(pageId, selectedNewParentId || null);
        if (res.success) {
          showFeedback('Sayfa üst ebeveyni başarıyla değiştirildi.');
          setMovingPageId(null);
        }
      } catch (err: any) {
        showFeedback(err?.message || 'Üst sayfa değiştirilemedi.', 'error');
      }
    });
  };

  // Auto heal
  const handleAutoHeal = () => {
    startTransition(async () => {
      try {
        const res = await syncPageHierarchy();
        if (res.success) {
          showFeedback(`${res.updatedCount} sayfanın hiyerarşisi otomatik onarıldı.`);
        }
      } catch (err: any) {
        showFeedback('Hiyerarşi onarılamadı.', 'error');
      }
    });
  };

  // Filtered pages for search + durum filtresi
  const filteredPages = pages.filter(p => {
    if (statusFilter === 'published' && !p.isPublished) return false;
    if (statusFilter === 'draft' && p.isPublished) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  // Calculate tree nodes
  const rootPages = filteredPages.filter(p => !p.parentId && p.slug !== 'home');
  const homePage = pages.find(p => p.slug === 'home');

  // Map of children by parentId
  const childrenMap = new Map<string, PageNode[]>();
  pages.forEach(p => {
    if (p.parentId) {
      const existing = childrenMap.get(p.parentId) || [];
      existing.push(p);
      childrenMap.set(p.parentId, existing);
    }
  });

  // Sort children by order
  childrenMap.forEach((list) => {
    list.sort((a, b) => a.order - b.order);
  });

  const totalSubpages = pages.filter(p => p.parentId).length;
  const totalRootPages = pages.filter(p => !p.parentId && p.slug !== 'home').length;

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className={feedbackMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'} />
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs opacity-70 hover:opacity-100 font-bold">Kapat</button>
        </div>
      )}

      {/* Stats and Controls Row */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
            <Layers size={14} className="text-blue-600" />
            Toplam {pages.length} Sayfa
          </span>
          <span className="bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-lg font-medium">
            📁 {totalRootPages} Üst Düzey Sayfa
          </span>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
            ↳ {totalSubpages} Alt Sayfa
          </span>
        </div>

        {/* View Switcher & Search & Healing */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            {([
              ['all', 'Tümü'],
              ['published', 'Yayında'],
              ['draft', 'Taslak'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  statusFilter === value ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sayfa veya URL ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleAutoHeal}
            disabled={isPending}
            className="p-1.5 text-gray-600 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="URL'leri tarayarak eksik üst/alt sayfa hiyerarşilerini otomatik bağlar"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="hidden sm:inline">Hiyerarşiyi Tara & Onar</span>
          </button>

          <div className="bg-gray-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'tree' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderTree size={14} />
              <span>Ağaç Görünümü</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={14} />
              <span>Düz Tablo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Move Parent Modal / Inline Selector */}
      {movingPageId && (() => {
        const target = pages.find(p => p.id === movingPageId);
        if (!target) return null;

        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <MoveRight size={14} className="text-blue-600" />
                <span>Sayfayı Başka Bir Üst Sayfaya Taşı: <strong>{target.title}</strong></span>
              </div>
              <p className="text-[11px] text-blue-700">
                Bu sayfanın yeni üst ebeveynini seçin veya ana sayfa seviyesine çıkarın.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedNewParentId}
                onChange={(e) => setSelectedNewParentId(e.target.value)}
                className="border border-blue-300 rounded-lg p-1.5 text-xs bg-white text-gray-800 flex-1 sm:w-60"
              >
                <option value="">(Kök / Bağımsız Ana Seviye)</option>
                {pages
                  .filter(p => p.id !== target.id && p.slug !== 'home' && p.parentId !== target.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      📁 {p.title} (/{p.slug})
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => handleReparent(target.id)}
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Taşı
              </button>
              <button
                type="button"
                onClick={() => setMovingPageId(null)}
                className="px-2.5 py-1.5 border rounded-lg text-xs text-gray-600 hover:bg-gray-100 bg-white"
              >
                Vazgeç
              </button>
            </div>
          </div>
        );
      })()}

      {/* Toplu İşlem Çubuğu */}
      {selectedIds.size > 0 && (
        <div className="sticky top-2 z-20 bg-gray-900 text-white rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <span className="text-sm font-semibold">{selectedIds.size} sayfa seçili</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkPublish(true)}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Yayınla
            </button>
            <button
              type="button"
              onClick={() => handleBulkPublish(false)}
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Taslağa Al
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Sil
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 pl-1"
            >
              <XCircle size={14} /> Seçimi Temizle
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: HIERARCHICAL TREE VIEW */}
      {viewMode === 'tree' ? (
        <div className="space-y-3">
          {rootPages.length === 0 ? (
            <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
              {searchQuery ? 'Aramanıza uygun sayfa bulunamadı.' : 'Henüz sayfa oluşturulmamış.'}
            </div>
          ) : (
            rootPages.map((rootPage, rIdx) => {
              const children = childrenMap.get(rootPage.id) || [];
              const isCollapsed = !!collapsedParents[rootPage.id];
              const isSystem = systemSlugs.includes(rootPage.slug);
              const pageUrl = `/${rootPage.slug}`;

              return (
                <div key={rootPage.id} className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden transition-all">
                  
                  {/* Root Page Row */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Collapse / Expand Toggle if has children */}
                      {children.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => toggleCollapse(rootPage.id)}
                          className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                          title={isCollapsed ? 'Alt Sayfaları Göster' : 'Alt Sayfaları Gizle'}
                        >
                          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                        </button>
                      ) : (
                        <div className="w-6 flex justify-center text-gray-300">•</div>
                      )}

                      {/* Icon */}
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100/80 shrink-0">
                        <FolderTree size={17} />
                      </div>

                      {/* Title & Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">{rootPage.title}</h3>
                          {children.length > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {children.length} Alt Sayfa
                            </span>
                          )}
                          {isSystem && (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                              Sistem
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${rootPage.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {rootPage.isPublished ? 'Yayında' : 'Taslak'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 font-mono">
                          <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1 hover:underline">
                            {pageUrl}
                            <ExternalLink size={10} className="text-gray-400" />
                          </a>
                          <span>•</span>
                          <span className="text-gray-400 font-sans">{rootPage.sectionsCount} Bölüm</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-center">
                      {/* Move Up/Down among siblings */}
                      <button
                        type="button"
                        onClick={() => handleReorder(rootPage.id, 'up')}
                        disabled={rIdx === 0 || isPending}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-20 transition-colors"
                        title="Yukarı Taşı"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(rootPage.id, 'down')}
                        disabled={rIdx === rootPages.length - 1 || isPending}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-20 transition-colors"
                        title="Aşağı Taşı"
                      >
                        <ArrowDown size={13} />
                      </button>

                      {/* Add Subpage shortcut */}
                      <Link
                        href={`/admin/pages/new?parentId=${rootPage.id}`}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-200/80"
                        title="Bu sayfanın altına yeni bir alt sayfa ekle"
                      >
                        <FolderPlus size={13} />
                        <span className="hidden sm:inline">Alt Sayfa Ekle</span>
                      </Link>

                      {/* Reparent button */}
                      <button
                        type="button"
                        onClick={() => {
                          setMovingPageId(rootPage.id);
                          setSelectedNewParentId('');
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-200 transition-colors"
                        title="Üst Sayfayı Değiştir"
                      >
                        <MoveRight size={13} />
                      </button>

                      {/* Edit Button */}
                      <Link
                        href={`/admin/pages/${rootPage.id}`}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200/80"
                      >
                        <Edit size={13} />
                        <span>Düzenle</span>
                      </Link>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(rootPage.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded border border-gray-200 transition-colors disabled:opacity-50"
                        title="Sayfayı Kopyala"
                      >
                        <Copy size={13} />
                      </button>

                      {/* Delete */}
                      {!isSystem && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`"${rootPage.title}" sayfasını silmek istediğinize emin misiniz?`)) {
                              onDeletePageAction(rootPage.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
                          title="Sayfayı Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Children List */}
                  {!isCollapsed && children.length > 0 && (
                    <div className="bg-slate-50/60 border-t border-gray-100 divide-y divide-gray-100 pl-8 sm:pl-10 pr-4 py-1">
                      {children.map((child, cIdx) => {
                        const childUrl = `/${child.slug}`;
                        const isChildSystem = systemSlugs.includes(child.slug);

                        return (
                          <div key={child.id} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-blue-50/40 rounded-lg px-2 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <CornerDownRight size={15} className="text-blue-500 shrink-0" />
                              <div className="p-1.5 rounded-md bg-white text-gray-700 border border-gray-200 shrink-0">
                                <FileText size={14} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-gray-900">{child.title}</h4>
                                  <span className="text-[10px] bg-slate-200/80 text-slate-700 font-semibold px-2 py-0.2 rounded">
                                    Alt Sayfa
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${child.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {child.isPublished ? 'Yayında' : 'Taslak'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono mt-0.5">
                                  <a href={childUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1 hover:underline">
                                    {childUrl}
                                    <ExternalLink size={9} className="text-gray-400" />
                                  </a>
                                  <span>•</span>
                                  <span className="text-gray-400 font-sans">{child.sectionsCount} Bölüm</span>
                                </div>
                              </div>
                            </div>

                            {/* Child Actions */}
                            <div className="flex items-center gap-1.5 self-end md:self-center">
                              {/* Reorder among siblings */}
                              <button
                                type="button"
                                onClick={() => handleReorder(child.id, 'up')}
                                disabled={cIdx === 0 || isPending}
                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded border border-gray-200 disabled:opacity-20 transition-colors"
                                title="Yukarı Taşı"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReorder(child.id, 'down')}
                                disabled={cIdx === children.length - 1 || isPending}
                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded border border-gray-200 disabled:opacity-20 transition-colors"
                                title="Aşağı Taşı"
                              >
                                <ArrowDown size={12} />
                              </button>

                              {/* Reparent button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setMovingPageId(child.id);
                                  setSelectedNewParentId(child.parentId || '');
                                }}
                                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-white rounded border border-gray-200 transition-colors"
                                title="Üst Sayfayı Değiştir"
                              >
                                <MoveRight size={12} />
                              </button>

                              {/* Edit Button */}
                              <Link
                                href={`/admin/pages/${child.id}`}
                                className="bg-white text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200"
                              >
                                <Edit size={12} />
                                <span>Düzenle</span>
                              </Link>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={() => handleDuplicate(child.id)}
                                disabled={isPending}
                                className="p-1 text-gray-500 hover:text-purple-700 hover:bg-white rounded border border-gray-200 transition-colors disabled:opacity-50"
                                title="Sayfayı Kopyala"
                              >
                                <Copy size={12} />
                              </button>

                              {/* Delete Button */}
                              {!isChildSystem && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`"${child.title}" alt sayfasını silmek istediğinize emin misiniz?`)) {
                                      onDeletePageAction(child.id);
                                    }
                                  }}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
                                  title="Alt Sayfayı Sil"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW MODE 2: FLAT TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/75">
              <tr>
                <th className="px-4 py-3.5 text-left w-8">
                  <input
                    type="checkbox"
                    checked={filteredPages.filter(p => p.slug !== 'home').length > 0 && filteredPages.filter(p => p.slug !== 'home').every(p => selectedIds.has(p.id))}
                    onChange={(e) => {
                      const ids = filteredPages.filter(p => p.slug !== 'home').map(p => p.id);
                      setSelectedIds(e.target.checked ? new Set(ids) : new Set());
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sayfa Adı</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hiyerarşi / Üst Sayfa</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">URL Slug</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bölüm</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Son Yayınlayan</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.filter(p => p.slug !== 'home').map((page) => {
                const isSystem = systemSlugs.includes(page.slug);
                const pageUrl = `/${page.slug}`;
                const editedRel = relativeTime(page.lastEditedAt);

                return (
                  <tr key={page.id} className={`hover:bg-gray-50/80 transition-colors ${selectedIds.has(page.id) ? 'bg-blue-50/60' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(page.id)}
                        onChange={() => toggleSelected(page.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <span>{page.title}</span>
                            {isSystem && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Sistem
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      {page.parent ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          <CornerDownRight size={12} /> {page.parent.title}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">(Kök / Ana Seviye)</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 inline-flex items-center gap-1 hover:underline">
                        {pageUrl}
                        <ExternalLink size={12} className="text-gray-400" />
                      </a>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{page.sectionsCount}</span> bölüm
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {page.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {page.lastEditedByName ? (
                        <span>{page.lastEditedByName} <span className="text-gray-400">· {editedRel}</span></span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/pages/${page.id}`}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit size={14} />
                          <span>Düzenle</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(page.id)}
                          disabled={isPending}
                          className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
                          title="Sayfayı Kopyala"
                        >
                          <Copy size={14} />
                        </button>
                        {!isSystem && (
                          <button 
                            type="button" 
                            onClick={() => {
                              if (confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) {
                                onDeletePageAction(page.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors" 
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
