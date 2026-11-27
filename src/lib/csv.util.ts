/**
 * Minimal RFC 4180 CSV helpers shared by imports and exports (browser and
 * server). Fields may be quoted; quotes inside are doubled ("").
 */

/** Byte-order mark: makes Excel open the file as UTF-8. */
export const CSV_BOM = '﻿';

/**
 * Parse CSV text into rows of cells. Handles quoted fields (with commas,
 * quotes and line breaks inside), CRLF/LF line endings and a leading BOM.
 */
export const parseCsv = (text: string): string[][] => {
  const input = text.startsWith(CSV_BOM) ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"' && cell === '') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  // Last line (files don't always end with a newline)
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
};

/**
 * Quote a cell when needed and neutralise spreadsheet formulas: a text cell
 * starting with = + - @ (or tab/CR) would run as a formula when opened.
 */
export const csvCell = (value: string | number | null | undefined) => {
  let text = String(value ?? '');

  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return /[",\r\n]/.test(text) || text !== text.trim()
    ? `"${text.replace(/"/g, '""')}"`
    : text;
};

/**
 * Undo csvCell's formula guard on import: "'=x" → "=x". Only strips the
 * apostrophe when it precedes a formula character.
 */
export const unguardCsvCell = (value: string) =>
  /^'[=+\-@]/.test(value) ? value.slice(1) : value;

/** Build a CSV file (with BOM, CRLF line endings) from rows of cells. */
export const toCsv = (rows: (string | number | null | undefined)[][]) =>
  `${CSV_BOM}${rows.map(row => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
