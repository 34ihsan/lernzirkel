import prisma from "@/lib/prisma";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default async function NewAnnouncementPage() {
  // Hedefleme için sayfaları çek
  const pages = await prisma.page.findMany({
    select: { id: true, slug: true, title: true },
    orderBy: { title: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <AnnouncementForm pages={pages} />
    </div>
  );
}
