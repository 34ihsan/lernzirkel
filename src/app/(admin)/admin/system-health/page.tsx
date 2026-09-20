import { getSystemHealthMetrics } from "@/actions/system";
import SystemHealthClient from "./SystemHealthClient";

export const metadata = {
  title: "Sistem Sağlığı & DevOps | Lernzirkel Admin",
  description: "Canlı sistem metrikleri, veritabanı gecikmesi ve denetim kayıtları.",
};

export default async function SystemHealthPage() {
  const metrics = await getSystemHealthMetrics();
  return <SystemHealthClient metrics={metrics} />;
}
