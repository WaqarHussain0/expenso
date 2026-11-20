/**
 * Token lifetimes and the JWT signing secret.
 *
 * Server-only: never import this from client components.
 */

const toPositiveNumber = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Access tokens are short-lived — 15 minutes by default. */
export const ACCESS_TOKEN_TTL_SECONDS =
  toPositiveNumber(process.env.ACCESS_TOKEN_TTL_MINUTES, 15) * 60;

/** Refresh tokens slide: every refresh issues a new one valid for this long. */
export const REFRESH_TOKEN_TTL_SECONDS =
  toPositiveNumber(process.env.REFRESH_TOKEN_TTL_DAYS, 7) * 24 * 60 * 60;

/**
 * When a refresh token has just been rotated, the old one is still accepted
 * for this long so parallel requests (multiple tabs, concurrent fetches) that
 * raced with the rotation don't log the user out.
 */
export const REFRESH_TOKEN_REUSE_GRACE_MS = 30 * 1000;

/**
 * Secret used to sign access tokens. Prefer the server-only `JWT_SECRET`;
 * `NEXT_PUBLIC_JWT_SECRET` is still read for backwards compatibility but the
 * NEXT_PUBLIC_ prefix makes it eligible for inlining into browser bundles,
 * so it should be renamed.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set — refusing to sign or verify tokens with a default secret.',
    );
  }
  return secret;
}
