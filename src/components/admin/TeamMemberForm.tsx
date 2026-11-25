"use client";

import ImageUploadInput from "@/components/admin/ImageUploadInput";
import { useState } from "react";
import { Shield } from "lucide-react";

interface AreaPerm {
  view?: boolean;
  edit?: boolean;
}

interface Perms {
  pages?: AreaPerm;
  news?: AreaPerm;
  courses?: AreaPerm;
  team?: AreaPerm;
  gallery?: AreaPerm;
  projects?: AreaPerm;
  design?: AreaPerm;
  depotDownload?: boolean;
  depotUpload?: boolean;
}

const AREA_KEYS = ["pages", "news", "courses", "team", "gallery", "projects", "design"] as const;

const AREA_LABELS: Record<(typeof AREA_KEYS)[number], string> = {
  pages: "📄 Sayfalar (Sayfa Düzenleyici)",
  news: "📰 Haberler",
  courses: "📚 Kurslar",
  team: "👥 Ekip Üyeleri",
  gallery: "🖼️ Galeri",
  projects: "📁 Projeler",
  design: "🎨 Tasarım & Ayarlar",
};

const ROLE_PRESETS: Record<string, { label: string; icon: string; permissions: Perms }> = {
  "": { label: "Rol Yok (Sadece Ekip Üyesi)", icon: "👤", permissions: {} },
  VIEWER: {
    label: "Görüntüleyici", icon: "👁️",
    permissions: {
      pages: { view: true, edit: false },
      news: { view: true, edit: false },
      courses: { view: true, edit: false },
      team: { view: true, edit: false },
      gallery: { view: true, edit: false },
      projects: { view: true, edit: false },
      design: { view: false, edit: false },
      depotDownload: true,
      depotUpload: false,
    },
  },
  EDITOR: {
    label: "İçerik Editörü", icon: "✏️",
    permissions: {
      pages: { view: true, edit: true },
      news: { view: true, edit: true },
      courses: { view: true, edit: true },
      team: { view: true, edit: false },
      gallery: { view: true, edit: true },
      projects: { view: true, edit: true },
      design: { view: false, edit: false },
      depotDownload: true,
      depotUpload: true,
    },
  },
  ADMIN: {
    label: "Yönetici (Admin)", icon: "👑",
    permissions: {
      pages: { view: true, edit: true },
      news: { view: true, edit: true },
      courses: { view: true, edit: true },
      team: { view: true, edit: true },
      gallery: { view: true, edit: true },
      projects: { view: true, edit: true },
      design: { view: true, edit: true },
      depotDownload: true,
      depotUpload: true,
    },
  },
};

export default function TeamMemberForm({ action, member }: { action: any; member: any }) {
  const [adminRole, setAdminRole] = useState<string>(member?.adminRole || "");
  const [perms, setPerms] = useState<Perms>(
    member?.permissions && typeof member.permissions === "object" ? member.permissions : {}
  );

  const applyPreset = (role: string) => {
    setAdminRole(role);
    const preset = ROLE_PRESETS[role];
    if (preset) setPerms(preset.permissions);
  };

  const toggleAreaPerm = (area: (typeof AREA_KEYS)[number], field: "view" | "edit") => {
    setPerms((p) => {
      const current = p[area] || {};
      const nextEdit = field === "edit" ? !current.edit : current.edit;
      const nextView = field === "view" ? !current.view : current.view;
      return {
        ...p,
        // Düzenleme yetkisi görüntülemeyi de kapsar — "edit" açılırken "view" de açılır,
        // "view" kapatılırken "edit" de kapanır (düzenleyemeyen ama görmeyen tutarsız olurdu).
        [area]: {
          view: field === "edit" && nextEdit ? true : nextView,
          edit: field === "view" && !nextView ? false : nextEdit,
        },
      };
    });
  };

  const toggleFlatPerm = (key: "depotDownload" | "depotUpload") => {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  };

  const selectedPreset = ROLE_PRESETS[adminRole];

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
        <p className="text-sm text-gray-500 mb-5 pb-3 border-b">Bu kişiye CMS paneline erişim izni vermek istiyorsanız bir rol seçin ve her alan için görüntüleme/düzenleme yetkisini ayrı ayrı ayarlayın. Not: Yönetici (Admin) rolü her zaman her şeyi yapabilir, aşağıdaki kutucuklardan bağımsız olarak.</p>

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

        {/* Permission table */}
        {adminRole !== "" && (
          <div className="space-y-4">
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

            {adminRole === "ADMIN" && (
              <p className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg p-2.5">
                👑 Yönetici rolündeki kişiler her zaman tam yetkiye sahiptir — aşağıdaki kutucuklar sadece bilgi amaçlıdır, kapatılsalar bile erişim kısıtlanmaz.
              </p>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left font-semibold text-gray-600 px-3 py-2">Alan</th>
                    <th className="text-center font-semibold text-gray-600 px-3 py-2 w-24">Görüntüle</th>
                    <th className="text-center font-semibold text-gray-600 px-3 py-2 w-24">Düzenle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {AREA_KEYS.map((area) => {
                    const areaPerm = perms[area] || {};
                    return (
                      <tr key={area} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5 font-medium text-gray-700">{AREA_LABELS[area]}</td>
                        <td className="text-center px-3 py-2.5">
                          <input
                            type="checkbox"
                            name={`perm_${area}_view`}
                            checked={!!areaPerm.view || !!areaPerm.edit}
                            onChange={() => toggleAreaPerm(area, "view")}
                            className="rounded border-gray-300 text-blue-600 w-4 h-4"
                          />
                        </td>
                        <td className="text-center px-3 py-2.5">
                          <input
                            type="checkbox"
                            name={`perm_${area}_edit`}
                            checked={!!areaPerm.edit}
                            onChange={() => toggleAreaPerm(area, "edit")}
                            className="rounded border-gray-300 text-blue-600 w-4 h-4"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-3 py-2.5 font-medium text-gray-700">🗄️ Depo — İndirme</td>
                    <td colSpan={2} className="text-center px-3 py-2.5">
                      <input
                        type="checkbox"
                        name="perm_depotDownload"
                        checked={!!perms.depotDownload}
                        onChange={() => toggleFlatPerm("depotDownload")}
                        className="rounded border-gray-300 text-blue-600 w-4 h-4"
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-3 py-2.5 font-medium text-gray-700">📤 Depo — Yükleme</td>
                    <td colSpan={2} className="text-center px-3 py-2.5">
                      <input
                        type="checkbox"
                        name="perm_depotUpload"
                        checked={!!perms.depotUpload}
                        onChange={() => toggleFlatPerm("depotUpload")}
                        className="rounded border-gray-300 text-blue-600 w-4 h-4"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">💡 İpucu: Roller bir başlangıç noktasıdır. Yukarıdaki tabloyla kişiye özel ince ayar yapabilirsiniz. &quot;Düzenle&quot; işaretlendiğinde &quot;Görüntüle&quot; de otomatik açılır.</p>
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
