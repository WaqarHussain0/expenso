import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Security headers applied to every response. The Content-Security-Policy is
 * set per request (with a nonce) in src/proxy.ts, not here.
 */
const securityHeaders = [
  // Never let the site be framed (clickjacking); CSP frame-ancestors covers modern browsers
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't let browsers guess content types (MIME sniffing)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Send only the origin to other sites, full URL to ourselves
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Deny powerful browser features the app doesn't use
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  // Isolate the browsing context from cross-origin popups
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // HTTPS only, for two years, including subdomains (production only —
  // sending HSTS from localhost would pin it in your browser)
  ...(isProd
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header
  poweredByHeader: false,
  reactStrictMode: false,

  // Don't ship source maps to browsers in production
  productionBrowserSourceMaps: false,

  experimental: {
    // Tree-shake barrel imports so only the icons/components used are bundled
    optimizePackageImports: ['lucide-react', 'recharts', 'radix-ui', 'cmdk'],
  },

  compiler: {
    // Strip console.* (except errors/warnings) from production client bundles
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },

  images: {
    // Serve modern formats when the browser supports them
    formats: ['image/avif', 'image/webp'],
    // Only our own images are optimised — no open image proxy
    remotePatterns: [],
    // SVGs could carry scripts; never optimise/serve them through next/image
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Authenticated API responses must never be cached by browsers/proxies
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
      {
        // Long-lived caching for static images in /public
        source: '/:file*.(png|jpg|jpeg|webp|avif|ico|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

// `npm run analyze` → opens interactive treemaps of the client/server bundles
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  // set ANALYZE_OPEN=false to just write the reports (e.g. in CI)
  openAnalyzer: process.env.ANALYZE_OPEN !== 'false',
});

export default withBundleAnalyzer(nextConfig);
