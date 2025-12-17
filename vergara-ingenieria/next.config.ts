import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimizar imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["cuddly-barnacle-6jggggqg5v62r7q5-3000.app.github.dev", "localhost:3000", "localhost:3001"],
      bodySizeLimit: '52mb', // Aumentado para archivos CAD (50MB + margen)
    },
  },
  async rewrites() {
    return [
      {
        source: '/n8n-chat',
        destination: 'https://nicvergara852.app.n8n.cloud/webhook/ebae01d6-c5ce-4b6a-854c-241e602fc881/chat',
      },
      {
        source: '/n8n-chat/:path*',
        destination: 'https://nicvergara852.app.n8n.cloud/webhook/ebae01d6-c5ce-4b6a-854c-241e602fc881/chat/:path*',
      },
    ];
  },
};

export default nextConfig;
