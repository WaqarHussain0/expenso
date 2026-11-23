import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

const STEPS = [
  {
    n: '01',
    title: 'Create your categories',
    body: 'Set up the buckets your money moves through — Salary, Rent, Groceries, SIP — and label each as income, expense, or investment. New accounts can start from a ready-made set.',
    href: '/guide#categories',
  },
  {
    n: '02',
    title: 'Log your transactions',
    body: 'Got paid? Log it. Paid rent? Log it. Each entry takes seconds, and the habit sticks within a week.',
    href: '/guide#transactions',
  },
  {
    n: '03',
    title: 'Read your dashboard',
    body: 'See your free cash, where it went, and how this month compares — then dig into stats or just ask the assistant.',
    href: '/guide#dashboard',
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-surface scroll-mt-20 py-24 md:py-32">
    <Container>
      <Reveal>
        <SectionHeader
          eyebrow="How it works"
          lead="Up and running in"
          accent="three steps"
          description="No complicated setup, no onboarding calls. Open it and go."
        />
      </Reveal>

      <div className="relative mt-16">
        {/* connecting line on desktop */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-[#1a7f5a]/30 to-transparent md:block"
        />
        <ol className="relative grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.n}>
              <Reveal
                delay={i * 100}
                className="relative flex h-full flex-col items-center text-center"
              >
                <span
                  className="bg-panel relative z-10 flex size-16 items-center justify-center rounded-2xl text-xl font-bold text-[#34d399] shadow-[0_12px_30px_-10px_rgba(13,17,23,0.5)]"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  {step.n}
                </span>
                <h3
                  className="text-ink mt-6 text-xl font-bold"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  {step.title}
                </h3>
                <p className="inter text-ink-muted mt-3 max-w-xs text-sm leading-relaxed">
                  {step.body}
                </p>
                <Link
                  href={step.href}
                  className="inter group text-brand-fg mt-4 inline-flex items-center gap-1 text-sm font-medium"
                >
                  Learn how
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  </section>
);

export default HowItWorks;
