import { OG_SIZE, renderOgImage } from '@/lib/seo/og-image';

export const alt = 'The Expenso guide — how to track expenses and budget';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function TwitterImage() {
  return renderOgImage({
    eyebrow: 'Guide',
    title: 'Everything Expenso can do,',
    accent: 'and how to use it.',
    subtitle:
      'Categories, transactions, dashboards, yearly stats, share links and the AI assistant — step by step.',
  });
}
