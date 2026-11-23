import { unstable_cache } from 'next/cache';
import { TransactionService } from './transaction.service';

const transactionService = new TransactionService();

/**
 * Cache tag for one user's this-month cashflow totals. Expire it whenever
 * their transactions change, or a category's type changes (totals are
 * grouped by category type).
 */
export const transactionStatsTag = (userId: string) =>
  `transaction-stats:${userId}`;

/** "2026-11" — same local-time month that getMonthlyStats aggregates over. */
const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

/**
 * This month's income / expense / investment totals for a user.
 *
 * They don't depend on the transaction page's search, type, category or page
 * filters, so they're cached instead of re-aggregated on every filter change.
 * The month is part of the key, so a new month never serves last month's
 * totals; `revalidate` is only a safety net.
 */
export const getCachedMonthlyStats = (userId: string) =>
  unstable_cache(
    () => transactionService.getMonthlyStats(userId),
    ['transaction-monthly-stats', userId, currentMonthKey()],
    { tags: [transactionStatsTag(userId)], revalidate: 3600 },
  )();
