'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FolderTree, Globe, Hash, Layers } from 'lucide-react';

interface ParentPageItem {
  id: string;
  title: string;
  slug: string;
  parentId?: string | null;
}

interface Props {
  parentPages: ParentPageItem[];
  initialParentId?: string;
  onSubmitAction: (formData: FormData) => Promise<void>;
}

export default function NewPageForm({ parentPages, initialParentId, onSubmitAction }: Props) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>(initialParentId || '');
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find currently selected parent
  const selectedParent = parentPages.find(p => p.id === parentId);
  const parentSlug = selectedParent ? selectedParent.slug : '';

  // Auto-generate slug from title
  const generateSlugFromTitle = () => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setSlug(generated);
  };

  const finalUrlPath = selectedParent 
    ? `/${parentSlug}/${slug || 'sayfa-slugi'}`
    : `/${slug || 'sayfa-slugi'}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // form will be processed by server action passed to action
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center space-x-4 border-b pb-4">
        <Link 
          href="/admin/pages" 
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Sayfalar Listesine Dön"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="text-blue-600 w-6 h-6" />
            Yeni Sayfa Oluştur
          </h1>
          <p className="text-sm text-gray-500">
            {selectedParent ? (
              <span>
                <strong className="text-blue-600 font-semibold">{selectedParent.title}</strong> sayfasının altına yeni bir alt sayfa ekliyorsunuz.
              </span>
            ) : (
              'Yeni bir ana veya üst düzey sayfa oluşturun.'
            )}
          </p>
        </div>
      </div>

      <form action={onSubmitAction} onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Parent Page Selector */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <FolderTree size={16} className="text-blue-600" />
              Üst Sayfa (Hiyerarşi / Parent)
            </label>
            {selectedParent && (
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Alt Sayfa Olarak Eklenecek
              </span>
            )}
          </div>
          <select 
            name="parentId" 
            value={parentId} 
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border-blue-200 rounded-lg shadow-xs focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm bg-white font-medium"
          >
            <option value="">(Yok - Bu bir Ana / Bağımsız Üst Düzey Sayfadır)</option>
            {parentPages.map(p => (
              <option key={p.id} value={p.id}>
                {p.parentId ? '  └── ' : '📁 '} {p.title} (/{p.slug})
              </option>
            ))}
          </select>
          <p className="text-xs text-blue-700/80">
            Bir üst sayfa seçtiğinizde sayfa otomatik olarak o sayfanın altında hiyerarşik olarak konumlandırılır.
          </p>
        </div>

        {/* Page Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-gray-800">
              Sayfa Başlığı <span className="text-red-500">*</span>
            </label>
            {title && (
              <button
                type="button"
                onClick={generateSlugFromTitle}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                title="Başlıktan otomatik SEO uyumlu URL üret"
              >
                <Sparkles size={13} />
                <span>Slug'ı Başlıktan Üret</span>
              </button>
            )}
          </div>
          <input 
            type="text" 
            name="title" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-xs focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 border text-sm" 
            placeholder="Örn: Nachhilfe & Förderung" 
          />
        </div>

        {/* URL Slug with Prefix & Preview */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            URL Parçası (Slug) <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-lg shadow-xs overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 text-xs font-mono font-medium border-r border-gray-300">
              {selectedParent ? `/${parentSlug}/` : '/'}
            </span>
            <input 
              type="text" 
              name="slug" 
              required 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              className="flex-1 block w-full text-sm border-0 focus:ring-0 px-3 py-2 font-mono text-gray-800" 
              placeholder="nachhilfe" 
            />
          </div>
          
          {/* Live Full URL Preview Card */}
          <div className="mt-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-500 flex items-center gap-1">
              <Globe size={13} className="text-blue-600" /> Tam Web Bağlantısı:
            </span>
            <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-gray-200">
              {finalUrlPath}
            </span>
          </div>
        </div>

        {/* Order / Sıralama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1">
              <Hash size={14} className="text-gray-500" />
              Sıralama Numarası (Order)
            </label>
            <input 
              type="number" 
              name="order" 
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full border-gray-300 rounded-lg shadow-xs focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border text-sm" 
              placeholder="0" 
            />
            <p className="mt-1 text-[11px] text-gray-500">Aynı üst sayfaya bağlı sayfalar arasındaki görüntüleme sırası (küçükten büyüğe).</p>
          </div>
        </div>

        {/* Description (SEO / Meta) */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Açıklama (SEO / Meta)</label>
          <textarea 
            name="description" 
            rows={3} 
            className="w-full border-gray-300 rounded-lg shadow-xs focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 border text-sm" 
            placeholder="Sayfanın arama motorlarında ve paylaşımlarda görünecek kısa özeti..." 
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t flex items-center justify-end space-x-3">
          <Link
            href="/admin/pages"
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            İptal
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span>{isSubmitting ? 'Sayfa Oluşturuluyor...' : 'Sayfayı Oluştur ve Tasarıma Başla'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
