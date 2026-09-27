import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, PaintBucket, FileText, Settings, Users, 
  Image as ImageIcon, Newspaper, Megaphone, Inbox, TrendingUp, Bot, Activity 
} from "lucide-react";


const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Admin Dashboard | Lernzirkel CMS",
  description: "Lernzirkel CMS Admin Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-4 flex items-center justify-center border-b border-gray-800 h-16">
              <h1 className="text-xl font-bold tracking-wider">Lernzirkel CMS</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                <li>
                  <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                
                <li className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">İçerik (Content)</li>
                <li>
                  <Link href="/admin/pages" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <FileText size={18} />
                    <span>Sayfalar (Pages)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/announcements" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Megaphone size={18} />
                    <span>Duyurular (Announcements)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content/News" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Newspaper size={18} />
                    <span>Duyurular (News)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/articles" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <FileText size={18} />
                    <span>Blog & Makale</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content/Course" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <FileText size={18} />
                    <span>Kurslar (Courses)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content/Project" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <FileText size={18} />
                    <span>Projeler (Projects)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content/TeamMember" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Users size={18} />
                    <span>Ekip (Team)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content/GalleryImage" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <ImageIcon size={18} />
                    <span>Galeri (Gallery)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/jobs" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <FileText size={18} />
                    <span>Karriere (Jobs)</span>
                  </Link>
                </li>

                <li className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Büyüme & Onay (Growth)</li>
                <li>
                  <Link href="/admin/applications" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium text-amber-300 hover:text-amber-200">
                    <Inbox size={18} />
                    <span>Başvurular & Onay</span>
                  </Link>
                </li>

                <li className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tasarım & Ayarlar</li>
                <li>
                  <Link href="/admin/header-footer" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <LayoutDashboard size={18} />
                    <span>Header & Footer</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/design" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <PaintBucket size={18} />
                    <span>Tasarım Editörü</span>
                  </Link>
                </li>

                <li className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Yönetim & DevOps (Pro Elite)</li>
                <li>
                  <Link href="/admin/marketing" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <TrendingUp size={18} />
                    <span>Pazarlama & Takip</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/ai-settings" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Bot size={18} />
                    <span>Yapay Zeka (AI)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/system-health" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Activity size={18} />
                    <span>Sistem Sağlığı & DevOps</span>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-800">
              <Link href="/" className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm font-medium">
                <span>Siteye Dön</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Topbar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <h2 className="text-lg font-medium">Yönetim Paneli</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-600">Admin</div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
              </div>
            </header>
            
            {/* Page Content */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
