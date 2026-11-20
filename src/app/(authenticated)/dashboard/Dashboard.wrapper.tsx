'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import CountUp from '@/components/common/CountUp';
import StatCard from '@/components/common/StatCard';
import RecentTransactions from '@/components/feature/dashboard/RecentTransactions';
import {
  LazyCategoryDialog,
  LazyTransactionDialog,
} from '@/components/feature/lazy-dialogs';
import { Card } from '@/components/ui/card';
import { ITransaction } from '@/types/transaction.type';
import {
  ArrowRight,
  ChevronRight,
  List,
  ListPlus,
  Sparkles,
  Tags,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useSyncExternalStore } from 'react';

interface IDashboardWrapperProps {
  transactions: ITransaction[];
  totals: {
    income: number;
    expense: number;
    investment: number;
  };
  isFirstLogin?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const noopSubscribe = () => () => {};

const DashboardWrapper: React.FC<IDashboardWrapperProps> = ({
  totals,
  transactions,
  isFirstLogin = false,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? '';

  // Server renders a neutral greeting; the client re-renders with its local time
  const greeting = useSyncExternalStore(
    noopSubscribe,
    getGreeting,
    () => 'Welcome back',
  );

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

  // Allocation bar: how income was split. If spending exceeds income,
  // scale against total outflow so the bar never overflows.
  const allocationBase = Math.max(income, expense + investment, 1);
  const allocation = [
    { label: 'Expenses', value: expense, color: COLOR_CODES.expense },
    { label: 'Investments', value: investment, color: COLOR_CODES.investment },
    {
      label: 'Free cash',
      value: Math.max(freeCash, 0),
      color: COLOR_CODES.freeCash,
    },
  ].map(item => ({ ...item, pct: (item.value / allocationBase) * 100 }));

  const quickActions = [
    {
      title: 'Setup Workspace',
      icon: ListPlus,
      show: isFirstLogin,
      tint: '#eab308',
      onClick: () => router.push(PAGE_ROUTES.preferences),
      description: 'Set targets for your income, expenses, and investments.',
    },
    {
      title: 'Record Transaction',
      icon: List,
      show: true,
      tint: '#1a7f5a',
      onClick: handleCloseTransactionDialog,
      description: 'Log a new entry and keep your balance accurate.',
    },
    {
      title: 'New Category',
      icon: Tags,
      show: true,
      tint: '#6366f1',
      onClick: handleCloseCategoryDialog,
      description: 'Create labels to organise and filter your money.',
    },
    {
      title: 'Ask Assistant',
      icon: Sparkles,
      show: true,
      tint: '#d97706',
      onClick: () => router.push(PAGE_ROUTES.assistant),
      description: 'Get instant answers about your spending.',
    },
  ];

  return (
    <div className="page-fade flex w-full flex-col gap-4 md:gap-5">
      <div className="grid w-full grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        {/* ───────── Hero: free cash ───────── */}
        <section className="relative overflow-hidden rounded-2xl bg-[#0d1117] p-6 text-white shadow-[0_20px_40px_-20px_rgba(13,17,23,0.5)] md:p-8 xl:col-span-2">
          <div className="fr-grid-bg pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute -top-24 -right-16 h-[320px] w-[420px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(46,168,120,.22) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="inter text-sm text-white/55">
                  {greeting}
                  {firstName ? `, ${firstName}` : ''}
                </p>
                <h2
                  className="mt-1 text-2xl font-bold text-[#f4f4f4] md:text-[28px]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Your{' '}
                  <em
                    className="text-gradient-green"
                    style={{ fontStyle: 'italic' }}
                  >
                    free cash
                  </em>
                </h2>
              </div>

              <Link
                href={PAGE_ROUTES.stats}
                className="inter group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition-all duration-300 hover:border-[#34d399]/40 hover:text-white"
              >
                View stats
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <CountUp
                to={freeCash}
                className={`manrope text-4xl font-bold tracking-tight tabular-nums md:text-5xl ${
                  freeCash < 0 ? 'text-[#fb7185]' : 'text-white'
                }`}
              />
            </div>
            <p className="inter mt-1.5 text-xs text-white/45">
              Left after expenses and investments · all time
            </p>

            {/* Allocation bar */}
            <div className="mt-7 flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-white/[0.06]">
              {allocation
                .filter(a => a.pct > 0)
                .map(a => (
                  <div
                    key={a.label}
                    className="h-full rounded-full transition-[width] duration-1000"
                    style={{ width: `${a.pct}%`, background: a.color }}
                  />
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {allocation.map(a => (
                <div key={a.label} className="flex items-center gap-2.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: a.color }}
                  />
                  <span className="inter text-xs text-white/55">{a.label}</span>
                  <span className="inter ml-auto text-xs font-semibold text-white/90 tabular-nums sm:ml-0">
                    {a.pct.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Quick actions ───────── */}
        <Card className="flex gap-0 p-2">
          <div className="px-3 pt-3 pb-2">
            <p className="inter text-sm font-semibold text-[#0d1117]">
              Quick actions
            </p>
            <p className="inter text-xs text-[#8b93a1]">
              Jump straight into the common stuff
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-around">
            {quickActions
              .filter(item => item.show)
              .map(action => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={action.onClick}
                    className="group flex w-full cursor-pointer items-center gap-3.5 rounded-xl p-3 text-left transition-colors duration-300 hover:bg-[#f6f7f5]"
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: `${action.tint}14`,
                        color: action.tint,
                      }}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="inter block text-sm font-medium text-[#0d1117]">
                        {action.title}
                      </span>
                      <span className="inter block text-xs leading-relaxed text-[#8b93a1]">
                        {action.description}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-[#c4c9d0] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#1a7f5a]" />
                  </button>
                );
              })}
          </div>
        </Card>
      </div>

      {/* ───────── Stats ───────── */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {stats.map(item => (
          <StatCard key={item.label} stat={item} />
        ))}
      </div>

      <RecentTransactions transactions={transactions} className="w-full" />

      {showCategoryDialog && (
        <LazyCategoryDialog onClose={handleCloseCategoryDialog} open />
      )}

      {showTransactionDialog && (
        <LazyTransactionDialog onClose={handleCloseTransactionDialog} open />
      )}
    </div>
  );
};

export default DashboardWrapper;
