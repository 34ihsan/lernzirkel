"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnnouncement, updateAnnouncement, AnnouncementData } from "@/actions/admin";
import { Settings, MousePointerClick, CalendarClock, Save, ArrowLeft, Info, AlertTriangle, Megaphone, X } from "lucide-react";
import Link from "next/link";

interface AnnouncementFormData {
  title: string;
  message: string;
  isActive: boolean;
  isCloseable: boolean;
  startDate: string | null;
  endDate: string | null;
  targetScope: string;
  targetPageSlugs: string[];
  type: string;
  position: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontSize: string;
  fontWeight: string;
  padding: string;
  icon: string;
  animation: string;
  animationSpeed: string;
  duration: number;
  isInline: boolean;
  linkUrl: string | null;
  linkText: string | null;
}

export default function AnnouncementForm({ 
  initialData, 
  id, 
  pages 
}: { 
  initialData?: AnnouncementData, 
  id?: string,
  pages: { id: string, slug: string, title: string }[] 
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "style" | "targeting">("content");

  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: initialData?.title || "",
    message: initialData?.message || "",
    isActive: initialData?.isActive ?? true,
    isCloseable: true, // Always true as requested
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    targetScope: "ALL", // Always all pages
    targetPageSlugs: [],
    type: initialData?.type === "popup" ? "popup" : "sticky-bar",
    position: "top", // Always top if sticky-bar
    backgroundColor: initialData?.backgroundColor || "#1a6d92",
    textColor: initialData?.textColor || "#ffffff",
    borderColor: initialData?.borderColor || "transparent",
    fontSize: initialData?.fontSize || "14px",
    fontWeight: initialData?.fontWeight || "normal",
    padding: initialData?.padding || "12px 16px",
    icon: initialData?.icon || "megaphone",
    animation: "none",
    animationSpeed: "normal",
    duration: initialData?.duration ?? 3, // Repurposed for popup delay
    isInline: true,
    linkUrl: initialData?.linkUrl || "",
    linkText: initialData?.linkText || "Tıklayın",
  });

  const handleSave = async () => {
    if (!formData.title || !formData.message) {
      alert("Lütfen başlık ve mesaj alanlarını doldurun.");
      return;
    }

    setIsSaving(true);
    try {
      if (id) {
        await updateAnnouncement(id, formData);
      } else {
        await createAnnouncement(formData);
      }
      
      router.push("/admin/announcements");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/announcements" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{id ? "Duyuruyu Düzenle" : "Yeni Duyuru Oluştur"}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Save size={18} />
          <span>{isSaving ? "Kaydediliyor..." : "Kaydet"}</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6 max-w-2xl">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gösterim Şekli</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sticky-bar">Sayfanın En Üstünde (Header Banner)</option>
              <option value="popup">Ekranın Ortasında Açılır Pencere (Pop-up)</option>
            </select>
          </div>

          {formData.type === "popup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pop-up Ne Zaman Açılsın?</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3 Saniye Sonra Otomatik Açılsın</option>
                <option value={5}>5 Saniye Sonra Otomatik Açılsın</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Örn: Yeni Dönem Kayıtları"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj İçeriği</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Duyuru metnini buraya yazın..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yönlendirme Linki (Opsiyonel)</label>
              <input
                type="url"
                value={formData.linkUrl || ""}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buton Yazısı</label>
              <input
                type="text"
                value={formData.linkText || ""}
                onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: Detaylı Bilgi"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Aktif Mi?</h4>
              <p className="text-xs text-gray-500">Kapatırsanız duyuru hiçbir yerde görünmez.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Görünüm ve Zaman Ayarları</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi (Opsiyonel)</label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi (Opsiyonel)</label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arkaplan Rengi</label>
                <div className="flex space-x-2">
                  <input 
                    type="color" 
                    value={/^#[0-9A-Fa-f]{6}$/.test(formData.backgroundColor) ? formData.backgroundColor : '#1a6d92'} 
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})} 
                    className="h-10 w-10 rounded border border-gray-300 p-1 cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={formData.backgroundColor} 
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})} 
                    className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metin Rengi</label>
                <div className="flex space-x-2">
                  <input 
                    type="color" 
                    value={/^#[0-9A-Fa-f]{6}$/.test(formData.textColor) ? formData.textColor : '#ffffff'} 
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})} 
                    className="h-10 w-10 rounded border border-gray-300 p-1 cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={formData.textColor} 
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})} 
                    className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Boyutu</label>
                <input
                  type="text"
                  value={formData.fontSize}
                  onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: 16px"
                />
              </div>
            </div>

            {formData.type === "sticky-bar" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Animasyon Efekti</label>
                  <select
                    value={formData.animation || "none"}
                    onChange={(e) => setFormData({ ...formData, animation: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">Yok (Sabit)</option>
                    <option value="marquee">Kayan Yazı</option>
                    <option value="shimmer">Sihirli Parıltı</option>
                    <option value="pulse">Dikkat Çekici (Pulse)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Animasyon Hızı</label>
                  <select
                    value={formData.animationSpeed || "normal"}
                    onChange={(e) => setFormData({ ...formData, animationSpeed: e.target.value })}
                    disabled={formData.animation === "none"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="slow">Yavaş</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Hızlı</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
