import { Card, CardContent } from '@/components/ui/card';
import { CategoryTypeEnum } from '@/types/category.type';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import type { IBreakdownItem } from '@/lib/rtk/services/dashboard.rtk.service';

// Darkest shade first — the largest slice gets the strongest colour
const COLOR_MAP: Record<CategoryTypeEnum, string[]> = {
  [CategoryTypeEnum.EXPENSE]: ['#dc2626', '#ef4444', '#f87171'],
  [CategoryTypeEnum.INCOME]: ['#16a34a', '#22c55e', '#4ade80'],
  [CategoryTypeEnum.INVESTMENT]: ['#ca8a04', '#eab308', '#facc15'],
};

interface IPieGraphProps {
  className: string;
  data: IBreakdownItem[];
  category: CategoryTypeEnum;
  isLoading?: boolean;
}

const PieGraph: React.FC<IPieGraphProps> = ({
  className,
  data,
  category,
  isLoading = false,
}) => {
  const COLORS = COLOR_MAP[category];
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <Card className={`${className}`}>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[250px] flex-col items-center justify-center">
            {/* Circular skeleton mimicking the pie chart */}
            <Skeleton circle width={180} height={180} />

            {/* Legend skeletons below the chart */}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart className="inter">
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
                {sortedData.map((item, i) => (
                  <Cell
                    key={item.name}
                    fill={COLORS[Math.min(i, COLORS.length - 1)]}
                  />
                ))}
              </Pie>
              <PieTooltip formatter={value => Number(value).toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PieGraph;
