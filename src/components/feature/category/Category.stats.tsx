import Row from '@/components/common/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowDown, Coins, ShoppingCartIcon } from 'lucide-react';

export interface ICategoryStats {
  income: number;
  investment: number;
  expense: number;
}

interface ICategoryStatsProps {
  categoryStats: ICategoryStats;
}

const CategoryStats: React.FC<ICategoryStatsProps> = ({ categoryStats }) => {
  const currentMonthStats = [
    {
      title: `Income Categories`,
      amount: categoryStats.income,
      icon: BanknoteArrowDown,
      iconClassName: 'text-green-500',
    },

    {
      title: `Expense Categories`,
      amount: categoryStats.expense,
      icon: ShoppingCartIcon,
      iconClassName: 'text-red-500',
    },

    {
      title: `Investment Categories`,
      amount: categoryStats.investment,
      icon: Coins,
      iconClassName: 'text-yellow-500',
    },
  ];
  return (
    <Row className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {currentMonthStats.map(item => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="gap-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`${item.iconClassName}`}>
                  {item.title}
                </CardTitle>
                {<Icon className={`size-5 ${item.iconClassName}`} />}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-bold text-gray-900`}>
                    {item.amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Row>
  );
};

export default CategoryStats;
