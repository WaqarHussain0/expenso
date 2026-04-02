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
  income: '#4CAF50', // Green for income
  expense: '#F44336', // Red for expense
  investment: '#FF9800', // Blue for investment
  freeCash: '#2196F3', // Orange for free cash
};
