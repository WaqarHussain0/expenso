'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDashboardStatsQuery } from '@/lib/rtk/services/dashboard.rtk.service';
import {
  Banknote,
  BanknoteArrowDown,
  Coins,
  ShoppingCartIcon,
} from 'lucide-react';
import StatWrapper from '@/components/common/Stat.wrapper';
import Row from '@/components/common/Row';
import Transactions from '@/components/feature/dashboard/Transaction';
import { CategoryTypeEnum } from '@/types/category.type';
import PieGraph from '@/components/feature/dashboard/Pie.graph';
import TextElement from '@/components/common/TextElement';

const now = new Date();

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

const toInputDate = (d: Date) => d.toISOString().split('T')[0];

const getRange = (month: number, year: number) => ({
  startDate: toInputDate(new Date(year, month, 1)),
  endDate: toInputDate(new Date(year, month + 1, 0)),
});

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

const Page = () => {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const { startDate, endDate } = getRange(month, year);

  const { data, isFetching } = useGetDashboardStatsQuery({
    startDate,
    endDate,
  });

  const totals = data?.response?.totals ?? {
    income: 0,
    expense: 0,
    investment: 0,
  };

  const categoryBreakdown = data?.response?.categoryBreakdown ?? {
    income: [],
    expense: [],
    investment: [],
  };
  
  const allTransactions = data?.response?.monthAllTransactions ?? {
    income: [],
    expense: [],
    investment: [],
  };

  return (
    <div className="w-full space-y-3">
      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Select
            value={String(month)}
            onValueChange={val => setMonth(Number(val))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="h-40">
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(year)}
            onValueChange={val => setYear(Number(val))}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(y => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <StatWrapper
        isLoading={isFetching}
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
            isLoading={isFetching}
          />
        );

        const pieEl = (
          <PieGraph
            className="w-full md:w-[50%]"
            data={breakdown}
            category={category}
            isLoading={isFetching}
          />
        );

        return (
          <Card key={key} className="px-4">
            <CardTitle>{label}</CardTitle>
            {transactions.length === 0 && !isFetching ? (
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
    </div>
  );
};

export default Page;
