import { getBioPageLinks } from '@/actions/campaigns';
import prisma from '@/lib/prisma';
import { DEFAULT_DESIGN_CONFIG, DesignConfig } from '@/lib/design-defaults';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialLinksBar';
import { MessageCircle, Music2, Link2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Lernzirkel Ludwigshafen e.V. — Alle Links',
  description: 'Alle aktuellen Kurse, Projekte und Kontaktmöglichkeiten von Lernzirkel Ludwigshafen e.V. an einem Ort.',
};

export const dynamic = 'force-dynamic';

const platformIcon: Record<string, React.ReactNode> = {
  instagram: <InstagramIcon size={18} />,
  facebook: <FacebookIcon size={18} />,
  whatsapp: <MessageCircle size={18} />,
  tiktok: <Music2 size={18} />,
  other: <Link2 size={18} />,
};

export default async function BioLinkPage() {
  const [links, settings] = await Promise.all([
    getBioPageLinks(),
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
  ]);

  const design = (settings?.designConfig as unknown as DesignConfig) || DEFAULT_DESIGN_CONFIG;
  const primary = design?.colors?.primary || '#0F4761';
  const primaryLight = design?.colors?.primaryLight || '#1a6d92';

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ background: `linear-gradient(to bottom, ${primary}, ${primaryLight})` }}
    >
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold" style={{ color: primary }}>LZ</span>
          </div>
          <h1 className="text-xl font-bold text-white">Lernzirkel Ludwigshafen e.V.</h1>
          <p className="text-sm text-white/80 mt-1">Bildung & Integration seit 2002</p>
        </div>

        {/* Link Cards */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <a
              href="/kurse"
              className="w-full flex items-center justify-between gap-3 bg-white rounded-2xl px-5 py-4 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <span className="font-bold text-gray-900 text-sm">Alle Kurse & Bildungsangebote</span>
              <ArrowRight size={18} className="shrink-0" style={{ color: primary }} />
            </a>
          ) : (
            links.map((link) => (
              <a
                key={link.slug}
                href={`/go/${link.slug}`}
                className="w-full flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primary}1a`, color: primary }}
                >
                  {platformIcon[link.platform] || platformIcon.other}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-gray-900 text-sm truncate">{link.label}</span>
                  {link.description && (
                    <span className="block text-xs text-gray-500 truncate mt-0.5">{link.description}</span>
                  )}
                </span>
                <ArrowRight size={18} className="shrink-0" style={{ color: primary }} />
              </a>
            ))
          )}
        </div>

        {/* Static Footer Links */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <a
            href="/kontakt"
            className="flex items-center justify-center gap-2 bg-white/15 text-white rounded-2xl px-4 py-3 text-xs font-bold hover:bg-white/25 transition-colors"
          >
            Kontakt & Anmeldung
          </a>
          <a
            href="tel:062130737271"
            className="flex items-center justify-center gap-2 bg-white/15 text-white rounded-2xl px-4 py-3 text-xs font-bold hover:bg-white/25 transition-colors"
          >
            Jetzt anrufen
          </a>
        </div>

        <p className="text-center text-[11px] text-white/60 mt-8">
          © {new Date().getFullYear()} Lernzirkel Ludwigshafen e.V.
        </p>
      </div>
    </div>
  );
}
