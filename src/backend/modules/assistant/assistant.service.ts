import { initDB } from '@/backend/utils/dbInit.util';
import TransactionEntity from '../transaction/entities/transaction.entity';
import { isWriteIntent } from './assistant-intent-filter.util';
import { sanitizePipeline } from './assistant-pipeline.util';
import { generatePipeline, phraseAnswer } from './assistant-llm.util';
import {
  AllProvidersFailedError,
  resolveLlmChain,
  runWithFallback,
} from './llm/llm-resolver';
import {
  AiKeySource,
  AiProviderEnum,
} from '@/app/constants/ai-providers.constant';

const REFUSAL_MESSAGE =
  "I can only answer questions about your existing financial data. I can't make changes, additions, or deletions.";

const RATE_LIMIT_MESSAGE =
  'The assistant is getting a lot of requests right now. Please try again in a minute.';

const NOT_CONFIGURED_MESSAGE =
  'The assistant is not configured yet. Add your own API key in Profile → AI provider keys.';

const USER_KEYS_FAILED_MESSAGE =
  'Your saved AI keys were rejected by the provider. Please update them in Profile → AI provider keys.';

const UNAVAILABLE_MESSAGE =
  'The assistant is unavailable right now. Please try again shortly.';

export interface IAssistantAnswer {
  answer: string;
  /** Which provider produced the final answer (absent for local refusals) */
  provider?: AiProviderEnum;
  source?: AiKeySource;
}

const httpError = (message: string, status: number) =>
  Object.assign(new Error(message), { status });

export class AssistantService {
  async ask(userId: string, question: string): Promise<IAssistantAnswer> {
    if (isWriteIntent(question)) {
      return { answer: REFUSAL_MESSAGE };
    }

    await initDB();

    const chain = await resolveLlmChain(userId);
    if (chain.length === 0) {
      throw httpError(NOT_CONFIGURED_MESSAGE, 503);
    }

    try {
      // 1. Plan the query (first provider that succeeds)
      const planned = await runWithFallback(chain, llm =>
        generatePipeline(llm.client, question),
      );

      if (planned.value.refusal || planned.value.pipeline.length === 0) {
        return { answer: REFUSAL_MESSAGE };
      }

      const pipeline = sanitizePipeline(planned.value.pipeline, userId);

      const result = await TransactionEntity.aggregate(pipeline, {
        maxTimeMS: 5000,
      });

      // 2. Phrase the answer — start with the provider that just worked
      const phrased = await runWithFallback(
        chain,
        llm => phraseAnswer(llm.client, question, result),
        planned.index,
      );

      const used = chain[phrased.index];
      return {
        answer: phrased.value,
        provider: used.provider,
        source: used.source,
      };
    } catch (error) {
      if (error instanceof AllProvidersFailedError) {
        if (error.allRateLimited) throw httpError(RATE_LIMIT_MESSAGE, 429);
        if (error.source === 'user' && error.anyAuthFailure) {
          throw httpError(USER_KEYS_FAILED_MESSAGE, 400);
        }
        throw httpError(UNAVAILABLE_MESSAGE, 503);
      }

      throw error;
    }
  }
}
