'use client';

import { useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

interface ImageUploadInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  defaultValue?: string;
}

export default function ImageUploadInput({ value: propValue, onChange, placeholder = "Görsel seçin veya URL yapıştırın", className = "", name, defaultValue }: ImageUploadInputProps & { defaultValue?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <LinkIcon size={16} />
          </div>
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
          />
        </div>
        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
        >
          <ImageIcon size={16} />
          <span>Kütüphaneden Seç</span>
        </button>
      </div>
      
      {/* Media Preview (if value exists) */}
      {value && (
        <div className="mt-2 w-32 h-20 rounded-md border border-gray-200 bg-gray-50 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleChange} 
      />
    </div>
  );
}
