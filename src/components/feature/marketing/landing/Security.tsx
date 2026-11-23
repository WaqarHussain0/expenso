import { EyeOff, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

// Every claim here describes something the code actually does.
const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Only you see your data',
    body: 'Every read and write is scoped to your account on the server — another user’s data simply can’t be found.',
  },
  {
    icon: EyeOff,
    title: 'Never sold, never shared',
    body: 'Data only leaves your account when you choose to: a share link you create, or a question to the assistant (sent with its query results to the AI provider).',
  },
  {
    icon: KeyRound,
    title: 'Your AI keys, encrypted',
    body: 'Keys you add are verified, then encrypted with AES-256-GCM. We only ever show their last four characters.',
  },
  {
    icon: LockKeyhole,
    title: 'Short-lived sessions',
    body: 'Access tokens expire every 15 minutes and renew quietly in the background; signing out revokes your session.',
  },
];

const Security = () => (
  <section className="bg-canvas py-24 md:py-28">
    <Container>
      <Reveal>
        <SectionHeader
          eyebrow="Privacy & security"
          lead="Your finances are"
          accent="nobody else’s business"
          description="Money data is personal. Expenso is built so it stays that way."
        />
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 70}>
            <div className="bg-surface ring-ink/[0.06] h-full rounded-2xl p-6 shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1">
              <span className="text-brand-fg flex size-10 items-center justify-center rounded-xl bg-[#1a7f5a]/[0.08]">
                <Icon className="size-5" />
              </span>
              <h3 className="inter text-ink mt-5 text-[15px] font-semibold">
                {title}
              </h3>
              <p className="inter text-ink-muted mt-2 text-sm leading-relaxed">
                {body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
);

export default Security;
