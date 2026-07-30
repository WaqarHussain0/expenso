/**
 * Cheap, deterministic first gate — never calls OpenAI for prompts that look
 * like they're asking to write/update/delete data. This is defense-in-depth,
 * not the primary safety net: the pipeline validator (assistant-pipeline.util.ts)
 * is what actually guarantees the query stays read-only.
 */
const WRITE_INTENT_PATTERN =
  /\b(delete|remove|update|edit|modify|change|add|insert|create|set|clear|drop|erase|overwrite|replace)\b/i;

export function isWriteIntent(question: string): boolean {
  return WRITE_INTENT_PATTERN.test(question);
}
