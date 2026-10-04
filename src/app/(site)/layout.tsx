import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBanner from "@/components/common/AnnouncementBanner";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getCachedSiteSettings, getCachedAnnouncements, getCachedUnpublishedPageSlugs } from "@/lib/cached-settings";

import { constructMetadata, generateOrganizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import FloatingContact from "@/components/common/FloatingContact";
import MobileActionBar from "@/components/common/MobileActionBar";
import FloatingAIAssistant from "@/components/common/FloatingAIAssistant";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";

import A11yPanel from "@/components/ui/A11yPanel";

const fontInter = Inter({ 
  subsets: ["latin", "latin-ext"], 
  variable: '--font-sans',
  display: 'swap',
});

const fontOutfit = Outfit({ 
  subsets: ["latin", "latin-ext"], 
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, serializedAnnouncements, unpublishedSlugs] = await Promise.all([
    getCachedSiteSettings(),
    getCachedAnnouncements(),
    getCachedUnpublishedPageSlugs(),
  ]);

  const headerConfig = JSON.parse(JSON.stringify((settings?.headerConfig as any) || { navLinks: [] }));
  const footerConfig = JSON.parse(JSON.stringify((settings?.footerConfig as any) || { sections: [] }));

  // Helper to check if a URL points to an unpublished page
  const isUnpublished = (url: string) => {
    if (!url || !url.startsWith('/')) return false;
    const slug = url.substring(1).split('#')[0].split('?')[0];
    return unpublishedSlugs.includes(slug);
  };

  // Filter out unpublished pages from header config
  if (headerConfig.navLinks) {
    headerConfig.navLinks = headerConfig.navLinks.filter((link: any) => !isUnpublished(link.url));
    headerConfig.navLinks.forEach((link: any) => {
      if (link.children) {
        link.children = link.children.filter((child: any) => !isUnpublished(child.url));
      }
    });
  }

  // Filter out unpublished pages from footer config
  if (footerConfig.quickLinks?.links) {
    footerConfig.quickLinks.links = footerConfig.quickLinks.links.filter((link: any) => !isUnpublished(link.url));
  }
  if (footerConfig.legalLinks) {
    footerConfig.legalLinks = footerConfig.legalLinks.filter((link: any) => !isUnpublished(link.url));
  }



  const design = (settings?.designConfig as any) || {};
  const colors = design.colors || {};
  const typography = design.typography || {};
  const geometry = design.geometry || {};
  const buttons = design.buttons || {};

  const primary = colors.primary || settings?.primaryColor || "#0F4761";
  const primaryLight = colors.primaryLight || settings?.primaryLight || "#1a6d92";
  const primaryDark = colors.primaryDark || "#082c3d";
  const secondary = colors.secondary || settings?.secondaryColor || "#e8f4f8";
  const accent = colors.accent || settings?.accentColor || "#e63946";
  const background = colors.background || settings?.backgroundColor || "#fbfbfb";
  const foreground = colors.foreground || settings?.foregroundColor || "#333333";
  const muted = colors.muted || settings?.mutedColor || "#f1f1f1";
  const surface = colors.surface || "#ffffff";
  const border = colors.border || "#e2e8f0";

  const bodyFont = typography.bodyFont || "Inter";
  const headingFont = typography.headingFont || "Outfit";

  const getRadiusPx = (r: string) => {
    switch (r) {
      case 'none': return '0px';
      case 'subtle': return '6px';
      case 'smooth': return '12px';
      case 'rounded': return '18px';
      case 'organic': return '28px';
      default: return '12px';
    }
  };

  const getBtnRadiusPx = (s: string) => {
    switch (s) {
      case 'sharp': return '0px';
      case 'rounded': return '10px';
      case 'pill': return '9999px';
      default: return '9999px';
    }
  };

  const getCardShadow = (s: string) => {
    switch (s) {
      case 'flat': return '0 1px 3px rgba(0,0,0,0.05)';
      case 'subtle': return '0 4px 12px rgba(0,0,0,0.05)';
      case 'royal': return '0 12px 32px -4px rgba(15, 71, 97, 0.12), 0 4px 12px rgba(0,0,0,0.04)';
      case 'floating': return '0 20px 40px -8px rgba(0,0,0,0.2), 0 8px 16px -4px rgba(0,0,0,0.1)';
      default: return '0 12px 32px -4px rgba(15, 71, 97, 0.12)';
    }
  };

  const radiusCard = getRadiusPx(geometry.borderRadius || 'smooth');
  const radiusBtn = getBtnRadiusPx(buttons.shape || 'pill');
  const cardShadow = getCardShadow(geometry.cardShadow || 'royal');
  const btnTransform = buttons.transform === 'uppercase' ? 'uppercase' : 'none';

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <style>{`
          :root {
            --background: ${background};
            --foreground: ${foreground};
            --primary: ${primary};
            --primary-light: ${primaryLight};
            --primary-dark: ${primaryDark};
            --secondary: ${secondary};
            --accent: ${accent};
            --muted: ${muted};
            --surface: ${surface};
            --border: ${border};
            --radius-card: ${radiusCard};
            --radius-btn: ${radiusBtn};
            --shadow-card: ${cardShadow};
            --btn-transform: ${btnTransform};
            --font-body: var(--font-sans), system-ui, -apple-system, sans-serif;
            --font-heading: var(--font-heading), var(--font-sans), sans-serif;
          }
          .dark {
            --background: #121212;
            --foreground: #f1f5f9;
            --surface: #1e1e1e;
            --border: #333333;
            --muted: #2d2d2d;
            /* Keep brand colors (primary, accent) from CMS intact */
          }
          body {
            font-family: var(--font-body);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
          }
        `}</style>
        {design.customCss && (
          <style>{design.customCss}</style>
        )}
        <JsonLd data={generateOrganizationSchema()} />
      </head>
      <body className={`${fontInter.variable} ${fontOutfit.variable} antialiased flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300`} suppressHydrationWarning>
        <SmoothScrollProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <AnnouncementBanner announcements={serializedAnnouncements as any} />
            <Header config={headerConfig} designConfig={design} />
            <main className="flex-grow pb-14 lg:pb-0">
              {children}
            </main>
            <FloatingContact />
            <MobileActionBar />
            <FloatingAIAssistant />
              <A11yPanel />
              <Footer config={footerConfig} designConfig={design} />
            </LanguageProvider>
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
