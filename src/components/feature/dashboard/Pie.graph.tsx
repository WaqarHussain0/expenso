/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTypeEnum } from '@/types/category.type';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from 'recharts';

interface IPieGraphProps {
  className: string;
  data: any[];
  category: CategoryTypeEnum;
}

const PieGraph: React.FC<IPieGraphProps> = ({ className, data, category }) => {
  const COLOR_MAP: Record<CategoryTypeEnum, string[]> = {
    // 🔴 Expense → Strong reds (no pale tones)
    [CategoryTypeEnum.EXPENSE]: [
      '#f87171', // red-400
      '#ef4444', // red-500
      '#dc2626', // red-600
    ],

    // 🟢 Income → Rich greens
    [CategoryTypeEnum.INCOME]: [
      '#4ade80', // green-400
      '#22c55e', // green-500
      '#16a34a', // green-600
    ],

    // 🟡 Investment → Deep yellow/amber (no pale yellow)
    [CategoryTypeEnum.INVESTMENT]: [
      '#facc15', // yellow-400
      '#eab308', // yellow-500
      '#ca8a04', // yellow-600
    ],
  };

  const COLORS = [...COLOR_MAP[category]].reverse();
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  const getTitle = (category: CategoryTypeEnum) => {
    return category === CategoryTypeEnum.EXPENSE
      ? 'Expense'
      : category === CategoryTypeEnum.INCOME
        ? 'Income'
        : 'Investment';
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>{getTitle(category)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
            >
              {sortedData.map((_: any, i: any) => (
                <Cell key={i} fill={COLORS[Math.min(i, COLORS.length - 1)]} />
              ))}
            </Pie>

            <PieTooltip formatter={value => Number(value).toLocaleString()} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieGraph;
