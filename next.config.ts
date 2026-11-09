import type { NextConfig } from "next";

const rawBackend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mascotas-aplicacion-back.onrender.com';
const cleanBackend = rawBackend.trim().replace(/([^:])\/\/+/g, '$1/').replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');

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
    return [
      {
        source: '/api/v1/:path*',
        destination: `${cleanBackend}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
