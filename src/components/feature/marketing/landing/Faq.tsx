import Link from 'next/link';
import { Plus } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

// Answers reflect how the app actually behaves today.
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Is Expenso really free?',
    a: 'Yes — every feature, with no subscription, trial, or paid tier.',
  },
  {
    q: 'Does it connect to my bank?',
    a: 'No. You log transactions yourself — it takes a few seconds each, and it means your bank credentials never touch the app.',
  },
  {
    q: 'Who can see my data?',
    a: 'Only you. Every query is scoped to your account on the server. The only ways data leaves your account are share links you create and questions you send to the AI assistant.',
  },
  {
    q: 'What does a share link show — and can I turn it off?',
    a: (
      <>
        Anyone with the link sees that period’s totals and charts — and for a
        monthly report, the individual transactions with their notes. Links
        don’t expire and can’t be revoked yet, so only share with people you
        trust.{' '}
        <Link href="/guide#sharing" className="text-brand-fg underline">
          More on sharing
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Can the AI assistant change my data?',
    a: 'No. It is strictly read-only — it can answer questions about your transactions but refuses any request to add, edit, or delete.',
  },
  {
    q: 'Do I need my own AI API key?',
    a: 'No — Expenso’s shared keys are used by default. You can add your own Gemini, OpenAI, or Grok key in Profile if you prefer; it’s stored encrypted.',
  },
  {
    q: 'Which currency does it use?',
    a: 'Amounts are plain numbers with thousands separators and no currency symbol, so the app works for whichever single currency you track in. The AI assistant phrases its answers assuming rupees (PKR).',
  },
];

const Faq = () => (
  <section id="faq" className="bg-surface scroll-mt-20 py-24 md:py-32">
    <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal>
        <SectionHeader
          align="left"
          eyebrow="FAQ"
          lead="Questions,"
          accent="answered"
          description={
            <>
              Can’t find what you’re looking for? The{' '}
              <Link href="/guide" className="text-brand-fg underline">
                guide
              </Link>{' '}
              walks through every feature step by step.
            </>
          }
        />
      </Reveal>

      <Reveal delay={100}>
        <div className="divide-ink/[0.07] bg-surface-2 ring-ink/[0.06] divide-y rounded-2xl px-6 ring-1">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="inter text-ink flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                {q}
                <Plus className="text-ink-subtle group-open:text-brand-fg size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="inter text-ink-muted mt-3 text-sm leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </Container>
  </section>
);

export default Faq;
