/**
 * Abuse limits for heavy or outward-facing actions (per user). Tune here.
 * Windows are fixed (e.g. 10:00–11:00), so a burst at a boundary can briefly
 * allow up to twice the limit — fine for abuse protection.
 */
export const LIMITS = {
  /** Stats CSV emails: each one queries a whole period and sends an email */
  statsExport: { limit: 5, windowSeconds: 60 * 60 },
  /** Category CSV imports (up to 500 rows each) */
  categoryImport: { limit: 10, windowSeconds: 10 * 60 },
  /** Category CSV downloads */
  categoryExport: { limit: 20, windowSeconds: 10 * 60 },
};

/** Most transactions one stats export may contain (keeps the email small). */
export const STATS_EXPORT_MAX_ROWS = 20_000;

/** Most categories (active + deleted) a user can reach through an import. */
export const MAX_CATEGORIES_PER_USER = 1_000;

/** Most categories one export returns. */
export const CATEGORY_EXPORT_MAX_ROWS = 5_000;
