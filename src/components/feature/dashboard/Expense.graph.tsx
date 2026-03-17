/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from 'recharts';

interface IExpenseGraphProps {
  expense: any;
  className?: string;
}

const ExpenseGraph: React.FC<IExpenseGraphProps> = ({ expense, className }) => {
  const EXPENSE_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#06b6d4',
    '#8b5cf6',
  ];

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={expense}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
            >
              {expense.map((_: any, i: any) => (
                <Cell
                  key={i}
                  fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                />
              ))}
            </Pie>
            <PieTooltip formatter={value => Number(value).toLocaleString()} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseGraph;
