import React from 'react';

/** Max-width page column used by every marketing section. */
export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>
    {children}
  </div>
);

/** Small pill label above a section title. */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}> = ({ children, dark = false, className = '' }) => (
  <span
    className={`inter inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase ${
      dark
        ? 'border border-white/10 bg-white/[0.04] text-[#34d399]'
        : 'text-brand-fg border border-[#1a7f5a]/15 bg-[#1a7f5a]/[0.06]'
    } ${className}`}
  >
    <span
      className="animate-pulse-dot size-1.5 rounded-full bg-[#34d399]"
      style={{ boxShadow: '0 0 8px #34d399' }}
    />
    {children}
  </span>
);

/** Serif section heading with an italic, gradient-coloured accent phrase. */
export const SectionTitle: React.FC<{
  lead: React.ReactNode;
  accent?: React.ReactNode;
  dark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}> = ({ lead, accent, dark = false, as: Tag = 'h2', className = '' }) => (
  <Tag
    className={`text-[clamp(30px,4.2vw,48px)] leading-[1.08] font-bold tracking-tight ${
      dark ? 'text-[#f4f4f4]' : 'text-ink'
    } ${className}`}
    style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
  >
    {lead}
    {accent && (
      <>
        {' '}
        <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
          {accent}
        </em>
      </>
    )}
  </Tag>
);

/** Eyebrow + title + description, centred or left-aligned. */
export const SectionHeader: React.FC<{
  eyebrow: string;
  lead: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  dark?: boolean;
  align?: 'center' | 'left';
  className?: string;
}> = ({
  eyebrow,
  lead,
  accent,
  description,
  dark = false,
  align = 'center',
  className = '',
}) => (
  <div
    className={`flex flex-col gap-4 ${
      align === 'center' ? 'items-center text-center' : 'items-start'
    } ${className}`}
  >
    <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
    <SectionTitle lead={lead} accent={accent} dark={dark} />
    {description && (
      <p
        className={`inter max-w-2xl text-[15px] leading-relaxed ${
          dark ? 'text-white/55' : 'text-ink-muted'
        }`}
      >
        {description}
      </p>
    )}
  </div>
);

/** Dark band background shared by hero/CTA sections. */
export const DarkBackdrop: React.FC<{ glow?: 'top' | 'center' }> = ({
  glow = 'top',
}) => (
  <>
    <div className="fr-grid-bg pointer-events-none absolute inset-0" />
    <div
      className={`pointer-events-none absolute left-1/2 h-[520px] w-[900px] -translate-x-1/2 ${
        glow === 'top' ? '-top-56' : 'top-1/2 -translate-y-1/2'
      }`}
      style={{
        background:
          'radial-gradient(ellipse, rgba(46,168,120,.20) 0%, transparent 65%)',
      }}
    />
  </>
);
