'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_TOOLTIP_STYLE } from '@/components/feature/stats/BreakdownBarChart';
import type { IAdminOverview } from '@/backend/modules/user/services/user-insights.service';

const AXIS_TICK = { fontSize: 11, fill: 'var(--muted-foreground)' };

/** New sign-ups (bars) and transactions logged (line) per month. */
const UserGrowthChart: React.FC<{ data: IAdminOverview['trend'] }> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={260}>
    <ComposedChart
      data={data}
      margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
      className="inter"
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
        yAxisId="users"
        allowDecimals={false}
        tick={AXIS_TICK}
        axisLine={false}
        tickLine={false}
        width={40}
      />
      <YAxis
        yAxisId="tx"
        orientation="right"
        allowDecimals={false}
        tick={AXIS_TICK}
        axisLine={false}
        tickLine={false}
        width={40}
      />
      <Tooltip
        contentStyle={CHART_TOOLTIP_STYLE}
        cursor={{ fill: 'var(--ink)', fillOpacity: 0.04 }}
      />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
      />
      <Bar
        yAxisId="users"
        dataKey="signups"
        name="New users"
        fill="#1a7f5a"
        fillOpacity={0.85}
        radius={[4, 4, 0, 0]}
        maxBarSize={28}
      />
      <Line
        yAxisId="tx"
        dataKey="transactions"
        name="Transactions logged"
        type="monotone"
        stroke="#6366f1"
        strokeWidth={2}
        dot={{ r: 2.5, strokeWidth: 0, fill: '#6366f1' }}
        activeDot={{ r: 4 }}
        zIndex={1000}
      />
    </ComposedChart>
  </ResponsiveContainer>
);

export default UserGrowthChart;
