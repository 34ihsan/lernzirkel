import { modelConfig } from "@/lib/admin-config";
import { saveModelRecord } from "@/actions/admin";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import EditFormWithPreview from "@/components/admin/EditFormWithPreview";
import { getAreaAccess, MODEL_TO_AREA } from "@/lib/permissions";

export default async function NewModelPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const config = modelConfig[model];

  if (!config) return notFound();

  const area = MODEL_TO_AREA[model];
  const access = area ? await getAreaAccess(area) : { canView: true, canEdit: true };
  if (!access.canEdit) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
        <h1 className="text-lg font-bold text-gray-900 mb-2">Bu bölümde düzenleme yetkiniz yok</h1>
        <p className="text-sm text-gray-500">Erişmek için yöneticinizden yetki talep edin.</p>
      </div>
    );
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

    await saveModelRecord(model, null, data);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/content/${model}`} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni {config.label} Ekle</h1>
      </div>

      <EditFormWithPreview 
        model={model} 
        fields={config.fields} 
        initialData={{}} 
        action={handleSave}
        submitLabel="Kaydet"
      />
    </div>
  );
}
