'use client';

import { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';

interface AutoTranslateButtonProps {
  fieldsToTranslate: Record<string, string>;
  onTranslationComplete: (translations: any) => void;
  targetLanguages?: string[];
}

export default function AutoTranslateButton({ 
  fieldsToTranslate, 
  onTranslationComplete, 
  targetLanguages = ['en', 'tr', 'ar'] 
}: AutoTranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    // Sadece dolu alanları çevir
    const validFields = Object.fromEntries(
      Object.entries(fieldsToTranslate).filter(([_, v]) => typeof v === 'string' && v.trim().length > 0)
    );

    if (Object.keys(validFields).length === 0) {
      alert("Çevrilecek dolu bir alan bulunamadı.");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: validFields, targetLanguages })
      });

      const data = await res.json();
      if (data.success && data.translations) {
        onTranslationComplete(data.translations);
        alert("Çeviriler başarıyla tamamlandı!");
      } else {
        alert(data.error || "Çeviri başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={isTranslating}
      className="flex items-center space-x-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isTranslating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Languages className="w-4 h-4" />
      )}
      <span>{isTranslating ? 'Yapay Zeka Çeviriyor...' : 'Otomatik Çevir (AI)'}</span>
    </button>
  );
}
