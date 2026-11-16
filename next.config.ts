import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Contabo VPS'te PM2 ile çalıştırmak için: standalone çıktı, tüm node_modules'ü
  // sunucuya kopyalamak zorunda kalmadan .next/standalone'u deploy etmeyi sağlar.
  output: 'standalone',

  // Compression & HTTP Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Next.js Image Optimization with AVIF & WebP
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for optimized images
    // Not: Önceden her http(s) host'a açıktı — bu next/image optimizer'ın açık proxy
    // gibi kötüye kullanılmasına izin veriyordu. Admin panelinden içeriğe yeni bir
    // dış görsel host'u eklendiğinde, o host buraya da eklenmeli.
    remotePatterns: [
      { protocol: 'https', hostname: 'lernzirkel-online.de' },
      { protocol: 'https', hostname: '*.lernzirkel-online.de' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
