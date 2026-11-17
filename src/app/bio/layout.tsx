import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Lernzirkel Ludwigshafen e.V. — Alle Links",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// "Link in Bio" sayfası bilinçli olarak site header/footer/anons çubuğundan bağımsız —
// Instagram'dan gelen ziyaretçi için hızlı, dikkat dağıtmayan tek sayfa deneyimi.
export default function BioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
