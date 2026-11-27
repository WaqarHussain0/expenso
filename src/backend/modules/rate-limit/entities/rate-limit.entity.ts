import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Counters for rate limits and short-lived locks. Lives in MongoDB (not
 * memory) so limits hold across serverless instances. One row per
 * key + time window; MongoDB deletes rows once they expire.
 */
export interface IRateLimit extends Document {
  /** e.g. "stats-export:<userId>:<window>" or "lock:category-import:<userId>" */
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false },
);

// MongoDB removes rows automatically once they expire (checked ~every 60s)
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitEntity: Model<IRateLimit> =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimitEntity;
