'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploadInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  defaultValue?: string;
}

export default function ImageUploadInput({ value: propValue, onChange, placeholder = "Görsel URL'si (http://...) veya bilgisayardan seç", className = "", name, defaultValue }: ImageUploadInputProps & { defaultValue?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    if (onChange) onChange(val);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
          handleChange(data.url);
        }
      } else {
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Hata oluştu.');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
        />
        <label className={`cursor-pointer flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}>
          <UploadCloud size={16} />
          <span>{isUploading ? 'Yükleniyor...' : 'Seç'}</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            disabled={isUploading}
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
}
