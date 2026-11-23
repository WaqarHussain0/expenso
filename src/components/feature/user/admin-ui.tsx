import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/*
 * Small presentational building blocks shared by the admin Users pages.
 * No hooks — usable from server and client components alike.
 */

/** Card with a title row (and optional description / right-side action). */
export const Panel: React.FC<{
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}> = ({ title, description, action, children, className, bodyClassName }) => (
  <Card className={cn('gap-0 py-0', className)}>
    <div className="flex items-start justify-between gap-3 px-4 pt-4 md:px-5 md:pt-5">
      <div className="min-w-0">
        <h2 className="inter text-ink text-sm font-semibold">{title}</h2>
        {description && (
          <p className="inter text-ink-subtle mt-0.5 text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
    <div className={cn('p-4 md:p-5', bodyClassName)}>{children}</div>
  </Card>
);

/** Label + value pair with an icon, for fact lists. */
export const Fact: React.FC<{
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}> = ({ icon: Icon, label, value, hint }) => (
  <div className="flex min-w-0 items-start gap-3">
    <span className="bg-ink/[0.04] text-ink-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
      <Icon className="size-4" />
    </span>
    <div className="min-w-0">
      <p className="inter text-ink-subtle text-[11px] font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="inter text-ink mt-0.5 truncate text-sm font-medium">
        {value}
      </div>
      {hint && (
        <p className="inter text-ink-subtle mt-0.5 truncate text-xs">{hint}</p>
      )}
    </div>
  </div>
);

type PillTone = 'success' | 'muted' | 'brand' | 'warning' | 'info' | 'danger';

const PILL_TONES: Record<PillTone, string> = {
  success: 'bg-success/10 text-success',
  muted: 'bg-ink/[0.05] text-ink-subtle',
  brand: 'bg-[#1a7f5a]/10 text-brand-fg',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

export const Pill: React.FC<{
  tone?: PillTone;
  dot?: boolean;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}> = ({ tone = 'muted', dot, icon: Icon, children, className }) => (
  <span
    className={cn(
      'inter inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
      PILL_TONES[tone],
      className,
    )}
  >
    {dot && <span className="size-1.5 rounded-full bg-current" />}
    {Icon && <Icon className="size-3" />}
    {children}
  </span>
);

export const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <Pill tone={active ? 'success' : 'muted'} dot>
    {active ? 'Active' : 'Deactivated'}
  </Pill>
);

export const AdminPill = () => (
  <Pill tone="brand" icon={ShieldCheck} className="uppercase">
    Admin
  </Pill>
);

/** Google "G" mark (lucide has no brand icons). */
export const GoogleMark: React.FC<{ className?: string }> = ({
  className = 'size-3',
}) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

export const SignInPill: React.FC<{ method: 'password' | 'google' }> = ({
  method,
}) =>
  method === 'google' ? (
    <span className="inter border-ink/[0.08] text-ink-muted inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap">
      <GoogleMark />
      Google
    </span>
  ) : (
    <span className="inter border-ink/[0.08] text-ink-muted inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap">
      <Mail className="size-3" />
      Email
    </span>
  );

export const AiKeyPill: React.FC<{ provider: string }> = ({ provider }) => (
  <Pill tone="info" icon={KeyRound} className="capitalize">
    {provider}
  </Pill>
);

export interface ISplitSegment {
  label: string;
  value: number;
  color: string;
}

/** Horizontal stacked bar with a legend — e.g. Google vs email sign-ins. */
export const SplitBar: React.FC<{ segments: ISplitSegment[] }> = ({
  segments,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);

  return (
    <div>
      <div
        className="bg-ink/[0.05] flex h-2.5 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={segments
          .map(s => `${s.label}: ${s.value} (${pct(s.value)}%)`)
          .join(', ')}
      >
        {total > 0 &&
          segments.map(s =>
            s.value > 0 ? (
              <span
                key={s.label}
                className="h-full transition-[width] duration-700 first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(s.value / total) * 100}%`,
                  backgroundColor: s.color,
                }}
              />
            ) : null,
          )}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.map(s => (
          <li key={s.label} className="inter flex items-center gap-2 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-ink-muted truncate">{s.label}</span>
            <span className="text-ink ml-auto font-semibold tabular-nums">
              {s.value}
              <span className="text-ink-subtle ml-1 font-normal">
                {pct(s.value)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** "label ........ value / total" row with a thin progress bar. */
export const RatioRow: React.FC<{
  label: string;
  value: number;
  total: number;
  color?: string;
  hint?: string;
}> = ({ label, value, total, color = '#1a7f5a', hint }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="inter flex items-baseline justify-between gap-3 text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="text-ink font-semibold tabular-nums">
          {value}
          <span className="text-ink-subtle font-normal">
            {' '}
            / {total} · {pct}%
          </span>
        </span>
      </div>
      <div className="bg-ink/[0.05] mt-1.5 h-1.5 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {hint && <p className="inter text-ink-subtle mt-1 text-[11px]">{hint}</p>}
    </div>
  );
};

/**
 * Icon stat tile with the same look as StatCard's icon variant, but with no
 * client code — so server components can pass it an icon component.
 */
export const KpiTile: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  color: string;
  hint?: string;
}> = ({ label, value, icon: Icon, color, hint }) => (
  <Card className="group relative gap-0 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(13,17,23,0.18)] md:p-5">
    <div
      className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.14]"
      style={{ background: color }}
    />
    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: color, boxShadow: `0 0 0 3px ${color}22` }}
          />
          <span className="inter text-ink-muted truncate text-xs font-medium">
            {label}
          </span>
        </div>
        <p className="manrope text-ink mt-3 truncate text-2xl font-bold tracking-tight tabular-nums md:text-[26px]">
          {value}
        </p>
        {hint && (
          <p className="inter text-ink-subtle mt-0.5 truncate text-[11px]">
            {hint}
          </p>
        )}
      </div>
      <span
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: `${color}14`, color }}
      >
        <Icon className="size-6" />
      </span>
    </div>
  </Card>
);
