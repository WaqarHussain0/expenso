/**
 * Site-wide SEO constants: one place for the canonical origin, brand copy and
 * keywords used by metadata, the sitemap, robots, OG images and JSON-LD.
 */

/**
 * Canonical public origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL when
 * moving to a custom domain so canonicals, the sitemap and OG URLs follow.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://expenso-pi.vercel.app'
).replace(/\/+$/, '');

export const SITE_NAME = 'Expenso';

export const SITE_TITLE =
  'Expenso — Free Expense Tracker & Personal Budget App';

export const SITE_DESCRIPTION =
  'Expenso is a free expense tracker and budget app. Track income, expenses and investments, see monthly and yearly spending charts, share reports, and ask an AI assistant where your money went.';

export const SITE_TAGLINE = 'Know exactly where every rupee goes';

export const CONTACT_EMAIL = 'waqar.mernstackdev@gmail.com';

export const SITE_KEYWORDS = [
  'expense tracker',
  'free expense tracker',
  'budget app',
  'personal finance app',
  'money manager',
  'spending tracker',
  'income and expense tracker',
  'investment tracker',
  'monthly budget planner',
  'daily expense tracker',
  'expense tracker Pakistan',
  'PKR budget app',
  'AI finance assistant',
  'personal finance dashboard',
  'track spending by category',
  'salary tracker',
];

/** Absolute URL for a site path, e.g. absoluteUrl('/guide'). */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Search Console ownership token (public — it's printed in the page's HTML).
 * The env var overrides it, e.g. when the property moves to a custom domain.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  '7NJNF7Nc7PlkzKNjD1Z7j-7ewS5NRXMtvhXFXfvFNGQ';
