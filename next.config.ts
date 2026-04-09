import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Speed up production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: false,
};

export default nextConfig;
