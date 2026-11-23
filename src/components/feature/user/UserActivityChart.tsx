'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLOR_CODES } from '@/app/constants/app.constant';
import {
  CHART_TOOLTIP_STYLE,
  formatAxisAmount,
  formatTooltipAmount,
} from '@/components/feature/stats/BreakdownBarChart';
import type { IAdminUserInsights } from '@/backend/modules/user/services/user-insights.service';

const AXIS_TICK = { fontSize: 11, fill: 'var(--muted-foreground)' };

/** One user's income / expense / investment per month. */
const UserActivityChart: React.FC<{ data: IAdminUserInsights['trend'] }> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart
      data={data}
      margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
      className="inter"
      barGap={2}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="var(--border)"
        vertical={false}
      />
      <XAxis
        dataKey="label"
        tick={AXIS_TICK}
        axisLine={false}
        tickLine={false}
        interval="preserveStartEnd"
      />
      <YAxis
        tickFormatter={formatAxisAmount}
        tick={AXIS_TICK}
        axisLine={false}
        tickLine={false}
        width={56}
      />
      <Tooltip
        formatter={formatTooltipAmount}
        contentStyle={CHART_TOOLTIP_STYLE}
        cursor={{ fill: 'var(--ink)', fillOpacity: 0.04 }}
      />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
      />
      <Bar
        dataKey="income"
        name="Income"
        fill={COLOR_CODES.income}
        radius={[3, 3, 0, 0]}
        maxBarSize={14}
      />
      <Bar
        dataKey="expense"
        name="Expense"
        fill={COLOR_CODES.expense}
        radius={[3, 3, 0, 0]}
        maxBarSize={14}
      />
      <Bar
        dataKey="investment"
        name="Investment"
        fill={COLOR_CODES.investment}
        radius={[3, 3, 0, 0]}
        maxBarSize={14}
      />
    </BarChart>
  </ResponsiveContainer>
);

export default UserActivityChart;
