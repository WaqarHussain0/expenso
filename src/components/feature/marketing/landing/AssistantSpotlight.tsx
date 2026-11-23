import Link from 'next/link';
import {
  ArrowRight,
  KeyRound,
  Lock,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, DarkBackdrop, SectionHeader } from '../primitives';

const POINTS = [
  {
    icon: MessageSquareText,
    title: 'Plain-language questions',
    body: '“How much did I spend on food this month?” — no filters or date pickers.',
  },
  {
    icon: Lock,
    title: 'Read-only, always',
    body: 'It can only read your own transactions. It refuses to add, edit, or delete anything.',
  },
  {
    icon: KeyRound,
    title: 'Bring your own AI key',
    body: 'Optionally plug in your Gemini, OpenAI, or Grok key — stored encrypted, with automatic fallback.',
  },
];

const AssistantSpotlight = () => (
  <section className="bg-panel relative overflow-hidden py-24 md:py-32">
    <DarkBackdrop glow="center" />

    <Container className="relative grid items-center gap-14 lg:grid-cols-2">
      <div>
        <Reveal>
          <SectionHeader
            dark
            align="left"
            eyebrow="AI assistant"
            lead="Skip the spreadsheets."
            accent="Just ask."
            description="Your financial assistant turns a question into a precise query over your own data, then answers with the numbers — as a sentence or a tidy table."
          />
        </Reveal>

        <ul className="mt-10 space-y-5">
          {POINTS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80}>
              <li className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#34d399]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="inter text-[15px] font-semibold text-white">
                    {title}
                  </p>
                  <p className="inter mt-0.5 text-sm leading-relaxed text-white/55">
                    {body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={260}>
          <Link
            href="/guide#assistant"
            className="inter group mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-[#34d399] hover:text-white"
          >
            How the assistant works
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      {/* Chat preview */}
      <Reveal delay={120}>
        <div
          aria-hidden
          className="bg-surface rounded-2xl border border-white/10 p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] sm:p-6"
        >
          <div className="flex justify-end">
            <p className="inter max-w-[80%] rounded-2xl rounded-tr-md bg-[#1a7f5a] px-4 py-2.5 text-sm text-white">
              Give me a breakdown of my expenses this month
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <span className="bg-panel flex size-8 shrink-0 items-center justify-center rounded-xl text-[#34d399]">
              <Sparkles className="size-4" />
            </span>
            <div className="inter bg-canvas text-ink-2 ring-ink/[0.05] min-w-0 flex-1 rounded-2xl rounded-tl-md px-4 py-3 text-sm ring-1">
              <p>
                You&apos;ve spent <strong className="text-ink">71,957</strong>{' '}
                this month.
              </p>
              <table className="bg-surface ring-ink/[0.08] mt-3 w-full overflow-hidden rounded-lg text-left text-xs ring-1">
                <thead className="bg-surface-2 text-ink-muted">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Category</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {[
                    ['Fuel', '33,143'],
                    ['Food', '11,000'],
                    ['Home', '5,000'],
                  ].map(([name, amount]) => (
                    <tr key={name} className="border-ink/[0.05] border-t">
                      <td className="px-3 py-2">{name}</td>
                      <td className="px-3 py-2 text-right">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-ink-subtle mt-2 text-[11px]">via Gemini</p>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
);

export default AssistantSpotlight;
