import { api } from '@/lib/rtk';

export interface IAskAssistantResponse {
  response: string;
  message: string;
  success: boolean;
}

export const assistantApi = api.injectEndpoints({
  endpoints: assistant => ({
    askAssistant: assistant.mutation<
      IAskAssistantResponse,
      { question: string }
    >({
      query: payload => ({
        url: `/assistant`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useAskAssistantMutation } = assistantApi;
