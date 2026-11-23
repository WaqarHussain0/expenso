import Link from 'next/link';
import { ArrowRight, BookOpen, Lock, Sparkles, Timer } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Container, DarkBackdrop, Eyebrow } from '../primitives';
import HeroMockup from './HeroMockup';

const TRUST = [
  { icon: Sparkles, label: 'Free forever' },
  { icon: Lock, label: 'Private by default' },
  { icon: Timer, label: '2-minute setup' },
];

const Hero: React.FC<{ signedIn?: boolean }> = ({ signedIn = false }) => (
  <section className="bg-panel relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
    <DarkBackdrop />

    <Container className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div className="flex flex-col items-start">
        <Reveal>
          <Eyebrow dark>Free personal finance tracker</Eyebrow>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="mt-6 text-[clamp(40px,6vw,68px)] leading-[1.02] font-bold tracking-tight text-[#f4f4f4]"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            Know exactly where{' '}
            <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
              every rupee goes
            </em>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="inter mt-6 max-w-xl text-[16px] leading-relaxed text-white/60">
            I built Expenso, a free expense tracker and budget app, because I
            kept wondering where my salary went by the 20th of every month. Log
            income, expenses, and investments in seconds — and see your month at
            a glance. You won&apos;t have to wonder either.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href={signedIn ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
            className="inter group inline-flex items-center gap-2 rounded-full bg-[#1a7f5a] px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(26,127,90,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f9468]"
          >
            {signedIn ? 'Open your dashboard' : 'Start for free'}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/guide"
            className="inter inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[15px] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
          >
            <BookOpen className="size-4" />
            Read the guide
          </Link>
        </Reveal>

        <Reveal delay={320} className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
          {TRUST.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inter inline-flex items-center gap-2 text-sm text-white/50"
            >
              <Icon className="size-4 text-[#34d399]" />
              {label}
            </span>
          ))}
        </Reveal>
      </div>

      <Reveal delay={200} className="lg:pl-4">
        <HeroMockup />
      </Reveal>
    </Container>
  </section>
);

export default Hero;
