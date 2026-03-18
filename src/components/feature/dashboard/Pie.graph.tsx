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
  const COLORS =
    category === CategoryTypeEnum.EXPENSE
      ? ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6']
      : category === CategoryTypeEnum.INCOME
        ? ['#16a34a', '#4ade80', '#86efac']
        : ['#16a34a', '#4ade80', '#86efac'];

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
              data={data}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
            >
              {data.map((_: any, i: any) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
