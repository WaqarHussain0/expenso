import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import RTKProvider from '@/components/providers/RTK.provider';
import NextAuthProvider from '@/components/providers/NextAuth.provider';
import { Poppins, Manrope, Inter } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const appURL = 'https://expenso-pi.vercel.app';
export const metadata: Metadata = {
  metadataBase: new URL(appURL), // change later if needed

  title: {
    default: 'Expenso — Smart Expense & Income Tracker',
    template: '%s | Expenso',
  },

  description:
    'Expenso helps you track expenses, income, and investments in one place. Visual dashboards, category-based tracking, and financial insights to manage your money smarter.',

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${manrope.variable} antialiased`}
      >
        <Toaster position="bottom-right" richColors />

        <NextAuthProvider>
          <RTKProvider>{children}</RTKProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
