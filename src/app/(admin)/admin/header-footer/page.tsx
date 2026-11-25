import prisma from "@/lib/prisma";
import HeaderFooterEditor from "@/components/admin/HeaderFooterEditor";
import { defaultHeaderConfig, defaultFooterConfig, HeaderConfig, FooterConfig } from "@/lib/site-defaults";
import { getAreaAccess } from "@/lib/permissions";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHeaderFooterPage() {
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
  }).catch(() => null);

  const initialHeader = (settings?.headerConfig as unknown as HeaderConfig) || defaultHeaderConfig;
  const initialFooter = (settings?.footerConfig as unknown as FooterConfig) || defaultFooterConfig;

  return (
    <div className="max-w-5xl mx-auto py-6">
      <HeaderFooterEditor initialHeader={initialHeader} initialFooter={initialFooter} />
    </div>
  );
}
