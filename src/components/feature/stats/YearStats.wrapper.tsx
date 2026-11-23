import { Card, CardTitle } from '@/components/ui/card';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import StatCard from '@/components/common/StatCard';
import TextElement from '@/components/common/TextElement';
import { buildCashflowStats, ICashflowTotals } from '@/lib/stats.util';
import type {
  IBreakdownItem,
  IMonthlySeriesPoint,
} from '@/lib/rtk/services/dashboard.rtk.service';
import BreakdownBarChart, {
  CHART_TOOLTIP_STYLE,
  EXPENSE_COLORS,
  formatAxisAmount,
  formatTooltipAmount,
} from './BreakdownBarChart';

interface IYearStatsWrapperProps {
  isLoading: boolean;
  totals?: ICashflowTotals;
  monthlySeries?: IMonthlySeriesPoint[];
  expenseBreakdown?: IBreakdownItem[];
  incomeBreakdown?: IBreakdownItem[];
  investmentBreakdown?: IBreakdownItem[];
}

const INCOME_COLORS = [
  '#34d399',
  '#4ade80',
  '#60a5fa',
  '#a78bfa',
  '#fbbf24',
  '#f472b6',
  '#fb923c',
  '#94a3b8',
];

const INVESTMENT_COLORS = [
  '#fbbf24',
  '#facc15',
  '#60a5fa',
  '#a78bfa',
  '#34d399',
  '#f87171',
  '#f472b6',
  '#94a3b8',
];

// Static outside component — stable across renders, no Math.random()
const LINE_CHART_HEIGHTS = [120, 80, 160, 60, 140, 90, 110, 75, 150, 55];

const EmptyMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <TextElement className="w-full py-2 text-center">{children}</TextElement>;

const YearStatsWrapper: React.FC<IYearStatsWrapperProps> = ({
  totals = { income: 0, expense: 0, investment: 0 },
  isLoading,
  monthlySeries,
  expenseBreakdown,
  incomeBreakdown,
  investmentBreakdown,
}) => {
  const stats = buildCashflowStats(totals);

  return (
    <div className="flex flex-col gap-4">
      {/* ── 1. Stat Cards ── */}

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(item => (
          <StatCard key={item.label} isLoading={isLoading} stat={item} />
        ))}
      </div>

      {/* ── 2. Line Chart — 12 months ── */}
      <Card className="px-4">
        <CardTitle>Monthly Overview</CardTitle>

        {isLoading ? (
          <div className="flex h-[280px] flex-col justify-end gap-2 pb-2">
            <div className="flex h-full items-end gap-1 px-2">
              {LINE_CHART_HEIGHTS.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col justify-end">
                  <Skeleton height={h} borderRadius={4} />
                </div>
              ))}
            </div>
            <div className="flex gap-1 px-2">
              {LINE_CHART_HEIGHTS.map((_, i) => (
                <div key={i} className="flex-1">
                  <Skeleton height={10} borderRadius={4} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280} className={''}>
            <LineChart
              data={monthlySeries}
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              className="inter p-1"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatAxisAmount}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={formatTooltipAmount}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="investment"
                stroke="#facc15"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="freeCash"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ── 4. Expense Breakdown Bar Chart ── */}
      <BreakdownBarChart
        className="w-full px-4"
        title="Expense Breakdown"
        isLoading={isLoading}
        data={expenseBreakdown}
        colors={EXPENSE_COLORS}
        empty={<EmptyMessage>No expense data for this year.</EmptyMessage>}
      />

      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        {/* ── 3. Income Breakdown Bar Chart ── */}
        <BreakdownBarChart
          className="w-full px-4"
          title="Income Breakdown"
          isLoading={isLoading}
          data={incomeBreakdown}
          colors={INCOME_COLORS}
          empty={<EmptyMessage>No income data for this year.</EmptyMessage>}
        />
        {/* ── 5. Investment Breakdown Bar Chart ── */}
        <BreakdownBarChart
          className="w-full px-4"
          title="Investment Breakdown"
          isLoading={isLoading}
          data={investmentBreakdown}
          colors={INVESTMENT_COLORS}
          empty={<EmptyMessage>No investment data for this year.</EmptyMessage>}
        />
      </div>
    </div>
  );
};

export default YearStatsWrapper;
