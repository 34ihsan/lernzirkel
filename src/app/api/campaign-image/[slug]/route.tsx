import { ImageResponse } from 'next/og';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';
import { DEFAULT_DESIGN_CONFIG, DesignConfig } from '@/lib/design-defaults';

export const runtime = 'nodejs';

// Admin panelinden indirilen, Instagram feed/story'e direkt yüklenebilecek kare (1080x1080)
// paylaşım görseli: kampanya etiketi + QR kod + marka rengi. QR, /go/[slug] üzerinden
// tıklamayı ve kaydı diğer her yerle aynı şekilde izler.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [link, settings] = await Promise.all([
    prisma.campaignLink.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
  ]);

  if (!link) {
    return new Response('Kampanya linki bulunamadı', { status: 404 });
  }

  const design = (settings?.designConfig as unknown as DesignConfig) || DEFAULT_DESIGN_CONFIG;
  const primary = design?.colors?.primary || '#0F4761';
  const primaryLight = design?.colors?.primaryLight || '#1a6d92';

  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/go/${slug}`, {
    margin: 1,
    width: 500,
    color: { dark: primary, light: '#ffffffff' },
  });

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${primary} 0%, ${primaryLight} 100%)`,
          padding: '70px',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: 0.9,
              display: 'flex',
            }}
          >
            Lernzirkel Ludwigshafen e.V.
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.15,
              marginTop: '28px',
              maxWidth: '850px',
              display: 'flex',
            }}
          >
            {link.label}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '32px',
            padding: '36px',
            display: 'flex',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} width={420} height={420} alt="QR" />
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          📲 QR-Code scannen & anmelden
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );

  image.headers.set('Content-Disposition', `inline; filename="${slug}-instagram.png"`);
  return image;
}
