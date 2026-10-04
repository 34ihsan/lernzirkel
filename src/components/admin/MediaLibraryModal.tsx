"use client";

import { useState, useEffect, useRef } from "react";
import { X, UploadCloud, Image as ImageIcon, Search, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Add to local state immediately
          setFiles((prev) => [
            {
              name: file.name,
              url: data.url,
              size: file.size,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
          onSelect(data.url);
          onClose();
        }
      } else {
        alert("Dosya yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("Hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <ImageIcon className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Medya Kütüphanesi</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Dosya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-all border"
            />
          </div>

          <div className="flex items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              disabled={uploading}
              onChange={handleUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
              <span>{uploading ? "Yükleniyor..." : "Yeni Görsel Yükle"}</span>
            </button>
          </div>
        </div>

        {/* Grid Area */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p>Medyalar yükleniyor...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-300" />
              </div>
              <p>{searchQuery ? "Arama kriterlerine uygun görsel bulunamadı." : "Henüz görsel yüklenmemiş."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div 
                  key={file.url}
                  onClick={() => {
                    onSelect(file.url);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-xl border border-gray-200 bg-white overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="absolute inset-0 bg-gray-100">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <CheckCircle className="text-blue-600" size={24} />
                    </div>
                  </div>

                  {/* File info footer */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-[10px] text-white truncate font-medium">{file.name}</p>
                    <p className="text-[9px] text-white/70">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
