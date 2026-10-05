import CookiesContent from "./CookiesContent";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Cookie-Richtlinie",
  description: "Umfassende Informationen zur Verwendung von Cookies und ähnlichen Technologien auf der Website des Lernzirkel Ludwigshafen e.V.",
  url: "https://www.lernzirkel-online.de/cookies",
});

export default function CookiesPage() {
  return <CookiesContent />;
}
