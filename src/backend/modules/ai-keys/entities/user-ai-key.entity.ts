import mongoose, { Schema, Document, Model } from 'mongoose';
import { AiProviderEnum } from '@/app/constants/ai-providers.constant';

/** A user's own API key for one AI provider, stored encrypted. */
export interface IUserAiKey extends Document {
  userId: mongoose.Types.ObjectId;
  provider: AiProviderEnum;
  /** AES-256-GCM payload — never returned to the client */
  encryptedKey: string;
  /** Last 4 characters, for display only */
  last4: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserAiKeySchema = new Schema<IUserAiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: Object.values(AiProviderEnum),
      required: true,
    },
    // select: false → only loaded when explicitly requested
    encryptedKey: { type: String, required: true, select: false },
    last4: { type: String, required: true },
  },
  { timestamps: true },
);

// One key per provider per user
UserAiKeySchema.index({ userId: 1, provider: 1 }, { unique: true });

const UserAiKeyEntity: Model<IUserAiKey> =
  mongoose.models.UserAiKey ||
  mongoose.model<IUserAiKey>('UserAiKey', UserAiKeySchema);

export default UserAiKeyEntity;
