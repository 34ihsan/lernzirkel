'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageUploadInput from './ImageUploadInput';

// Lazy-load preview bileşenleri
const NewsPreview = dynamic(() => import('./previews/NewsPreview'), { ssr: false });
const CoursePreview = dynamic(() => import('./previews/CoursePreview'), { ssr: false });
const ProjectPreview = dynamic(() => import('./previews/ProjectPreview'), { ssr: false });
const TeamMemberPreview = dynamic(() => import('./previews/TeamMemberPreview'), { ssr: false });
const GalleryImagePreview = dynamic(() => import('./previews/GalleryImagePreview'), { ssr: false });

interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[];
  isDesign?: boolean;
}

interface EditFormWithPreviewProps {
  model: string;
  fields: Field[];
  initialData: Record<string, string>;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

function PreviewComponent({ model, data }: { model: string; data: Record<string, string> }) {
  switch (model) {
    case 'News':        return <NewsPreview data={data} />;
    case 'Course':      return <CoursePreview data={data} />;
    case 'Project':     return <ProjectPreview data={data} />;
    case 'TeamMember':  return <TeamMemberPreview data={data} />;
    case 'GalleryImage': return <GalleryImagePreview data={data} />;
    default:            return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500">
        Bu model için önizleme desteklenmiyor.
      </div>
    );
  }
}

export default function EditFormWithPreview({
  model,
  fields,
  initialData,
  action,
  submitLabel,
}: EditFormWithPreviewProps) {
  // Flatten: design alanlarını da flat objeye al
  const flattenInitial = (raw: Record<string, string>) => {
    const flat: Record<string, string> = { ...raw };
    // design JSON alanı varsa düzleştir
    if ((raw as any).design && typeof (raw as any).design === 'object') {
      Object.entries((raw as any).design).forEach(([k, v]) => {
        flat[k] = String(v ?? '');
      });
    }
    return flat;
  };

  const [formData, setFormData] = useState<Record<string, string>>(flattenInitial(initialData));
  const [showPreview, setShowPreview] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (name: string, file: File) => {
    if (!file) return;
    setIsUploading(prev => ({ ...prev, [name]: true }));
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
          handleChange(name, data.url);
        }
      } else {
        alert('Dosya yüklenemedi.');
      }
    } catch (e) {
      alert('Hata oluştu.');
    } finally {
      setIsUploading(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(fd);
    });
  };

  const formatDate = (val: string) => {
    if (!val) return '';
    try {
      return new Date(val).toISOString().split('T')[0];
    } catch {
      return val;
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* ===== FORM ===== */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Alanları doldururken önizleme anında güncellenir.</p>
          <button
            type="button"
            onClick={() => setShowPreview(p => !p)}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 transition-colors xl:hidden"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showPreview ? 'Önizlemeyi Gizle' : 'Önizlemeyi Göster'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
          {fields.map(field => {
            const rawVal = formData[field.name] ?? '';
            const displayVal = field.type === 'date' ? formatDate(rawVal) : rawVal;

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.isDesign && (
                    <span className="ml-2 text-xs font-normal text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">tasarım</span>
                  )}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={displayVal}
                    onChange={e => handleChange(field.name, e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  />
                ) : field.type === 'enum' && field.options ? (
                  <select
                    name={field.name}
                    value={displayVal}
                    onChange={e => handleChange(field.name, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={displayVal === 'true' || displayVal === 'on'}
                    onChange={e => handleChange(field.name, e.target.checked ? 'true' : 'false')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 h-4 w-4"
                  />
                ) : field.type === 'color' ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name={field.name}
                      value={/^#[0-9A-Fa-f]{6}$/i.test(displayVal || '') ? displayVal : '#000000'}
                      onChange={e => handleChange(field.name, e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={displayVal || '#000000'}
                      onChange={e => handleChange(field.name, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                ) : field.type === 'image' ? (
                  <ImageUploadInput 
                    name={field.name} 
                    value={displayVal} 
                    onChange={v => handleChange(field.name, v)} 
                  />
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    name={field.name}
                    value={displayVal}
                    onChange={e => handleChange(field.name, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required={!field.isDesign}
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isPending && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A8 8 0 014 12z" />
                </svg>
              )}
              <span>{isPending ? 'Kaydediliyor...' : submitLabel}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ===== ÖNIZLEME PANELİ ===== */}
      {showPreview && (
        <div className="xl:w-[420px] xl:shrink-0">
          <div className="sticky top-6">
            <div className="flex items-center space-x-2 mb-3">
              <Eye size={16} className="text-gray-400" />
              <p className="text-sm font-semibold text-gray-600">Canlı Önizleme</p>
              <span className="ml-auto flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <PreviewComponent model={model} data={formData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
