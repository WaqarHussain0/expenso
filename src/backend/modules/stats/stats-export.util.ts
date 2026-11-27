import { toCsv } from '@/lib/csv.util';
import { CategoryTypeEnum } from '../category/entities/category.entity';

export enum StatsExportFilterEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export interface IStatsExportFilterInput {
  type?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  year?: unknown;
}

export interface IStatsExportRange {
  type: StatsExportFilterEnum;
  start: Date;
  end: Date;
  /** Human label for the period, e.g. "November 2026" */
  label: string;
  /** File name for the attachment, e.g. "expenso-2026-11.csv" */
  fileName: string;
}

export interface IStatsExportRow {
  date: Date;
  type?: CategoryTypeEnum;
  category: string;
  amount: number;
  note: string;
}

/** A bad filter from the client; the message is safe to show. */
export class StatsExportFilterError extends Error {
  name = 'StatsExportFilterError';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse "YYYY-MM-DD" (as sent by the stats page) or throw. */
const parseInputDate = (value: unknown, label: string) => {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw new StatsExportFilterError(`A valid ${label} is required.`);
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new StatsExportFilterError(`A valid ${label} is required.`);
  }

  return date;
};

const toIsoDay = (d: Date) => d.toISOString().slice(0, 10);

const shortDay = (d: Date) =>
  `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;

/**
 * Validates the stats page filter and turns it into the exact date range the
 * stats views query, so the export holds the same transactions as the screen:
 * - month / custom: startDate 00:00 → endDate 23:59:59.999
 * - year: 1 Jan → 31 Dec of that year
 */
export const resolveStatsExportRange = (
  filter: IStatsExportFilterInput,
): IStatsExportRange => {
  const { type } = filter;

  switch (type) {
    case StatsExportFilterEnum.YEAR: {
      const year = Number(filter.year);

      if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        throw new StatsExportFilterError('A valid year is required.');
      }

      return {
        type,
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31, 23, 59, 59, 999),
        label: String(year),
        fileName: `expenso-${year}.csv`,
      };
    }

    case StatsExportFilterEnum.MONTH:
    case StatsExportFilterEnum.CUSTOM: {
      const start = parseInputDate(filter.startDate, 'start date');
      const end = parseInputDate(filter.endDate, 'end date');

      if (start > end) {
        throw new StatsExportFilterError(
          'The start date must be on or before the end date.',
        );
      }

      const fromDay = toIsoDay(start);
      const toDay = toIsoDay(end);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      if (type === StatsExportFilterEnum.MONTH) {
        const monthStart = new Date(fromDay);
        return {
          type,
          start,
          end,
          label: `${MONTHS[monthStart.getUTCMonth()]} ${monthStart.getUTCFullYear()}`,
          fileName: `expenso-${fromDay.slice(0, 7)}.csv`,
        };
      }

      return {
        type,
        start,
        end,
        label: `${shortDay(new Date(fromDay))} – ${shortDay(new Date(toDay))}`,
        fileName: `expenso-${fromDay}_to_${toDay}.csv`,
      };
    }

    default:
      throw new StatsExportFilterError(
        'Choose a month, year or custom range to export.',
      );
  }
};

/* -------------------------------------------------------------------------- */
/*                                CSV template                                 */
/* -------------------------------------------------------------------------- */

/**
 * Columns of the export, in order. One row per transaction so the file sorts,
 * filters and pivots cleanly in Excel / Google Sheets; totals go in the email.
 */
export const STATS_EXPORT_COLUMNS = [
  'Date',
  'Type',
  'Category',
  'Amount',
  'Note',
] as const;

const TYPE_LABELS: Record<CategoryTypeEnum, string> = {
  [CategoryTypeEnum.INCOME]: 'Income',
  [CategoryTypeEnum.EXPENSE]: 'Expense',
  [CategoryTypeEnum.INVESTMENT]: 'Investment',
};

/** "monthly rent" → "Monthly Rent" (category names are stored lowercase) */
const titleCase = (value: string) =>
  value.replace(/\b\p{L}/gu, ch => ch.toUpperCase());

/** Build the CSV file (UTF-8 with BOM so Excel shows non-English text right). */
export const buildStatsExportCsv = (rows: IStatsExportRow[]) =>
  toCsv([
    [...STATS_EXPORT_COLUMNS],
    ...rows.map(row => [
      toIsoDay(row.date),
      row.type ? TYPE_LABELS[row.type] : '',
      titleCase(row.category),
      row.amount,
      row.note.replace(/\r?\n/g, ' '),
    ]),
  ]);

/** Totals per type for the email summary. */
export const summariseStatsExport = (rows: IStatsExportRow[]) => {
  const totals = { income: 0, expense: 0, investment: 0 };

  for (const row of rows) {
    if (row.type && row.type in totals) totals[row.type] += row.amount;
  }

  return {
    ...totals,
    freeCash: totals.income - (totals.expense + totals.investment),
    count: rows.length,
  };
};
