import { MetadataRoute } from 'next';

const appURL = 'https://expenso-pi.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/stats',
          '/transaction',
          '/category',
          '/profile',
          '/user',
        ],
      },
    ],
    sitemap: `${appURL}/sitemap.xml`,
  };
}
