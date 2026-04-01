/* eslint-disable react/no-unescaped-entities */
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import CustomDateStatsWrapper from '@/components/feature/stats/CustomDateStats.wrapper';
import MonthStatsWrapper from '@/components/feature/stats/MonthStats.wrapper';
import YearStatsWrapper from '@/components/feature/stats/YearStats.wrapper';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';

interface ISharedStatsWrapperProps {
  filterType?: string;

  response: any;
  userName?: string;
}
const SharedStatsWrapper: React.FC<ISharedStatsWrapperProps> = ({
  filterType,
  response,
  userName,
}) => {
  const renderData = (filterOption: FilterOptionEnum) => {
    switch (filterOption) {
      case FilterOptionEnum.MONTH:
        return (
          <MonthStatsWrapper
            allTransactions={response?.monthAllTransactions}
            categoryBreakdown={response?.categoryBreakdown}
            isLoading={false}
            totals={response?.totals}
          />
        );

      case FilterOptionEnum.YEAR:
        return (
          <YearStatsWrapper
            isLoading={false}
            monthlySeries={response?.monthlySeries}
            expenseBreakdown={response?.expenseBreakdown}
            totals={response?.totals}
          />
        );

      case FilterOptionEnum.CUSTOM:
      default:
        return (
          <CustomDateStatsWrapper
            isLoading={false}
            totals={response?.totals}
            counts={response?.counts}
            expenseBreakdown={response?.expenseBreakdown}
            savingsRate={response?.savingsRate}
            topExpenseCategory={response?.topExpenseCategory}
          />
        );
    }
  };

  return (
    <Row className="no-scrollbar w-full flex-col items-start gap-3 p-4">
      <TextElement as="h3" className="w-full text-center">
        {userName} shared stats with you!{' '}
      </TextElement>
      <TextElement className="w-full text-center">{`Here's a snapshot of the financial journey.`}</TextElement>

      <div className="w-full space-y-3">
        {renderData(filterType as FilterOptionEnum)}
      </div>
    </Row>
  );
};

export default SharedStatsWrapper;
