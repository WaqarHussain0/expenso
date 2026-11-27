import { CategoryTypeEnum } from '@/types/category.type';
import { parseCsv, toCsv, unguardCsvCell } from './csv.util';

/**
 * Category CSV format, shared by the template, export and import. The browser
 * validates with it before uploading and the server validates again with the
 * same rules (a server action can be called with anything).
 */

/** Columns, in template order. Exactly these — no more, no fewer. */
export const CATEGORY_CSV_COLUMNS = ['Name', 'Type', 'Color'] as const;

export const CATEGORY_IMPORT_MAX_ROWS = 500;
export const CATEGORY_IMPORT_MAX_BYTES = 512 * 1024;
export const CATEGORY_NAME_MAX_LENGTH = 50;

const CATEGORY_TYPES = Object.values(CategoryTypeEnum) as string[];
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Errors shown at most; the rest are summarised as "…and N more" */
const MAX_ERRORS = 15;

export interface ICategoryCsvRow {
  /** Line number in the file (header is line 1), for messages */
  line: number;
  /** Lowercased and trimmed, as categories are stored */
  name: string;
  type: CategoryTypeEnum;
  /** "#RRGGBB" uppercase, or undefined when the cell was blank */
  color?: string;
}

export interface ICategoryCsvParseResult {
  rows: ICategoryCsvRow[];
  errors: string[];
}

const normaliseColor = (value: string) => {
  const hex = value.slice(1);
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map(ch => ch + ch)
          .join('')
      : hex;
  return `#${full.toUpperCase()}`;
};

/** "monthly rent" → "Monthly Rent" (names are stored lowercase) */
const titleCase = (value: string) =>
  value.replace(/(^|\s)\p{L}/gu, ch => ch.toUpperCase());

/** Header-only template for users to fill in. */
export const buildCategoryTemplateCsv = () =>
  toCsv([[...CATEGORY_CSV_COLUMNS]]);

/** All categories in the import format, so an export can be re-imported. */
export const buildCategoriesCsv = (
  categories: { name: string; type: string; color?: string }[],
) =>
  toCsv([
    [...CATEGORY_CSV_COLUMNS],
    ...categories.map(c => [titleCase(c.name), c.type, c.color ?? '']),
  ]);

/**
 * Validate a category CSV. Returns the clean rows, or the problems found:
 * - header must have exactly Name, Type, Color (any order, any case)
 * - every row must have exactly that many values
 * - Name required (≤ 50 chars), Type one of income / expense / investment,
 *   Color blank or a hex colour like #22C55E
 * - no category (same name + type) twice in the file
 */
export const parseCategoryCsv = (text: string): ICategoryCsvParseResult => {
  const errors: string[] = [];
  const addError = (message: string) => errors.push(message);

  if (text.length > CATEGORY_IMPORT_MAX_BYTES) {
    return {
      rows: [],
      errors: [
        `The file is too large (max ${CATEGORY_IMPORT_MAX_BYTES / 1024} KB).`,
      ],
    };
  }

  const table = parseCsv(text);
  // Ignore completely blank lines (e.g. trailing ones left by Excel)
  const lines = table
    .map((cells, index) => ({ cells, line: index + 1 }))
    .filter(({ cells }) => cells.some(cell => cell.trim() !== ''));

  if (lines.length === 0) {
    return { rows: [], errors: ['The file is empty.'] };
  }

  // ── Header ──────────────────────────────────────────────────────
  const header = lines[0].cells.map(cell => cell.trim().toLowerCase());
  const expected = CATEGORY_CSV_COLUMNS.map(col => col.toLowerCase());

  const missing = CATEGORY_CSV_COLUMNS.filter(
    col => !header.includes(col.toLowerCase()),
  );
  const extra = lines[0].cells
    .map(cell => cell.trim())
    .filter(cell => !expected.includes(cell.toLowerCase()));
  const repeated = CATEGORY_CSV_COLUMNS.filter(
    col => header.filter(h => h === col.toLowerCase()).length > 1,
  );

  if (missing.length) addError(`Missing column(s): ${missing.join(', ')}.`);
  if (extra.length) {
    addError(
      `Unexpected column(s): ${extra.map(c => `"${c || '(blank)'}"`).join(', ')}. Only ${CATEGORY_CSV_COLUMNS.join(', ')} are allowed.`,
    );
  }
  if (repeated.length) addError(`Repeated column(s): ${repeated.join(', ')}.`);

  if (errors.length) return { rows: [], errors };

  const col = {
    name: header.indexOf('name'),
    type: header.indexOf('type'),
    color: header.indexOf('color'),
  };

  // ── Rows ────────────────────────────────────────────────────────
  const dataLines = lines.slice(1);

  if (dataLines.length === 0) {
    return {
      rows: [],
      errors: ['The file has no categories under the header.'],
    };
  }
  if (dataLines.length > CATEGORY_IMPORT_MAX_ROWS) {
    return {
      rows: [],
      errors: [
        `Too many rows (${dataLines.length}). Import up to ${CATEGORY_IMPORT_MAX_ROWS} categories at a time.`,
      ],
    };
  }

  const rows: ICategoryCsvRow[] = [];
  const seen = new Map<string, number>();

  for (const { cells, line } of dataLines) {
    const rowErrors: string[] = [];

    if (cells.length !== header.length) {
      addError(
        `Row ${line}: has ${cells.length} value(s), expected ${header.length} (${CATEGORY_CSV_COLUMNS.join(', ')}).`,
      );
      continue;
    }

    const name = unguardCsvCell(cells[col.name].trim()).replace(/\s+/g, ' ');
    const type = cells[col.type].trim().toLowerCase();
    const color = cells[col.color].trim();

    if (!name) rowErrors.push('Name is required');
    else if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      rowErrors.push(
        `Name is longer than ${CATEGORY_NAME_MAX_LENGTH} characters`,
      );
    }

    if (!type) rowErrors.push('Type is required');
    else if (!CATEGORY_TYPES.includes(type)) {
      rowErrors.push(
        `Type "${cells[col.type].trim()}" must be one of ${CATEGORY_TYPES.join(', ')}`,
      );
    }

    if (color && !HEX_COLOR.test(color)) {
      rowErrors.push(`Color "${color}" must be a hex colour like #22C55E`);
    }

    if (rowErrors.length) {
      addError(`Row ${line}: ${rowErrors.join('; ')}.`);
      continue;
    }

    const key = `${name.toLowerCase()}|${type}`;
    const firstLine = seen.get(key);

    if (firstLine) {
      addError(
        `Row ${line}: "${name}" (${type}) is a duplicate of row ${firstLine}.`,
      );
      continue;
    }

    seen.set(key, line);
    rows.push({
      line,
      name: name.toLowerCase(),
      type: type as CategoryTypeEnum,
      color: color ? normaliseColor(color) : undefined,
    });
  }

  if (errors.length > MAX_ERRORS) {
    const more = errors.length - MAX_ERRORS;
    errors.splice(MAX_ERRORS, errors.length, `…and ${more} more problem(s).`);
  }

  return errors.length ? { rows: [], errors } : { rows, errors };
};
