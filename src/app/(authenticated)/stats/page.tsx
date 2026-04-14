'use client';

import { useEffect, useState, useTransition } from 'react';
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

import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Row from '@/components/common/Row';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';
import { Input } from '@/components/ui/input';
import { MONTH_NAMES } from '@/app/constants/app.constant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import { getStatsLinkAction } from '@/lib/server-actions/user.server-action';

const now = new Date();

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

const Page = () => {
  const [isPending, startTransition] = useTransition();

  const [filterOption, setFilterOption] = useState<FilterOptionEnum>(
    FilterOptionEnum.MONTH,
  );

  // Add a state for copy confirmation
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Month filter state
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Custom filter state
  const [fromDate, setFromDate] = useState(toInputDate(now));
  const [toDate, setToDate] = useState(toInputDate(now));

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

  // Open dialog and prepare to generate URL
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setShareUrl('');
    setIsCopied(false);
  };

  // Generate stats URL and copy it
  const handleCopy = async () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    }

    // Reset copied state after 2s
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Auto-generate URL when dialog opens
  useEffect(() => {
    if (isDialogOpen && !shareUrl) {
      const generateURL = async () => {
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
      generateURL();
    }
  }, [isDialogOpen, shareUrl, filterOption, startDate, endDate, year]);

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
                  variant={filterOption === f ? 'default' : 'outline'}
                  onClick={() => setFilterOption(f)}
                  className="px-4 capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-2">
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
                      {MONTH_NAMES.map((m, i) => (
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
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    type="date"
                    value={toDate}
                    min={fromDate} // prevent selecting before 'fromDate'
                    onChange={e => setToDate(e.target.value)}
                  />
                </div>
              </Row>
            )}

            <Button onClick={handleOpenDialog}>Share</Button>
          </div>
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
