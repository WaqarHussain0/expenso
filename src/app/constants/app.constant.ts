export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const MONTH_NAMES = [
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

export const COLOR_CODES = {
  income: '#10b981', // Emerald for income
  expense: '#f43f5e', // Rose for expense
  investment: '#f59e0b', // Amber for investment
  freeCash: '#3b82f6', // Blue for free cash
};

/** Cookie that remembers whether the desktop sidebar is collapsed */
export const SIDEBAR_COOKIE = 'expenso-sidebar-collapsed';
