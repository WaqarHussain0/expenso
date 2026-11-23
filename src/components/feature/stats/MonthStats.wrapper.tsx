import { CategoryTypeEnum } from '@/types/category.type';
import { ITransaction } from '@/types/transaction.type';
import Transactions from './Transaction';
import PieGraph from './Pie.graph';
import { Card, CardTitle } from '@/components/ui/card';
import TextElement from '@/components/common/TextElement';
import Row from '@/components/common/Row';
import StatCard from '@/components/common/StatCard';
import { buildCashflowStats, ICashflowTotals } from '@/lib/stats.util';
import type {
  IBreakdownItem,
  IByCategoryType,
} from '@/lib/rtk/services/dashboard.rtk.service';

interface IMonthStatsWrapperProps {
  isLoading: boolean;
  allTransactions: IByCategoryType<ITransaction[]>;
  categoryBreakdown: IByCategoryType<IBreakdownItem[]>;
  totals?: ICashflowTotals;
}

// Config drives all three section cards
const SECTION_CONFIG = [
  {
    key: 'income' as const,
    label: 'Income',
    category: CategoryTypeEnum.INCOME,
    pieFirst: false, // Transactions left, Pie right
  },
  {
    key: 'expense' as const,
    label: 'Expense',
    category: CategoryTypeEnum.EXPENSE,
    pieFirst: true,
  },
  {
    key: 'investment' as const,
    label: 'Investment',
    category: CategoryTypeEnum.INVESTMENT,
    pieFirst: false,
  },
];

const MonthStatsWrapper: React.FC<IMonthStatsWrapperProps> = ({
  isLoading,
  allTransactions,
  categoryBreakdown,
  totals = { income: 0, expense: 0, investment: 0 },
}) => {
  const stats = buildCashflowStats(totals);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(item => (
          <StatCard key={item.label} isLoading={isLoading} stat={item} />
        ))}
      </div>

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
