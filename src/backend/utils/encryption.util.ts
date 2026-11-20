import crypto from 'crypto';

/**
 * Authenticated symmetric encryption (AES-256-GCM) for secrets stored in the
 * database, e.g. users' AI provider API keys.
 *
 * Format: `v1:<iv b64>:<auth tag b64>:<ciphertext b64>`
 *
 * `context` is bound as Additional Authenticated Data — decrypting with a
 * different context fails, so a ciphertext can't be copied to another
 * user/row and still decrypt.
 */

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';

function getKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'API_KEY_ENCRYPTION_SECRET is not set (or too short) — cannot encrypt or decrypt stored API keys.',
    );
  }
  // Derive a fixed 32-byte key from the configured secret
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSecret(plaintext: string, context: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  cipher.setAAD(Buffer.from(context, 'utf8'));

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString('base64'),
    tag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptSecret(payload: string, context: string): string {
  const [version, ivB64, tagB64, dataB64] = payload.split(':');
  if (version !== VERSION || !ivB64 || !tagB64 || !dataB64) {
    throw new Error('Unsupported encrypted payload format');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivB64, 'base64'),
  );
  decipher.setAAD(Buffer.from(context, 'utf8'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
