import { OG_SIZE, renderOgImage } from '@/lib/seo/og-image';

export const alt = 'Expenso — free expense tracker and budget app';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function TwitterImage() {
  return renderOgImage({
    eyebrow: 'Free expense tracker',
    title: 'Know exactly where',
    accent: 'every rupee goes.',
    subtitle:
      'Track income, expenses and investments, see your month at a glance, and ask an AI assistant about your money.',
  });
}
