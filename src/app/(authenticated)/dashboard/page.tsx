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

const Page = () => {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const { startDate, endDate } = getRange(month, year);

  const { data, isFetching } = useGetDashboardStatsQuery({
    startDate,
    endDate,
  });

  const series = data?.response?.series ?? [];
  const totals = data?.response?.totals ?? {
    income: 0,
    expense: 0,
    investment: 0,
  };

  // inside Page, below series/totals:
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

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }
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
        stats={[
          {
            label: `Income`,
            value: totals.income,
            icon: BanknoteArrowDown,
            iconClassName: 'text-green-400',
          },

          {
            label: `Expense`,
            value: totals.expense,
            icon: ShoppingCartIcon,
            iconClassName: 'text-red-400',
          },

          {
            label: `Investment`,
            value: totals.investment,
            icon: Coins,
            iconClassName: 'text-yellow-400',
          },

          {
            label: `Free Cash`,
            value: totals.income - (totals.expense + totals.investment),
            icon: Banknote,
            iconClassName: 'text-blue-400',
          },
        ]}
        className="grid-cols-2 gap-2 lg:grid-cols-4"
      />

      <Card className="px-4">
        <CardTitle> Income Data</CardTitle>
        <Row className="w-full flex-col items-start justify-between gap-2 md:flex-row">
          <Transactions
            className="w-full md:w-[50%]"
            transactions={allTransactions.income || []}
            category={CategoryTypeEnum.INCOME}
          />

          <PieGraph
            className="w-full md:w-[50%]"
            data={categoryBreakdown.income}
            category={CategoryTypeEnum.INCOME}
          />
        </Row>
      </Card>

      <Card className="px-4">
        <CardTitle>Investment Data</CardTitle>

        <Row className="w-full flex-col items-start justify-between gap-2 md:flex-row">
          <PieGraph
            className="w-full md:w-[50%]"
            data={categoryBreakdown.investment}
            category={CategoryTypeEnum.INVESTMENT}
          />

          <Transactions
            className="w-full md:w-[50%]"
            transactions={allTransactions.investment || []}
            category={CategoryTypeEnum.INVESTMENT}
          />
        </Row>
      </Card>

      <Card className="px-4">
        <CardTitle>Expense Data</CardTitle>
        <Row className="w-full flex-col items-start justify-between gap-2 md:flex-row">
          <Transactions
            className="w-full md:w-[50%]"
            transactions={allTransactions.expense || []}
            category={CategoryTypeEnum.EXPENSE}
          />

          <PieGraph
            category={CategoryTypeEnum.EXPENSE}
            className="w-full md:w-[50%]"
            data={categoryBreakdown.expense}
          />
        </Row>
      </Card>
    </div>
  );
};

export default Page;
