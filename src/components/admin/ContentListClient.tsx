'use client';

import { useState, useTransition } from 'react';
import { Eye, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { deleteModelRecord } from '@/actions/admin';

const NewsPreview = dynamic(() => import('./previews/NewsPreview'), { ssr: false });
const CoursePreview = dynamic(() => import('./previews/CoursePreview'), { ssr: false });
const ProjectPreview = dynamic(() => import('./previews/ProjectPreview'), { ssr: false });
const TeamMemberPreview = dynamic(() => import('./previews/TeamMemberPreview'), { ssr: false });
const GalleryImagePreview = dynamic(() => import('./previews/GalleryImagePreview'), { ssr: false });

function PreviewComponent({ model, data }: { model: string; data: Record<string, string> }) {
  switch (model) {
    case 'News':         return <NewsPreview data={data} />;
    case 'Course':       return <CoursePreview data={data} />;
    case 'Project':      return <ProjectPreview data={data} />;
    case 'TeamMember':   return <TeamMemberPreview data={data} />;
    case 'GalleryImage': return <GalleryImagePreview data={data} />;
    default:             return <div className="text-gray-500 p-4 text-sm">Önizleme mevcut değil.</div>;
  }
}

// Record'ı flat string map'e çevir (design JSON'u düzleştir)
function flattenRecord(record: Record<string, any>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(record)) {
    if (k === 'design' && v && typeof v === 'object') {
      for (const [dk, dv] of Object.entries(v as Record<string, any>)) {
        flat[dk] = String(dv ?? '');
      }
    } else {
      flat[k] = v instanceof Date ? v.toISOString() : String(v ?? '');
    }
  }
  return flat;
}

interface ContentListClientProps {
  model: string;
  records: Record<string, any>[];
  displayKeys: string[];
}

export default function ContentListClient({
  model,
  records,
  displayKeys,
}: ContentListClientProps) {
  const [previewRecord, setPreviewRecord] = useState<Record<string, string> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteModelRecord(model, id);
      } catch (err) {
        alert('Kayıt silinirken bir hata oluştu.');
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {displayKeys.map(key => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {key}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                {displayKeys.map(key => (
                  <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(record[key] ?? '').substring(0, 50)}
                    {String(record[key] ?? '').length > 50 ? '...' : ''}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-3">
                    {/* Önizle */}
                    <button
                      type="button"
                      onClick={() => setPreviewRecord(flattenRecord(record))}
                      className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded hover:bg-purple-50"
                      title="Önizle"
                    >
                      <Eye size={18} />
                    </button>
                    {/* Düzenle */}
                    <Link 
                      href={`/admin/content/${model}/${record.id}`} 
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50" 
                      title="Düzenle"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    {/* Sil */}
                    <button
                      type="button"
                      disabled={isPending && deletingId === record.id}
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-40"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== ÖNIZLEME MODAL ===== */}
      {previewRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewRecord(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Kapat butonu */}
            <button
              onClick={() => setPreviewRecord(null)}
              className="absolute top-3 right-3 z-20 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
              title="Kapat"
            >
              <X size={18} className="text-gray-700" />
            </button>

            <PreviewComponent model={model} data={previewRecord} />
          </div>
        </div>
      )}
    </>
  );
}
