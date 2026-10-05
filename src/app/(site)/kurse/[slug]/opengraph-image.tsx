import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const alt = 'Lernzirkel Kurs';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Kurse are searched by ID for now based on the course detail page implementation
  const course = await prisma.course.findUnique({ where: { id: slug } });

  if (!course) {
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
          Kurs nicht gefunden
        </div>
      ),
      { ...size }
    );
  }

  const categoryLabels: Record<string, string> = {
    INTEGRATION: 'Integrationskurs',
    SPRACHE: 'Sprachkurs',
    NACHHILFE: 'Nachhilfe',
    GRUNDBILDUNG: 'Grundbildung',
    BERUFSBEZOGEN: 'Berufsbezogene Deutschförderung',
    PRUEFUNGSVORBEREITUNG: 'Prüfungsvorbereitung',
    ALPHABETISIERUNG: 'Alphabetisierung',
    ERSTORIENTIERUNG: 'Erstorientierung',
    FRAUENKURSE: 'Frauen- & MiA-Kurse',
    FERIENKURSE: 'Ferienkurse',
    WEITERBILDUNG: 'Weiterbildung',
    ANDERE: 'Andere',
  };

  const categoryLabel = categoryLabels[course.category] || course.category;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fbfbfb 0%, #e8f4f8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          color: '#333',
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
              background: '#0F4761',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {categoryLabel}
          </div>
          
          <div style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 700, color: '#0F4761' }}>
            Lernzirkel e.V.
          </div>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '40px',
            maxWidth: '900px',
            color: '#0F4761',
          }}
        >
          {course.title}
        </h1>

        <p
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: '#555',
            maxWidth: '900px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.description}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
