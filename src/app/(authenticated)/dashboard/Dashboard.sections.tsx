import Skeleton from 'react-loading-skeleton';
import { COLOR_CODES } from '@/app/constants/app.constant';
import CountUp from '@/components/common/CountUp';
import StatCard from '@/components/common/StatCard';
import RecentTransactions from '@/components/feature/dashboard/RecentTransactions';
import { Card } from '@/components/ui/card';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { getCachedUserStats } from '@/backend/modules/transaction/transaction-stats.cache';

const transactionService = new TransactionService();

const RECENT_LIMIT = 5;

const STATS_GRID_CLASS =
  'grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4';

// ───────────────────────────── Free cash (hero) ─────────────────────────────

/** The free-cash figure and allocation bar inside the hero card. */
export const FreeCashSection = async ({ userId }: { userId: string }) => {
  const {
    totals: { income, expense, investment },
  } = await getCachedUserStats(userId);

  const freeCash = income - (expense + investment);

  // Allocation bar: how income was split. If spending exceeds income,
  // scale against total outflow so the bar never overflows.
  const allocationBase = Math.max(income, expense + investment, 1);
  const allocation = [
    { label: 'Expenses', value: expense, color: COLOR_CODES.expense },
    { label: 'Investments', value: investment, color: COLOR_CODES.investment },
    {
      label: 'Free cash',
      value: Math.max(freeCash, 0),
      color: COLOR_CODES.freeCash,
    },
  ].map(item => ({ ...item, pct: (item.value / allocationBase) * 100 }));

  return (
    <>
      <div className="mt-6 flex items-baseline gap-2">
        <CountUp
          to={freeCash}
          className={`manrope text-4xl font-bold tracking-tight tabular-nums md:text-5xl ${
            freeCash < 0 ? 'text-[#fb7185]' : 'text-white'
          }`}
        />
      </div>
      <p className="inter mt-1.5 text-xs text-white/45">
        Left after expenses and investments · all time
      </p>

      {/* Allocation bar */}
      <div className="mt-7 flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-white/[0.06]">
        {allocation
          .filter(a => a.pct > 0)
          .map(a => (
            <div
              key={a.label}
              className="h-full rounded-full transition-[width] duration-1000"
              style={{ width: `${a.pct}%`, background: a.color }}
            />
          ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {allocation.map(a => (
          <div key={a.label} className="flex items-center gap-2.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: a.color }}
            />
            <span className="inter text-xs text-white/55">{a.label}</span>
            <span className="inter ml-auto text-xs font-semibold text-white/90 tabular-nums sm:ml-0">
              {a.pct.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

/** Dark-panel placeholder — the default skeleton colours vanish on the hero. */
const HeroBar = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
);

export const FreeCashSkeleton = () => (
  <div aria-busy="true" aria-label="Loading free cash">
    <HeroBar className="mt-6 h-10 w-48 rounded-lg md:h-12" />
    <HeroBar className="mt-2.5 h-3 w-56" />
    <HeroBar className="mt-7 h-2.5 w-full" />
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <HeroBar key={i} className="h-3 w-28" />
      ))}
    </div>
  </div>
);

// ───────────────────────────── Stat cards ─────────────────────────────

export const DashboardStatsSection = async ({ userId }: { userId: string }) => {
  const {
    totals: { income, expense, investment },
  } = await getCachedUserStats(userId);

  const base = income || 1;
  const freeCash = income - (expense + investment);

  const stats = [
    {
      label: 'Income',
      value: income,
      percent: 100,
      color: COLOR_CODES.income,
    },
    {
      label: 'Total Expense',
      value: expense,
      percent: (expense / base) * 100,
      color: COLOR_CODES.expense,
    },
    {
      label: 'Total Investment',
      value: investment,
      percent: (investment / base) * 100,
      color: COLOR_CODES.investment,
    },
    {
      label: 'Total Free Cash',
      value: freeCash,
      percent: (freeCash / base) * 100,
      color: COLOR_CODES.freeCash,
    },
  ];

  return (
    <div className={STATS_GRID_CLASS}>
      {stats.map(item => (
        <StatCard key={item.label} stat={item} />
      ))}
    </div>
  );
};

export const DashboardStatsSkeleton = () => (
  <div className={STATS_GRID_CLASS}>
    {Array.from({ length: 4 }, (_, i) => (
      <StatCard
        key={i}
        isLoading
        stat={{ label: `loading-${i}`, value: 0, color: COLOR_CODES.income }}
      />
    ))}
  </div>
);

// ───────────────────────────── Recent transactions ─────────────────────────────

export const RecentTransactionsSection = async ({
  userId,
}: {
  userId: string;
}) => {
  const { data } = await transactionService.findAll({
    page: 1,
    limit: RECENT_LIMIT,
    userId,
  });

  return <RecentTransactions transactions={data || []} className="w-full" />;
};

export const RecentTransactionsSkeleton = () => (
  <Card
    className="w-full gap-0 py-0"
    aria-busy="true"
    aria-label="Loading recent transactions"
  >
    <div className="px-5 pt-5 pb-4">
      <Skeleton width={140} height={14} />
      <Skeleton width={110} height={12} className="mt-1" />
    </div>

    <div className="border-ink/[0.06] border-t">
      {Array.from({ length: RECENT_LIMIT }, (_, i) => (
        <div
          key={i}
          className="border-ink/[0.06] flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
        >
          <Skeleton width={36} height={36} borderRadius={12} />
          <div className="min-w-0 flex-1">
            <Skeleton width="35%" height={13} />
            <Skeleton width={80} height={11} className="mt-1" />
          </div>
          <div className="hidden flex-1 md:block">
            <Skeleton width="55%" height={13} />
          </div>
          <Skeleton width={70} height={14} />
        </div>
      ))}
    </div>
  </Card>
);
