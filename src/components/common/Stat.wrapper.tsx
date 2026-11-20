import React from 'react';
import { LucideIcon } from 'lucide-react';
import StatCard from './StatCard';

interface IStatWrapperProps {
  stats: {
    label: string;
    value: number | string;
    /** Accent colour (hex) */
    color?: string;
    /** 0–100 — shows a progress ring like the dashboard cards */
    percent?: number;
    /** Shown instead of the ring when there's no meaningful percentage */
    icon?: LucideIcon;
    hint?: string;
  }[];
  className?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

const DEFAULT_COLOR = '#1a7f5a';

/** Grid of dashboard-style stat cards. */
const StatWrapper: React.FC<IStatWrapperProps> = ({
  stats,
  className = '',
  isLoading = false,
  skeletonCount = 4,
}) => {
  const items = isLoading
    ? Array.from({ length: skeletonCount }, (_, i) => ({
        label: `loading-${i}`,
        value: 0,
        color: DEFAULT_COLOR,
      }))
    : stats;

  return (
    <div
      className={`grid w-full grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 ${className}`}
    >
      {items.map(item => (
        <StatCard
          key={item.label}
          isLoading={isLoading}
          stat={{ ...item, color: item.color ?? DEFAULT_COLOR }}
        />
      ))}
    </div>
  );
};

export default StatWrapper;
