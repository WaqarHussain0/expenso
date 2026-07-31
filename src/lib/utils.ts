import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Compacts large amounts into a short suffixed form — 100k, 1.5M, 2.3B —
// anything below 1,00,000, or non-numeric (e.g. a percentage/label string),
// passes through as a normal locale-formatted string.
export function formatCompactAmount(value: number | string): string {
  const num = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(num)) return String(value);

  const abs = Math.abs(num);

  if (abs < 100000) return num.toLocaleString('en-US');

  const TIERS = [
    { threshold: 1_000_000_000, divisor: 1_000_000_000, suffix: 'B' },
    { threshold: 1_000_000, divisor: 1_000_000, suffix: 'M' },
    { threshold: 0, divisor: 1_000, suffix: 'k' },
  ];

  const tier = TIERS.find(t => abs >= t.threshold)!;
  const rounded = Math.round((num / tier.divisor) * 10) / 10;
  const formatted = Number.isInteger(rounded)
    ? rounded.toString()
    : rounded.toFixed(1);

  return `${formatted}${tier.suffix}`;
}
