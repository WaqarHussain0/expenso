import { initDB } from '@/backend/utils/dbInit.util';
import RateLimitEntity from './entities/rate-limit.entity';

/** Thrown when a limit is hit; the message is safe to show to the user. */
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Connect, and make sure the unique index on `key` exists before relying on
 * it (on a fresh deploy Mongoose builds indexes in the background).
 */
const ready = async () => {
  await initDB();
  await RateLimitEntity.init();
};

const isDuplicateKey = (error: unknown) =>
  (error as { code?: number })?.code === 11000;

const describeWait = (ms: number) => {
  const minutes = Math.ceil(ms / 60000);
  return minutes <= 1 ? 'a minute' : `${minutes} minutes`;
};

interface IRateLimitOptions {
  /** What is limited, e.g. "stats-export" */
  action: string;
  /** Who is limited, usually the user id */
  subject: string;
  /** Allowed calls per window */
  limit: number;
  windowSeconds: number;
  /** Shown to the user when the limit is hit (wait time is appended) */
  message: string;
}

/**
 * Fixed-window rate limit: counts calls per subject in the current window and
 * throws RateLimitError once `limit` is exceeded. Atomic ($inc on a unique
 * key), so concurrent requests on different instances can't slip past it.
 */
export async function enforceRateLimit({
  action,
  subject,
  limit,
  windowSeconds,
  message,
}: IRateLimitOptions) {
  await ready();

  const windowMs = windowSeconds * 1000;
  const windowIndex = Math.floor(Date.now() / windowMs);
  const windowEnd = (windowIndex + 1) * windowMs;
  const key = `${action}:${subject}:${windowIndex}`;

  const increment = () =>
    RateLimitEntity.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowEnd) } },
      { upsert: true, new: true, lean: true },
    );

  // Two first-calls racing can both try to insert; the loser just retries
  const doc = await increment().catch(error =>
    isDuplicateKey(error) ? increment() : Promise.reject(error),
  );

  if ((doc?.count ?? 0) > limit) {
    throw new RateLimitError(
      `${message} Try again in ${describeWait(windowEnd - Date.now())}.`,
    );
  }
}

/**
 * Run `task` while holding a per-key lock, so the same user can't run it
 * twice at once (e.g. two imports racing and creating duplicates). The lock
 * expires on its own after `ttlSeconds` in case the instance dies mid-task.
 */
export async function withLock<T>(
  key: string,
  ttlSeconds: number,
  busyMessage: string,
  task: () => Promise<T>,
): Promise<T> {
  await ready();
  const lockKey = `lock:${key}`;

  // Clear a lock left behind past its expiry (the TTL monitor is lazy)
  await RateLimitEntity.deleteOne({
    key: lockKey,
    expiresAt: { $lte: new Date() },
  });

  try {
    await RateLimitEntity.create({
      key: lockKey,
      count: 1,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    });
  } catch (error) {
    if (isDuplicateKey(error)) throw new RateLimitError(busyMessage);
    throw error;
  }

  try {
    return await task();
  } finally {
    await RateLimitEntity.deleteOne({ key: lockKey }).catch(() => {});
  }
}
