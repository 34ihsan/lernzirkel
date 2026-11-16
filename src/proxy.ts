import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

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

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // /admin altındaki sayfaları (login hariç) gerçek oturum ile koru
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
  const headers = new Headers(request.headers);
  headers.set('x-pathname', url.pathname);
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
