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
  endpoints: category => ({
    setProfile: category.mutation<any, ICreateOrUpdatePayload>({
      query: payload => ({
        url: '/users/set-profile',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['users'],
    }),
  }),
  overrideExisting: false,
});

export const { useSetProfileMutation } = UserApi;
