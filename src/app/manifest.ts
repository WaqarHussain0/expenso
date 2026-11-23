import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '@/app/constants/site.constant';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Expenso — Expense & Budget Tracker',
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#1a7f5a',
    categories: ['finance', 'productivity', 'utilities'],
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
