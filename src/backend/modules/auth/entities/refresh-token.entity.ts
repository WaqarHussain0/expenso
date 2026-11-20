import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * One row per issued refresh token. Only a SHA-256 hash of the token is
 * stored, so a database leak doesn't hand out usable tokens.
 */
export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  /** Set when the token is rotated or revoked */
  revokedAt?: Date | null;
  /** Hash of the token that replaced this one (rotation chain) */
  replacedByHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: null },
  },
  { timestamps: true },
);

// MongoDB deletes rows automatically once they expire
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenEntity: Model<IRefreshToken> =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshTokenEntity;
