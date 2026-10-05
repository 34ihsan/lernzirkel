import { modelConfig } from "@/lib/admin-config";
import { saveModelRecord } from "@/actions/admin";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import EditFormWithPreview from "@/components/admin/EditFormWithPreview";

export default async function EditModelPage({ params }: { params: Promise<{ model: string; id: string }> }) {
  const { model, id } = await params;
  const config = modelConfig[model];
  
  if (!config) return notFound();

  // Fetch record
  let record: any = null;
  try {
    // @ts-ignore
    record = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].findUnique({
      where: { id },
      include: { translations: true }
    });
  } catch(e) {}

  if (!record) return notFound();

  // Convert translations array to dictionary map for the form
  if (record.translations && Array.isArray(record.translations)) {
    const transMap: any = {};
    for (const t of record.translations) {
      if (t.language) {
        const { id: _, language, ...rest } = t;
        transMap[language] = rest;
      }
    }
    record.translations = JSON.stringify(transMap);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const data: Record<string, any> = {};
    const design: Record<string, any> = {};
    
    config.fields.forEach(field => {
      const val = formData.get(field.name);
      if (val !== null && val !== "") {
        let parsedVal: any = val;
        if (field.type === 'boolean') {
          parsedVal = val === 'true' || val === 'on';
        } else if (field.type === 'date') {
          parsedVal = new Date(val as string);
        }
        
        if (field.isDesign) {
          design[field.name] = parsedVal;
        } else {
          data[field.name] = parsedVal;
        }
      } else if (field.type === 'boolean') {
        if (field.isDesign) design[field.name] = false;
        else data[field.name] = false; // Checkbox unticked
      }
    });

    if (Object.keys(design).length > 0) {
      data.design = design;
    }

    const translationsStr = formData.get("translations");
    if (translationsStr) {
      try {
        const translationsObj = JSON.parse(translationsStr as string);
        if (Object.keys(translationsObj).length > 0) {
          data.translations = translationsObj;
        }
      } catch (e) {
        console.error("Failed to parse translations", e);
      }
    }

    await saveModelRecord(model, id, data);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/content/${model}`} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{config.label} Düzenle</h1>
      </div>

      <EditFormWithPreview 
        model={model} 
        fields={config.fields} 
        initialData={record} 
        action={handleSave}
        submitLabel="Güncelle"
      />
    </div>
  );
}
