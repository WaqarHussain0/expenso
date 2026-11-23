import Link from 'next/link';
import { Plus } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { Container, SectionHeader } from '../primitives';

// Answers reflect how the app actually behaves today. `text` is the plain
// version used for FAQPage structured data (must match what's on the page);
// `a` overrides it on the page when an answer needs links.
interface IFaq {
  q: string;
  text: string;
  a?: React.ReactNode;
}

export const FAQS: IFaq[] = [
  {
    q: 'What is Expenso?',
    text: 'Expenso is a free online expense tracker and budget app. You log your income, expenses and investments by category, and it turns them into a monthly dashboard, yearly charts, shareable reports and answers from an AI finance assistant.',
  },
  {
    q: 'Is Expenso really free?',
    text: 'Yes — every feature, with no subscription, trial, or paid tier.',
  },
  {
    q: 'How do I track my monthly expenses with Expenso?',
    text: 'Create categories such as Salary, Rent and Groceries, then log each transaction as it happens — it takes a few seconds. The dashboard totals your income, expenses, investments and free cash for the month, and the Stats page compares months and years.',
    a: (
      <>
        Create categories such as Salary, Rent and Groceries, then log each
        transaction as it happens — it takes a few seconds. The dashboard totals
        your income, expenses, investments and free cash for the month, and the
        Stats page compares months and years. The{' '}
        <Link href="/guide#getting-started" className="text-brand-fg underline">
          getting-started guide
        </Link>{' '}
        walks through it.
      </>
    ),
  },
  {
    q: 'Can I track investments and savings, not just spending?',
    text: 'Yes. Every category is income, expense, or investment, so SIPs, mutual funds, gold or stock purchases are tracked separately and never counted as spending.',
  },
  {
    q: 'Does it connect to my bank?',
    text: 'No. You log transactions yourself — it takes a few seconds each, and it means your bank credentials never touch the app.',
  },
  {
    q: 'Does Expenso work on my phone?',
    text: 'Yes. Expenso runs in any modern browser and the layout is built for phones as well as desktops, so you can log an expense right after you pay. You can also add it to your home screen.',
  },
  {
    q: 'Who can see my data?',
    text: 'Only you. Every query is scoped to your account on the server. The only ways data leaves your account are share links you create and questions you send to the AI assistant.',
  },
  {
    q: 'What does a share link show — and can I turn it off?',
    text: 'Anyone with the link sees that period’s totals and charts — and for a monthly report, the individual transactions with their notes. Links don’t expire and can’t be revoked yet, so only share with people you trust.',
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
    q: 'What can I ask the AI finance assistant?',
    text: 'Plain-language questions about your own transactions, like “How much did I spend on food last month?” or “Which category grew the most this year?”. It answers with the numbers, as a sentence or a table.',
  },
  {
    q: 'Can the AI assistant change my data?',
    text: 'No. It is strictly read-only — it can answer questions about your transactions but refuses any request to add, edit, or delete.',
  },
  {
    q: 'Do I need my own AI API key?',
    text: 'No — Expenso’s shared keys are used by default. You can add your own Gemini, OpenAI, or Grok key in Profile if you prefer; it’s stored encrypted.',
  },
  {
    q: 'Which currency does it use?',
    text: 'Amounts are plain numbers with thousands separators and no currency symbol, so the app works for whichever single currency you track in. The AI assistant phrases its answers assuming rupees (PKR).',
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
          {FAQS.map(({ q, text, a }) => (
            <details
              key={q}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="inter text-ink flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                {q}
                <Plus className="text-ink-subtle group-open:text-brand-fg size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="inter text-ink-muted mt-3 text-sm leading-relaxed">
                {a ?? text}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </Container>
  </section>
);

export default Faq;
