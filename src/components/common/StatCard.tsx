'use client';

import React, { memo, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';
import Skeleton from 'react-loading-skeleton';
import { formatCompactAmount } from '@/lib/utils';

export interface IStat {
  label: string;
  color: string;
  value: number | string;
  /** 0–100. When set, a progress ring is shown on the right. */
  percent?: number;
  /** Shown on the right instead of a ring when `percent` is not set. */
  icon?: LucideIcon;
  /** Small caption under the value, e.g. "This month". */
  hint?: string;
}

interface IStatCardProps {
  isLoading?: boolean;
  stat: IStat;
}

const RING_SIZE = 64;
const STROKE = 6;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ProgressRing: React.FC<{ percent: number; color: string }> = ({
  percent,
  color,
}) => {
  // Animate the ring from 0 → value after mount
  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div
      className="relative shrink-0"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - drawn / 100)}
          style={{
            transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <span className="manrope text-ink absolute inset-0 flex items-center justify-center text-[13px] font-bold tabular-nums">
        {percent.toFixed(0)}%
      </span>
    </div>
  );
};

const StatCard: React.FC<IStatCardProps> = ({ isLoading = false, stat }) => {
  if (isLoading) {
    return (
      <Card className="gap-0 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Skeleton width={90} height={12} />
            <div className="mt-3">
              <Skeleton width={110} height={26} />
            </div>
          </div>
          <Skeleton circle width={RING_SIZE} height={RING_SIZE} />
        </div>
      </Card>
    );
  }

  const hasPercent = typeof stat.percent === 'number';
  const safePercent = Math.max(0, Math.min(100, stat.percent || 0));
  const Icon = stat.icon;

  return (
    <Card className="group relative gap-0 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(13,17,23,0.18)] md:p-5">
      {/* colour wash */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.14]"
        style={{ background: stat.color }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                background: stat.color,
                boxShadow: `0 0 0 3px ${stat.color}22`,
              }}
            />
            <span className="inter text-ink-muted truncate text-xs font-medium">
              {stat.label}
            </span>
          </div>

          <p className="manrope text-ink mt-3 truncate text-2xl font-bold tracking-tight capitalize tabular-nums md:text-[26px]">
            {typeof stat.value === 'number'
              ? formatCompactAmount(stat.value)
              : stat.value}
          </p>
          {stat.hint && (
            <p className="inter text-ink-subtle mt-0.5 truncate text-[11px]">
              {stat.hint}
            </p>
          )}
        </div>

        {hasPercent ? (
          <ProgressRing percent={safePercent} color={stat.color} />
        ) : (
          Icon && (
            <span
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: `${stat.color}14`, color: stat.color }}
            >
              <Icon className="size-6" />
            </span>
          )
        )}
      </div>
    </Card>
  );
};

export default memo(StatCard);
