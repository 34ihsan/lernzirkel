import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression & HTTP Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Next.js Image Optimization with AVIF & WebP
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for optimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
