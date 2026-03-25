'use client';

import Row from '@/components/common/Row';
import StatCard from '@/components/common/StatCard';
import RecentTransactions from '@/components/feature/dashboard/RecentTransactions';
import UserProfile from '@/components/feature/dashboard/UserProfile';
import { ITransaction } from '@/types/transaction.type';
import { IUser } from '@/types/user.type';

interface IDashboardWrapperProps {
  transactions: ITransaction[];
  user: IUser | undefined;
  totals: {
    income: number;
    expense: number;
    investment: number;
  };
}
const DashboardWrapper: React.FC<IDashboardWrapperProps> = ({
  totals,
  transactions,
  user,
}) => {
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
      label: 'Total Expense',
      value: expense,
      percent: (expense / total) * 100,
      color: '#ef4444',
    },
    {
      label: 'Total Investment',
      value: investment,
      percent: (investment / total) * 100,
      color: '#3b82f6',
    },
    {
      label: 'Total Free Cash',
      value: freeCash,
      percent: (freeCash / total) * 100,
      color: '#a855f7',
    },
  ];

  return (
    <>
      <Row className="w-full flex-col gap-3">
        <UserProfile user={user} />

        {/* Stats  */}
        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
          {stats.map(item => (
            <StatCard key={item.label} stat={item} />
          ))}
        </div>

        <RecentTransactions transactions={transactions} className="w-full" />
      </Row>
    </>
  );
};

export default DashboardWrapper;
