import DOMPurify from 'isomorphic-dompurify';
import { LlmClient } from './llm/llm-providers';

// Static, versioned-with-the-code description of the entities the model is
// allowed to query — not read from the .entity.ts files at runtime.
const PIPELINE_SYSTEM_PROMPT = `You are a read-only financial data query planner for a personal finance app.

Data model (MongoDB):
- "transactions" collection: { amount: number, date: Date, note?: string, categoryId: ObjectId (references categories._id), userId: ObjectId }
- "categories" collection: { name: string, type: "income" | "expense" | "investment", userId: ObjectId }

Your job: given the user's question, output a MongoDB aggregation pipeline (an array of stage objects) that runs against the "transactions" collection and answers it.

Strict rules:
- Only use these stages: $match, $group, $project, $sort, $limit, $unwind, $addFields, $count.
- You may use $lookup, but ONLY in exactly this shape: {"$lookup": {"from": "categories", "localField": "categoryId", "foreignField": "_id", "as": "category"}}, followed by {"$unwind": "$category"} if you need the category name/type.
- Never include a "userId" field in any $match — the system adds it automatically for the currently logged-in user.
- Never produce a pipeline that could write, update, delete, or modify data. If the question asks for anything resembling a write/delete/update/create action, or anything outside the user's own financial data, respond with "refusal": true and leave "pipeline" as an empty array.
- Keep the pipeline as small as possible while fully answering the question.

Respond with strict JSON matching: { "refusal": boolean, "reason": string, "pipeline": array }`;

const ANSWER_SYSTEM_PROMPT =
  'You turn raw financial query results into a friendly, concise answer for the user, formatted as a small HTML fragment. ' +
  'Only use values present in the result — never invent numbers. If the result is empty, say so plainly. ' +
  'Only use these tags: <p>, <strong>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. Never use attributes, inline styles, scripts, or any other tags. ' +
  'Lead with a one-line headline answer wrapped in <p>, with the key number in <strong>. ' +
  'If the result has more than 3 items (e.g. a category breakdown), present them as an HTML table with sensible column headers instead of a run-on sentence, sorted by amount descending. ' +
  'Amounts are in PKR — write plain numbers with thousands separators and no currency symbol or code. Keep any prose outside the table brief. ' +
  'Respond with strict JSON matching: { "answer": string } where "answer" is the HTML fragment.';

export interface GeneratedPipeline {
  refusal: boolean;
  reason: string;
  pipeline: unknown[];
}

/** Some models wrap JSON in ```json fences despite JSON mode — strip them. */
function parseJson(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

export async function generatePipeline(
  llm: LlmClient,
  question: string,
): Promise<GeneratedPipeline> {
  const content = await llm.completeJson({
    system: PIPELINE_SYSTEM_PROMPT,
    user: question,
  });

  const parsed = parseJson(content);

  if (
    typeof parsed?.refusal !== 'boolean' ||
    !Array.isArray(parsed?.pipeline)
  ) {
    throw new Error('The assistant returned an unexpected response format.');
  }

  return parsed as GeneratedPipeline;
}

export async function phraseAnswer(
  llm: LlmClient,
  question: string,
  result: unknown[],
): Promise<string> {
  const content = await llm.completeJson({
    system: ANSWER_SYSTEM_PROMPT,
    user: `Question: ${question}\nQuery result (JSON): ${JSON.stringify(result)}`,
  });

  const parsed = parseJson(content);
  if (typeof parsed?.answer !== 'string') {
    throw new Error('The assistant returned an unexpected response format.');
  }

  return DOMPurify.sanitize(parsed.answer, {
    ALLOWED_TAGS: [
      'p',
      'strong',
      'ul',
      'ol',
      'li',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: [],
  });
}
