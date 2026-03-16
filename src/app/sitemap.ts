import { MetadataRoute } from 'next';

const appURL = 'https://expenso-pi.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appURL,
      lastModified: new Date(),
    },
    {
      url: `${appURL}/login`,
      lastModified: new Date(),
    },
    {
      url: `${appURL}/register`,
      lastModified: new Date(),
    },
  ];
}
