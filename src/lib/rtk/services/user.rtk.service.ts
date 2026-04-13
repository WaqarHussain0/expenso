/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/rtk';
import { UserGenderEnum } from '@/types/user-profile.type';

interface ICreateOrUpdatePayload {
  name: string;
  gender: UserGenderEnum;
  contact: string;
  userId: string;
}

export const UserApi = api.injectEndpoints({
  endpoints: user => ({
    setProfile: user.mutation<any, ICreateOrUpdatePayload>({
      query: payload => ({
        url: '/users/set-profile',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['users'],
    }),


    toggleUserStatus: user.mutation<
      { success: boolean },
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/toggle-status`,
        method: 'PATCH',
        body: { isActive },
      }),
    }),

    deleteUser: user.mutation<any, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSetProfileMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = UserApi;
