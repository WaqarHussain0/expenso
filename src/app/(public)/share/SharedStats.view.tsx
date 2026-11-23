/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';
import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';

interface ISharedStatsViewProps {
  filterType?: string;
  /** Report data; omitted while it's still loading */
  response?: any;
  isLoading?: boolean;
}

const EMPTY_BUCKETS = { income: [], expense: [], investment: [] };

/**
 * The month / year / custom report body. Rendered with `isLoading` (and no
 * response) as the Suspense fallback, then with the real data.
 */
const SharedStatsView: React.FC<ISharedStatsViewProps> = ({
  filterType = 'custom',
  response,
  isLoading = false,
}) => {
  const totals = response?.totals ?? {};

  switch (filterType as FilterOptionEnum) {
    case FilterOptionEnum.MONTH:
      return (
        <MonthStatsWrapper
          allTransactions={response?.monthAllTransactions ?? EMPTY_BUCKETS}
          categoryBreakdown={response?.categoryBreakdown ?? EMPTY_BUCKETS}
          isLoading={isLoading}
          totals={totals}
        />
      );
    case FilterOptionEnum.YEAR:
      return (
        <YearStatsWrapper
          isLoading={isLoading}
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
          isLoading={isLoading}
          totals={totals}
          counts={response?.counts}
          expenseBreakdown={response?.expenseBreakdown}
          savingsRate={response?.savingsRate}
          topExpenseCategory={response?.topExpenseCategory}
        />
      );
  }
};

export default SharedStatsView;
