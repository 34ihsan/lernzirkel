import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ContentListClient from "@/components/admin/ContentListClient";
import { modelConfig } from "@/lib/admin-config";
import { notFound } from "next/navigation";

export default async function ModelContentPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  
  const config = modelConfig[model];
  if (!config) return notFound();

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
        <Link href={`/admin/content/${model}/new`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
          <Plus size={16} />
          <span>Yeni Ekle</span>
        </Link>
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
        />
      )}
    </div>
  );
}
