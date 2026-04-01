/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { StatsService } from '@/backend/modules/stats/stats.service';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import SharedStatsWrapper from './SharedStats.wrapper';
import mongoose from 'mongoose';

type IUser = {
  _id: string;
  name: string;
  email: string;
};

type SearchParams = Promise<{
  m: string;
}>;

const statsService = new StatsService();
const transactionService = new TransactionService();

// Type guard to check if userId is populated
const isUser = (user: any): user is IUser => {
  return user && typeof user === 'object' && 'name' in user;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { m } = await searchParams;

  if (!m) {
    redirect(PAGE_ROUTES.stats);
  }

  const stat = await statsService.getStatsByToken(m);

  if (!stat || !stat.filter) {
    redirect(PAGE_ROUTES.stats);
  }

  const { filter, userId } = stat;
  const { type, startDate, endDate, year } = filter;

  if (!type || (type === FilterOptionEnum.MONTH && (!startDate || !endDate))) {
    redirect(PAGE_ROUTES.stats);
  }

  // Determine userId string

  const userObjectId =
    typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId(userId._id); // wrap string _id as ObjectId

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
      if (year === undefined) redirect(PAGE_ROUTES.stats);
      response = await transactionService.getYearlyDashboardData(
        userObjectId,
        year,
      );
      break;
    case FilterOptionEnum.CUSTOM:
      if (!startDate || !endDate) redirect(PAGE_ROUTES.stats);
      response = await transactionService.getCustomDateDashboardData(
        userObjectId,
        startDate,
        endDate,
      );
      break;
    default:
      redirect(PAGE_ROUTES.stats);
  }

  // Safely get name
  const userName = isUser(userId) ? userId.name : 'User';

  return (
    <SharedStatsWrapper
      filterType={type}
      response={response}
      userName={userName}
    />
  );
};

export default Page;
