/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const ALLOWED_STAGES = new Set([
  '$match',
  '$group',
  '$project',
  '$sort',
  '$limit',
  '$unwind',
  '$addFields',
  '$count',
]);

// Operators that must never appear anywhere in a model-generated pipeline,
// whether as a stage or nested inside a stage's expression.
const DANGEROUS_KEYS = new Set([
  '$where',
  '$function',
  '$accumulator',
  '$out',
  '$merge',
  '$unionWith',
  '$graphLookup',
  '$currentOp',
  '$collStats',
  '$indexStats',
  '$listSessions',
  '$listLocalSessions',
  '$planCacheStats',
  '$documents',
  '$search',
  '$searchMeta',
  '$changeStream',
  '$listSearchIndexes',
]);

const MAX_STAGES = 10;
const MAX_LIMIT = 200;

/**
 * Validates and sanitizes a MongoDB aggregation pipeline produced by the model
 * before it is allowed anywhere near `TransactionEntity.aggregate()`. Throws on
 * anything outside the read-only whitelist. The authenticated user's id is
 * always injected here, never trusted from the model's output.
 */
export function sanitizePipeline(
  rawPipeline: unknown,
  userId: string,
): mongoose.PipelineStage[] {
  if (!Array.isArray(rawPipeline) || rawPipeline.length === 0) {
    throw new Error(
      'The assistant could not build a valid query for that question.',
    );
  }

  if (rawPipeline.length > MAX_STAGES) {
    throw new Error(
      'That question requires too complex a query to answer safely.',
    );
  }

  const sanitized = rawPipeline.map(sanitizeStage);

  const hasLimit = sanitized.some(stage => '$limit' in stage);
  if (!hasLimit) {
    sanitized.push({ $limit: MAX_LIMIT });
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const firstStage = sanitized[0];

  if (!('$match' in firstStage)) {
    sanitized.unshift({ $match: { userId: userObjectId } });
  } else {
    firstStage.$match = { ...firstStage.$match, userId: userObjectId };
  }

  return sanitized as unknown as mongoose.PipelineStage[];
}

function sanitizeStage(stage: unknown): Record<string, any> {
  if (typeof stage !== 'object' || stage === null || Array.isArray(stage)) {
    throw new Error('Invalid query stage produced by the assistant.');
  }

  const keys = Object.keys(stage as object);

  if (keys.length !== 1) {
    throw new Error('Invalid query stage produced by the assistant.');
  }

  const [stageKey] = keys;

  if (stageKey !== '$lookup' && !ALLOWED_STAGES.has(stageKey)) {
    throw new Error(
      `The assistant attempted a disallowed operation: ${stageKey}`,
    );
  }

  if (stageKey === '$lookup') {
    validateLookupStage((stage as any).$lookup);
  } else {
    assertNoDangerousOperators((stage as any)[stageKey]);
  }

  if (stageKey === '$limit') {
    const value = (stage as any).$limit;

    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Invalid $limit value produced by the assistant.');
    }

    return { $limit: Math.min(value, MAX_LIMIT) };
  }

  return stage as Record<string, any>;
}

function validateLookupStage(lookup: unknown) {
  if (typeof lookup !== 'object' || lookup === null) {
    throw new Error('Invalid $lookup stage produced by the assistant.');
  }

  const allowedKeys = ['from', 'localField', 'foreignField', 'as'];
  const keys = Object.keys(lookup as object);

  const hasOnlyAllowedKeys = keys.every(key => allowedKeys.includes(key));

  const { from, localField, foreignField, as } = lookup as Record<
    string,
    unknown
  >;

  if (
    !hasOnlyAllowedKeys ||
    from !== 'categories' ||
    localField !== 'categoryId' ||
    foreignField !== '_id' ||
    typeof as !== 'string'
  ) {
    throw new Error(
      'The assistant attempted a disallowed $lookup — only joining "categories" on categoryId is permitted.',
    );
  }
}

function assertNoDangerousOperators(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertNoDangerousOperators);
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (DANGEROUS_KEYS.has(key)) {
        throw new Error(
          `The assistant attempted a disallowed operation: ${key}`,
        );
      }

      assertNoDangerousOperators(nested);
    }
  }
}
