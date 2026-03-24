/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';

export enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export const dashboardApi = api.injectEndpoints({
  endpoints: dashboard => ({
    getDashboardStats: dashboard.query<
      any,
      { payload: any; filterBy?: FilterOptionEnum }
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
