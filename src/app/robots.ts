import { MetadataRoute } from 'next';

const appURL = 'https://expenso-pi.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/month-stats', '/transactions', '/categories'],
      },
    ],
    sitemap: `${appURL}/sitemap.xml`,
  };
}
