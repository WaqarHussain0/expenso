const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "just now", "12 min ago", "3 h ago", "yesterday", "5 days ago",
 * "3 months ago", "2 years ago". Relative to `now` (pass one in for
 * consistent output across a render). Falls back to `empty` for null.
 */
export const formatRelative = (
  iso: string | Date | null | undefined,
  { now = Date.now(), empty = 'Never' }: { now?: number; empty?: string } = {},
) => {
  if (!iso) return empty;
  const diff = now - new Date(iso).getTime();
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} h ago`;
  const days = Math.floor(diff / DAY);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  const years = Math.floor(days / 365.25);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

/** "23 Nov 2026" */
export const formatDate = (
  iso: string | Date | null | undefined,
  empty = '—',
) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : empty;

/** "23 Nov 2026, 14:05" */
export const formatDateTime = (
  iso: string | Date | null | undefined,
  empty = '—',
) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : empty;

/** Whole days between a date and now (0 if in the future). */
export const daysSince = (
  iso: string | Date | null | undefined,
  now = Date.now(),
) => (iso ? Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY)) : 0);
