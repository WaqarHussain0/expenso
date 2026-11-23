import StatWrapper from '@/components/common/Stat.wrapper';
import { getCachedMonthlyStats } from '@/backend/modules/transaction/transaction-stats.cache';
import { buildCashflowStats } from '@/lib/stats.util';

const GRID_CLASS = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';

/** Streams in on its own, so the page shell never waits on the totals. */
const TransactionStatsSection = async ({ userId }: { userId: string }) => {
  const monthStats = await getCachedMonthlyStats(userId);

  return (
    <StatWrapper
      stats={buildCashflowStats(monthStats, 'This month')}
      className={GRID_CLASS}
    />
  );
};

export const TransactionStatsSkeleton = () => (
  <StatWrapper stats={[]} isLoading skeletonCount={4} className={GRID_CLASS} />
);

export default TransactionStatsSection;
