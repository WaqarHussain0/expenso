/**
 * AI providers the assistant can use. Shared by client (settings UI) and
 * server (resolver) — contains no secrets.
 */
export enum AiProviderEnum {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  GROK = 'grok',
}

/** Fallback order: the assistant tries providers in this order. */
export const AI_PROVIDER_ORDER: AiProviderEnum[] = [
  AiProviderEnum.GEMINI,
  AiProviderEnum.OPENAI,
  AiProviderEnum.GROK,
];

export const AI_PROVIDERS: Record<
  AiProviderEnum,
  {
    label: string;
    vendor: string;
    /** Where users can create a key */
    keyUrl: string;
    placeholder: string;
    /** Accent colour for the UI tile */
    color: string;
  }
> = {
  [AiProviderEnum.GEMINI]: {
    label: 'Gemini',
    vendor: 'Google',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIza…',
    color: '#4f7df3',
  },
  [AiProviderEnum.OPENAI]: {
    label: 'OpenAI',
    vendor: 'OpenAI',
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-…',
    color: '#0d1117',
  },
  [AiProviderEnum.GROK]: {
    label: 'Grok',
    vendor: 'xAI',
    keyUrl: 'https://console.x.ai',
    placeholder: 'xai-…',
    color: '#5b5f6b',
  },
};

export type AiKeySource = 'user' | 'system';

/** What the client is allowed to know about a saved key. */
export interface IAiKeySummary {
  provider: AiProviderEnum;
  last4: string;
  updatedAt: string;
}
