import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";
import DeleteButton from "./DeleteButton";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-500">Sitenizde gösterilecek olan banner, popup ve duyuruları yönetin.</p>
        </div>
        <Link 
          href="/admin/announcements/new" 
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          <span>Yeni Duyuru</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">Henüz hiç duyuru yok</p>
            <p className="mt-1 text-sm text-gray-500">Sağ üstteki butona tıklayarak ilk duyurunuzu oluşturabilirsiniz.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip & Kapsam
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((ann) => {
                const now = new Date();
                const isStarted = !ann.startDate || ann.startDate <= now;
                const isExpired = ann.endDate && ann.endDate < now;
                const isCurrentlyActive = ann.isActive && isStarted && !isExpired;

                return (
                  <tr key={ann.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ann.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-max">
                          {ann.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          Hedef: {ann.targetScope === "ALL" ? "Tüm Sayfalar" : ann.targetScope === "HOME" ? "Ana Sayfa" : "Seçili Sayfalar"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ann.startDate ? new Date(ann.startDate).toLocaleDateString("tr-TR") : "Belirtilmedi"} - <br />
                      {ann.endDate ? new Date(ann.endDate).toLocaleDateString("tr-TR") : "Süresiz"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCurrentlyActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isCurrentlyActive ? 'Yayında' : (isExpired ? 'Süresi Doldu' : (!ann.isActive ? 'Pasif' : 'Beklemede'))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link href={`/admin/announcements/${ann.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          <Edit size={18} />
                        </Link>
                        <DeleteButton id={ann.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
