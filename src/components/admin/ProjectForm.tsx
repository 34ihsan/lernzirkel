"use client";

import ImageUploadInput from "@/components/admin/ImageUploadInput";
import { Calendar, FileText, Target, Users, MapPin, Briefcase, Activity, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function ProjectForm({ action, project, teamMembers }: { action: any; project?: any, teamMembers: any[] }) {
  // Tarihleri "YYYY-MM-DD" formatına çevirme yardımcı fonksiyonu
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <form action={action} className="space-y-8">
      {/* 1. Genel Bilgiler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5 pb-2 border-b">
          <FileText size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Genel Bilgiler</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı *</label>
            <input name="title" type="text" required defaultValue={project?.title || ""} placeholder="Örn: Gençlik Entegrasyon Projesi 2024" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Özel URL)</label>
            <input name="slug" type="text" defaultValue={project?.slug || ""} placeholder="genclik-projesi-2024" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa proje adından otomatik oluşturulur.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Durumu</label>
            <select name="status" defaultValue={project?.status || "AKTIV"} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white">
              <option value="AKTIV">Aktif (Devam Ediyor)</option>
              <option value="ABGESCHLOSSEN">Tamamlandı (Abgeschlossen)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Genel Açıklama</label>
            <textarea name="description" rows={5} defaultValue={project?.description || ""} placeholder="Projenin amacı, kapsamı ve özet bilgisi..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Hedefler (Goals)</label>
            <textarea name="goals" rows={3} defaultValue={project?.goals || ""} placeholder="Bu projeyle ne amaçlanıyor?" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle</label>
            <input name="targetGroup" type="text" defaultValue={project?.targetGroup || ""} placeholder="Örn: 15-25 yaş arası gençler, göçmen aileler..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uygulama Yeri (Location)</label>
            <input name="location" type="text" defaultValue={project?.location || ""} placeholder="Örn: Ludwigshafen Merkez, Online..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Beklenen/Elde Edilen Sonuçlar (Results/Impact)</label>
            <textarea name="results" rows={3} defaultValue={project?.results || ""} placeholder="Proje tamamlandığında (veya devam ederken) ulaşılan sonuçlar..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
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
            <input name="startDate" type="date" defaultValue={formatDate(project?.startDate)} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <input name="endDate" type="date" defaultValue={formatDate(project?.endDate)} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe</label>
            <input name="budget" type="text" defaultValue={project?.budget || ""} placeholder="Örn: 50.000 €, Kısmen Fonlandı..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fon Sağlayıcı (Funding Source)</label>
            <input name="fundingSource" type="text" defaultValue={project?.fundingSource || ""} placeholder="Örn: BAMF, EU, Belediye..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500" />
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
            <select name="contactPersonId" defaultValue={project?.contactPersonId || ""} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white">
              <option value="">-- Sorumlu Seçin --</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ortaklar (Partners)</label>
            <input name="partners" type="text" defaultValue={project?.partners || ""} placeholder="Örn: X Derneği, Y Vakfı" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aksiyon Butonu Metni (Örn: Kaydol)</label>
            <input name="actionText" type="text" defaultValue={project?.actionText || ""} placeholder="Örn: Projeye Kaydol" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aksiyon Butonu Linki</label>
            <input name="actionUrl" type="url" defaultValue={project?.actionUrl || ""} placeholder="Örn: https://form.linki.com veya /iletisim" className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
            <ImageUploadInput name="imageUrl" defaultValue={project?.imageUrl || ""} />
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
  );
}
