import prisma from "@/lib/prisma";
import DesignEditorClient from "@/components/admin/DesignEditorClient";
import { DesignConfig } from "@/lib/design-defaults";

export default async function DesignEditorPage() {
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
