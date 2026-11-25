'use client';

import { useState, useTransition, useRef } from 'react';
import { FileText, FileSpreadsheet, FileType, Upload, Download, Trash2, Loader2 } from 'lucide-react';
import { deleteDepotDocument } from '@/actions/depot';

interface DepotDocumentRow {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  category: string | null;
  uploadedByName: string;
  createdAt: string | Date;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return <FileSpreadsheet className="text-green-600" size={20} />;
  }
  if (mimeType.includes('word')) {
    return <FileType className="text-blue-600" size={20} />;
  }
  return <FileText className="text-red-600" size={20} />;
}

export default function DepotClient({ documents, canUpload }: { documents: DepotDocumentRow[]; canUpload: boolean }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError(null);
    const fd = new FormData(e.currentTarget);
    if (!fd.get('file') || (fd.get('file') as File).size === 0) {
      setUploadError('Lütfen bir dosya seçin.');
      return;
    }
    setIsUploading(true);
    try {
      const res = await fetch('/api/depo/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Yükleme başarısız.');
        return;
      }
      formRef.current?.reset();
      window.location.reload();
    } catch {
      setUploadError('Beklenmeyen bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu dokümanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDepotDocument(id);
      if (!result.success) alert(result.error);
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-6">
      {canUpload && (
        <form
          ref={formRef}
          onSubmit={handleUpload}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-700">Yeni Doküman Yükle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Başlık (opsiyonel)</label>
              <input name="title" type="text" placeholder="Dosya adı kullanılır" className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Kategori (opsiyonel)</label>
              <input name="category" type="text" placeholder="Örn: Mali Rapor" className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Dosya (pdf, doc, xls vb. — maks. 20MB)</label>
              <input name="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="w-full text-sm" required />
            </div>
          </div>
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{isUploading ? 'Yükleniyor...' : 'Yükle'}</span>
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Henüz doküman yüklenmemiş.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doküman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boyut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yükleyen</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileIcon mimeType={doc.mimeType} />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-gray-400">{doc.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.category || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.uploadedByName}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <a
                        href={`/api/depo/download/${doc.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="İndir"
                      >
                        <Download size={18} />
                      </a>
                      {canUpload && (
                        <button
                          type="button"
                          disabled={isPending && deletingId === doc.id}
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-40"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
