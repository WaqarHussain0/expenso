import mongoose from 'mongoose';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';
import SharedStatsView from './SharedStats.view';

const transactionService = new TransactionService();

interface ISharedStatsSectionProps {
  type: FilterOptionEnum;
  userObjectId: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  year?: number;
}

/**
 * Loads the shared report's data (the slow part of the share page) and
 * renders it. The page has already validated the filter, so the dates/year
 * each type needs are present.
 */
const SharedStatsSection = async ({
  type,
  userObjectId,
  startDate,
  endDate,
  year,
}: ISharedStatsSectionProps) => {
  let response;

  switch (type) {
    case FilterOptionEnum.MONTH:
      response = await transactionService.getMonthlyDashboardData(
        startDate!,
        endDate!,
        userObjectId,
      );
      break;
    case FilterOptionEnum.YEAR:
      response = await transactionService.getYearlyDashboardData(
        userObjectId,
        year!,
      );
      break;
    case FilterOptionEnum.CUSTOM:
    default:
      response = await transactionService.getCustomDateDashboardData(
        userObjectId,
        startDate!,
        endDate!,
      );
      break;
  }

  return <SharedStatsView filterType={type} response={response} />;
};

export default SharedStatsSection;
