import StatWrapper from '@/components/common/Stat.wrapper';
import { TrendingUp, Flame, Hash } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import { COLOR_CODES } from '@/app/constants/app.constant';
import { buildCashflowStats, ICashflowTotals } from '@/lib/stats.util';
import type {
  IBreakdownItem,
  IByCategoryType,
} from '@/lib/rtk/services/dashboard.rtk.service';
import BreakdownBarChart, { EXPENSE_COLORS } from './BreakdownBarChart';

interface ICustomDateStatsWrapperProps {
  isLoading: boolean;
  totals?: ICashflowTotals;
  counts?: IByCategoryType<number>;
  savingsRate?: number;
  topExpenseCategory?: IBreakdownItem | null;
  expenseBreakdown?: IBreakdownItem[];
}

const CustomDateStatsWrapper: React.FC<ICustomDateStatsWrapperProps> = ({
  isLoading,
  totals = { income: 0, expense: 0, investment: 0 },
  counts,
  savingsRate,
  topExpenseCategory,
  expenseBreakdown,
}) => {
  const stats = buildCashflowStats(totals);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(item => (
          <StatCard key={item.label} isLoading={isLoading} stat={item} />
        ))}
      </div>

      {/* ── 1. Totals ── */}
      <StatWrapper
        isLoading={isLoading}
        stats={[
          {
            label: 'Savings Rate',
            value: `${savingsRate}%`,
            icon: TrendingUp,
            color: COLOR_CODES.income,
            hint: 'Of income kept',
          },
          {
            label: 'Top Expense',
            value: topExpenseCategory?.name ?? '—',
            icon: Flame,
            color: COLOR_CODES.expense,
            hint: 'Biggest spending category',
          },
          {
            label: 'Transactions',
            value: counts
              ? counts.income + counts.expense + counts.investment
              : 0,
            icon: Hash,
            color: '#8b5cf6',
            hint: 'In this range',
          },
        ]}
        skeletonCount={3}
        className="grid-cols-1 sm:grid-cols-3"
      />

      {/* ── 3. Expense Breakdown ── */}
      <BreakdownBarChart
        title="Expense Breakdown"
        isLoading={isLoading}
        data={expenseBreakdown}
        colors={EXPENSE_COLORS}
        empty={
          <p className="text-muted-foreground py-10 text-center text-sm">
            No expense data for this period.
          </p>
        }
      />
    </div>
  );
};

export default CustomDateStatsWrapper;
