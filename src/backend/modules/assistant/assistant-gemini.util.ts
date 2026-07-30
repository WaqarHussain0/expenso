import { GoogleGenAI, Type } from '@google/genai';
import DOMPurify from 'isomorphic-dompurify';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

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

export interface GeneratedPipeline {
  refusal: boolean;
  reason: string;
  pipeline: unknown[];
}

export async function generatePipeline(
  question: string,
): Promise<GeneratedPipeline> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: question,
    config: {
      systemInstruction: PIPELINE_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error('The assistant did not return a response.');
  }

  const parsed = JSON.parse(content);

  if (
    typeof parsed?.refusal !== 'boolean' ||
    !Array.isArray(parsed?.pipeline)
  ) {
    throw new Error('The assistant returned an unexpected response format.');
  }

  return parsed as GeneratedPipeline;
}

export async function phraseAnswer(
  question: string,
  result: unknown[],
): Promise<string> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: `Question: ${question}\nQuery result (JSON): ${JSON.stringify(result)}`,
    config: {
      systemInstruction:
        'You turn raw financial query results into a friendly, concise answer for the user, formatted as a small HTML fragment. ' +
          'Only use values present in the result — never invent numbers. If the result is empty, say so plainly. ' +
          'Only use these tags: <p>, <strong>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. Never use attributes, inline styles, scripts, or any other tags. ' +
          'Lead with a one-line headline answer wrapped in <p>, with the key number in <strong>. ' +
          'If the result has more than 3 items (e.g. a category breakdown), present them as an HTML table with sensible column headers instead of a run-on sentence, sorted by amount descending. ' +
          'Amounts are in PKR — write plain numbers with thousands separators and no currency symbol or code. Keep any prose outside the table brief.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
        },
        required: ['answer'],
      },
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error('The assistant did not return a response.');
  }

  const parsed = JSON.parse(content);

  return DOMPurify.sanitize(parsed.answer as string, {
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
