import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Sadece /admin ile başlayan yolları koru
  if (url.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    // Basit Basic Auth kontrolü (Kullanıcı: admin, Şifre: admin123)
    // dW5kZWZpbmVkOg== -> undefined: 
    // YWRtaW46YWRtaW4xMjM= -> admin:admin123
    
    if (authHeader !== 'Basic YWRtaW46YWRtaW4xMjM=') {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
