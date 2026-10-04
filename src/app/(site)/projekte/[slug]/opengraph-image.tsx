import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const runtime = 'edge';
export const alt = 'Lernzirkel Projekt';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = await prisma.project.findUnique({ where: { id: slug } });

  if (!project) {
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
          Projekt nicht gefunden
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F4761 0%, #1a6d92 100%)',
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
          }}
        >
          {/* Badge */}
          <div
            style={{
              background: '#e63946',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {project.status}
          </div>
          
          <div style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            Lernzirkel Ludwigshafen e.V.
          </div>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '40px',
            maxWidth: '900px',
          }}
        >
          {project.title}
        </h1>

        <p
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '900px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
