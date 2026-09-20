import { getMarketingSettings, getMarketingEventMetrics } from "@/actions/marketing";
import MarketingClient from "./MarketingClient";

export const metadata = {
  title: "Pazarlama & Takip Yönetimi | Lernzirkel Admin",
  description: "Meta CAPI ve Google Analytics 4 dönüşüm entegrasyonu yönetimi.",
};

export default async function MarketingPage() {
  const [config, metrics] = await Promise.all([
    getMarketingSettings(),
    getMarketingEventMetrics(),
  ]);

  return <MarketingClient initialConfig={config} metrics={metrics} />;
}
