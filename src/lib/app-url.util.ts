import { SITE_URL } from '@/app/constants/site.constant';

/**
 * Origin of the running app (e.g. for links in emails), no trailing slash.
 * NEXTAUTH_URL points at the deployment that's sending; falls back to the
 * public site URL.
 */
const APP_ORIGIN = (process.env.NEXTAUTH_URL || SITE_URL).replace(/\/+$/, '');

/**
 * Absolute URL for an app path: appUrl('/login') → "https://…/login".
 * Joins with exactly one slash whether or not NEXTAUTH_URL ends with one.
 */
export const appUrl = (path = '/') =>
  `${APP_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
