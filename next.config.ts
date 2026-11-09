import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    // Permite usar la variable privada BACKEND_URL en Vercel sin prefijo público
    const cleanUrl = backendUrl.replace(/\/api\/v1\/?$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${cleanUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
