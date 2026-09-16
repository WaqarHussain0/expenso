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
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import StatCard from '@/components/common/StatCard';
import { COLOR_CODES } from '@/app/constants/app.constant';
import TextElement from '@/components/common/TextElement';

interface IYearStatsWrapperProps {
  isLoading: boolean;
  totals: {
    income: number;
    expense: number;
    investment: number;
  };
  monthlySeries: {
    month: string;
    income: number;
    expense: number;
    investment: number;
    freeCash: number;
  }[];
  expenseBreakdown: {
    name: string;
    total: number;
  }[];
  incomeBreakdown: {
    name: string;
    total: number;
  }[];
  investmentBreakdown: {
    name: string;
    total: number;
  }[];
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
const BAR_CHART_HEIGHTS = [140, 80, 120, 60, 100, 75];

const formatCurrency = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;

const BreakdownBarChart: React.FC<{
  title: string;
  isLoading: boolean;
  data: { name: string; total: number }[];
  colors: string[];
  emptyMessage: string;
}> = ({ title, isLoading, data, colors, emptyMessage }) => (
  <Card className="w-full px-4">
    <CardTitle>{title}</CardTitle>

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
    ) : data?.length === 0 ? (
      <TextElement className='w-full text-center py-2'>{emptyMessage}</TextElement>
    ) : (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          className="inter p-1"
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
            {data?.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </Card>
);

const YearStatsWrapper: React.FC<IYearStatsWrapperProps> = ({
  totals = { income: 0, expense: 0, investment: 0 },
  isLoading,
  monthlySeries,
  expenseBreakdown,
  incomeBreakdown,
  investmentBreakdown,
}) => {
  const { expense, income, investment } = totals;

  const total = income || 1;
  const freeCash = income - (expense + investment);

  const stats = [
    {
      label: 'Income',
      value: income,
      percent: 100,
      color: COLOR_CODES.income,
    },
    {
      label: 'Expense',
      value: expense,
      percent: (expense / total) * 100,
      color: COLOR_CODES.expense,
    },
    {
      label: 'Investment',
      value: investment,
      percent: (investment / total) * 100,
      color: COLOR_CODES.investment,
    },
    {
      label: 'Free Cash',
      value: freeCash,
      percent: (freeCash / total) * 100,
      color: COLOR_CODES.freeCash,
    },
  ];

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
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
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
        title="Expense Breakdown"
        isLoading={isLoading}
        data={expenseBreakdown}
        colors={EXPENSE_COLORS}
        emptyMessage="No expense data for this year."
      />

      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        {/* ── 3. Income Breakdown Bar Chart ── */}
        <BreakdownBarChart
          title="Income Breakdown"
          isLoading={isLoading}
          data={incomeBreakdown}
          colors={INCOME_COLORS}
          emptyMessage="No income data for this year."
        />
        {/* ── 5. Investment Breakdown Bar Chart ── */}
        <BreakdownBarChart
          title="Investment Breakdown"
          isLoading={isLoading}
          data={investmentBreakdown}
          colors={INVESTMENT_COLORS}
          emptyMessage="No investment data for this year."
        />
      </div>
    </div>
  );
};

export default YearStatsWrapper;
