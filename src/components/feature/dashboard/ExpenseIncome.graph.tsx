/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from 'recharts';

interface IExpenseIncomeGraphProps {
  isFetching: boolean;
  categoryBreakdown: any;
}

const ExpenseIncomeGraph: React.FC<IExpenseIncomeGraphProps> = ({
  isFetching,
  categoryBreakdown,
}) => {
  const EXPENSE_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#06b6d4',
    '#8b5cf6',
  ];
  const INCOME_COLORS = ['#16a34a', '#4ade80', '#86efac'];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Top Expenses by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : categoryBreakdown.expense.length === 0 ? (
            <p className="text-muted-foreground text-sm">No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryBreakdown.expense}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {categoryBreakdown.expense.map((_: any, i: any) => (
                    <Cell
                      key={i}
                      fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <PieTooltip
                  formatter={value => Number(value).toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Income by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Income by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : categoryBreakdown.income.length === 0 ? (
            <p className="text-muted-foreground text-sm">No income data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryBreakdown.income}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {categoryBreakdown.income.map((_: any, i: any) => (
                    <Cell
                      key={i}
                      fill={INCOME_COLORS[i % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <PieTooltip
                  formatter={value => Number(value).toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseIncomeGraph;
