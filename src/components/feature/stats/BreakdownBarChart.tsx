import { Card, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import type { IBreakdownItem } from '@/lib/rtk/services/dashboard.rtk.service';

// Static outside component — stable across renders, no Math.random()
const BAR_CHART_HEIGHTS = [140, 80, 120, 60, 100, 75];

export const EXPENSE_COLORS = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#a78bfa',
  '#60a5fa',
  '#34d399',
  '#f472b6',
  '#94a3b8',
];

/** Axis label: 1500 → "1.5k" */
export const formatAxisAmount = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;

export const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '13px',
};

export const formatTooltipAmount = (value: unknown) =>
  Number(value).toLocaleString();

interface IBreakdownBarChartProps {
  title: string;
  isLoading: boolean;
  data?: IBreakdownItem[];
  colors: string[];
  /** Rendered instead of the chart when `data` is empty */
  empty: React.ReactNode;
  className?: string;
}

/** Card with a per-category bar chart (plus its loading skeleton). */
const BreakdownBarChart: React.FC<IBreakdownBarChartProps> = ({
  title,
  isLoading,
  data,
  colors,
  empty,
  className = 'px-4',
}) => (
  <Card className={className}>
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
      empty
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
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data?.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </Card>
);

export default BreakdownBarChart;
