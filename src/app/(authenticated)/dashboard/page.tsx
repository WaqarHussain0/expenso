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

import DashboardStats from '@/components/feature/dashboard/Dashboard.stats';
import ExpenseIncomeGraph from '@/components/feature/dashboard/ExpenseIncome.graph';
import DailyBreakdown from '@/components/feature/dashboard/DailyBreakdown';

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

      <DashboardStats
        totalExpense={totals.expense}
        totalIncome={totals.income}
        totalInvestment={totals.investment}
        isFetching={isFetching}
      />

      {/* Category Breakdown */}
      <ExpenseIncomeGraph
        categoryBreakdown={categoryBreakdown}
        isFetching={isFetching}
      />

      {/* Bar Chart */}

      <DailyBreakdown isFetching={isFetching} series={series} />
    </div>
  );
};

export default Page;
