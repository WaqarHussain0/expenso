/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface IDailyBreakdownProps {
  isFetching: boolean;
  series: any;
}

const DailyBreakdown: React.FC<IDailyBreakdownProps> = ({
  isFetching,
  series,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={series}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={value => Number(value).toLocaleString()} />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="investment" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBreakdown;
