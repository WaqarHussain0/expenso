import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/app/constants/site.constant';

// Bump when the landing page or guide content meaningfully changes, so
// crawlers see a stable, honest lastModified instead of "now" on every fetch.
const CONTENT_UPDATED = new Date('2026-11-23');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/guide'),
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/register'),
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/login'),
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];
}
