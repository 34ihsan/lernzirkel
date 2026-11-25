import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Contabo VPS'te PM2 ile çalıştırmak için: standalone çıktı, tüm node_modules'ü
  // sunucuya kopyalamak zorunda kalmadan .next/standalone'u deploy etmeyi sağlar.
  output: 'standalone',

  // Dev sunucusuna Windows host-network köprüsü üzerinden (172.19.192.1) erişilince
  // HMR websocket'i cross-origin diye engelleniyordu — canlı yeniden yükleme çalışmıyor,
  // taraf tarayıcı eski bir JS bundle'ında takılı kalıyordu.
  allowedDevOrigins: ['172.19.192.1'],

  // Compression & HTTP Optimizations
  compress: true,
  poweredByHeader: false,

  // lucide-react ikonları neredeyse her dosyada import ediliyor — bu olmadan
  // Next, kullanılmayan ikonları tree-shake etmek için paketin barrel export'unu
  // tam çözümleyemiyor ve client bundle'a gerekenden fazlası sızabiliyor.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Next.js Image Optimization with AVIF & WebP
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for optimized images
    // Not: Önceden her http(s) host'a açıktı — bu next/image optimizer'ın açık proxy
    // gibi kötüye kullanılmasına izin veriyordu. Admin panelinden içeriğe yeni bir
    // dış görsel host'u eklendiğinde, o host buraya da eklenmeli.
    remotePatterns: [
      { protocol: 'https', hostname: 'lernzirkel-ludwigshafen.de' },
      { protocol: 'https', hostname: '*.lernzirkel-ludwigshafen.de' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Eski WordPress sitesinden (lernzirkel-online.de) hotlink edilen proje/organigramm
      // görselleri — sadece upload yoluna izin veriyoruz, siteyi açık proxy yapmamak için.
      { protocol: 'https', hostname: 'lernzirkel-online.de', pathname: '/wp-content/uploads/**' },
    ],
  },
};

export default nextConfig;
