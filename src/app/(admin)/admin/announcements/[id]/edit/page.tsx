import prisma from "@/lib/prisma";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import { notFound } from "next/navigation";

export default async function EditAnnouncementPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const [announcement, pages] = await Promise.all([
    prisma.announcement.findUnique({ where: { id } }),
    prisma.page.findMany({
      select: { id: true, slug: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  if (!announcement) {
    notFound();
  }

  // Type uyumluluğu için veri dönüştürme (Date to string)
  const formattedAnnouncement = {
    ...announcement,
    startDate: announcement.startDate?.toISOString() || null,
    endDate: announcement.endDate?.toISOString() || null,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnnouncementForm id={id} initialData={formattedAnnouncement} pages={pages} />
    </div>
  );
}
