'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import StatCard from '@/components/common/StatCard';
import CategoryDialog from '@/components/feature/category/Category.dialog';
import RecentTransactions from '@/components/feature/dashboard/RecentTransactions';
import UserProfile from '@/components/feature/dashboard/UserProfile';
import TransactionDialog from '@/components/feature/transaction/Transaction.dialog';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ITransaction } from '@/types/transaction.type';
import { IUser } from '@/types/user.type';
import { List, ListPlus, Tags } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface IDashboardWrapperProps {
  transactions: ITransaction[];
  user: IUser | undefined;
  totals: {
    income: number;
    expense: number;
    investment: number;
  };
  isFirstLogin?: boolean;
}
const DashboardWrapper: React.FC<IDashboardWrapperProps> = ({
  totals,
  transactions,
  user,
  isFirstLogin = false,
}) => {
  const router = useRouter();

  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const handleCloseCategoryDialog = useCallback(
    () => setShowCategoryDialog(prev => !prev),
    [],
  );

  const [showTransactionDialog, setShowTransactionDialog] =
    useState<boolean>(false);
  const handleCloseTransactionDialog = useCallback(
    () => setShowTransactionDialog(prev => !prev),
    [],
  );

  const { expense, income, investment } = totals;

  const total = income || 1;

  const freeCash = income - (expense + investment);

  const stats = [
    {
      label: 'Income',
      value: income,
      percent: 100,
      color: COLOR_CODES.income,
    },
    {
      label: 'Total Expense',
      value: expense,
      percent: (expense / total) * 100,
      color: COLOR_CODES.expense,
    },
    {
      label: 'Total Investment',
      value: investment,
      percent: (investment / total) * 100,
      color: COLOR_CODES.investment,
    },
    {
      label: 'Total Free Cash',
      value: freeCash,
      percent: (freeCash / total) * 100,
      color: COLOR_CODES.freeCash,
    },
  ];

  const quickActions = [
    {
      title: 'Setup Workspace',
      icon: ListPlus,
      show: isFirstLogin,
      className: 'text-yellow-500',
      onClick: () => router.push(PAGE_ROUTES.preferences),
      description:
        'Initialize your financial profile by setting targets for income, expenses, and investments.',
    },
    {
      title: 'New Category',
      icon: Tags,
      show: true,
      className: 'text-green-600',
      onClick: handleCloseCategoryDialog,
      description:
        'Create custom labels to better organize and filter your financial data.',
    },
    {
      title: 'Record Transaction',
      icon: List,
      show: true,
      className: 'text-blue-600',
      onClick: handleCloseTransactionDialog,
      description:
        'Log a new entry to keep your real-time balance and spending history accurate.',
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

        <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="w-full gap-2 px-4">
            <CardHeader className="p-0">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 gap-2">
              {quickActions
                .filter(item => item.show)
                .map(action => {
                  const Icon = action.icon;

                  return (
                    <Card
                      key={action.title}
                      className="cursor-pointer"
                      onClick={action?.onClick}
                    >
                      <CardHeader className="">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`size-4 shrink-0 ${action.className}`}
                          />
                          <CardTitle>{action.title}</CardTitle>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
            </div>
          </Card>

          <RecentTransactions transactions={transactions} className="w-full" />
        </div>

        <CategoryDialog
          onClose={handleCloseCategoryDialog}
          open={showCategoryDialog}
        />

        <TransactionDialog
          onClose={handleCloseTransactionDialog}
          open={showTransactionDialog}
        />
      </Row>
    </>
  );
};

export default DashboardWrapper;
