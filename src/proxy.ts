import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory store for rate limiting in Edge/Middleware
const rateLimitCache = new Map<string, { count: number; expiresAt: number }>();

function applyRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  
  // Clean up expired entries (garbage collection)
  if (Math.random() < 0.1) {
    for (const [key, value] of rateLimitCache.entries()) {
      if (now > value.expiresAt) rateLimitCache.delete(key);
    }
  }

  const record = rateLimitCache.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitCache.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Sadece /admin ile başlayan yolları koru
  if (url.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    // Basit Basic Auth kontrolü (Kullanıcı: admin, Şifre: admin123)
    if (authHeader !== 'Basic YWRtaW46YWRtaW4xMjM=') {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  // Add security headers to all responses
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // API Rate Limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    const rateLimit = applyRateLimit(ip, 50, 10000);
    
    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Zu viele Anfragen (Rate Limit überschritten). Bitte warten Sie einen Moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    response.headers.set('X-RateLimit-Limit', '50');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
