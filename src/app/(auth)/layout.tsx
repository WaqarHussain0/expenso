import Link from 'next/link';
import Image from 'next/image';
import { Lock, Sparkles, Timer } from 'lucide-react';
import PAGE_ROUTES from '../constants/page-routes.constant';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import AuroraGlow from '@/components/feature/landing-page/AuroraGlow';

const BREAKDOWN = [
  { label: 'Rent', amount: '25,000', width: '78%', color: '#1a7f5a' },
  { label: 'Groceries', amount: '14,500', width: '52%', color: '#2ea878' },
  { label: 'Fuel', amount: '9,200', width: '34%', color: '#34d399' },
  { label: 'SIP Investment', amount: '6,800', width: '24%', color: '#6ee7b7' },
];

const TRUST_POINTS = [
  { icon: Sparkles, label: 'Free forever' },
  { icon: Lock, label: 'Private by default' },
  { icon: Timer, label: '2-minute setup' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-canvas flex min-h-screen w-full flex-col lg:h-screen lg:flex-row">
      {/* ───────────── Brand / showcase panel ───────────── */}
      <aside className="bg-panel relative hidden overflow-hidden lg:flex lg:w-[46%] xl:w-1/2">
        <div className="fr-grid-bg pointer-events-none absolute inset-0" />
        <AuroraGlow />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[520px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(46,168,120,.14) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          {/* Logo */}
          <Link href={PAGE_ROUTES.home} className="w-fit">
            <div className="relative h-[40px] w-[120px]">
              <Image
                src="/light-logo.png"
                alt="Expenso"
                fill
                className="object-contain object-left"
                priority
                fetchPriority="high"
              />
            </div>
          </Link>

          {/* Pitch + preview */}
          <div className="page-fade max-w-[520px]">
            <div className="mb-5 inline-flex items-center gap-2">
              <span
                className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 8px #4ade80' }}
              />
              <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
                Expense · Income · Investments
              </span>
            </div>

            <h2
              className="mb-4 text-[clamp(34px,3.4vw,48px)] leading-[1.1] font-bold text-[#f4f4f4]"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Know exactly where
              <br />
              <em
                className="text-gradient-green"
                style={{ fontStyle: 'italic' }}
              >
                every rupee goes
              </em>
            </h2>

            <p className="inter text-ink-subtle mb-10 max-w-[440px] text-[14px] leading-relaxed">
              Log a transaction in seconds, see your month at a glance, and
              finally answer &ldquo;where did my salary go?&rdquo;
            </p>

            {/* Preview card */}
            <div className="animate-float rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <p className="text-ink-subtle mb-5 text-[10px] font-semibold tracking-[0.18em] uppercase">
                This month&rsquo;s breakdown
              </p>
              <div className="space-y-3.5">
                {BREAKDOWN.map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: row.color }}
                    />
                    <span className="inter w-28 shrink-0 text-[13px] text-[#c9ced6]">
                      {row.label}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: row.width, background: row.color }}
                      />
                    </div>
                    <span className="inter w-14 shrink-0 text-right text-[13px] text-[#e5e7eb] tabular-nums">
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-white/[0.06] pt-4">
                <span className="inter text-ink-subtle text-xs">
                  Total spent
                </span>
                <span
                  className="text-2xl text-[#f4f4f4] tabular-nums"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  55,500
                </span>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inter text-ink-subtle inline-flex items-center gap-2 text-xs"
              >
                <Icon size={14} className="text-[#34d399]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ───────────── Form panel ───────────── */}
      <main className="relative flex w-full flex-1 flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
        <ThemeToggle className="absolute top-4 right-4 z-20" />
        {/* soft background accents */}

        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-center px-5 pt-5 md:px-4 md:py-6 lg:hidden">
          <Link href={PAGE_ROUTES.home} className="lg:invisible">
            <BrandLogo className="h-[34px] w-[104px]" sizes="104px" priority />
          </Link>
        </header>

        {/* Form */}
        <div className="z-10 flex w-full flex-1 items-center justify-center">
          <div className="w-[90%] md:w-[80%]">{children}</div>
        </div>

        <footer className="inter z-10 text-center text-xs text-[#9aa1ad]">
          © {new Date().getFullYear()} Expenso · Your data stays yours.
        </footer>
      </main>
    </div>
  );
}
