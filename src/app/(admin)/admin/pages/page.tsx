import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, ExternalLink, Home, Layers, 
  Settings2, Palette, RefreshCw, CheckCircle2, AlertCircle, 
  Sliders, ArrowRight, ShieldCheck, FileText, Sparkles, FolderTree
} from "lucide-react";
import { revalidatePath } from "next/cache";
import { syncSystemPages } from "@/actions/admin";
import PageTreeManager from "@/components/admin/PageTreeManager";

async function deletePage(id: string) {
  "use server";
  const target = await prisma.page.findUnique({ where: { id } });
  if (target?.slug === 'home') {
    throw new Error("Ana sayfa silinemez!");
  }
  await prisma.page.delete({ where: { id } });
  revalidatePath('/admin/pages');
  revalidatePath('/', 'layout');
}

async function handleSyncAction() {
  "use server";
  await syncSystemPages();
}

export const dynamic = "force-dynamic";

export default async function PagesManager() {
  const pages = await prisma.page.findMany({
    include: {
      parent: {
        select: { id: true, title: true, slug: true }
      },
      children: {
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, title: true, slug: true, parentId: true }
      },
      sections: {
        select: { id: true, type: true, design: true, order: true }
      }
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  const serializedPages = pages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    isPublished: p.isPublished,
    parentId: p.parentId,
    order: p.order,
    sectionsCount: p.sections.length,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    parent: p.parent,
    children: p.children.map(c => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      parentId: c.parentId,
      description: null,
      isPublished: true,
      order: 0,
      sectionsCount: 0,
      createdAt: '',
      updatedAt: ''
    }))
  }));

  const homePage = pages.find((p: any) => p.slug === 'home');
  const systemSlugs = ['home', 'ueber-uns', 'kurse', 'projekte', 'beratung', 'kontakt', 'spenden', 'satzung'];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-blue-600" />
            Sayfa & Tasarım Yönetim Merkezi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ana sayfa dahil tüm web sitesi sayfalarının içeriklerini, bölümlerini (hero, kartlar, banner vb.), renk ve tipografilerini buradan canlı olarak düzenleyin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action={handleSyncAction}>
            <button
              type="submit"
              className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              title="Sistem şablonlarını ve eksik varsayılan sayfaları eşitle"
            >
              <RefreshCw size={15} />
              <span>Varsayılanları Eşitle</span>
            </button>
          </form>
          <Link 
            href="/admin/pages/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            <span>Yeni Sayfa Ekle</span>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full inline-block mb-3">
                Global Header & Footer
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Üst Menü & Alt Bilgi</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Tüm sayfalarda görünen Logo, Navigasyon linkleri, İletişim butonları, Üst çubuk ve Footer alanını özelleştirin.
              </p>
            </div>
            <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
              <Sliders size={22} />
            </div>
          </div>
          <Link 
            href="/admin/header-footer" 
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
          >
            Header & Footer Düzenle <ArrowRight size={13} className="ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full inline-block mb-3">
                Global Tema & Renkler
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tasarım & Stil Sistemi</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Sitenin kurumsal renk paleti (Primary, Secondary, Accent), arka planlar ve yazı renklerini tek bir yerden yönetin.
              </p>
            </div>
            <div className="p-3 bg-white text-purple-600 rounded-xl shadow-sm">
              <Palette size={22} />
            </div>
          </div>
          <Link 
            href="/admin/design" 
            className="inline-flex items-center text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-purple-200 transition-all"
          >
            Renk & Tasarım Ayarları <ArrowRight size={13} className="ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full inline-block mb-3">
                Duyurular & Bildirimler
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Duyuru Yönetimi</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Tüm sitede veya seçtiğiniz sayfalarda üst çubuk, alt çubuk, modal veya popup duyurular yayınlayın.
              </p>
            </div>
            <div className="p-3 bg-white text-amber-600 rounded-xl shadow-sm">
              <Sparkles size={22} />
            </div>
          </div>
          <Link 
            href="/admin/announcements" 
            className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-amber-200 transition-all"
          >
            Duyuruları Yönet <ArrowRight size={13} className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Featured Homepage Card */}
      {homePage ? (
        <div className="bg-white border-2 border-blue-500/80 rounded-2xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl tracking-wide flex items-center gap-1 shadow-sm">
            <Home size={13} />
            ANA SAYFA (ROOT /)
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Home size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{homePage.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">/ (Kök Dizin)</span>
                    <span>•</span>
                    <span className="font-medium text-blue-600">{homePage.sections.length} Bölüm (Hero, Kartlar, Banner, vb.)</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${homePage.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {homePage.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 pt-1">
                {homePage.description || "Web sitesinin ana karşılama sayfası. Hero slaytı, Über Uns, Integrationskurse, telc Prüfungen ve diğer tüm bölümler hem içerik hem tasarım olarak düzenlenebilir."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                title="Canlı ana sayfayı yeni sekmede aç"
              >
                <ExternalLink size={16} />
                <span>Canlı Gör</span>
              </a>
              <Link
                href={`/admin/pages/${homePage.id}`}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2 group"
              >
                <Sliders size={16} />
                <span>Ana Sayfa Bölümlerini Düzenle</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick preview of sections inside homepage */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Mevcut Sayfa Bölümleri ({homePage.sections.length}):</span>
            <div className="flex flex-wrap gap-2">
              {homePage.sections.map((sec: any, idx: number) => {
                const isHidden = (sec.design as any)?.isHidden;
                return (
                  <span 
                    key={sec.id} 
                    className={`text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 ${isHidden ? 'bg-gray-100 text-gray-400 line-through' : 'bg-blue-50 text-blue-800 border border-blue-200/60'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {sec.type}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Ana Sayfa & Şablonlar Henüz CMS'e Yüklenmedi</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
              Mevcut web sitesinin ana sayfa tasarımını (Hero, Über uns, Kurse, telc Prüfungen, Projeler, vb.) CMS üzerinden canlı düzenlemek için tek tıkla yükleyin.
            </p>
          </div>
          <form action={handleSyncAction} className="pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 hover:scale-[1.02]"
            >
              <RefreshCw size={18} />
              <span>Ana Sayfayı ve Sistem Sayfalarını Şimdi Yükle</span>
            </button>
          </form>
        </div>
      )}

      {/* Pages Hierarchy & Tree Manager */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="text-blue-600 w-5 h-5" />
            Sayfa Hiyerarşisi & Yönetimi
          </h2>
          <p className="text-xs text-gray-500">
            Sitedeki sayfaları hiyerarşik ağaç veya tablo halinde yönetin. Kardeş sayfaları Yukarı/Aşağı taşıyabilir, anında alt sayfa ekleyebilir veya üst sayfasını değiştirebilirsiniz.
          </p>
        </div>

        <PageTreeManager
          pages={serializedPages}
          systemSlugs={systemSlugs}
          onDeletePageAction={deletePage}
        />
      </div>
    </div>
  );
}
