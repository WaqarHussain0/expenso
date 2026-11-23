import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart3,
  Car,
  Coffee,
  Gift,
  Home,
  Link2,
  ListPlus,
  PieChart,
  Plane,
  ShoppingCart,
  Sparkles,
  Tags,
  Wallet,
} from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

/* ───────────── small illustrations for each tile ───────────── */

const AllocationViz = () => (
  <div className="mt-auto space-y-3 pt-6">
    <div className="flex h-3 gap-1 overflow-hidden rounded-full">
      <span
        className="h-full rounded-full bg-[#f43f5e]"
        style={{ width: '54%' }}
      />
      <span
        className="h-full rounded-full bg-[#f59e0b]"
        style={{ width: '16%' }}
      />
      <span
        className="h-full rounded-full bg-[#3b82f6]"
        style={{ width: '30%' }}
      />
    </div>
    <div className="inter flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/55">
      <span>
        <span className="text-[#f43f5e]">●</span> Expenses 54%
      </span>
      <span>
        <span className="text-[#f59e0b]">●</span> Investments 16%
      </span>
      <span>
        <span className="text-[#3b82f6]">●</span> Free cash 30%
      </span>
    </div>
  </div>
);

const AmountViz = () => (
  <div className="mt-auto pt-6">
    <div className="bg-surface rounded-xl border border-[#1a7f5a]/30 p-3 shadow-[0_0_0_3px_rgba(26,127,90,0.08)]">
      <p className="inter text-ink-subtle text-[10px] font-semibold tracking-wider uppercase">
        Amount
      </p>
      <p className="manrope text-ink text-2xl font-bold">
        450<span className="text-brand-fg ml-0.5 animate-pulse">|</span>
      </p>
    </div>
    <div className="inter text-ink-muted mt-2 flex items-center gap-2 text-xs">
      <span className="flex size-5 items-center justify-center rounded-md bg-[#f97316]/10 text-[#f97316]">
        <Coffee className="size-3" />
      </span>
      Coffee · today
    </div>
  </div>
);

const CategoryViz = () => (
  <div className="mt-auto flex flex-wrap gap-2 pt-6">
    {[
      { icon: Home, label: 'Rent', color: '#10b981' },
      { icon: ShoppingCart, label: 'Groceries', color: '#f97316' },
      { icon: Car, label: 'Car', color: '#3b82f6' },
      { icon: Plane, label: 'Travel', color: '#8b5cf6' },
      { icon: Gift, label: 'Gifts', color: '#ec4899' },
      { icon: Wallet, label: 'Salary', color: '#14b8a6' },
    ].map(({ icon: Icon, label, color }) => (
      <span
        key={label}
        className="inter inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{ background: `${color}14`, color }}
      >
        <Icon className="size-3.5" />
        {label}
      </span>
    ))}
  </div>
);

const ChartViz = () => (
  <div className="mt-auto flex h-24 items-end gap-1.5 pt-6">
    {[38, 52, 44, 70, 58, 86, 64, 92, 74, 60, 80, 96].map((h, i) => (
      <span
        key={i}
        className="flex-1 rounded-t-md bg-gradient-to-t from-[#1a7f5a] to-[#34d399]"
        style={{ height: `${h}%`, opacity: 0.35 + (i / 12) * 0.65 }}
      />
    ))}
  </div>
);

const ShareViz = () => (
  <div className="mt-auto pt-6">
    <div className="inter border-ink/[0.08] bg-surface flex items-center gap-2 rounded-xl border px-3 py-2 text-xs">
      <Link2 className="text-brand-fg size-3.5 shrink-0" />
      <span className="text-ink-muted truncate">expenso…/share?m=a3f9…</span>
      <span className="ml-auto shrink-0 rounded-md bg-[#1a7f5a] px-2 py-0.5 text-[10px] font-medium text-white">
        Copy
      </span>
    </div>
    <p className="inter text-ink-subtle mt-2 text-xs">
      Read-only · no account needed to view
    </p>
  </div>
);

const ChatViz = () => (
  <div className="mt-auto space-y-2 pt-6">
    <p className="inter ml-auto w-fit rounded-2xl rounded-tr-md bg-[#1a7f5a] px-3 py-1.5 text-xs text-white">
      Biggest expense this year?
    </p>
    <p className="inter w-fit rounded-2xl rounded-tl-md bg-white/[0.07] px-3 py-1.5 text-xs text-white/85">
      <strong className="text-white">Rent</strong> — 540,000 so far.
    </p>
  </div>
);

/* ───────────── tiles ───────────── */

interface ITile {
  icon: React.ElementType;
  title: string;
  body: string;
  viz: React.ReactNode;
  href: string;
  className: string;
  dark?: boolean;
}

const TILES: ITile[] = [
  {
    icon: PieChart,
    title: 'A dashboard that answers “how am I doing?”',
    body: 'Your free cash up top, then how income splits into expenses and investments — income, expense, investment, and free-cash rings, plus your latest entries.',
    viz: <AllocationViz />,
    href: '/guide#dashboard',
    className: 'md:col-span-2',
    dark: true,
  },
  {
    icon: ListPlus,
    title: 'Log it in five seconds',
    body: 'Amount, category, done. Date defaults to today; a note is optional.',
    viz: <AmountViz />,
    href: '/guide#transactions',
    className: '',
  },
  {
    icon: Tags,
    title: 'Categories that fit your life',
    body: 'Create your own — Salary, Rent, SIP — each with a type, an icon, and a colour.',
    viz: <CategoryViz />,
    href: '/guide#categories',
    className: '',
  },
  {
    icon: BarChart3,
    title: 'Stats by month, year, or any range',
    body: 'Charts and breakdowns show where money went, how much you kept, and your top spending categories.',
    viz: <ChartViz />,
    href: '/guide#stats',
    className: '',
  },
  {
    icon: Link2,
    title: 'Share a report with a link',
    body: 'Send your accountant, partner, or future self a read-only view of any period.',
    viz: <ShareViz />,
    href: '/guide#sharing',
    className: '',
  },
  {
    icon: Sparkles,
    title: 'Ask your money anything',
    body: 'A read-only AI assistant answers questions about your own data in plain language.',
    viz: <ChatViz />,
    href: '/guide#assistant',
    className: 'md:col-span-2 lg:col-span-1',
    dark: true,
  },
];

const FeatureBento = () => (
  <section id="features" className="bg-canvas scroll-mt-20 py-24 md:py-32">
    <Container>
      <Reveal>
        <SectionHeader
          eyebrow="Features"
          lead="Everything you need to"
          accent="understand your money"
          description="No double-entry bookkeeping, no “debits and credits.” Money came in, money went out — here’s what’s left."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Reveal
              key={tile.title}
              delay={(i % 3) * 80}
              className={tile.className}
            >
              <Link
                href={tile.href}
                className={`group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                  tile.dark
                    ? 'bg-panel text-white shadow-[0_24px_48px_-24px_rgba(13,17,23,0.6)]'
                    : 'bg-surface ring-ink/[0.06] shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1 hover:shadow-[0_20px_40px_-20px_rgba(13,17,23,0.2)]'
                }`}
              >
                {tile.dark && (
                  <div className="fr-grid-bg pointer-events-none absolute inset-0" />
                )}
                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${
                      tile.dark
                        ? 'bg-white/[0.07] text-[#34d399]'
                        : 'text-brand-fg bg-[#1a7f5a]/[0.08]'
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight
                    className={`size-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      tile.dark
                        ? 'text-white/30 group-hover:text-[#34d399]'
                        : 'text-ink-faint group-hover:text-brand-fg'
                    }`}
                  />
                </div>
                <h3
                  className={`relative mt-5 text-lg leading-snug font-bold ${
                    tile.dark ? 'text-white' : 'text-ink'
                  }`}
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  {tile.title}
                </h3>
                <p
                  className={`inter relative mt-2 text-sm leading-relaxed ${
                    tile.dark ? 'text-white/55' : 'text-ink-muted'
                  }`}
                >
                  {tile.body}
                </p>
                <div className="relative flex flex-1 flex-col">{tile.viz}</div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Container>
  </section>
);

export default FeatureBento;
