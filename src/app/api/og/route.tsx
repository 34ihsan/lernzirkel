import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Lernzirkel Ludwigshafen e.V.';
    
    const description = searchParams.get('description')?.slice(0, 120) || 'Bildung, Beratung und soziale Projekte';
    const badge = searchParams.get('badge') || 'Lernzirkel';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0c4a6e', // sky-900
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fcd34d', // amber-300
              color: '#082f49', // sky-950
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 40,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            {badge}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontStyle: 'normal',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 30,
              textShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: '#bae6fd', // sky-200
              lineHeight: 1.4,
              maxWidth: '85%',
              fontWeight: 500,
            }}
          >
            {description}
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              bottom: 60,
              left: 80,
              right: 80,
              justifyContent: 'space-between',
              borderTop: '2px solid rgba(255,255,255,0.1)',
              paddingTop: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.01em',
              }}
            >
              Lernzirkel Ludwigshafen e.V.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                color: '#7dd3fc', // sky-300
                fontWeight: 600,
              }}
            >
              lernzirkel-online.de
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
