/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';

export const dashboardApi = api.injectEndpoints({
  endpoints: dashboard => ({
    getDashboardStats: dashboard.query<any, any>({
      query: payload => ({
        url: '/dashboard',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
