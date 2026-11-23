import Link from 'next/link';
import {
  Briefcase,
  GraduationCap,
  Home,
  Laptop,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

// Each card describes using existing features (categories, transactions,
// dashboard, stats, sharing, assistant) — no claims about things the app
// doesn't do.
const USE_CASES = [
  {
    icon: Wallet,
    title: 'Salary & monthly budget',
    body: 'Log your salary when it lands, then every bill and grocery run. The dashboard shows your free cash for the month, so you know what’s left before the 20th — not after.',
    href: '/guide#dashboard',
  },
  {
    icon: Laptop,
    title: 'Freelancers & side income',
    body: 'Irregular income? Give each client or platform its own income category and see exactly which months were good, which were lean, and how the year adds up.',
    href: '/guide#stats',
  },
  {
    icon: Home,
    title: 'Household & family expenses',
    body: 'Track rent, utilities, school fees and groceries by category. Share a monthly report link with your partner instead of explaining a spreadsheet.',
    href: '/guide#sharing',
  },
  {
    icon: PiggyBank,
    title: 'Savings & investments',
    body: 'Mark SIPs, mutual funds, gold or stock purchases as investments, so money you saved isn’t mistaken for money you spent — and watch the total grow.',
    href: '/guide#categories',
  },
  {
    icon: GraduationCap,
    title: 'Students & first jobs',
    body: 'Building the habit early is the whole trick. Pocket money or a first paycheck — a few seconds per entry and you’ll see your spending patterns within weeks.',
    href: '/guide#getting-started',
  },
  {
    icon: Briefcase,
    title: 'Yearly reviews & tax season',
    body: 'Switch to the yearly view for month-by-month income, expenses and investments, or ask the AI assistant: “What did I spend on health this year?”',
    href: '/guide#assistant',
  },
];

const UseCases = () => (
  <section
    id="use-cases"
    aria-labelledby="use-cases-title"
    className="bg-surface-2 scroll-mt-20 py-24 md:py-32"
  >
    <Container>
      <Reveal>
        <SectionHeader
          eyebrow="Who it’s for"
          lead="One expense tracker,"
          accent="every kind of budget"
          description="Whether you’re stretching a salary, juggling freelance income, or running a household, Expenso turns everyday spending into a clear monthly budget — without bank logins or spreadsheets."
        />
      </Reveal>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map(({ icon: Icon, title, body, href }, i) => (
          <li key={title}>
            <Reveal delay={(i % 3) * 80} className="h-full">
              <div className="bg-surface ring-ink/[0.06] group flex h-full flex-col rounded-2xl p-6 ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(13,17,23,0.35)]">
                <span className="text-brand-fg flex size-10 items-center justify-center rounded-xl bg-[#1a7f5a]/[0.08]">
                  <Icon className="size-5" />
                </span>
                <h3
                  className="text-ink mt-5 text-lg font-bold"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  {title}
                </h3>
                <p className="inter text-ink-muted mt-2 flex-1 text-sm leading-relaxed">
                  {body}
                </p>
                <Link
                  href={href}
                  className="inter text-brand-fg mt-4 text-sm font-medium underline-offset-4 group-hover:underline"
                >
                  See how in the guide
                  <span className="sr-only"> — {title}</span>
                </Link>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default UseCases;
