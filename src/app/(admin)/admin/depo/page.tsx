import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-server";
import { Archive, ShieldAlert } from "lucide-react";
import DepotClient from "@/components/admin/DepotClient";

export default async function DepoPage() {
  const session = await getAdminSession();
  if (!session) return null; // middleware zaten /admin/login'e yönlendirir

  const member = await prisma.teamMember.findUnique({
    where: { id: session.teamMemberId },
    select: { permissions: true },
  });
  const permissions = member?.permissions as Record<string, boolean> | null;
  const canDownload = !permissions || permissions.depotDownload !== false;
  const canUpload = !permissions || permissions.depotUpload !== false;

  if (!canDownload) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
        <h1 className="text-lg font-bold text-gray-900 mb-2">Depo&apos;ya erişim yetkiniz yok</h1>
        <p className="text-sm text-gray-500">Bu bölüme erişmek için yöneticinizden yetki talep edin.</p>
      </div>
    );
  }

  const documents = await prisma.depotDocument.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Archive className="text-gray-700" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depo</h1>
          <p className="text-sm text-gray-500">Sadece admin paneline erişebilen yetkili kullanıcılar için kapalı doküman alanı (pdf, xlsx, docx vb.). Public sitede hiç görünmez.</p>
        </div>
      </div>

      <DepotClient documents={documents} canUpload={canUpload} />
    </div>
  );
}
