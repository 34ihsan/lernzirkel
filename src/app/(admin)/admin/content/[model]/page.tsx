import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, ShieldAlert } from "lucide-react";
import ContentListClient from "@/components/admin/ContentListClient";
import { modelConfig } from "@/lib/admin-config";
import { notFound } from "next/navigation";
import { getAreaAccess, MODEL_TO_AREA } from "@/lib/permissions";

export default async function ModelContentPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;

  const config = modelConfig[model];
  if (!config) return notFound();

  const area = MODEL_TO_AREA[model];
  const access = area ? await getAreaAccess(area) : { canView: true, canEdit: true, session: true };
  if (!access.canView) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
        <h1 className="text-lg font-bold text-gray-900 mb-2">Bu bölüme erişim yetkiniz yok</h1>
        <p className="text-sm text-gray-500">Erişmek için yöneticinizden yetki talep edin.</p>
      </div>
    );
  }

  // Very basic dynamic fetch - in production use a safer approach or switch statement
  let records: any[] = [];
  let error = null;

  try {
    // @ts-ignore
    records = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (e) {
    error = "Model bulunamadı veya veritabanı hatası.";
  }

  // Get keys to display in table (excluding long text fields or relational IDs where possible)
  const displayKeys = records.length > 0
    ? Object.keys(records[0]).filter(k => !['description', 'content', 'createdAt', 'updatedAt', 'design'].includes(k)).slice(0, 4)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{config.label} Yönetimi</h1>
        {access.canEdit && (
          <Link href={`/admin/content/${model}/new`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
            <Plus size={16} />
            <span>Yeni Ekle</span>
          </Link>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : records.length === 0 ? (
        <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow-sm border border-gray-200">
          Henüz kayıt bulunmamaktadır.
        </div>
      ) : (
        <ContentListClient
          model={model}
          records={records}
          displayKeys={displayKeys}
          canEdit={access.canEdit}
        />
      )}
    </div>
  );
}
