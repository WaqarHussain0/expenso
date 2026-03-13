import Row from '@/components/common/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Banknote,
  BanknoteArrowDown,
  Coins,
  ShoppingCartIcon,
} from 'lucide-react';

export interface IMonthTransactionStats {
  income: number;
  investment: number;
  expense: number;
}

interface ITransactionStatsProps {
  monthStats: IMonthTransactionStats;
}

const TransactionStats: React.FC<ITransactionStatsProps> = ({ monthStats }) => {
  const currentMonthStats = [
    {
      title: `Income`,
      amount: monthStats.income,
      icon: BanknoteArrowDown,
      iconClassName: 'text-green-500',
    },

    {
      title: `Expense`,
      amount: monthStats.expense,
      icon: ShoppingCartIcon,
      iconClassName: 'text-red-500',
    },

    {
      title: `Investment`,
      amount: monthStats.investment,
      icon: Coins,
      iconClassName: 'text-yellow-500',
    },

    {
      title: `Available Cash`,
      amount: monthStats.income - (monthStats.expense + monthStats.investment),
      icon: Banknote,
      iconClassName: 'text-blue-600',
    },
  ];
  return (
    <Row className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
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

export default TransactionStats;
