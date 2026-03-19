'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDashboardStatsQuery } from '@/lib/rtk/services/dashboard.rtk.service';

import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Row from '@/components/common/Row';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';

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

enum FilterOptionEnum {
  MONTH = 'Month',
  YEAR = 'Year',
  CUSTOM = 'Custom',
}

const DATE_FILTER_OPTIONS = [
  FilterOptionEnum.MONTH,
  FilterOptionEnum.YEAR,
  FilterOptionEnum.CUSTOM,
];

const YEARS = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

const toInputDate = (d: Date) => d.toISOString().split('T')[0];

// Month filter: first → last day of the selected month
const getRangeForMonth = (month: number, year: number) => ({
  startDate: toInputDate(new Date(year, month, 1)),
  endDate: toInputDate(new Date(year, month + 1, 0)),
});

// Year filter: Jan 1 → Dec 31 of the given year
const getRangeForYear = (year: number) => ({
  startDate: toInputDate(new Date(year, 0, 1)),
  endDate: toInputDate(new Date(year, 11, 31)),
});

// Custom filter: first day of startMonth/startYear → last day of endMonth/endYear
const getRangeForCustom = (
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number,
) => ({
  startDate: toInputDate(new Date(startYear, startMonth, 1)),
  endDate: toInputDate(new Date(endYear, endMonth + 1, 0)),
});

const Page = () => {
  const [filterOption, setFilterOption] = useState<FilterOptionEnum>(
    FilterOptionEnum.MONTH,
  );

  // Month filter state
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Custom filter state
  const [customStartMonth, setCustomStartMonth] = useState(now.getMonth());
  const [customStartYear, setCustomStartYear] = useState(now.getFullYear());
  const [customEndMonth, setCustomEndMonth] = useState(now.getMonth());
  const [customEndYear, setCustomEndYear] = useState(now.getFullYear());

  // Derive the date range based on active filter
  const { startDate, endDate } = (() => {
    switch (filterOption) {
      case FilterOptionEnum.YEAR:
        return getRangeForYear(year);
      case FilterOptionEnum.CUSTOM:
        return getRangeForCustom(
          customStartMonth,
          customStartYear,
          customEndMonth,
          customEndYear,
        );
      case FilterOptionEnum.MONTH:
      default:
        return getRangeForMonth(month, year);
    }
  })();

  const { data, isFetching } = useGetDashboardStatsQuery(
    {
      startDate,
      endDate,
    },
    { skip: filterOption !== FilterOptionEnum.MONTH },
  );

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

  const renderData = (filterOption: FilterOptionEnum) => {
    if (filterOption === FilterOptionEnum.MONTH) {
      return (
        <MonthStatsWrapper
          allTransactions={allTransactions}
          categoryBreakdown={categoryBreakdown}
          isLoading={isFetching}
          totals={totals}
        />
      );
    }

    if (filterOption === FilterOptionEnum.YEAR) {
      return (
        <YearStatsWrapper
          isLoading={false}
          totals={{
            expense: 0,
            income: 0,
            investment: 0,
          }}
        />
      );
    } else {
      return (
        <CustomDateStatsWrapper
          isLoading={false}
          totals={{
            expense: 0,
            income: 0,
            investment: 0,
          }}
        />
      );
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Filter */}
      <Card>
        <CardContent className="flex flex-col gap-6">
          {/* Filter type selector — always visible */}

          <div className="space-y-2">
            <Label>Filter By</Label>
            <div className="flex gap-2">
              {DATE_FILTER_OPTIONS.map(f => (
                <Button
                  key={f}
                  type="button"
                  onClick={() => setFilterOption(f)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    filterOption === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input hover:bg-muted'
                  }`}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          {/* ── MONTH filter inputs ── */}
          {filterOption === FilterOptionEnum.MONTH && (
            <Row className="gap-2">
              <div className="space-y-2">
                <Label>Month</Label>
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
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
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
              </div>
            </Row>
          )}

          {/* ── YEAR filter inputs ── */}
          {filterOption === FilterOptionEnum.YEAR && (
            <Row className="gap-2">
              <div className="space-y-2">
                <Label>Year</Label>
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
              </div>
            </Row>
          )}

          {/* ── CUSTOM filter inputs ── */}
          {filterOption === FilterOptionEnum.CUSTOM && (
            <Row className="gap-2">
              {/* Start */}
              <div className="space-y-2">
                <Label>Start Month</Label>
                <Select
                  value={String(customStartMonth)}
                  onValueChange={val => setCustomStartMonth(Number(val))}
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
              </div>

              <div className="space-y-2">
                <Label>Start Year</Label>
                <Select
                  value={String(customStartYear)}
                  onValueChange={val => setCustomStartYear(Number(val))}
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
              </div>

              {/* End */}
              <div className="space-y-2">
                <Label>End Month</Label>
                <Select
                  value={String(customEndMonth)}
                  onValueChange={val => setCustomEndMonth(Number(val))}
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
              </div>

              <div className="space-y-2">
                <Label>End Year</Label>
                <Select
                  value={String(customEndYear)}
                  onValueChange={val => setCustomEndYear(Number(val))}
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
              </div>
            </Row>
          )}
        </CardContent>
      </Card>

      {renderData(filterOption)}
    </div>
  );
};

export default Page;
