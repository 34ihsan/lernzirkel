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
    isCloseable: initialData?.isCloseable ?? true,
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    targetScope: initialData?.targetScope || "ALL",
    targetPageSlugs: initialData?.targetPageSlugs || [],
    type: initialData?.type || "banner",
    position: initialData?.position || "top",
    backgroundColor: initialData?.backgroundColor || "#1a6d92",
    textColor: initialData?.textColor || "#ffffff",
    borderColor: initialData?.borderColor || "transparent",
    fontSize: initialData?.fontSize || "14px",
    fontWeight: initialData?.fontWeight || "normal",
    padding: initialData?.padding || "12px 16px",
    icon: initialData?.icon || "info",
    animation: initialData?.animation || "none",
    animationSpeed: initialData?.animationSpeed || "normal",
    duration: initialData?.duration ?? 7,
    isInline: initialData?.isInline ?? true,
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
      
      // Yönlendirmeyi burada (client side) yapıyoruz
      router.push("/admin/announcements");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
      setIsSaving(false);
    }
  };

  const handleSlugToggle = (slug: string) => {
    if (formData.targetPageSlugs.includes(slug)) {
      setFormData({ ...formData, targetPageSlugs: formData.targetPageSlugs.filter(s => s !== slug) });
    } else {
      setFormData({ ...formData, targetPageSlugs: [...formData.targetPageSlugs, slug] });
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sol Panel - Düzenleme */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings size={18} />
              <span>İçerik</span>
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "style" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MousePointerClick size={18} />
              <span>Stil & Tasarım</span>
            </button>
            <button
              onClick={() => setActiveTab("targeting")}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "targeting" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CalendarClock size={18} />
              <span>Hedefleme & Zaman</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (İç takip veya gösterim için)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Örn: Kış Dönemi Kayıtları Başladı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj İçeriği (HTML destekler)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
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
                      placeholder="Örn: https://example.com/kayit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton/Link Yazısı</label>
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
                    <h4 className="text-sm font-medium text-gray-900">Kullanıcı Kapatabilir mi?</h4>
                    <p className="text-xs text-gray-500">Kullanıcı çarpı ikonuna basarak duyuruyu gizleyebilir.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.isCloseable}
                      onChange={(e) => setFormData({ ...formData, isCloseable: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* STYLE TAB */}
            {activeTab === "style" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Görünüm Tipi</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="banner">Banner (Statik)</option>
                      <option value="sticky-bar">Sticky Bar (Yapışkan)</option>
                      <option value="toast">Toast (Köşe Bildirimi)</option>
                      <option value="popup">Popup (Modal Ortada)</option>
                    </select>
                  </div>
                  {(formData.type === "banner" || formData.type === "sticky-bar") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="top">Üst (Header yanı)</option>
                        <option value="bottom">Alt (Footer altı)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Tek Satırda Göster (İkon, Metin ve Buton Yan Yana)</h4>
                    <p className="text-xs text-gray-500">Kapatılırsa, içerik uzunluğuna göre alt alta geçebilir.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.isInline}
                      onChange={(e) => setFormData({ ...formData, isInline: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arkaplan Rengi</label>
                    <div className="flex space-x-2">
                      <input 
                        type="color" 
                        value={/^#[0-9A-Fa-f]{6}$/.test(formData.backgroundColor) ? formData.backgroundColor : '#1a6d92'} 
                        onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})} 
                        className="h-9 w-9 rounded border border-gray-300 p-0.5 cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={formData.backgroundColor} 
                        onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})} 
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm" 
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
                        className="h-9 w-9 rounded border border-gray-300 p-0.5 cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={formData.textColor} 
                        onChange={(e) => setFormData({...formData, textColor: e.target.value})} 
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kenarlık Rengi</label>
                    <div className="flex space-x-2">
                      <input 
                        type="color" 
                        value={/^#[0-9A-Fa-f]{6}$/.test(formData.borderColor) ? formData.borderColor : '#ffffff'} 
                        onChange={(e) => setFormData({...formData, borderColor: e.target.value})} 
                        className="h-9 w-9 rounded border border-gray-300 p-0.5 cursor-pointer" 
                        title="Renk seç"
                      />
                      <input 
                        type="text" 
                        value={formData.borderColor} 
                        onChange={(e) => setFormData({...formData, borderColor: e.target.value})} 
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm" 
                        placeholder="transparent veya #hex"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Boyutu</label>
                    <input
                      type="text"
                      value={formData.fontSize}
                      onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="14px, 1rem, vb."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Ağırlığı</label>
                    <select
                      value={formData.fontWeight}
                      onChange={(e) => setFormData({ ...formData, fontWeight: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi-Bold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Padding (İç Boşluk)</label>
                    <input
                      type="text"
                      value={formData.padding}
                      onChange={(e) => setFormData({ ...formData, padding: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="12px 16px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="none">İkon Yok</option>
                      <option value="info">Info (Bilgi)</option>
                      <option value="warning">Warning (Uyarı)</option>
                      <option value="megaphone">Megaphone (Duyuru)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Animasyon Efekti</label>
                    <select
                      value={formData.animation || "none"}
                      onChange={(e) => setFormData({ ...formData, animation: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="none">Yok (Sabit)</option>
                      <option value="marquee">Kayan Yazı (Marquee)</option>
                      <option value="shimmer">Sihirli Parıltı (Shimmer)</option>
                      <option value="pulse">Dikkat Çekici (Pulse)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Duyurunun görünümüne dinamik bir efekt ekleyin.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Animasyon Hızı</label>
                    <select
                      value={formData.animationSpeed || 'normal'}
                      onChange={(e) => setFormData({ ...formData, animationSpeed: e.target.value })}
                      disabled={formData.animation === 'none'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white disabled:opacity-50"
                    >
                      <option value="slow">Yavaş (Slow)</option>
                      <option value="normal">Normal (Normal)</option>
                      <option value="fast">Hızlı (Fast)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Animasyonun oynatılma hızını seçin.</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ekranda Kalma Süresi (Saniye)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 7 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Birden fazla duyuru olduğunda her birinin ne kadar süre ekranda kalıp diğerine geçeceğini belirler.</p>
                </div>
              </div>
            )}

            {/* TARGETING & TIME TAB */}
            {activeTab === "targeting" && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Aktif Durumu</h4>
                    <p className="text-xs text-gray-500">Sistemde açık veya kapalı olmasını manuel kontrol edin.</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi (Opsiyonel)</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi (Opsiyonel)</label>
                    <input
                      type="datetime-local"
                      value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Kapsamı</label>
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input type="radio" value="ALL" checked={formData.targetScope === "ALL"} onChange={(e) => setFormData({ ...formData, targetScope: e.target.value })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                      <span className="ml-2 text-sm text-gray-700">Tüm Sayfalar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" value="HOME" checked={formData.targetScope === "HOME"} onChange={(e) => setFormData({ ...formData, targetScope: e.target.value })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                      <span className="ml-2 text-sm text-gray-700">Sadece Ana Sayfa</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" value="SELECTED" checked={formData.targetScope === "SELECTED"} onChange={(e) => setFormData({ ...formData, targetScope: e.target.value })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                      <span className="ml-2 text-sm text-gray-700">Belirli Sayfalar (Aşağıdan Seçin)</span>
                    </label>
                  </div>
                </div>

                {formData.targetScope === "SELECTED" && (
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-48 overflow-y-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Sayfa Seçimi</label>
                    <div className="space-y-2">
                      {pages.map((page) => (
                        <label key={page.id} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.targetPageSlugs.includes(page.slug)}
                            onChange={() => handleSlugToggle(page.slug)}
                            className="text-blue-600 rounded focus:ring-blue-500 h-4 w-4" 
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{page.title}</p>
                            <p className="text-xs text-gray-500">/{page.slug}</p>
                          </div>
                        </label>
                      ))}
                      {pages.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Henüz sayfa oluşturulmamış.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel - Önizleme */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Canlı Önizleme</h3>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 min-h-[400px] flex flex-col relative shadow-inner">
              
              {/* Fake Browser Header */}
              <div className="bg-white border-b border-gray-200 p-2 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-gray-100 h-6 flex-1 rounded-full px-3 flex items-center">
                  <span className="text-[10px] text-gray-400 font-mono">lernzirkel-ludwigshafen.de</span>
                </div>
              </div>

              {/* Fake Page Body */}
              <div className={`flex-1 relative flex flex-col bg-white overflow-hidden ${(formData.type === 'popup' || formData.type === 'toast') ? 'justify-center items-center p-6' : ''}`}>
                
                {(() => {
                  const getPreviewAnimationDuration = () => {
                    if (formData.animation === 'marquee') {
                      return formData.animationSpeed === 'slow' ? '30s' : formData.animationSpeed === 'fast' ? '10s' : '20s';
                    } else if (formData.animation === 'shimmer') {
                      return formData.animationSpeed === 'slow' ? '5s' : formData.animationSpeed === 'fast' ? '1.5s' : '3s';
                    } else if (formData.animation === 'pulse') {
                      return formData.animationSpeed === 'slow' ? '3s' : formData.animationSpeed === 'fast' ? '1s' : '2s';
                    }
                    return undefined;
                  };

                  const previewStyle = {
                    backgroundColor: formData.backgroundColor,
                    color: formData.textColor,
                    fontSize: formData.fontSize,
                    fontWeight: formData.fontWeight,
                    padding: formData.padding,
                    animationDuration: getPreviewAnimationDuration(),
                  };

                  const renderPreviewLink = () => {
                    if (!formData.linkUrl) return null;
                    return (
                      <div 
                        className="shrink-0 px-4 py-1 ml-3 rounded-full font-medium text-sm transition-all hover:scale-105 z-20 relative shadow-sm inline-block cursor-pointer" 
                        style={{ backgroundColor: formData.textColor, color: formData.backgroundColor }}
                      >
                        {formData.linkText || 'Tıklayın'}
                      </div>
                    );
                  };

                  return (
                    <>
                      {/* Banner & Sticky Top */}
                      {(formData.type === "banner" || (formData.type === "sticky-bar" && formData.position === "top")) && (
                        <div 
                          style={{
                            ...previewStyle,
                            borderBottom: formData.type === 'sticky-bar' && /^#[0-9A-Fa-f]{6}$/.test(formData.borderColor) ? `1px solid ${formData.borderColor}` : 'none'
                          }}
                          className={`w-full flex items-center justify-between overflow-hidden shadow-sm group ${formData.animation === 'pulse' ? 'animate-pulse' : ''} ${formData.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
                        >
                          <div 
                            style={formData.animation === 'marquee' ? { animationDuration: previewStyle.animationDuration } : {}}
                            className={`container mx-auto flex ${formData.isInline !== false ? 'flex-row items-center justify-center whitespace-nowrap' : 'flex-col md:flex-row items-center justify-center md:text-left text-center'} gap-3 px-4 relative ${formData.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
                          >
                            {formData.icon !== 'none' && (
                              <div className="flex items-center shrink-0">
                                {formData.icon === 'info' && <Info size={18} />}
                                {formData.icon === 'warning' && <AlertTriangle size={18} />}
                                {formData.icon === 'megaphone' && <Megaphone size={18} />}
                              </div>
                            )}
                            <div dangerouslySetInnerHTML={{ __html: formData.message || "Önizleme metni..." }} className={`${formData.isInline !== false ? '[&>*]:inline [&>*]:m-0 shrink-0' : 'flex-1 max-w-4xl'}`} />
                            {renderPreviewLink()}
                            {formData.isCloseable && (
                              <button className={`${formData.isInline !== false ? 'shrink-0 ml-2' : 'absolute right-4 md:relative md:right-0'} p-1 opacity-70 hover:opacity-100 transition-opacity z-20`}>
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fake Content for context if not popup/toast */}
                      {(formData.type === "banner" || formData.type === "sticky-bar") && (
                        <div className="p-8 space-y-4 flex-1">
                          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                          <div className="h-32 w-full bg-gray-100 rounded mt-8 flex items-center justify-center text-gray-400 text-sm">Site İçeriği</div>
                        </div>
                      )}

                      {/* Toast Preview */}
                      {formData.type === "toast" && (
                        <div 
                          style={{
                            ...previewStyle,
                            border: /^#[0-9A-Fa-f]{6}$/.test(formData.borderColor) ? `1px solid ${formData.borderColor}` : 'none',
                          }}
                          className={`absolute right-6 bottom-6 rounded-lg shadow-xl max-w-xs w-full flex items-start space-x-3 overflow-hidden group ${formData.animation === 'pulse' ? 'animate-pulse' : ''} ${formData.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
                        >
                          <div 
                            style={formData.animation === 'marquee' ? { animationDuration: previewStyle.animationDuration } : {}}
                            className={`flex flex-col space-y-2 w-full ${formData.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
                          >
                            <div className="flex flex-row items-start space-x-3 w-full">
                              {formData.icon !== 'none' && (
                                <div className="shrink-0 mt-0.5">
                                  {formData.icon === 'info' && <Info size={18} />}
                                  {formData.icon === 'warning' && <AlertTriangle size={18} />}
                                  {formData.icon === 'megaphone' && <Megaphone size={18} />}
                                </div>
                              )}
                              <div dangerouslySetInnerHTML={{ __html: formData.message || "Önizleme metni..." }} className="flex-1 text-sm leading-relaxed [&>p]:inline [&>p]:m-0" />
                            </div>
                            {formData.linkUrl && (
                              <div className="pl-8 pb-1">
                                {renderPreviewLink()}
                              </div>
                            )}
                          </div>
                          {formData.isCloseable && (
                            <button className="shrink-0 opacity-70 hover:opacity-100 p-0.5 ml-2 z-20">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Popup Preview */}
                      {formData.type === "popup" && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 p-4 group">
                          <div 
                            style={{
                              ...previewStyle,
                              border: /^#[0-9A-Fa-f]{6}$/.test(formData.borderColor) ? `1px solid ${formData.borderColor}` : 'none',
                            }}
                            className={`relative rounded-xl shadow-2xl w-full max-w-sm overflow-hidden ${formData.animation === 'pulse' ? 'animate-pulse' : ''} ${formData.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
                          >
                            {formData.isCloseable && (
                              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 z-20">
                                <X size={16} />
                              </button>
                            )}
                            
                            <div 
                              style={formData.animation === 'marquee' ? { animationDuration: previewStyle.animationDuration } : {}}
                              className={`flex flex-col items-center text-center space-y-4 ${formData.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
                            >
                              {formData.icon !== 'none' && (
                                <div className="p-3 bg-black/5 rounded-full shrink-0">
                                  {formData.icon === 'info' && <Info size={32} />}
                                  {formData.icon === 'warning' && <AlertTriangle size={32} />}
                                  {formData.icon === 'megaphone' && <Megaphone size={32} />}
                                </div>
                              )}
                              
                              {formData.title && (
                                <h3 className="text-xl font-bold">{formData.title}</h3>
                              )}
                              
                              <div dangerouslySetInnerHTML={{ __html: formData.message || "Önizleme metni..." }} className="leading-relaxed [&>p]:inline [&>p]:m-0" />
                              
                              {formData.linkUrl && (
                                <div className="pt-2">
                                  {renderPreviewLink()}
                                </div>
                              )}

                              {formData.isCloseable && (
                                <button className="mt-4 px-6 py-2 bg-black/10 hover:bg-black/20 font-medium rounded-md w-full sm:w-auto z-20 relative">
                                  Kapat
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sticky Bottom Preview */}
                      {(formData.type === "sticky-bar" && formData.position === "bottom") && (
                        <div 
                          style={{
                            ...previewStyle,
                            borderTop: /^#[0-9A-Fa-f]{6}$/.test(formData.borderColor) ? `1px solid ${formData.borderColor}` : 'none'
                          }}
                          className={`absolute bottom-0 left-0 right-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] w-full flex items-center justify-between overflow-hidden group ${formData.animation === 'pulse' ? 'animate-pulse' : ''} ${formData.animation === 'shimmer' ? 'animate-shimmer' : ''}`}
                        >
                          <div 
                            style={formData.animation === 'marquee' ? { animationDuration: previewStyle.animationDuration } : {}}
                            className={`container mx-auto flex flex-row items-center justify-between px-4 py-1 relative ${formData.animation === 'marquee' ? 'animate-marquee group-hover:[animation-play-state:paused]' : ''}`}
                          >
                            <div className="flex flex-row items-center space-x-3 flex-1 overflow-hidden">
                              {formData.icon !== 'none' && (
                                <div className="flex items-center space-x-2 shrink-0">
                                  {formData.icon === 'info' && <Info size={18} />}
                                  {formData.icon === 'warning' && <AlertTriangle size={18} />}
                                  {formData.icon === 'megaphone' && <Megaphone size={18} />}
                                </div>
                              )}
                              <div dangerouslySetInnerHTML={{ __html: formData.message || "Önizleme metni..." }} className="truncate md:whitespace-normal [&>p]:inline [&>p]:m-0" />
                            </div>
                            <div className="flex items-center shrink-0">
                              {renderPreviewLink()}
                              {formData.isCloseable && (
                                <button className="p-1 ml-4 opacity-70 hover:opacity-100 shrink-0 z-20">
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
