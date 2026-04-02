/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import Row from '@/components/common/Row';
import CTA from '@/components/feature/landing-page/CTA';
import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';
import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
import { Badge } from '@/components/ui/badge';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';
import { CalendarDays, TrendingUp, BarChart3 } from 'lucide-react';

interface ISharedStatsWrapperProps {
  filterType?: string;
  response: any;
  userName?: string;
  dateRange?: { startDate?: string; endDate?: string; year?: number };
}

const initials = (name?: string) =>
  name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

const filterMeta: Record<string, { label: string; Icon: any }> = {
  month: { label: 'Monthly report', Icon: CalendarDays },
  year: { label: 'Yearly report', Icon: TrendingUp },
  custom: { label: 'Custom period', Icon: BarChart3 },
};

const SharedStatsWrapper: React.FC<ISharedStatsWrapperProps> = ({
  filterType = 'custom',
  response,
  userName,
  dateRange,
}) => {
  console.log('dateRange : ', dateRange);
  const totals = response?.totals ?? {};

  const { label, Icon } = filterMeta[filterType] ?? filterMeta.custom;

  const dateLabel = (() => {
    if (filterType === 'year') {
      return dateRange?.year ? `${dateRange.year}` : null;
    }

    if (filterType === 'month') {
      const date = dateRange?.endDate ?? dateRange?.startDate;
      if (!date) return null;
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }); // → "March 2026"
    }

    // custom
    if (dateRange?.startDate && dateRange?.endDate) {
      const fmt = (d: string | Date) =>
        new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      return `${fmt(dateRange.startDate)} – ${fmt(dateRange.endDate)}`;
    }

    return null;
  })();

  const renderData = (opt: FilterOptionEnum) => {
    switch (opt) {
      case FilterOptionEnum.MONTH:
        return (
          <MonthStatsWrapper
            allTransactions={response?.monthAllTransactions}
            categoryBreakdown={response?.categoryBreakdown}
            isLoading={false}
            totals={totals}
          />
        );
      case FilterOptionEnum.YEAR:
        return (
          <YearStatsWrapper
            isLoading={false}
            monthlySeries={response?.monthlySeries}
            expenseBreakdown={response?.expenseBreakdown}
            totals={totals}
          />
        );
      case FilterOptionEnum.CUSTOM:
      default:
        return (
          <CustomDateStatsWrapper
            isLoading={false}
            totals={totals}
            counts={response?.counts}
            expenseBreakdown={response?.expenseBreakdown}
            savingsRate={response?.savingsRate}
            topExpenseCategory={response?.topExpenseCategory}
          />
        );
    }
  };

  return (
    <Row className="no-scrollbar bg-background w-full flex-col items-start gap-0">
      {/* ── Hero ── */}
      <div className="border-border flex w-full flex-col items-center border-b bg-[#0d1117] p-4 md:px-6">
        {/* User row */}
        <div className="mb-2 flex items-center gap-2.5 text-[#2ea878]">
          <div className="poppins flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium text-emerald-700">
            {initials(userName)}
          </div>

          <h1 className="poppins text-xl leading-snug font-medium">
            {userName}'s financial snapshot
          </h1>
        </div>

        <Row className="inter flex-wrap justify-center gap-2">
          {/* Filter badge */}

          <Badge variant={'outline'} className="py-4 text-[#FFFFFFB3]">
            <Icon className="size-3" />
            {label} · Shared with you
          </Badge>

          {/* Date range */}
          <Badge variant={'outline'} className="py-4 text-[#FFFFFFB3]">
            <CalendarDays className="size-3" />
            {dateLabel}
          </Badge>
        </Row>
      </div>

      {/* ── Stats content ── */}
      <div className="w-full space-y-3 p-4">
        {renderData(filterType as FilterOptionEnum)}
      </div>

      <CTA className="" />
    </Row>
  );
};

export default SharedStatsWrapper;
