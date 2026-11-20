import { api } from '@/lib/rtk';
import {
  AiKeySource,
  AiProviderEnum,
} from '@/app/constants/ai-providers.constant';

export interface IAskAssistantResponse {
  response: string;
  /** Provider that produced the answer (absent for local refusals) */
  provider?: AiProviderEnum;
  source?: AiKeySource;
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
