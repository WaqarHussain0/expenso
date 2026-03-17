/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from 'recharts';

interface IIncomeGraphProps {
  income: any;
  className?: string;
}

const IncomeGraph: React.FC<IIncomeGraphProps> = ({ income, className }) => {
  const INCOME_COLORS = ['#16a34a', '#4ade80', '#86efac'];

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Income by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={income}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
            >
              {income.map((_: any, i: any) => (
                <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip formatter={value => Number(value).toLocaleString()} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeGraph;
