import { COLOR_CODES } from '@/app/constants/app.constant';
import type { IStat } from '@/components/common/StatCard';

export interface ICashflowTotals {
  income: number;
  expense: number;
  investment: number;
}

/**
 * The Income / Expense / Investment / Free Cash stat cards shown on the
 * transaction, stats and user-details pages. Percentages are relative to
 * income.
 */
export const buildCashflowStats = (
  { income, expense, investment }: ICashflowTotals,
  hint?: string,
): IStat[] => {
  const base = income || 1;
  const freeCash = income - (expense + investment);

  return [
    {
      label: 'Income',
      value: income,
      percent: income ? 100 : 0,
      color: COLOR_CODES.income,
      hint,
    },
    {
      label: 'Expense',
      value: expense,
      percent: (expense / base) * 100,
      color: COLOR_CODES.expense,
      hint,
    },
    {
      label: 'Investment',
      value: investment,
      percent: (investment / base) * 100,
      color: COLOR_CODES.investment,
      hint,
    },
    {
      label: 'Free Cash',
      value: freeCash,
      percent: (freeCash / base) * 100,
      color: COLOR_CODES.freeCash,
      hint,
    },
  ];
};
