/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';
import { CategoryTypeEnum } from '@/types/category.type';

interface ICreateOrUpdatePayload {
  name: string;
  type: CategoryTypeEnum;
}

export const categoryApi = api.injectEndpoints({
  endpoints: category => ({
    getAllCategories: category.query<any, any>({
      query: payload => ({
        url: '/categories/get-all',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['categories'],
    }),

    getCategoryById: category.query<any, string>({
      query: id => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: ['categories'],
    }),

    createCategory: category.mutation<any, ICreateOrUpdatePayload>({
      query: payload => ({
        url: '/categories',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['categories'],
    }),

    updateCategory: category.mutation<
      any,
      { id: string; payload: ICreateOrUpdatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['categories'],
    }),

    deleteCategory: category.mutation<any, string>({
      query: id => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categories'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryByIdQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
