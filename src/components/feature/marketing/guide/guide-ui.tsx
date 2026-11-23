import React from 'react';
import { AlertTriangle, Info, Lightbulb, LucideIcon } from 'lucide-react';

/** One top-level guide section; `id` doubles as the URL anchor. */
export const GuideSection: React.FC<{
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, icon: Icon, eyebrow, title, intro, children }) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="border-ink/[0.06] scroll-mt-28 border-b py-14 first:pt-2 last:border-0 lg:scroll-mt-24"
  >
    <div className="flex items-center gap-3">
      <span className="text-brand-fg flex size-9 items-center justify-center rounded-xl bg-[#1a7f5a]/[0.08]">
        <Icon className="size-[18px]" />
      </span>
      <span className="inter text-brand-fg text-xs font-semibold tracking-[0.16em] uppercase">
        {eyebrow}
      </span>
    </div>
    <h2
      id={`${id}-title`}
      className="text-ink mt-4 text-[28px] leading-tight font-bold tracking-tight md:text-[32px]"
      style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
    >
      <a href={`#${id}`} className="group">
        {title}
        <span className="text-ink-faint ml-2 opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
    </h2>
    {intro && (
      <p className="inter text-ink-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
        {intro}
      </p>
    )}
    <div className="mt-8 space-y-8">{children}</div>
  </section>
);

/** Sub-heading inside a section. */
export const GuideH3: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h3 className="inter text-ink text-[17px] font-semibold">{children}</h3>;

export const P: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`inter text-ink-2 text-[15px] leading-relaxed ${className}`}>
    {children}
  </p>
);

/** Numbered how-to steps. */
export const Steps: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ol className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3.5">
        <span className="manrope bg-panel mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-[#34d399] dark:bg-[#1a7f5a]/25 dark:ring-1 dark:ring-[#34d399]/30">
          {i + 1}
        </span>
        <span className="inter text-ink-2 text-[15px] leading-relaxed">
          {item}
        </span>
      </li>
    ))}
  </ol>
);

/** Bulleted list. */
export const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2.5">
    {items.map((item, i) => (
      <li
        key={i}
        className="inter text-ink-2 flex gap-3 text-[15px] leading-relaxed"
      >
        <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#1a7f5a]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const CALLOUTS = {
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    box: 'border-[#1a7f5a]/20 bg-[#1a7f5a]/[0.05]',
    tone: 'text-brand-fg',
  },
  note: {
    icon: Info,
    label: 'Good to know',
    box: 'border-[#3b82f6]/20 bg-[#3b82f6]/[0.05]',
    tone: 'text-[#2563eb] dark:text-[#60a5fa]',
  },
  warn: {
    icon: AlertTriangle,
    label: 'Heads up',
    box: 'border-[#f59e0b]/25 bg-[#f59e0b]/[0.07]',
    tone: 'text-[#b45309] dark:text-[#fbbf24]',
  },
};

export const Callout: React.FC<{
  type?: keyof typeof CALLOUTS;
  title?: string;
  children: React.ReactNode;
}> = ({ type = 'tip', title, children }) => {
  const c = CALLOUTS[type];
  const Icon = c.icon;
  return (
    <aside className={`flex gap-3 rounded-xl border px-4 py-3.5 ${c.box}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${c.tone}`} />
      <div className="inter text-ink-2 text-sm leading-relaxed">
        <p className={`font-semibold ${c.tone}`}>{title ?? c.label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </aside>
  );
};

/** Keyboard key. */
export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="manrope border-ink/15 bg-surface text-ink inline-flex min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 py-0.5 text-[12px] font-semibold">
    {children}
  </kbd>
);

/** Inline reference to a UI element (button, menu, page). */
export const Ui: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inter bg-ink/[0.05] text-ink inline-flex items-center rounded-md px-1.5 py-0.5 text-[13px] font-semibold whitespace-nowrap">
    {children}
  </span>
);

/** Small two-column definition grid, e.g. for field descriptions. */
export const FieldTable: React.FC<{
  rows: [React.ReactNode, React.ReactNode][];
}> = ({ rows }) => (
  <div className="ring-ink/[0.07] overflow-hidden rounded-xl ring-1">
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i} className="border-ink/[0.05] border-b last:border-0">
            <th className="inter bg-surface-2 text-ink w-40 px-4 py-3 align-top font-semibold sm:w-48">
              {k}
            </th>
            <td className="inter text-ink-2 px-4 py-3 leading-relaxed">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
