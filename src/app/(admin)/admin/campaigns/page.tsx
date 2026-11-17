import { getCampaignLinksWithStats, getCampaignStatsByPlatform } from "@/actions/campaigns";
import CampaignsClient from "./CampaignsClient";

export const metadata = {
  title: "Kampanya Linkleri & QR | Lernzirkel Admin",
  description: "Afiş, saha ve sosyal medya kampanyaları için izlenebilir linkler ve QR kodlar.",
};

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [links, platformStats] = await Promise.all([
    getCampaignLinksWithStats(),
    getCampaignStatsByPlatform(),
  ]);
  return <CampaignsClient initialLinks={links} platformStats={platformStats} />;
}
