import { api } from '@/lib/rtk';
import type { ITransaction } from '@/types/transaction.type';

export enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export interface IBreakdownItem {
  name: string;
  total: number;
}

export interface IByCategoryType<T> {
  income: T;
  expense: T;
  investment: T;
}

export interface IMonthlySeriesPoint {
  month: string;
  income: number;
  expense: number;
  investment: number;
  freeCash: number;
}

/**
 * `/dashboard` returns a different shape per `filterBy`, so every field is
 * optional — month: totals/categoryBreakdown/monthAllTransactions,
 * year: totals/monthlySeries/*Breakdown, custom: totals/counts/savingsRate/…
 */
export interface IDashboardStatsResponse {
  response?: {
    totals?: IByCategoryType<number> & { freeCash?: number };
    // month
    categoryBreakdown?: IByCategoryType<IBreakdownItem[]>;
    monthAllTransactions?: IByCategoryType<ITransaction[]>;
    // year
    monthlySeries?: IMonthlySeriesPoint[];
    incomeBreakdown?: IBreakdownItem[];
    investmentBreakdown?: IBreakdownItem[];
    // year + custom
    expenseBreakdown?: IBreakdownItem[];
    // custom
    counts?: IByCategoryType<number>;
    savingsRate?: number;
    topExpenseCategory?: IBreakdownItem | null;
  };
  message?: string;
  success?: boolean;
}

export interface IDashboardStatsPayload {
  startDate?: string;
  endDate?: string;
  year?: number;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: dashboard => ({
    getDashboardStats: dashboard.query<
      IDashboardStatsResponse,
      { payload: IDashboardStatsPayload; filterBy?: FilterOptionEnum }
    >({
      query: ({ payload, filterBy }) => ({
        url: `/dashboard`,
        method: 'POST',
        body: payload,
        params: {
          filterBy,
        },
      }),
      providesTags: ['dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
