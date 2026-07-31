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

// The model can only express date bounds as JSON — either a bare ISO string
// (e.g. "2026-06-01") or, more often in practice, MongoDB Extended JSON's
// canonical form (e.g. {"$date": "2026-06-01T00:00:00.000Z"}). `.aggregate()`
// never auto-casts either of these against the BSON `Date` fields in the
// "transactions" collection the way Mongoose's `find()` does — and since this
// pipeline came from `JSON.parse`, not an EJSON parser, the `{"$date": ...}`
// form isn't understood by the driver either; it's just a plain subdocument
// that can never match a real Date. Left alone, every date-range question
// would silently match zero documents. This walks the sanitized pipeline and
// turns both forms into real `Date` instances before it reaches
// `TransactionEntity.aggregate()`.
const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function extendedJsonToDate(value: Record<string, unknown>): Date | null {
  const raw = value.$date;

  if (typeof raw === 'string') {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof raw === 'number') {
    return new Date(raw);
  }

  if (raw && typeof raw === 'object' && '$numberLong' in raw) {
    const ms = Number((raw as Record<string, unknown>).$numberLong);
    return Number.isNaN(ms) ? null : new Date(ms);
  }

  return null;
}

// Only plain object/array literals — the shapes `JSON.parse` can actually
// produce — get walked and rebuilt. Anything else (the `ObjectId` this
// module injects for `userId`, or any other class instance) is returned
// untouched, so rebuilding a plain-object clone of it doesn't strip its BSON
// type and silently break the match.
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function coerceDateStrings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(coerceDateStrings);

  if (value instanceof Date) return value;

  if (isPlainObject(value)) {
    const keys = Object.keys(value);

    if (keys.length === 1 && keys[0] === '$date') {
      const date = extendedJsonToDate(value);
      if (date) return date;
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        coerceDateStrings(nested),
      ]),
    );
  }

  if (typeof value === 'string' && ISO_DATE_PATTERN.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return value;
}

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

  return sanitized.map(coerceDateStrings) as unknown as mongoose.PipelineStage[];
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
