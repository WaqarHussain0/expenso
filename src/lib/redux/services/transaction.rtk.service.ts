/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';

interface ICreateOrUpdatePayload {
  categoryId: string;
  amount: number;
  date: Date;
  note?: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: category => ({
    getAllTransactions: category.query<any, any>({
      query: payload => ({
        url: '/transactions/get-all',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['transactions'],
    }),

    createTransaction: category.mutation<any, ICreateOrUpdatePayload>({
      query: payload => ({
        url: '/transactions',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['transactions'],
    }),

    updateTransaction: category.mutation<
      any,
      { id: string; payload: ICreateOrUpdatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['transactions'],
    }),

    deleteTransaction: category.mutation<any, string>({
      query: id => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['transactions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = categoryApi;
