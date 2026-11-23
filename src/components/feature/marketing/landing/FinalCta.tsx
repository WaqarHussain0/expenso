import Link from 'next/link';
import { ArrowRight, Check, Lightbulb, Mail, Phone } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Container, DarkBackdrop, Eyebrow } from '../primitives';

const FEATURE_REQUEST_MAILTO =
  'mailto:waqar.mernstackdev@gmail.com?subject=Feature%20Request%20%E2%80%94%20Expenso&body=Hi%20Waqar%2C%0A%0AI%20have%20a%20feature%20idea%20for%20Expenso%3A%0A%0A%5BDescribe%20your%20idea%20here%5D%0A%0AThanks!';

const PERKS = ['Free forever', 'No card needed', '2-minute setup'];

interface IFinalCtaProps {
  signedIn?: boolean;
  /**
   * `section` — full-width closing section for the landing page (with the
   * feature-request card). `compact` — a single self-contained card to embed
   * inside other pages (e.g. a shared report), with no section background.
   */
  variant?: 'section' | 'compact';
}

const PrimaryButton: React.FC<{ signedIn: boolean; label?: string }> = ({
  signedIn,
  label,
}) => (
  <Link
    href={signedIn ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
    className="inter group inline-flex items-center justify-center gap-2 rounded-full bg-[#1a7f5a] px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(26,127,90,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f9468]"
  >
    {signedIn ? 'Open your dashboard' : (label ?? 'Create free account')}
    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const GuideButton = () => (
  <Link
    href="/guide"
    className="inter inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-[15px] text-white/80 transition-all hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
  >
    Read the guide
  </Link>
);

const Perks: React.FC<{ className?: string }> = ({ className = '' }) => (
  <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
    {PERKS.map(perk => (
      <li
        key={perk}
        className="inter inline-flex items-center gap-1.5 text-sm text-white/55"
      >
        <Check className="size-3.5 text-[#34d399]" />
        {perk}
      </li>
    ))}
  </ul>
);

/** Compact card: fits inside any page width, no outer section or padding. */
const CompactCta: React.FC<{ signedIn: boolean }> = ({ signedIn }) => (
  <div className="bg-panel relative overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
    <DarkBackdrop glow="center" />
    <div className="relative flex flex-col gap-7 p-7 md:flex-row md:items-center md:justify-between md:p-10">
      <div className="max-w-xl">
        <Eyebrow dark>Made with Expenso</Eyebrow>
        <h2
          className="mt-4 text-[clamp(24px,3vw,34px)] leading-[1.12] font-bold text-white"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          Like what you see?{' '}
          <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
            Track your own money like this.
          </em>
        </h2>
        <Perks className="mt-5" />
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
        <PrimaryButton signedIn={signedIn} label="Start for free" />
        <GuideButton />
      </div>
    </div>
  </div>
);

const FinalCta: React.FC<IFinalCtaProps> = ({
  signedIn = false,
  variant = 'section',
}) => {
  if (variant === 'compact') return <CompactCta signedIn={signedIn} />;

  return (
    <section className="bg-canvas pb-24 md:pb-32">
      <Container className="space-y-6">
        {/* Feature request */}
        <Reveal>
          <div className="bg-surface ring-ink/[0.06] flex flex-col gap-6 rounded-3xl p-7 ring-1 md:flex-row md:items-center md:justify-between md:p-9">
            <div className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f59e0b]/10 text-[#d97706]">
                <Lightbulb className="size-5" />
              </span>
              <div>
                <p className="inter text-ink text-base font-semibold">
                  Have an idea that could make Expenso better?
                </p>
                <p className="inter text-ink-muted mt-1 max-w-xl text-sm leading-relaxed">
                  Expenso is built around real user needs. Missing a chart, a
                  filter, recurring transactions, budget goals? If it’s useful
                  for most people, there’s a good chance it’ll make it in.
                  Replies usually within 24–48 hours.
                </p>
                <div className="inter mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <a
                    href="mailto:waqar.mernstackdev@gmail.com"
                    className="text-ink-muted hover:text-brand-fg inline-flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5" />
                    waqar.mernstackdev@gmail.com
                  </a>
                  <a
                    href="tel:+923174945496"
                    className="text-ink-muted hover:text-brand-fg inline-flex items-center gap-1.5"
                  >
                    <Phone className="size-3.5" />
                    +92 317 4945496
                  </a>
                </div>
              </div>
            </div>
            <a
              href={FEATURE_REQUEST_MAILTO}
              className="inter border-ink/10 text-ink hover:text-brand-fg inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:border-[#1a7f5a]/40"
            >
              Send your idea
              <ArrowRight className="size-4" />
            </a>
          </div>
        </Reveal>

        {/* Closing call to action */}
        <Reveal delay={80}>
          <div className="bg-panel relative overflow-hidden rounded-3xl px-7 py-14 text-center ring-1 ring-white/[0.06] md:px-14 md:py-20">
            <DarkBackdrop glow="center" />
            <div className="relative flex flex-col items-center">
              <Eyebrow dark>Ready when you are</Eyebrow>
              <h2
                className="mt-6 max-w-2xl text-[clamp(30px,4.5vw,52px)] leading-[1.08] font-bold text-white"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                Start tracking today.{' '}
                <em
                  className="text-gradient-green"
                  style={{ fontStyle: 'italic' }}
                >
                  Future you will thank you.
                </em>
              </h2>
              <p className="inter mt-5 max-w-md text-[15px] text-white/55">
                Takes two minutes to set up. Takes one month to wonder why you
                didn’t do it sooner.
              </p>
              <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <PrimaryButton signedIn={signedIn} />
                <GuideButton />
              </div>
              <Perks className="mt-8 justify-center" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export default FinalCta;
