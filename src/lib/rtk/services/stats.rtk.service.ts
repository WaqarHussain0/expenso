/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';

export const StatsApi = api.injectEndpoints({
  endpoints: stats => ({
    createStatsURL: stats.mutation<any, { payload: any }>({
      query: ({ payload }) => ({
        url: `/stats/share`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['stats'], // ✅ mutation → invalidate
    }),
  }),
  overrideExisting: false,
});

export const { useCreateStatsURLMutation } = StatsApi;
