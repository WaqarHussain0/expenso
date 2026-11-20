import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import PAGE_ROUTES from './app/constants/page-routes.constant';

/** Pages that require a signed-in user. */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/stats',
  '/category',
  '/transaction',
  '/assistant',
  '/preferences',
  '/profile',
  '/user',
];

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const isDev = process.env.NODE_ENV !== 'production';

/**
 * The RTK API client calls NEXT_PUBLIC_API_URL — allow that origin in
 * connect-src so the CSP keeps working if it differs from the page origin.
 */
const apiOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_API_URL
      ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
      : null;
  } catch {
    return null;
  }
})();

/**
 * Strict, nonce-based Content-Security-Policy.
 * Next.js reads the nonce from the request's CSP header and adds it to its
 * own <script> tags; anything without the nonce (injected scripts) is blocked.
 */
function buildCsp(nonce: string) {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // React dev tooling needs eval for stack traces / fast refresh
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Inline style attributes (React style={}, toasts) are low-risk and widely used
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      ...(apiOrigin ? [apiOrigin] : []),
      ...(isDev ? ['ws:', 'wss:'] : []),
    ],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", 'https://accounts.google.com'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

/** Attach a fresh nonce + CSP to the request (for Next.js) and the response. */
function withSecurityHeaders(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

const authProxy = withAuth(
  function proxy(req: NextRequestWithAuth) {
    return withSecurityHeaders(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Valid while the refresh token is alive and no refresh has failed.
        // (An expired *access* token is fine here — it gets refreshed by
        // the client's next /api/auth/session call.)
        if (!token || token.error || !token.refreshToken) return false;
        return (
          typeof token.refreshTokenExpires === 'number' &&
          Date.now() < token.refreshTokenExpires
        );
      },
    },
    pages: {
      signIn: PAGE_ROUTES.login,
    },
  },
);

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (isProtected(req.nextUrl.pathname)) {
    return authProxy(req as NextRequestWithAuth, event);
  }
  return withSecurityHeaders(req);
}

export const config = {
  matcher: [
    {
      // Every page route — skip API routes, Next.js assets and static files
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?)$).*)',
      // Skip prefetches: their HTML is never executed, no nonce needed
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
