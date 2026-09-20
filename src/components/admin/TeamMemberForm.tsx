"use client";

import ImageUploadInput from "@/components/admin/ImageUploadInput";
import { useState } from "react";
import { Shield, Eye, Pencil, Crown } from "lucide-react";

const ROLE_PRESETS = {
  "": { label: "Rol Yok (Sadece Ekip Üyesi)", icon: "👤", color: "gray", permissions: {} },
  VIEWER: { label: "Görüntüleyici", icon: "👁️", color: "blue", permissions: { pages: true, news: true, courses: true, team: true, gallery: true, projects: true, design: false } },
  EDITOR: { label: "İçerik Editörü", icon: "✏️", color: "yellow", permissions: { pages: true, news: true, courses: true, team: false, gallery: true, projects: true, design: false } },
  ADMIN: { label: "Yönetici (Admin)", icon: "👑", color: "red", permissions: { pages: true, news: true, courses: true, team: true, gallery: true, projects: true, design: true } },
};

const PERMISSION_LABELS: Record<string, string> = {
  pages: "📄 Sayfalar (Sayfa Düzenleyici)",
  news: "📰 Haberler",
  courses: "📚 Kurslar",
  team: "👥 Ekip Üyeleri",
  gallery: "🖼️ Galeri",
  projects: "📁 Projeler",
  design: "🎨 Tasarım & Ayarlar",
};

export default function TeamMemberForm({ action, member }: { action: any; member: any }) {
  const [adminRole, setAdminRole] = useState<string>(member?.adminRole || "");
  const [perms, setPerms] = useState<Record<string, boolean>>(
    member?.permissions && typeof member.permissions === "object"
      ? member.permissions
      : {}
  );

  const applyPreset = (role: string) => {
    setAdminRole(role);
    const preset = ROLE_PRESETS[role as keyof typeof ROLE_PRESETS];
    if (preset) setPerms(preset.permissions as Record<string, boolean>);
  };

  const togglePerm = (key: string) => {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  };

  const selectedPreset = ROLE_PRESETS[adminRole as keyof typeof ROLE_PRESETS];

  return (
    <form action={action} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b">Kişisel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
            <input name="name" type="text" required defaultValue={member?.name || ""} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unvan / Pozisyon *</label>
            <input name="role" type="text" required defaultValue={member?.role || ""} placeholder="Örn: Baş Öğretmen, Koordinatör..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
            <input name="email" type="email" defaultValue={member?.email || ""} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input name="phone" type="text" defaultValue={member?.phone || ""} className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotoğraf URL</label>
            <ImageUploadInput name="photoUrl" defaultValue={member?.photoUrl || ""} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Biyografi</label>
            <textarea name="bio" rows={3} defaultValue={member?.bio || ""} placeholder="Kişi hakkında kısa bir tanıtım..." className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Role & Permissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Admin Rolü & Yetkiler</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5 pb-3 border-b">Bu kişiye CMS paneline erişim izni vermek istiyorsanız bir rol seçin ve gerekli yetkileri ayarlayın.</p>

        {/* Role Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                adminRole === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-xs font-semibold text-gray-700 leading-tight">{preset.label}</div>
            </button>
          ))}
        </div>

        {/* Hidden adminRole field */}
        <input type="hidden" name="adminRole" value={adminRole} />

        {/* Permission checkboxes */}
        {adminRole !== "" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Ayrıntılı Yetki Ayarları</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                adminRole === "ADMIN" ? "bg-red-100 text-red-700" :
                adminRole === "EDITOR" ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {selectedPreset?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    perms[key] ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={`perm_${key}`}
                    checked={!!perms[key]}
                    onChange={() => togglePerm(key)}
                    className="rounded border-gray-300 text-blue-600 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">💡 İpucu: Roller bir başlangıç noktasıdır. Yukarıdaki kutucuklarla kişiye özel ince ayar yapabilirsiniz.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <a href="/admin/content/TeamMember" className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">İptal</a>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 font-medium text-sm">Kaydet</button>
      </div>
    </form>
  );
}
