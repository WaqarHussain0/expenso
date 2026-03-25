/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryTypeEnum } from '@/types/category.type';
import Transactions from './Transaction';
import PieGraph from './Pie.graph';
import { Card, CardTitle } from '@/components/ui/card';
import TextElement from '@/components/common/TextElement';
import Row from '@/components/common/Row';
import StatCard from '@/components/common/StatCard';

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
  totals = { income: 0, expense: 0, investment: 0 },
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

  const { expense, income, investment } = totals;

  const total = income || 1;
  const freeCash = income - (expense + investment);

  const stats = [
    {
      label: 'Income',
      value: income,
      percent: 100,
      color: '#22c55e',
    },
    {
      label: 'Expense',
      value: expense,
      percent: (expense / total) * 100,
      color: '#ef4444',
    },
    {
      label: 'Investment',
      value: investment,
      percent: (investment / total) * 100,
      color: '#3b82f6',
    },
    {
      label: 'Free Cash',
      value: freeCash,
      percent: (freeCash / total) * 100,
      color: '#a855f7',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(item => (
          <StatCard key={item.label} isLoading={isLoading} stat={item} />
        ))}
      </div>

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
