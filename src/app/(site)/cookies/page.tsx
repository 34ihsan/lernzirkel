import CookiesContent from "./CookiesContent";
import { constructMetadata } from "@/lib/seo";
import { getCachedPageBySlug } from "@/lib/cached-content";

export async function generateMetadata() {
  const page = await getCachedPageBySlug('cookies');
  if (page?.title) {
    return constructMetadata({
      title: page.title,
      description: page.description || undefined,
      image: page.ogImage || undefined,
      noIndex: page.noIndex,
      url: "https://www.lernzirkel-online.de/cookies",
    });
  }
  return constructMetadata({
    title: "Cookie-Richtlinie",
    description: "Umfassende Informationen zur Verwendung von Cookies und ähnlichen Technologien auf der Website des Lernzirkel Ludwigshafen e.V.",
    url: "https://www.lernzirkel-online.de/cookies",
  });
}

export default function CookiesPage() {
  return <CookiesContent />;
}
