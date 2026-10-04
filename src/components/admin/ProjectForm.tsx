"use client";

import { useState } from "react";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ProjectLivePreview from "@/components/admin/ProjectLivePreview";
import { Calendar, FileText, Target, Users, CheckCircle, SplitSquareHorizontal, PenTool } from "lucide-react";

export default function ProjectForm({ action, project, teamMembers }: { action: any; project?: any, teamMembers: any[] }) {
  const [viewMode, setViewMode] = useState<'editor' | 'split'>('editor');
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // Keep state for live preview
  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    status: project?.status || "AKTIV",
    description: project?.description || "",
    goals: project?.goals || "",
    targetGroup: project?.targetGroup || "",
    location: project?.location || "",
    results: project?.results || "",
    startDate: formatDate(project?.startDate),
    endDate: formatDate(project?.endDate),
    budget: project?.budget || "",
    fundingSource: project?.fundingSource || "",
    contactPersonId: project?.contactPersonId || "",
    partners: project?.partners || "",
    actionText: project?.actionText || "",
    actionUrl: project?.actionUrl || "",
    imageUrl: project?.imageUrl || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactPerson = teamMembers.find(m => m.id === formData.contactPersonId);

  // Hidden inputs will carry the state to the Server Action form submission
  return (
    <div className="w-full">
      {/* Top Bar for View Mode Toggling */}
      <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm sticky top-4 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <PenTool size={14} /> Editör (Tam Ekran)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <SplitSquareHorizontal size={14} /> Canlı Önizleme (Split)
            </button>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
        
        {/* FORM SIDE */}
        <form action={action} className="space-y-8 pb-20">
          
          {/* Hidden inputs to pass data to Server Action */}
          {Object.entries(formData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

          {/* 1. Genel Bilgiler */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b">
              <FileText size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Genel Bilgiler</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => handleChange("title", e.target.value)} 
                  required 
                  placeholder="Örn: Gençlik Entegrasyon Projesi 2024" 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Özel URL)</label>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={(e) => handleChange("slug", e.target.value)} 
                  placeholder="genclik-projesi-2024" 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proje Durumu</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => handleChange("status", e.target.value)} 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <option value="AKTIV">Aktif (Devam Ediyor)</option>
                  <option value="ABGESCHLOSSEN">Tamamlandı (Abgeschlossen)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <RichTextEditor 
                  label="Genel Açıklama" 
                  value={formData.description} 
                  onChange={(val) => handleChange("description", val)} 
                  rows={8}
                />
              </div>
            </div>
          </div>

          {/* 2. Hedefler & Etki */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b">
              <Target size={20} className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-800">Hedefler ve Kapsam</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <RichTextEditor 
                  label="Hedefler (Goals)" 
                  value={formData.goals} 
                  onChange={(val) => handleChange("goals", val)} 
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle</label>
                <input 
                  type="text" 
                  value={formData.targetGroup} 
                  onChange={(e) => handleChange("targetGroup", e.target.value)} 
                  placeholder="Örn: 15-25 yaş arası gençler, göçmen aileler..." 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uygulama Yeri (Location)</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => handleChange("location", e.target.value)} 
                  placeholder="Örn: Ludwigshafen Merkez, Online..." 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" 
                />
              </div>
              <div className="md:col-span-2">
                <RichTextEditor 
                  label="Beklenen/Elde Edilen Sonuçlar (Results/Impact)" 
                  value={formData.results} 
                  onChange={(val) => handleChange("results", val)} 
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* 3. Finans & Takvim */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b">
              <Calendar size={20} className="text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">Takvim & Bütçe Bilgileri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                <input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => handleChange("startDate", e.target.value)} 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                <input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => handleChange("endDate", e.target.value)} 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe</label>
                <input 
                  type="text" 
                  value={formData.budget} 
                  onChange={(e) => handleChange("budget", e.target.value)} 
                  placeholder="Örn: 50.000 €, Kısmen Fonlandı..." 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fon Sağlayıcı (Funding Source)</label>
                <input 
                  type="text" 
                  value={formData.fundingSource} 
                  onChange={(e) => handleChange("fundingSource", e.target.value)} 
                  placeholder="Örn: BAMF, EU, Belediye..." 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" 
                />
              </div>
            </div>
          </div>

          {/* 4. İletişim & Medya */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b">
              <Users size={20} className="text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-800">İletişim & Medya</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proje Sorumlusu (Contact Person)</label>
                <select 
                  value={formData.contactPersonId} 
                  onChange={(e) => handleChange("contactPersonId", e.target.value)} 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white"
                >
                  <option value="">-- Sorumlu Seçin --</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ortaklar (Partners)</label>
                <input 
                  type="text" 
                  value={formData.partners} 
                  onChange={(e) => handleChange("partners", e.target.value)} 
                  placeholder="Örn: X Derneği, Y Vakfı" 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aksiyon Butonu Metni (Örn: Kaydol)</label>
                <input 
                  type="text" 
                  value={formData.actionText} 
                  onChange={(e) => handleChange("actionText", e.target.value)} 
                  placeholder="Örn: Projeye Kaydol" 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aksiyon Butonu Linki</label>
                <input 
                  type="text" 
                  value={formData.actionUrl} 
                  onChange={(e) => handleChange("actionUrl", e.target.value)} 
                  placeholder="Örn: https://form.linki.com veya /iletisim" 
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
                <ImageUploadInput 
                  value={formData.imageUrl} 
                  onChange={(val) => handleChange("imageUrl", val)} 
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-sm border border-gray-200">
            <a href="/admin/content/Project" className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              İptal
            </a>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2">
              <CheckCircle size={18} />
              {project ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
            </button>
          </div>
        </form>

        {/* PREVIEW SIDE */}
        {viewMode === 'split' && (
          <div className="sticky top-24 self-start">
            <ProjectLivePreview project={{ ...formData, contactPerson }} />
          </div>
        )}
      </div>
    </div>
  );
}
