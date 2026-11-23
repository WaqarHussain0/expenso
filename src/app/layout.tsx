import type { Metadata } from 'next';
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

const appURL = 'https://expenso-pi.vercel.app';
export const metadata: Metadata = {
  metadataBase: new URL(appURL), // change later if needed

  title: {
    default: 'Expenso — Smart Expense, Income & Investment Tracker',
    template: '%s | Expenso',
  },

  description:
    'Expenso helps you track expenses, income, and investments in one place. Visual dashboards, category-based tracking, and financial insights to manage your money smarter.',

  icons: {
    icon: [
      { url: '/favicon.ico' }, // fallback
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  keywords: [
    'expense tracker',
    'budget app',
    'income tracker',
    'personal finance',
    'expense management',
    'financial dashboard',
    'budget planner',
  ],

  authors: [{ name: 'Expenso' }],
  creator: 'Expenso',

  openGraph: {
    title: 'Expenso — Smart Expense & Income Tracker',
    description:
      'Track expenses, income, and investments with powerful dashboards and category insights.',
    url: appURL,
    siteName: 'Expenso',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Expenso — Expense & Income Tracker',
    description:
      'Track your money smarter with Expenso. Categorize transactions and visualize your finances.',
  },

  robots: {
    index: true,
    follow: true,
  },
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
