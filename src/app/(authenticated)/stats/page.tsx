'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FilterOptionEnum,
  useGetDashboardStatsQuery,
} from '@/lib/rtk/services/dashboard.rtk.service';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MONTH_NAMES } from '@/app/constants/app.constant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, Send } from 'lucide-react';
import { getStatsLinkAction } from '@/lib/server-actions/user.server-action';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import dynamic from 'next/dynamic';
import StatWrapper from '@/components/common/Stat.wrapper';

// Each view pulls in Recharts; only the selected one is downloaded.
const StatsViewFallback = () => (
  <StatWrapper
    isLoading
    stats={[]}
    className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
  />
);
const MonthStatsWrapper = dynamic(
  () => import('@/components/feature/stats/MonthStats.wrapper'),
  { loading: StatsViewFallback },
);
const YearStatsWrapper = dynamic(
  () => import('@/components/feature/stats/YearStats.wrapper'),
  { loading: StatsViewFallback },
);
const CustomDateStatsWrapper = dynamic(
  () => import('@/components/feature/stats/CustomDateStats.wrapper'),
  { loading: StatsViewFallback },
);

const DATE_FILTER_OPTIONS = [
  FilterOptionEnum.MONTH,
  FilterOptionEnum.YEAR,
  FilterOptionEnum.CUSTOM,
];

const toInputDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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

const Page = () => {
  const [isPending, startTransition] = useTransition();

  // Captured once per mount (not at module load, which on the server would
  // be whenever the process started)
  const [now] = useState(() => new Date());
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  const [filterOption, setFilterOption] = useState<FilterOptionEnum>(
    FilterOptionEnum.MONTH,
  );

  // Add a state for copy confirmation
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Month filter state
  const [month, setMonth] = useState(() => now.getMonth());
  const [year, setYear] = useState(() => now.getFullYear());

  // Custom filter state
  const [fromDate, setFromDate] = useState(() => toInputDate(now));
  const [toDate, setToDate] = useState(() => toInputDate(now));

  // Derive the date range based on active filter
  const { startDate, endDate } = (() => {
    switch (filterOption) {
      case FilterOptionEnum.YEAR:
        return getRangeForYear(year);
      case FilterOptionEnum.CUSTOM:
        return {
          startDate: fromDate,
          endDate: toDate,
        };
      case FilterOptionEnum.MONTH:
      default:
        return getRangeForMonth(month, year);
    }
  })();

  const { data, isFetching } = useGetDashboardStatsQuery(
    {
      payload: {
        startDate,
        endDate,
      },
      filterBy: FilterOptionEnum.MONTH,
    },
    {
      skip: filterOption !== FilterOptionEnum.MONTH,
    },
  );

  const { data: yearData, isFetching: yearDataFetching } =
    useGetDashboardStatsQuery(
      {
        payload: {
          year,
        },
        filterBy: FilterOptionEnum.YEAR,
      },
      {
        skip: filterOption !== FilterOptionEnum.YEAR,
      },
    );

  const { data: customDateData, isFetching: customDateDataFetching } =
    useGetDashboardStatsQuery(
      {
        payload: {
          startDate: fromDate,
          endDate: toDate,
        },
        filterBy: FilterOptionEnum.CUSTOM,
      },
      {
        skip: filterOption !== FilterOptionEnum.CUSTOM,
      },
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
    switch (filterOption) {
      case FilterOptionEnum.MONTH:
        return (
          <MonthStatsWrapper
            allTransactions={allTransactions}
            categoryBreakdown={categoryBreakdown}
            isLoading={isFetching}
            totals={totals}
          />
        );

      case FilterOptionEnum.YEAR:
        return (
          <YearStatsWrapper
            isLoading={yearDataFetching}
            monthlySeries={yearData?.response?.monthlySeries}
            expenseBreakdown={yearData?.response?.expenseBreakdown}
            incomeBreakdown={yearData?.response?.incomeBreakdown}
            investmentBreakdown={yearData?.response?.investmentBreakdown}
            totals={yearData?.response?.totals}
          />
        );

      case FilterOptionEnum.CUSTOM:
      default:
        return (
          <CustomDateStatsWrapper
            isLoading={customDateDataFetching}
            totals={customDateData?.response?.totals}
            counts={customDateData?.response?.counts}
            expenseBreakdown={customDateData?.response?.expenseBreakdown}
            savingsRate={customDateData?.response?.savingsRate}
            topExpenseCategory={customDateData?.response?.topExpenseCategory}
          />
        );
    }
  };

  // Open the dialog and generate a share link for the current view
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setShareUrl('');
    setIsCopied(false);

    startTransition(async () => {
      const result = await getStatsLinkAction({
        type: filterOption,
        startDate,
        endDate,
        year,
      });

      if (result.success && result.url) {
        setShareUrl(result.url);
      }
    });
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);

    // Reset copied state after 2s
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="page-fade flex w-full flex-col gap-5">
      <PageHeader
        title="Stats"
        description="See where your money went — by month, year, or a custom range — and share it."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Stats' },
        ]}
      />
      {/* Filter */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-2">
          {/* Filter type selector — always visible */}

          <div className="space-y-2">
            <Label htmlFor="stats-filter">Filter By</Label>

            <Select
              value={filterOption}
              onValueChange={value =>
                setFilterOption(value as FilterOptionEnum)
              }
            >
              <SelectTrigger id="stats-filter" className="w-24 capitalize">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>

              <SelectContent>
                {DATE_FILTER_OPTIONS.map(option => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="capitalize"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── MONTH filter inputs ── */}
          {filterOption === FilterOptionEnum.MONTH && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stats-month">Month</Label>
                <Select
                  value={String(month)}
                  onValueChange={val => setMonth(Number(val))}
                >
                  <SelectTrigger id="stats-month" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="max-h-40"
                  >
                    {MONTH_NAMES.map((m, i) => (
                      <SelectItem key={m} value={String(i)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stats-month-year">Year</Label>
                <Select
                  value={String(year)}
                  onValueChange={val => setYear(Number(val))}
                >
                  <SelectTrigger id="stats-month-year" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ── YEAR filter inputs ── */}
          {filterOption === FilterOptionEnum.YEAR && (
            <div className="space-y-2">
              <Label htmlFor="stats-year">Year</Label>
              <Select
                value={String(year)}
                onValueChange={val => setYear(Number(val))}
              >
                <SelectTrigger id="stats-year" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ── CUSTOM filter inputs ── */}
          {filterOption === FilterOptionEnum.CUSTOM && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stats-from">From </Label>
                <Input
                  id="stats-from"
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stats-to">To </Label>
                <Input
                  id="stats-to"
                  type="date"
                  value={toDate}
                  min={fromDate} // prevent selecting before 'fromDate'
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
            </>
          )}

          <Button onClick={handleOpenDialog}>
            <Send />
            Share
          </Button>
        </CardContent>
      </Card>

      {renderData(filterOption)}

      {/* Share URL Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share your stats</DialogTitle>

            <DialogDescription>
              A unique URL for your current stats view. You can share this with
              others.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                aria-label="Share URL"
                value={shareUrl}
                readOnly
                className="flex-1"
                placeholder="Generating URL..."
              />
              <Button onClick={handleCopy} disabled={isPending || !shareUrl}>
                <Copy />{' '}
                {isPending ? 'Generating...' : isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
