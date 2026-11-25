import prisma from "@/lib/prisma";
import DesignEditorClient from "@/components/admin/DesignEditorClient";
import { DesignConfig } from "@/lib/design-defaults";
import { getAreaAccess } from "@/lib/permissions";
import { ShieldAlert } from "lucide-react";

export default async function DesignEditorPage() {
  const access = await getAreaAccess("design");
  if (!access.canEdit) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
        <h1 className="text-lg font-bold text-gray-900 mb-2">Bu bölümde düzenleme yetkiniz yok</h1>
        <p className="text-sm text-gray-500">Erişmek için yöneticinizden yetki talep edin.</p>
      </div>
    );
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  const fallbackColors = {
    primaryColor: settings?.primaryColor || "#0F4761",
    primaryLight: settings?.primaryLight || "#1a6d92",
    secondaryColor: settings?.secondaryColor || "#e8f4f8",
    accentColor: settings?.accentColor || "#e63946",
    backgroundColor: settings?.backgroundColor || "#fbfbfb",
    foregroundColor: settings?.foregroundColor || "#333333",
    mutedColor: settings?.mutedColor || "#f1f1f1",
  };

  return (
    <DesignEditorClient
      initialSiteName={settings?.siteName || "Lernzirkel Ludwigshafen e.V."}
      initialDescription={settings?.description || "Bildung, Beratung und soziale Projekte"}
      initialDesignConfig={(settings?.designConfig as unknown as DesignConfig) || null}
      fallbackColors={fallbackColors}
    />
  );
}
