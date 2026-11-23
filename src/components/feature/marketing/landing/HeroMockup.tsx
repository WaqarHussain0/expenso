import { Fuel, Home, TrendingUp, Utensils } from 'lucide-react';

/**
 * Illustrative product preview built in HTML/CSS (not a screenshot), so it's
 * crisp at any size and costs no image download. Figures are sample data.
 */

const RINGS = [
  { label: 'Income', value: '180k', pct: 100, color: '#10b981' },
  { label: 'Expense', value: '96.4k', pct: 54, color: '#f43f5e' },
  { label: 'Invested', value: '30k', pct: 17, color: '#f59e0b' },
];

const ROWS = [
  {
    icon: Home,
    name: 'Rent',
    note: 'November',
    amount: '−45,000',
    color: '#10b981',
  },
  {
    icon: Utensils,
    name: 'Groceries',
    note: 'Weekly shop',
    amount: '−8,450',
    color: '#f97316',
  },
  {
    icon: Fuel,
    name: 'Fuel',
    note: 'Full tank',
    amount: '−6,200',
    color: '#ef4444',
  },
  {
    icon: TrendingUp,
    name: 'Salary',
    note: 'Monthly pay',
    amount: '+180,000',
    color: '#3b82f6',
    income: true,
  },
];

const Ring = ({ pct, color }: { pct: number; color: string }) => {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" className="-rotate-90" aria-hidden>
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="var(--ring-track)"
        strokeWidth="4"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
      />
    </svg>
  );
};

const HeroMockup = () => (
  <div className="relative" aria-hidden>
    {/* glow behind the frame */}
    <div className="absolute -inset-6 rounded-[32px] bg-[#34d399]/10 blur-3xl" />

    <div className="bg-canvas relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
      {/* window chrome */}
      <div className="border-ink/[0.06] bg-surface flex items-center gap-1.5 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="inter bg-canvas text-ink-subtle ml-3 truncate rounded-md px-3 py-0.5 text-[10px]">
          expenso · dashboard
        </span>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {/* free-cash card */}
        <div className="bg-panel relative overflow-hidden rounded-xl p-4 text-white">
          <div className="fr-grid-bg absolute inset-0" />
          <div className="relative">
            <p className="inter text-[10px] text-white/50">Your free cash</p>
            <p className="manrope mt-1 text-2xl font-bold tracking-tight tabular-nums">
              53,600
            </p>
            <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
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
            <div className="inter mt-2 flex gap-3 text-[9px] text-white/50">
              <span>● Expenses 54%</span>
              <span>● Invested 16%</span>
              <span>● Free 30%</span>
            </div>
          </div>
        </div>

        {/* stat rings */}
        <div className="grid grid-cols-3 gap-2">
          {RINGS.map(ring => (
            <div
              key={ring.label}
              className="bg-surface ring-ink/[0.06] flex items-center justify-between rounded-xl p-2.5 ring-1"
            >
              <div>
                <p className="inter text-ink-subtle text-[9px]">{ring.label}</p>
                <p className="manrope text-ink text-sm font-bold">
                  {ring.value}
                </p>
              </div>
              <Ring pct={ring.pct} color={ring.color} />
            </div>
          ))}
        </div>

        {/* recent rows */}
        <div className="bg-surface ring-ink/[0.06] overflow-hidden rounded-xl ring-1">
          <p className="inter border-ink/[0.05] bg-surface-2 text-ink-subtle border-b px-3 py-1.5 text-[9px] font-semibold tracking-wider uppercase">
            Today
          </p>
          {ROWS.map(({ icon: Icon, name, note, amount, color, income }) => (
            <div
              key={name}
              className="border-ink/[0.04] flex items-center gap-2.5 border-b px-3 py-2 last:border-0"
            >
              <span
                className="flex size-7 items-center justify-center rounded-lg"
                style={{ background: `${color}1a`, color }}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="inter text-ink text-[11px] font-medium">{name}</p>
                <p className="inter text-ink-subtle text-[9px]">{note}</p>
              </div>
              <span
                className={`manrope text-[11px] font-bold tabular-nums ${
                  income ? 'text-success' : 'text-ink'
                }`}
              >
                {amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* floating assistant bubble */}
    <div className="animate-float bg-panel/95 absolute -bottom-6 -left-4 hidden w-56 rounded-2xl border border-white/10 p-3 shadow-2xl backdrop-blur sm:block">
      <p className="inter text-[10px] text-white/50">You asked</p>
      <p className="inter text-xs text-white">
        &ldquo;How much did I spend on food?&rdquo;
      </p>
      <p className="inter mt-2 text-[11px] text-[#34d399]">
        <strong className="text-white">8,450</strong> on groceries this month.
      </p>
    </div>
  </div>
);

export default HeroMockup;
