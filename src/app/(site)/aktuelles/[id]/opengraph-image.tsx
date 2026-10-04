import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const runtime = 'edge';
export const alt = 'Lernzirkel Aktuelles';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const news = await prisma.news.findUnique({ where: { id } });

  if (!news) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Beitrag nicht gefunden
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a6d92 0%, #0F4761 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
            width: '100%',
          }}
        >
          {/* Badge */}
          <div
            style={{
              background: '#e63946',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Aktuelles
          </div>
          
          <div style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            Lernzirkel Ludwigshafen e.V.
          </div>
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '40px',
            maxWidth: '1000px',
          }}
        >
          {news.title}
        </h1>
        
        <div style={{ fontSize: 32, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
          {new Date(news.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
