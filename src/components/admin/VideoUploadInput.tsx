'use client';

import { useState, useRef } from 'react';
import { Video, Loader2 } from 'lucide-react';

interface VideoUploadInputProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const MAX_SIZE_MB = 50;

export default function VideoUploadInput({ value, onChange, name }: VideoUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Video çok büyük (maksimum ${MAX_SIZE_MB}MB). Paylaşımlı sunucu depolamasını korumak için bu sınır konuldu.`);
      return;
    }
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/gallery-video', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Video yüklenemedi.');
        return;
      }
      onChange?.(data.url);
    } catch {
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder="Video URL'si veya dosya yükleyin"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center space-x-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
          <span>{isUploading ? 'Yükleniyor...' : 'Video Yükle'}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <video src={value} controls className="mt-2 w-48 rounded-md border border-gray-200 bg-gray-50" />
      )}
    </div>
  );
}
