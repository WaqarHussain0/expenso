import StatWrapper from '@/components/common/Stat.wrapper';
import { Card, CardTitle } from '@/components/ui/card';
import { TrendingUp, Flame, Hash } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import StatCard from '@/components/common/StatCard';

interface ICustomDateStatsWrapperProps {
  isLoading: boolean;
  totals: {
    income: number;
    expense: number;
    investment: number;
    freeCash: number;
  };
  counts: {
    income: number;
    expense: number;
    investment: number;
  };
  savingsRate: number;
  topExpenseCategory: { name: string; total: number } | null;
  expenseBreakdown: { name: string; total: number }[];
}

const EXPENSE_COLORS = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#a78bfa',
  '#60a5fa',
  '#34d399',
  '#f472b6',
  '#94a3b8',
];

// Static outside component — stable across renders
const BAR_CHART_HEIGHTS = [140, 80, 120, 60, 100, 75];

const formatCurrency = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;

const CustomDateStatsWrapper: React.FC<ICustomDateStatsWrapperProps> = ({
  isLoading,
  totals = { income: 0, expense: 0, investment: 0, freeCash: 0 },
  counts,
  savingsRate,
  topExpenseCategory,
  expenseBreakdown,
}) => {
  const { expense, income, investment, freeCash } = totals;
  const total = income || 1;

  const stats = [
    {
      label: 'Income',
      value: income,
      percent: 100,
      color: '#22c55e',
    },
    {
      label: 'Expense',
      value: expense,
      percent: (expense / total) * 100,
      color: '#ef4444',
    },
    {
      label: 'Investment',
      value: investment,
      percent: (investment / total) * 100,
      color: '#3b82f6',
    },
    {
      label: 'Free Cash',
      value: freeCash,
      percent: (freeCash / total) * 100,
      color: '#a855f7',
    },
  ];

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
            iconClassName: 'text-emerald-400',
          },
          {
            label: 'Top Expense',
            value: topExpenseCategory?.name ?? '—',
            icon: Flame,
            iconClassName: 'text-orange-400',
          },
          {
            label: 'Transactions',
            value: counts?.income + counts?.expense + counts?.investment,
            icon: Hash,
            iconClassName: 'text-purple-400',
          },
        ]}
        skeletonCount={3}
        className="grid-cols-2 gap-2 lg:grid-cols-4"
      />

      {/* ── 3. Expense Breakdown ── */}
      <Card className="px-4">
        <CardTitle>Expense Breakdown</CardTitle>

        {isLoading ? (
          <div className="flex h-[240px] flex-col justify-end gap-2 pb-2">
            <div className="flex h-full items-end gap-3 px-2">
              {BAR_CHART_HEIGHTS.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col justify-end">
                  <Skeleton height={h} borderRadius={4} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-2">
              {BAR_CHART_HEIGHTS.map((_, i) => (
                <div key={i} className="flex-1">
                  <Skeleton height={10} borderRadius={4} />
                </div>
              ))}
            </div>
          </div>
        ) : expenseBreakdown?.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No expense data for this period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={expenseBreakdown}
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={value => Number(value).toLocaleString()}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {expenseBreakdown?.map((_, index) => (
                  <Cell
                    key={index}
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default CustomDateStatsWrapper;
