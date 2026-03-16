import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowDown, Coins, ShoppingCartIcon } from 'lucide-react';

interface IDashboardStatsProps {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  isFetching?: boolean;
}
const DashboardStats: React.FC<IDashboardStatsProps> = ({
  totalExpense,
  totalIncome,
  totalInvestment,
  isFetching = false,
}) => {
  const stats = [
    {
      label: 'Income',
      value: totalIncome,
      icon: BanknoteArrowDown,
      iconClassName: 'text-green-500',
    },
    {
      label: 'Expense',
      value: totalExpense,
      icon: ShoppingCartIcon,
      iconClassName: 'text-red-500',
    },
    {
      label: 'Investment',
      value: totalInvestment,
      icon: Coins,
      iconClassName: 'text-yellow-500',
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {stats.map(({ label, value, iconClassName, icon }) => {
        const Icon = icon;
        return(
        <Card key={label}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`${iconClassName}`}>{label}</CardTitle>
              {<Icon className={`size-5 ${iconClassName}`} />}
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-2xl font-bold text-gray-900`}>
                  {isFetching ? '...' : value.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )})}
    </div>
  );
};

export default DashboardStats;
