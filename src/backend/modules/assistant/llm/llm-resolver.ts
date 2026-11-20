import {
  AI_PROVIDER_ORDER,
  AiKeySource,
  AiProviderEnum,
} from '@/app/constants/ai-providers.constant';
import { AiKeysService } from '../../ai-keys/ai-keys.service';
import {
  createLlmClient,
  getSystemApiKey,
  LlmClient,
  LlmProviderError,
} from './llm-providers';

const aiKeysService = new AiKeysService();

export interface ResolvedLlm {
  client: LlmClient;
  provider: AiProviderEnum;
  source: AiKeySource;
}

/**
 * Decide which providers (and whose keys) to use for this user.
 *
 * - If the user has saved any of their own keys, ONLY their keys are used
 *   (falling back between their providers). We don't silently fall back to
 *   the app's system keys, so a broken user key surfaces instead of quietly
 *   spending the app's quota.
 * - Otherwise the system keys from the environment are used.
 *
 * Either way providers are tried in AI_PROVIDER_ORDER.
 */
export async function resolveLlmChain(userId: string): Promise<ResolvedLlm[]> {
  const userKeys = await aiKeysService.getDecryptedKeys(userId);

  const userChain = AI_PROVIDER_ORDER.filter(p => userKeys[p]).map(p => ({
    client: createLlmClient(p, userKeys[p]!),
    provider: p,
    source: 'user' as const,
  }));
  if (userChain.length > 0) return userChain;

  return AI_PROVIDER_ORDER.filter(p => getSystemApiKey(p)).map(p => ({
    client: createLlmClient(p, getSystemApiKey(p)!),
    provider: p,
    source: 'system' as const,
  }));
}

/** Thrown when every provider in the chain failed. */
export class AllProvidersFailedError extends Error {
  constructor(
    public source: AiKeySource | undefined,
    public failures: {
      provider: AiProviderEnum;
      status?: number;
      message: string;
    }[],
  ) {
    super('All AI providers failed');
    this.name = 'AllProvidersFailedError';
  }

  get allRateLimited() {
    return (
      this.failures.length > 0 && this.failures.every(f => f.status === 429)
    );
  }

  get anyAuthFailure() {
    return this.failures.some(f => f.status === 401 || f.status === 403);
  }
}

/**
 * Run `task` against the chain, starting at `startIndex`, moving to the next
 * provider on any provider failure (auth, quota, 5xx, network, bad output).
 * Returns the result and the index of the provider that succeeded.
 */
export async function runWithFallback<T>(
  chain: ResolvedLlm[],
  task: (llm: ResolvedLlm) => Promise<T>,
  startIndex = 0,
): Promise<{ value: T; index: number }> {
  const failures: AllProvidersFailedError['failures'] = [];

  for (let i = startIndex; i < chain.length; i++) {
    try {
      return { value: await task(chain[i]), index: i };
    } catch (error) {
      const status =
        error instanceof LlmProviderError ? error.status : undefined;
      const message = (error as Error)?.message || 'Unknown error';
      failures.push({ provider: chain[i].provider, status, message });
      console.warn(
        `[assistant] ${chain[i].provider} (${chain[i].source} key) failed${
          status ? ` [${status}]` : ''
        }: ${message}`,
      );
    }
  }

  throw new AllProvidersFailedError(chain[0]?.source, failures);
}
