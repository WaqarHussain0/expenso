import mongoose from 'mongoose';
import { initDB } from '@/backend/utils/dbInit.util';
import { decryptSecret, encryptSecret } from '@/backend/utils/encryption.util';
import {
  AiProviderEnum,
  IAiKeySummary,
} from '@/app/constants/ai-providers.constant';
import UserAiKeyEntity from './entities/user-ai-key.entity';
import { verifyApiKey } from '../assistant/llm/llm-providers';

const MIN_KEY_LENGTH = 20;
const MAX_KEY_LENGTH = 512;

/** AAD binding a ciphertext to exactly one user + provider row */
const encryptionContext = (userId: string, provider: AiProviderEnum) =>
  `user-ai-key:${userId}:${provider}`;

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export class AiKeysService {
  /** What the UI may see: provider, last 4 chars, last update. Never the key. */
  async listForUser(userId: string): Promise<IAiKeySummary[]> {
    await initDB();
    const rows = await UserAiKeyEntity.find({ userId: toObjectId(userId) })
      .select('provider last4 updatedAt')
      .lean();

    return rows.map(row => ({
      provider: row.provider,
      last4: row.last4,
      updatedAt: new Date(row.updatedAt).toISOString(),
    }));
  }

  /** Verify the key with the provider, then store it encrypted (insert or replace). */
  async save(userId: string, provider: AiProviderEnum, rawKey: string) {
    if (!Object.values(AiProviderEnum).includes(provider)) {
      throw new Error('Unknown provider');
    }

    const apiKey = (rawKey ?? '').trim();
    if (
      apiKey.length < MIN_KEY_LENGTH ||
      apiKey.length > MAX_KEY_LENGTH ||
      /\s/.test(apiKey)
    ) {
      throw new Error('That does not look like a valid API key.');
    }

    await verifyApiKey(provider, apiKey);

    await initDB();
    await UserAiKeyEntity.findOneAndUpdate(
      { userId: toObjectId(userId), provider },
      {
        $set: {
          encryptedKey: encryptSecret(
            apiKey,
            encryptionContext(userId, provider),
          ),
          last4: apiKey.slice(-4),
        },
      },
      { upsert: true, runValidators: true },
    );
  }

  async remove(userId: string, provider: AiProviderEnum) {
    await initDB();
    await UserAiKeyEntity.deleteOne({ userId: toObjectId(userId), provider });
  }

  /**
   * Decrypted keys for the assistant resolver. Server-side only.
   * Rows that fail to decrypt (e.g. the encryption secret changed) are skipped.
   */
  async getDecryptedKeys(
    userId: string,
  ): Promise<Partial<Record<AiProviderEnum, string>>> {
    await initDB();
    const rows = await UserAiKeyEntity.find({ userId: toObjectId(userId) })
      .select('+encryptedKey provider')
      .lean();

    const keys: Partial<Record<AiProviderEnum, string>> = {};
    for (const row of rows) {
      try {
        keys[row.provider] = decryptSecret(
          row.encryptedKey,
          encryptionContext(userId, row.provider),
        );
      } catch {
        console.error(
          `Could not decrypt ${row.provider} key for user ${userId} — skipping`,
        );
      }
    }
    return keys;
  }
}
