import StatWrapper from '@/components/common/Stat.wrapper';
import {
  Banknote,
  BanknoteArrowDown,
  Coins,
  ShoppingCartIcon,
} from 'lucide-react';

interface ICustomDateStatsWrapperProps {
  isLoading: boolean;

  totals: {
    income: number;
    expense: number;
    investment: number;
  };
}

const CustomDateStatsWrapper: React.FC<ICustomDateStatsWrapperProps> = ({
  isLoading,
  totals,
}) => {
  return (
    <>
      Custom date stats in progress
      <StatWrapper
        isLoading={isLoading}
        stats={[
          {
            label: 'Income',
            value: totals.income,
            icon: BanknoteArrowDown,
            iconClassName: 'text-green-400',
          },
          {
            label: 'Expense',
            value: totals.expense,
            icon: ShoppingCartIcon,
            iconClassName: 'text-red-400',
          },
          {
            label: 'Investment',
            value: totals.investment,
            icon: Coins,
            iconClassName: 'text-yellow-400',
          },
          {
            label: 'Free Cash',
            value: totals.income - (totals.expense + totals.investment),
            icon: Banknote,
            iconClassName: 'text-blue-400',
          },
        ]}
        className="grid-cols-2 gap-2 lg:grid-cols-4"
      />
    </>
  );
};

export default CustomDateStatsWrapper;
