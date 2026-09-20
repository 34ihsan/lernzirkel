import { getAISettings } from "@/actions/ai";
import AISettingsClient from "./AISettingsClient";

export const metadata = {
  title: "Yapay Zeka & Asistan Yönetimi | Lernzirkel Admin",
  description: "Web sitesi akıllı danışman botu ve RAG bilgi tabanı yönetimi.",
};

export default async function AISettingsPage() {
  const config = await getAISettings();
  return <AISettingsClient initialConfig={config} />;
}
