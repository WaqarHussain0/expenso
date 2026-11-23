/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import FinalCta from '@/components/feature/marketing/landing/FinalCta';
import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';
import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
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
            incomeBreakdown={response?.incomeBreakdown}
            investmentBreakdown={response?.investmentBreakdown}
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
    <div className="bg-canvas min-h-screen w-full">
      {/* ── Header ── */}
      <header className="bg-panel relative overflow-hidden">
        <div className="fr-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center md:px-6 md:py-10">
          <span className="manrope flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#34d399] to-[#1a7f5a] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)]">
            {initials(userName)}
          </span>

          <h1
            className="text-2xl font-bold text-[#f4f4f4] md:text-3xl"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {userName ? (
              <>
                <span className="capitalize">{userName}</span>&apos;s{' '}
              </>
            ) : null}
            <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
              financial snapshot
            </em>
          </h1>

          <div className="inter flex flex-wrap justify-center gap-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <Icon className="size-3.5 text-[#34d399]" />
              {label} · Shared with you
            </span>
            {dateLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <CalendarDays className="size-3.5 text-[#34d399]" />
                {dateLabel}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Stats content ── */}
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-3">
          {renderData(filterType as FilterOptionEnum)}
        </div>

        <FinalCta variant="compact" />
      </main>
    </div>
  );
};

export default SharedStatsWrapper;
