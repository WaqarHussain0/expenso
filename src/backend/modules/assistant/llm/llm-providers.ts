import { ApiError, GoogleGenAI } from '@google/genai';
import { AiProviderEnum } from '@/app/constants/ai-providers.constant';

/**
 * Minimal, provider-agnostic interface the assistant needs: send a system
 * prompt + user message and get a JSON string back.
 */
export interface LlmClient {
  provider: AiProviderEnum;
  completeJson(params: { system: string; user: string }): Promise<string>;
}

/** Error carrying the provider and HTTP status, used to decide on fallback. */
export class LlmProviderError extends Error {
  constructor(
    public provider: AiProviderEnum,
    public status: number | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'LlmProviderError';
  }
}

/**
 * Per-request timeout. A hung provider is abandoned so the next one in the
 * chain can answer. Configurable because some models are slow under load.
 */
const REQUEST_TIMEOUT_MS =
  Number(process.env.AI_REQUEST_TIMEOUT_MS) > 0
    ? Number(process.env.AI_REQUEST_TIMEOUT_MS)
    : 45_000;
const VERIFY_TIMEOUT_MS = 10_000;

const MODELS: Record<AiProviderEnum, string> = {
  [AiProviderEnum.GEMINI]: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  [AiProviderEnum.OPENAI]: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  [AiProviderEnum.GROK]: process.env.GROK_MODEL || 'grok-3-mini',
};

/** OpenAI-compatible chat-completions endpoints */
const OPENAI_COMPATIBLE_BASE_URL: Partial<Record<AiProviderEnum, string>> = {
  [AiProviderEnum.OPENAI]: 'https://api.openai.com/v1',
  [AiProviderEnum.GROK]: 'https://api.x.ai/v1',
};

/* ───────────────────────── Gemini ───────────────────────── */

function createGeminiClient(apiKey: string): LlmClient {
  const client = new GoogleGenAI({ apiKey });

  return {
    provider: AiProviderEnum.GEMINI,
    async completeJson({ system, user }) {
      try {
        const response = await client.models.generateContent({
          model: MODELS[AiProviderEnum.GEMINI],
          contents: user,
          config: {
            systemInstruction: system,
            responseMimeType: 'application/json',
            abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          },
        });
        if (!response.text) {
          throw new LlmProviderError(
            AiProviderEnum.GEMINI,
            undefined,
            'Empty response',
          );
        }
        return response.text;
      } catch (error) {
        if (error instanceof LlmProviderError) throw error;
        throw new LlmProviderError(
          AiProviderEnum.GEMINI,
          error instanceof ApiError ? error.status : undefined,
          (error as Error)?.message || 'Gemini request failed',
        );
      }
    },
  };
}

/* ─────────────── OpenAI & Grok (OpenAI-compatible) ─────────────── */

function createOpenAiCompatibleClient(
  provider: AiProviderEnum,
  apiKey: string,
): LlmClient {
  const baseUrl = OPENAI_COMPATIBLE_BASE_URL[provider]!;

  return {
    provider,
    async completeJson({ system, user }) {
      let res: Response;
      try {
        res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODELS[provider],
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
      } catch (error) {
        throw new LlmProviderError(
          provider,
          undefined,
          (error as Error)?.message || 'Network error',
        );
      }

      if (!res.ok) {
        // Error bodies can echo request details — keep only a short message
        let message = `${res.status} ${res.statusText}`;
        try {
          const body = await res.json();
          message = body?.error?.message?.slice(0, 200) || message;
        } catch {
          /* non-JSON error body */
        }
        throw new LlmProviderError(provider, res.status, message);
      }

      const data = await res.json();
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new LlmProviderError(provider, undefined, 'Empty response');
      }
      return content;
    },
  };
}

export function createLlmClient(
  provider: AiProviderEnum,
  apiKey: string,
): LlmClient {
  return provider === AiProviderEnum.GEMINI
    ? createGeminiClient(apiKey)
    : createOpenAiCompatibleClient(provider, apiKey);
}

/* ───────────────────────── Key checks ───────────────────────── */

/** System (env) API key for a provider, if configured. */
export function getSystemApiKey(provider: AiProviderEnum): string | undefined {
  const key = {
    [AiProviderEnum.GEMINI]: process.env.GEMINI_API_KEY,
    [AiProviderEnum.OPENAI]: process.env.OPENAI_API_KEY,
    [AiProviderEnum.GROK]: process.env.GROK_API_KEY,
  }[provider];
  return key?.trim() || undefined;
}

/**
 * Cheap authenticated call (list models) to check a key is accepted by the
 * provider before we store it. Throws a user-friendly error if not.
 */
export async function verifyApiKey(
  provider: AiProviderEnum,
  apiKey: string,
): Promise<void> {
  const request =
    provider === AiProviderEnum.GEMINI
      ? fetch(
          'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1',
          {
            headers: { 'x-goog-api-key': apiKey },
            signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
          },
        )
      : fetch(`${OPENAI_COMPATIBLE_BASE_URL[provider]}/models`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
        });

  let res: Response;
  try {
    res = await request;
  } catch {
    throw new Error(
      'Could not reach the provider to verify this key. Please try again.',
    );
  }

  if (res.ok) return;

  if ([400, 401, 403].includes(res.status)) {
    throw new Error('This key was rejected by the provider. Please check it.');
  }
  if (res.status === 429) {
    throw new Error(
      'The provider is rate-limiting this key right now. Please try again shortly.',
    );
  }
  throw new Error(`The provider could not verify this key (${res.status}).`);
}
