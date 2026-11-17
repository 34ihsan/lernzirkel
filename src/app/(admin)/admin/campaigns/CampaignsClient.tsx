"use client";

import { useState, useTransition } from "react";
import {
  QrCode, Plus, Trash2, Copy, Check, ExternalLink,
  MousePointerClick, UserCheck, Link as LinkIcon, Power,
  MessageCircle, Music2, Link2,
  Download, FileText, Globe,
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/common/SocialLinksBar";
import { createCampaignLink, deleteCampaignLink, toggleCampaignLink, updateCampaignLinkBioSettings } from "@/actions/campaigns";
import { Platform } from "@/lib/campaign-platforms";

export interface CampaignLinkItem {
  id: string;
  slug: string;
  label: string;
  targetUrl: string;
  platform: Platform;
  description: string | null;
  showOnBioPage: boolean;
  clicks: number;
  isActive: boolean;
  createdAt: Date;
  registrations: number;
  fullUrl: string;
  qrDataUrl: string;
  caption: string;
}

export interface PlatformStats {
  [key: string]: { clicks: number; registrations: number; count: number };
}

const PLATFORM_META: Record<Platform, { label: string; icon: React.ReactNode; color: string }> = {
  instagram: { label: "Instagram", icon: <InstagramIcon size={14} />, color: "bg-pink-100 text-pink-800 border-pink-200" },
  facebook: { label: "Facebook", icon: <FacebookIcon size={14} />, color: "bg-blue-100 text-blue-800 border-blue-200" },
  whatsapp: { label: "WhatsApp", icon: <MessageCircle size={14} />, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  tiktok: { label: "TikTok", icon: <Music2 size={14} />, color: "bg-gray-200 text-gray-800 border-gray-300" },
  other: { label: "Diğer", icon: <Link2 size={14} />, color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function CampaignsClient({
  initialLinks,
  platformStats,
}: {
  initialLinks: CampaignLinkItem[];
  platformStats: PlatformStats;
}) {
  const [links, setLinks] = useState(initialLinks);
  const [label, setLabel] = useState("");
  const [targetUrl, setTargetUrl] = useState("/kurse");
  const [customSlug, setCustomSlug] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [showOnBioPage, setShowOnBioPage] = useState(true);
  const [description, setDescription] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createCampaignLink({
        label,
        targetUrl,
        slug: customSlug || undefined,
        platform,
        description: description || undefined,
        showOnBioPage,
      });
      if (res.success) {
        setLabel("");
        setTargetUrl("/kurse");
        setCustomSlug("");
        setDescription("");
        window.location.reload();
      } else {
        setError(res.error || "Bir hata oluştu.");
      }
    });
  };

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`"${label}" kampanya linki kalıcı olarak silinecek. Emin misiniz?`)) return;
    startTransition(async () => {
      const res = await deleteCampaignLink(id);
      if (res.success) setLinks((prev) => prev.filter((l) => l.id !== id));
    });
  };

  const handleToggle = (id: string, isActive: boolean) => {
    startTransition(async () => {
      const res = await toggleCampaignLink(id, !isActive);
      if (res.success) {
        setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive: !isActive } : l)));
      }
    });
  };

  const handleToggleBio = (link: CampaignLinkItem) => {
    startTransition(async () => {
      const res = await updateCampaignLinkBioSettings(link.id, {
        showOnBioPage: !link.showOnBioPage,
        description: link.description || undefined,
      });
      if (res.success) {
        setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, showOnBioPage: !l.showOnBioPage } : l)));
      }
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <QrCode className="text-sky-700" size={26} />
          <span>Kampanya Linkleri & QR Kodlar</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Her afiş, okul ziyareti veya sosyal medya paylaşımı için ayrı izlenebilir link oluşturun — hangi kanaldan kaç tıklama ve kayıt geldiğini burada görürsünüz.
        </p>
      </div>

      {/* Platform-grouped stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
          const meta = PLATFORM_META[p];
          const stats = platformStats[p] || { clicks: 0, registrations: 0, count: 0 };
          return (
            <div key={p} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
              <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                {meta.icon}
                <span>{meta.label}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-900">{stats.clicks}</span>
                <span className="text-[10px] text-gray-400">tıklama</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">{stats.registrations} kayıt</div>
            </div>
          );
        })}
      </div>

      {/* Bio page link */}
      <a
        href="/bio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 bg-gradient-to-r from-sky-900 to-sky-700 text-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <Globe size={22} />
          <div>
            <div className="font-bold text-sm">"Link in Bio" Sayfası — Instagram Profiline Ekleyin</div>
            <div className="text-xs text-white/80 mt-0.5">lernzirkel-online.de/bio — aşağıda "Bio sayfasında göster" işaretli linkler burada listelenir</div>
          </div>
        </div>
        <ExternalLink size={18} className="shrink-0" />
      </a>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-sky-900 font-bold text-sm border-b border-gray-100 pb-2">
          <Plus size={16} />
          <span>Yeni Kampanya Linki Oluştur</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Etiket (Admin için)</label>
            <input
              type="text"
              required
              placeholder="Örn: Instagram Story - Kasım 2026"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Hedef Sayfa</label>
            <input
              type="text"
              required
              placeholder="/kurse/xxxx veya /kontakt"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
                <option key={p} value={p}>{PLATFORM_META[p].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Özel Kısa Ad (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Boş bırakılırsa otomatik üretilir"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bio Sayfası Açıklaması (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Örn: Kasım dönemi Deutschkurs kayıtları başladı"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showOnBioPage}
            onChange={(e) => setShowOnBioPage(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>"Link in Bio" sayfasında (/bio) kart olarak göster</span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl flex items-center gap-2 text-sm shadow transition disabled:opacity-50"
        >
          <Plus size={16} />
          <span>{isPending ? "Oluşturuluyor..." : "Link Oluştur"}</span>
        </button>
      </form>

      {/* Links Grid */}
      {links.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <LinkIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-800">Henüz kampanya linki yok</h3>
          <p className="text-xs text-gray-500 mt-1">Yukarıdaki formla ilk linkinizi oluşturun.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {links.map((link) => {
            const meta = PLATFORM_META[link.platform] || PLATFORM_META.other;
            return (
              <div
                key={link.id}
                className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 ${
                  link.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border mb-1 ${meta.color}`}>
                      {meta.icon}
                      <span>{meta.label}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm truncate">{link.label}</h4>
                    <a
                      href={link.targetUrl}
                      className="text-[11px] text-gray-500 flex items-center gap-1 hover:text-sky-700 truncate"
                    >
                      <ExternalLink size={10} className="shrink-0" />
                      <span className="truncate">{link.targetUrl}</span>
                    </a>
                  </div>
                  <img src={link.qrDataUrl} alt={`QR: ${link.label}`} className="w-16 h-16 rounded-lg border border-gray-200 shrink-0" />
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <code className="text-[11px] text-gray-600 truncate flex-1">{link.fullUrl}</code>
                  <button
                    type="button"
                    onClick={() => handleCopy(link.id, link.fullUrl)}
                    className="p-1 text-gray-500 hover:text-sky-700 shrink-0"
                    title="Linki kopyala"
                  >
                    {copiedId === link.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-sky-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-sky-700 text-[10px] font-semibold uppercase">
                      <MousePointerClick size={11} />
                      <span>Tıklama</span>
                    </div>
                    <div className="text-lg font-bold text-sky-900">{link.clicks}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-700 text-[10px] font-semibold uppercase">
                      <UserCheck size={11} />
                      <span>Kayıt</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-900">{link.registrations}</div>
                  </div>
                </div>

                {/* Share tools */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`/api/campaign-image/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${link.slug}-instagram.png`}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-800 hover:bg-violet-100 transition"
                  >
                    <Download size={12} /> Görsel İndir
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(`caption-${link.id}`, link.caption)}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition"
                  >
                    {copiedId === `caption-${link.id}` ? <Check size={12} className="text-emerald-600" /> : <FileText size={12} />}
                    {copiedId === `caption-${link.id}` ? "Kopyalandı" : "Metni Kopyala"}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggle(link.id, link.isActive)}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                        link.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Power size={11} />
                      {link.isActive ? "Aktif" : "Pasif"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleBio(link)}
                      title="Link in Bio sayfasında göster/gizle"
                      className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                        link.showOnBioPage ? "bg-sky-100 text-sky-800" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Globe size={11} />
                      Bio
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(link.id, link.label)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Sil"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
