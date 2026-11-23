import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Container, SectionHeader } from '../primitives';

const INCLUDED = [
  'Unlimited categories and transactions',
  'Full dashboard and stats — no locked charts',
  'Shareable read-only report links',
  'AI assistant (bring your own key if you like)',
  'Your data is private — never sold, never shared',
  'No subscription, no expiry, no hidden costs',
];

const Pricing: React.FC<{ signedIn?: boolean }> = ({ signedIn = false }) => (
  <section id="pricing" className="bg-canvas scroll-mt-20 py-24 md:py-32">
    <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      <Reveal>
        <SectionHeader
          align="left"
          eyebrow="Pricing"
          lead="Completely free."
          accent="No tricks."
          description="It’s free because I use it myself and didn’t want to charge people for something I built on weekends. Simple as that."
        />
      </Reveal>

      <Reveal delay={120}>
        <div className="bg-panel relative overflow-hidden rounded-3xl p-8 text-white shadow-[0_40px_80px_-40px_rgba(13,17,23,0.7)] md:p-10">
          <div className="fr-grid-bg pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute -top-24 -right-20 h-[300px] w-[380px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(46,168,120,.25) 0%, transparent 70%)',
            }}
          />
          <div className="relative">
            <p className="inter text-xs font-semibold tracking-[0.16em] text-[#34d399] uppercase">
              Free forever
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span
                className="text-6xl font-bold"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                Rs 0
              </span>
              <span className="inter text-sm text-white/50">
                / month, always
              </span>
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map(item => (
                <li
                  key={item}
                  className="inter flex gap-2.5 text-sm text-white/80"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[#34d399]" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={signedIn ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
              className="inter group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0d1117] transition-all duration-300 hover:-translate-y-0.5"
            >
              {signedIn ? 'Open your dashboard' : 'Create your free account'}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
);

export default Pricing;
