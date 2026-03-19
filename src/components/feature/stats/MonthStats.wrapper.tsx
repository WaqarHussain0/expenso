/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryTypeEnum } from '@/types/category.type';
import Transactions from './Transaction';
import PieGraph from './Pie.graph';
import { Card, CardTitle } from '@/components/ui/card';
import TextElement from '@/components/common/TextElement';
import Row from '@/components/common/Row';
import StatWrapper from '@/components/common/Stat.wrapper';
import {
  Banknote,
  BanknoteArrowDown,
  Coins,
  ShoppingCartIcon,
} from 'lucide-react';

interface IMonthStatsWrapperProps {
  isLoading: boolean;
  allTransactions: {
    income: any[];
    expense: any[];
    investment: any[];
  };
  categoryBreakdown: {
    income: any[];
    expense: any[];
    investment: any[];
  };

  totals: {
    income: number;
    expense: number;
    investment: number;
  };
}

const MonthStatsWrapper: React.FC<IMonthStatsWrapperProps> = ({
  isLoading,
  allTransactions,
  categoryBreakdown,
  totals
}) => {
  // ✅ Config drives all three section cards
  const SECTION_CONFIG = [
    {
      key: 'income' as const,
      label: 'Income',
      category: CategoryTypeEnum.INCOME,
      pieFirst: false, // Transactions left, Pie right
    },
    {
      key: 'investment' as const,
      label: 'Investment',
      category: CategoryTypeEnum.INVESTMENT,
      pieFirst: true, // Pie left, Transactions right
    },
    {
      key: 'expense' as const,
      label: 'Expense',
      category: CategoryTypeEnum.EXPENSE,
      pieFirst: false,
    },
  ];

  return (
    <>
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
      {/* ✅ Single loop replaces three identical card blocks */}
      {SECTION_CONFIG.map(({ key, label, category, pieFirst }) => {
        const transactions = allTransactions[key] ?? [];
        const breakdown = categoryBreakdown[key] ?? [];

        const transactionsEl = (
          <Transactions
            className="w-full md:w-[50%]"
            transactions={transactions}
            category={category}
            isLoading={isLoading}
          />
        );

        const pieEl = (
          <PieGraph
            className="w-full md:w-[50%]"
            data={breakdown}
            category={category}
            isLoading={isLoading}
          />
        );

        return (
          <Card key={key} className="px-4">
            <CardTitle>{label}</CardTitle>
            {transactions.length === 0 && !isLoading ? (
              <TextElement>No data available</TextElement>
            ) : (
              <Row className="w-full flex-col items-start justify-between gap-2 md:flex-row">
                {pieFirst ? (
                  <>
                    {pieEl}
                    {transactionsEl}
                  </>
                ) : (
                  <>
                    {transactionsEl}
                    {pieEl}
                  </>
                )}
              </Row>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default MonthStatsWrapper;
