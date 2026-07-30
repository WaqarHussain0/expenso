import { ApiError } from '@google/genai';
import { initDB } from '@/backend/utils/dbInit.util';
import TransactionEntity from '../transaction/entities/transaction.entity';
import { isWriteIntent } from './assistant-intent-filter.util';
import { sanitizePipeline } from './assistant-pipeline.util';
import { generatePipeline, phraseAnswer } from './assistant-gemini.util';

const REFUSAL_MESSAGE =
  "I can only answer questions about your existing financial data. I can't make changes, additions, or deletions.";

const RATE_LIMIT_MESSAGE =
  "The assistant is getting a lot of requests right now. Please try again in a minute.";

export class AssistantService {
  async ask(userId: string, question: string): Promise<string> {
    if (isWriteIntent(question)) {
      return REFUSAL_MESSAGE;
    }

    await initDB();

    try {
      const generated = await generatePipeline(question);

      if (generated.refusal || generated.pipeline.length === 0) {
        return REFUSAL_MESSAGE;
      }

      const pipeline = sanitizePipeline(generated.pipeline, userId);

      const result = await TransactionEntity.aggregate(pipeline, {
        maxTimeMS: 5000,
      });

      return await phraseAnswer(question, result);
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw Object.assign(new Error(RATE_LIMIT_MESSAGE), { status: 429 });
      }

      throw error;
    }
  }
}
