import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/app/constants/site.constant';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Signed-in app screens and APIs have nothing to index. (Share
        // links are left crawlable on purpose: they carry a `noindex` tag,
        // which crawlers can only see if they're allowed to fetch the page.)
        disallow: [
          '/api/',
          '/dashboard',
          '/stats',
          '/transaction',
          '/category',
          '/assistant',
          '/preferences',
          '/profile',
          '/user',
          '/reset-password',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
