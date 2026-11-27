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

/** Colours a category can use (the picker in the category dialog). */
export const CATEGORY_COLORS = [
  '#FF6B35',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#22C55E',
  '#14B8A6',
  '#84CC16',
  '#6366F1',
  '#06B6D4',
  '#EAB308',
  '#EC4899',
  '#795548',
  '#10B981',
  '#F97316',
];

/** Icon given to categories created without one (e.g. imported from CSV). */
export const DEFAULT_CATEGORY_ICON = 'Wallet';
