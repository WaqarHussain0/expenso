import Skeleton from 'react-loading-skeleton';
import StatWrapper from '@/components/common/Stat.wrapper';
import { Card } from '@/components/ui/card';
import { getCachedAdminOverview } from '@/backend/modules/user/services/admin-overview.cache';
import UserInsightsPanels from './UserInsights.panels';

const STATS_GRID_CLASS = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';

const pct = (value: number, total: number) =>
  total ? (value / total) * 100 : 0;

// ───────────────────────────── Stat cards ─────────────────────────────

export const UserStatsSection = async () => {
  const { totals } = await getCachedAdminOverview();
  const users$ = totals.users;
  const hint = `of ${users$} ${users$ === 1 ? 'user' : 'users'}`;

  return (
    <StatWrapper
      className={STATS_GRID_CLASS}
      stats={[
        {
          label: 'Total users',
          value: users$,
          percent: users$ ? 100 : 0,
          color: '#0ea5e9',
          hint: `+${totals.newThisMonth} new this month`,
        },
        {
          label: `Active · last ${totals.activeWindowDays} days`,
          value: totals.activeRecently,
          percent: pct(totals.activeRecently, users$),
          color: '#1a7f5a',
          hint,
        },
        {
          label: 'Tracking money',
          value: totals.withTransactions,
          percent: pct(totals.withTransactions, users$),
          color: '#6366f1',
          hint: 'Logged a transaction',
        },
        {
          label: 'Deactivated',
          value: totals.deactivated,
          percent: pct(totals.deactivated, users$),
          color: '#f43f5e',
          hint,
        },
      ]}
    />
  );
};

export const UserStatsSkeleton = () => (
  <StatWrapper
    stats={[]}
    isLoading
    skeletonCount={4}
    className={STATS_GRID_CLASS}
  />
);

// ───────────────────────────── Insights view ─────────────────────────────

export const UserInsightsSection = async () => {
  const overview = await getCachedAdminOverview();
  return <UserInsightsPanels overview={overview} />;
};

const PanelSkeleton = ({
  className = '',
  height,
}: {
  className?: string;
  height: number;
}) => (
  <Card className={`gap-0 py-0 ${className}`}>
    <div className="px-4 pt-4 md:px-5 md:pt-5">
      <Skeleton width={110} height={14} />
      <Skeleton width="60%" height={12} className="mt-1" />
    </div>
    <div className="p-4 md:p-5">
      <Skeleton height={height} borderRadius={12} />
    </div>
  </Card>
);

export const UserInsightsSkeleton = () => (
  <div
    className="grid gap-5 lg:grid-cols-3"
    aria-busy="true"
    aria-label="Loading insights"
  >
    <PanelSkeleton className="lg:col-span-2" height={260} />
    <PanelSkeleton height={260} />
    <PanelSkeleton height={60} />
    <PanelSkeleton height={60} />
    <PanelSkeleton height={60} />
  </div>
);
