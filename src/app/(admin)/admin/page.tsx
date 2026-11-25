import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, FileText, Newspaper, Image as ImageIcon, TrendingUp, Bot, Activity, ClipboardCheck } from "lucide-react";
import QuickApprovalInbox, { InboxItem } from "@/components/admin/QuickApprovalInbox";

export default async function AdminDashboard() {
  const [
    coursesCount,
    projectsCount,
    newsCount,
    teamCount,
    galleryCount,
    pagesCount,
    pendingRegistrationsCount,
    totalEventsCount,
    recentPendingRegistrations,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.project.count(),
    prisma.news.count(),
    prisma.teamMember.count(),
    prisma.galleryMedia.count(),
    prisma.page.count().catch(() => 0),
    prisma.registration.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.eventLog.count().catch(() => 0),
    prisma.registration.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, createdAt: true, course: { select: { title: true } } },
    }).catch(() => []),
  ]);

  const inboxItems: InboxItem[] = recentPendingRegistrations.map((r) => ({
    id: r.id,
    name: r.name,
    subtitle: r.course?.title ?? "Kurs",
    createdAt: r.createdAt,
  }));

  const stats = [
    {
      name: "Yeni Kurs Kayıtları (Anmeldungen)",
      count: pendingRegistrationsCount,
      icon: ClipboardCheck,
      color: pendingRegistrationsCount > 0 ? "bg-amber-600 animate-pulse" : "bg-emerald-600",
      href: "/admin/registrations",
      highlight: true
    },
    { name: "Pazarlama Sinyalleri", count: totalEventsCount, icon: TrendingUp, color: "bg-teal-600", href: "/admin/marketing" },
    { name: "Kurslar", count: coursesCount, icon: FileText, color: "bg-blue-500", href: "/admin/content/Course" },
    { name: "Sayfalar", count: pagesCount, icon: FileText, color: "bg-indigo-500", href: "/admin/pages" },
    { name: "Haberler", count: newsCount, icon: Newspaper, color: "bg-orange-500", href: "/admin/content/News" },
    { name: "Projeler", count: projectsCount, icon: FileText, color: "bg-emerald-500", href: "/admin/content/Project" },
    { name: "Ekip Üyeleri", count: teamCount, icon: Users, color: "bg-purple-500", href: "/admin/content/TeamMember" },
    { name: "Galeri (Foto & Video)", count: galleryCount, icon: ImageIcon, color: "bg-pink-500", href: "/admin/content/GalleryMedia" },
    { name: "Sistem Sağlığı & DevOps", count: "100%", icon: Activity, color: "bg-slate-700", href: "/admin/system-health" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Admin</h1>
      <p className="text-gray-500">Sitenizin genel durumu ve içerik istatistikleri aşağıda yer almaktadır.</p>

      <QuickApprovalInbox items={inboxItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.name} className="block group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-shadow group-hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full text-white ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-semibold text-gray-900">{stat.count}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
