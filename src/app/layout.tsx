import type { Metadata, Viewport } from 'next';
import './globals.css';
import NextAuthProvider from '@/components/providers/NextAuth.provider';
import ThemeProvider from '@/components/providers/Theme.provider';
import ThemedToaster from '@/components/providers/ThemedToaster';
import { Fraunces, Manrope, Inter } from 'next/font/google';
import { connection } from 'next/server';
import { cookies, headers } from 'next/headers';
import {
  THEME_COOKIE,
  isThemePreference,
} from '@/app/constants/theme.constant';
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/app/constants/site.constant';

// Display serif for headings and the italic accents (replaces the Georgia
// system font, which isn't installed on most Android devices)
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Expenso',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Waqar Hussain', url: SITE_URL }],
  creator: 'Waqar Hussain',
  publisher: SITE_NAME,
  category: 'finance',
  alternates: { canonical: '/' },
  // Don't let iOS turn amounts into phone links
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Search Console / Bing ownership — set the env vars to verify
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0e13' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The CSP uses a per-request nonce (see src/proxy.ts), so every page must be
  // rendered per request for Next.js to stamp the nonce on its scripts.
  await connection();

  // Theme from cookie → correct class on first paint (no light/dark flash)
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const theme = isThemePreference(stored) ? stored : 'system';
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      className={theme === 'dark' ? 'dark' : undefined}
      style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
      // the inline script below may add .dark before React hydrates
      suppressHydrationWarning
    >
      <head>
        {theme === 'system' && (
          // "System" can only be resolved in the browser: apply it before paint.
          // Carries the CSP nonce, so it's allowed by the strict policy.
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `try{if(matchMedia('(prefers-color-scheme: dark)').matches){var d=document.documentElement;d.classList.add('dark');d.style.colorScheme='dark'}}catch(e){}`,
            }}
          />
        )}
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${manrope.variable} antialiased`}
      >
        <ThemeProvider initialTheme={theme}>
          <ThemedToaster />
          <NextAuthProvider>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
