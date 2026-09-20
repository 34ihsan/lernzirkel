import prisma from "@/lib/prisma";
import HeaderFooterEditor from "@/components/admin/HeaderFooterEditor";
import { defaultHeaderConfig, defaultFooterConfig, HeaderConfig, FooterConfig } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

export default async function AdminHeaderFooterPage() {
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
