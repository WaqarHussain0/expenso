/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api`,

    prepareHeaders: async (headers: any) => {
      const session = await getSession();
      if (session && session.accessToken) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['categories', 'transactions', 'dashboard', 'stats', 'users'],
  endpoints: () => ({}),
});
