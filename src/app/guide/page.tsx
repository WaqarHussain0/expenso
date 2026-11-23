import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  ListPlus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Tags,
  UserRound,
} from 'lucide-react';
import { getServerSideSession } from '@/lib/next-auth.util';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from '@/app/constants/site.constant';
import JsonLd from '@/components/common/JsonLd';
import MarketingNav from '@/components/feature/marketing/MarketingNav';
import HashScroll from '@/components/feature/marketing/HashScroll';
import MarketingFooter from '@/components/feature/marketing/MarketingFooter';
import {
  Container,
  DarkBackdrop,
  Eyebrow,
} from '@/components/feature/marketing/primitives';
import GuideToc, {
  ITocItem,
} from '@/components/feature/marketing/guide/GuideToc';
import {
  Bullets,
  Callout,
  FieldTable,
  GuideH3,
  GuideSection,
  Kbd,
  P,
  Steps,
  Ui,
} from '@/components/feature/marketing/guide/guide-ui';

const GUIDE_TITLE = 'How to Track Expenses & Build a Budget — Expenso Guide';
const GUIDE_DESCRIPTION =
  'Step-by-step guide to tracking your expenses with Expenso: set up income, expense and investment categories, log transactions, read your monthly dashboard, compare yearly stats, share reports, and ask the AI assistant about your money.';

export const metadata: Metadata = {
  title: { absolute: GUIDE_TITLE },
  description: GUIDE_DESCRIPTION,
  keywords: [
    'how to track expenses',
    'expense tracker guide',
    'how to make a monthly budget',
    'track spending by category',
    'personal finance tutorial',
    'Expenso guide',
  ],
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'article',
    url: '/guide',
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
  },
};

const TOC: ITocItem[] = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'categories', label: 'Categories' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'stats', label: 'Stats & charts' },
  { id: 'sharing', label: 'Sharing reports' },
  { id: 'assistant', label: 'AI assistant' },
  { id: 'profile', label: 'Profile & AI keys' },
  { id: 'security', label: 'Privacy & security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

const QUICK_START = [
  {
    icon: Rocket,
    title: 'Create an account',
    body: 'Email or Google — takes a minute.',
    href: '#getting-started',
  },
  {
    icon: Tags,
    title: 'Add your categories',
    body: 'Or start from ready-made ones.',
    href: '#categories',
  },
  {
    icon: ListPlus,
    title: 'Log a transaction',
    body: 'Amount, category, done.',
    href: '#transactions',
  },
  {
    icon: Sparkles,
    title: 'Ask the assistant',
    body: '“How much did I spend on food?”',
    href: '#assistant',
  },
];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': `${absoluteUrl('/guide')}#article`,
      headline: GUIDE_TITLE,
      description: GUIDE_DESCRIPTION,
      url: absoluteUrl('/guide'),
      image: absoluteUrl('/guide/opengraph-image'),
      inLanguage: 'en',
      proficiencyLevel: 'Beginner',
      dateModified: '2026-11-23',
      author: { '@type': 'Person', name: 'Waqar Hussain' },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl('/android-chrome-512x512.png'),
      },
      about: { '@type': 'Thing', name: 'Personal expense tracking' },
      hasPart: TOC.map(({ id, label }) => ({
        '@type': 'WebPageElement',
        name: label,
        url: `${absoluteUrl('/guide')}#${id}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guide',
          item: absoluteUrl('/guide'),
        },
      ],
    },
  ],
};

const GuidePage = async () => {
  const session = await getServerSideSession();
  const signedIn = !!session?.user;

  return (
    <div className="bg-surface w-full overflow-x-clip">
      <MarketingNav signedIn={signedIn} />
      <JsonLd data={STRUCTURED_DATA} />
      <HashScroll />

      {/* ───────── Header ───────── */}
      <header className="bg-panel relative overflow-hidden pt-32 pb-16 md:pt-36 md:pb-20">
        <DarkBackdrop />
        <Container className="relative">
          <Eyebrow dark>Expenso guide</Eyebrow>
          <h1
            className="mt-6 max-w-3xl text-[clamp(36px,5.5vw,58px)] leading-[1.05] font-bold tracking-tight text-[#f4f4f4]"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            Everything Expenso can do,{' '}
            <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
              and how to use it
            </em>
          </h1>
          <p className="inter mt-5 max-w-2xl text-[16px] leading-relaxed text-white/60">
            A practical walkthrough of every feature — from your first category
            to asking the AI assistant where your money went. Ten minutes to
            read, two minutes to get started.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_START.map(({ icon: Icon, title, body, href }, i) => (
              <a
                key={title}
                href={href}
                className="group flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#34d399]/40 hover:bg-white/[0.06]"
              >
                <span className="manrope flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-xs font-bold text-[#34d399]">
                  {i + 1}
                </span>
                <span>
                  <span className="inter flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Icon className="size-3.5 text-[#34d399]" />
                    {title}
                  </span>
                  <span className="inter mt-0.5 block text-xs text-white/50">
                    {body}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </header>

      {/* ───────── Body ───────── */}
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="min-w-0 lg:pt-14">
          <GuideToc items={TOC} />
        </aside>

        <article className="max-w-3xl min-w-0 pb-10">
          {/* 1 ─ Getting started */}
          <GuideSection
            id="getting-started"
            icon={Rocket}
            eyebrow="Step 1"
            title="Getting started"
            intro="Expenso tracks three kinds of money: what comes in (income), what goes out (expenses), and what you set aside (investments). Everything else builds on that."
          >
            <div className="space-y-4">
              <GuideH3>Create your account</GuideH3>
              <Steps
                items={[
                  <>
                    Open{' '}
                    <Link
                      href={PAGE_ROUTES.register}
                      className="text-brand-fg underline"
                    >
                      Register
                    </Link>{' '}
                    and enter your name, email, and a password — or choose{' '}
                    <Ui>Continue with Google</Ui>.
                  </>,
                  <>
                    Sign in. You land on your <Ui>Dashboard</Ui>.
                  </>,
                  <>
                    On your first visit you’ll see <Ui>Setup Workspace</Ui>{' '}
                    under Quick actions — use it to pick from about 25
                    ready-made categories (Salary, Rent, Groceries, SIP…)
                    instead of creating them one by one.
                  </>,
                ]}
              />
              <Callout type="note">
                <Ui>Setup Workspace</Ui> is offered only on your first sign-in.
                You can always add or remove categories later on the Categories
                page.
              </Callout>
            </div>

            <div className="space-y-4">
              <GuideH3>Finding your way around</GuideH3>
              <Bullets
                items={[
                  <>
                    On desktop, the sidebar holds every page. Collapse it to
                    icons with the panel button next to the logo, or press{' '}
                    <Kbd>Ctrl</Kbd> + <Kbd>B</Kbd> (<Kbd>⌘</Kbd> + <Kbd>B</Kbd>{' '}
                    on Mac). Your choice is remembered.
                  </>,
                  <>
                    On mobile, the same pages live in the tab bar at the bottom
                    of the screen.
                  </>,
                  <>
                    Your name in the top-right opens a menu with{' '}
                    <Ui>Profile</Ui> and <Ui>Logout</Ui>.
                  </>,
                ]}
              />
              <Callout type="tip" title="Forgot your password?">
                Use <Ui>Forgot password</Ui> on the sign-in page. You’ll get an
                email with a link to choose a new one.
              </Callout>
            </div>
          </GuideSection>

          {/* 2 ─ Categories */}
          <GuideSection
            id="categories"
            icon={Tags}
            eyebrow="Organise"
            title="Categories"
            intro="Every transaction belongs to a category, and every category has a type. The type decides how its money is counted on your dashboard."
          >
            <FieldTable
              rows={[
                [
                  <span key="i" className="text-success">
                    Income
                  </span>,
                  'Money coming in — salary, freelance work, dividends, gifts received.',
                ],
                [
                  <span key="e" className="text-[#e11d48] dark:text-[#fb7185]">
                    Expense
                  </span>,
                  'Money spent — rent, groceries, fuel, bills, eating out.',
                ],
                [
                  <span key="v" className="text-[#b45309] dark:text-[#fbbf24]">
                    Investment
                  </span>,
                  'Money set aside to grow — SIPs, stocks, savings schemes. Counted separately from expenses, so saving never looks like spending.',
                ],
              ]}
            />

            <div className="space-y-4">
              <GuideH3>Create a category</GuideH3>
              <Steps
                items={[
                  <>
                    Go to <Ui>Category</Ui> in the sidebar and click{' '}
                    <Ui>Add Category</Ui>.
                  </>,
                  <>
                    Give it a name and choose its type: <Ui>Income</Ui>,{' '}
                    <Ui>Expense</Ui>, or <Ui>Investment</Ui>.
                  </>,
                  <>
                    Pick an icon and a colour — the preview at the top shows
                    exactly how it will look.
                  </>,
                  <>
                    Click <Ui>Create category</Ui>.
                  </>,
                ]}
              />
              <Callout type="note">
                Names must be unique within a type — you can have “Gifts” as
                both an income and an expense category, but not two expense
                categories called “Gifts”.
              </Callout>
            </div>

            <div className="space-y-4">
              <GuideH3>Edit, delete, and find categories</GuideH3>
              <Bullets
                items={[
                  <>
                    Click any category card to edit it, or use its <Ui>⋯</Ui>{' '}
                    menu → <Ui>Edit</Ui>.
                  </>,
                  <>
                    <Ui>⋯</Ui> → <Ui>Delete</Ui> removes it from your lists and
                    pickers. Transactions you already logged with it are kept.
                  </>,
                  <>
                    Use the search box to find a category by name, and the{' '}
                    <Ui>All · Income · Expense · Investment</Ui> toggle to
                    filter by type.
                  </>,
                ]}
              />
              <Callout type="tip">
                Deleted a category by mistake? Create one with the same name and
                type — Expenso restores the original instead of making a
                duplicate.
              </Callout>
            </div>
          </GuideSection>

          {/* 3 ─ Transactions */}
          <GuideSection
            id="transactions"
            icon={ListPlus}
            eyebrow="Track"
            title="Transactions"
            intro="A transaction is one movement of money: an amount, a category, a date, and an optional note."
          >
            <div className="space-y-4">
              <GuideH3>Log a transaction</GuideH3>
              <Steps
                items={[
                  <>
                    Click <Ui>Add Transaction</Ui> on the Transactions page — or{' '}
                    <Ui>Record Transaction</Ui> under Quick actions on the
                    dashboard.
                  </>,
                  <>Type the amount (it must be more than zero).</>,
                  <>Choose a category — start typing to search.</>,
                  <>
                    The date defaults to today; change it for past entries. Add
                    a note if it helps you remember (“Chai with the team”).
                  </>,
                  <>
                    Click <Ui>Add transaction</Ui>.
                  </>,
                ]}
              />
              <Callout type="tip">
                Log as it happens — it takes about five seconds, and the habit
                is what makes your dashboard trustworthy.
              </Callout>
            </div>

            <div className="space-y-4">
              <GuideH3>Reading the list</GuideH3>
              <Bullets
                items={[
                  <>
                    Entries are grouped by day — <Ui>Today</Ui>,{' '}
                    <Ui>Yesterday</Ui>, then dates — newest first.
                  </>,
                  <>
                    Each day header shows how many entries it has and the day’s
                    net: income minus expenses and investments.
                  </>,
                  <>
                    Amounts are colour-coded:{' '}
                    <span className="text-success font-semibold">+ income</span>
                    , − expenses, and investments in amber.
                  </>,
                  <>
                    The four cards at the top show this month’s income,
                    expenses, investments, and free cash.
                  </>,
                ]}
              />
            </div>

            <div className="space-y-4">
              <GuideH3>Edit, delete, and filter</GuideH3>
              <Bullets
                items={[
                  <>
                    Click a row (or press <Kbd>Enter</Kbd> on it) to edit it.
                  </>,
                  <>
                    Use the row’s <Ui>⋯</Ui> menu → <Ui>Delete</Ui> to remove
                    it.
                  </>,
                  <>
                    Search by note, pick a category, or filter by type.{' '}
                    <Ui>Clear filters</Ui> resets everything.
                  </>,
                ]}
              />
              <Callout type="warn">
                Deleting a transaction is permanent and immediately updates your
                totals.
              </Callout>
            </div>
          </GuideSection>

          {/* 4 ─ Dashboard */}
          <GuideSection
            id="dashboard"
            icon={LayoutDashboard}
            eyebrow="Understand"
            title="Your dashboard"
            intro="The dashboard answers one question at a glance: how am I doing? Its totals cover everything you’ve ever logged."
          >
            <FieldTable
              rows={[
                [
                  'Free cash',
                  'Income − (expenses + investments). What’s genuinely left. It turns red if you’ve spent and invested more than you earned.',
                ],
                [
                  'Allocation bar',
                  'How your income splits into expenses, investments, and free cash, as percentages.',
                ],
                [
                  'Stat rings',
                  'Income, expenses, investments, and free cash — each ring shows that amount as a share of your income.',
                ],
                [
                  'Quick actions',
                  'Shortcuts to record a transaction, create a category, or open the assistant.',
                ],
                [
                  'Recent transactions',
                  'Your five latest entries. View all opens the Transactions page.',
                ],
              ]}
            />
            <Callout type="note">
              The dashboard uses all-time totals. For a single month, a year, or
              a custom range, use{' '}
              <a href="#stats" className="text-brand-fg underline">
                Stats
              </a>
              .
            </Callout>
          </GuideSection>

          {/* 5 ─ Stats */}
          <GuideSection
            id="stats"
            icon={BarChart3}
            eyebrow="Analyse"
            title="Stats & charts"
            intro="Stats lets you zoom into any period. Choose a view with Filter By, then the month, year, or dates."
          >
            <FieldTable
              rows={[
                [
                  'Month',
                  'Totals for the month, plus each type’s transactions listed beside a pie chart of where the money went.',
                ],
                [
                  'Year',
                  'A month-by-month overview chart for the year, plus expense, income, and investment breakdowns by category.',
                ],
                [
                  'Custom range',
                  'Any start and end date. Adds your savings rate, your top expense category, the number of transactions, and an expense breakdown chart.',
                ],
              ]}
            />
            <Callout type="note" title="How savings rate is calculated">
              Savings rate = (income − expenses) ÷ income. Investments count as
              money kept, so they don’t lower it.
            </Callout>
          </GuideSection>

          {/* 6 ─ Sharing */}
          <GuideSection
            id="sharing"
            icon={Link2}
            eyebrow="Share"
            title="Sharing reports"
            intro="Send a read-only view of any period to your accountant, your partner, or yourself on another device. Viewers don’t need an account."
          >
            <Steps
              items={[
                <>
                  On <Ui>Stats</Ui>, choose the period you want to share.
                </>,
                <>
                  Click <Ui>Share</Ui>, then copy the link.
                </>,
                <>
                  Send it however you like. Anyone who opens it sees that
                  report.
                </>,
              ]}
            />
            <div className="space-y-4">
              <GuideH3>What viewers can see</GuideH3>
              <Bullets
                items={[
                  'The totals and charts for that period.',
                  'For a monthly report, the individual transactions — including their notes.',
                  'Nothing else: not your other periods, not your categories page, and they can’t change anything.',
                ]}
              />
            </div>
            <Callout type="warn" title="Share with people you trust">
              Share links don’t expire and can’t be switched off yet. Sharing
              the same period again gives you the same link.
            </Callout>
          </GuideSection>

          {/* 7 ─ Assistant */}
          <GuideSection
            id="assistant"
            icon={Sparkles}
            eyebrow="Ask"
            title="AI assistant"
            intro="Ask questions about your money in plain language. The assistant turns your question into a precise query over your own transactions and answers with the numbers — as a sentence or a table."
          >
            <div className="space-y-4">
              <GuideH3>Questions that work well</GuideH3>
              <div className="flex flex-wrap gap-2">
                {[
                  'How much did I spend this month?',
                  'Break down my expenses by category',
                  'What was my biggest expense this year?',
                  'How much have I invested so far?',
                  'How much did I spend on fuel in October?',
                ].map(q => (
                  <span
                    key={q}
                    className="inter border-ink/[0.08] bg-surface-2 text-ink-2 rounded-full border px-3 py-1.5 text-sm"
                  >
                    “{q}”
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <GuideH3>What to expect</GuideH3>
              <Bullets
                items={[
                  <>
                    It’s <strong>read-only</strong>. Ask it to add, edit, or
                    delete something and it will politely refuse.
                  </>,
                  'It only knows your own transactions and categories — not other users, and nothing outside Expenso.',
                  <>
                    Each answer shows which AI provider produced it, e.g.{' '}
                    <em>via Gemini</em>.
                  </>,
                  <>
                    Conversations aren’t saved: refreshing the page or clicking{' '}
                    <Ui>New chat</Ui> starts fresh.
                  </>,
                  'Answers can take a few seconds — longer when the AI provider is busy.',
                ]}
              />
              <Callout type="note" title="Privacy">
                To answer, your question and the matching query results are sent
                to the AI provider (Gemini, OpenAI, or Grok). Your password and
                account details are never sent.
              </Callout>
            </div>
          </GuideSection>

          {/* 8 ─ Profile & keys */}
          <GuideSection
            id="profile"
            icon={UserRound}
            eyebrow="Personalise"
            title="Profile & AI keys"
          >
            <div className="space-y-4">
              <GuideH3>Your profile</GuideH3>
              <P>
                Open <Ui>Profile</Ui> to update your name, contact number, and
                gender. The card on the left previews your changes as you type;
                <Ui>Save changes</Ui> stores them and <Ui>Discard</Ui> reverts
                them. Your sign-in email can’t be changed.
              </P>
            </div>

            <div className="space-y-4">
              <GuideH3>Use your own AI keys (optional)</GuideH3>
              <P>
                By default the assistant uses Expenso’s shared keys. If you have
                your own Gemini, OpenAI, or Grok (xAI) API key, you can use it
                instead.
              </P>
              <Steps
                items={[
                  <>
                    Go to <Ui>Profile</Ui> → <Ui>AI provider keys</Ui>. Each
                    provider has a <em>Get a key</em> link.
                  </>,
                  <>
                    Paste your key and click <Ui>Save key</Ui>. It’s checked
                    with the provider first, so a typo is caught immediately.
                  </>,
                  <>
                    Use <Ui>Replace</Ui> or the delete button at any time.
                  </>,
                ]}
              />
              <FieldTable
                rows={[
                  [
                    'Which keys are used',
                    'If you’ve saved any key, the assistant uses only your keys. With none saved, it uses Expenso’s shared keys.',
                  ],
                  [
                    'Fallback order',
                    'Gemini → OpenAI → Grok. If one fails or is busy, the next is tried automatically.',
                  ],
                  [
                    'Storage',
                    <>
                      <KeyRound
                        key="k"
                        className="text-brand-fg mr-1 inline size-3.5"
                      />
                      Encrypted (AES-256-GCM) and never shown again — only the
                      last four characters.
                    </>,
                  ],
                ]}
              />
              <Callout type="tip">
                If your own keys are rejected, the assistant tells you to update
                them here rather than silently switching to shared keys.
              </Callout>
            </div>
          </GuideSection>

          {/* 9 ─ Security */}
          <GuideSection
            id="security"
            icon={ShieldCheck}
            eyebrow="Trust"
            title="Privacy & security"
            intro="What Expenso does to keep your financial data yours."
          >
            <Bullets
              items={[
                'Every read and change is checked against your account on the server — another user’s records simply can’t be found or edited.',
                'Your data is never sold or shared. It only leaves your account through a share link you create, or a question you send to the assistant.',
                'You stay signed in while you use the app: access tokens last 15 minutes and renew automatically. After 7 days without visiting, you’ll be asked to sign in again.',
                'Logging out ends your session on the server, not just in the browser.',
                'Saved AI keys are encrypted, and the assistant can never change your data.',
              ]}
            />
          </GuideSection>

          {/* 10 ─ Troubleshooting */}
          <GuideSection
            id="troubleshooting"
            icon={LifeBuoy}
            eyebrow="Help"
            title="Troubleshooting"
          >
            <FieldTable
              rows={[
                [
                  'I was signed out',
                  'Sessions end after 7 days without a visit, or when you log out. Just sign in again — your data is untouched.',
                ],
                [
                  '“The assistant is unavailable”',
                  'The AI provider is busy or out of quota. Try again shortly, or add your own key in Profile.',
                ],
                [
                  '“Your saved AI keys were rejected”',
                  'One of your keys is invalid or out of credit. Replace or remove it under Profile → AI provider keys.',
                ],
                [
                  'Can’t find Setup Workspace',
                  'It’s only offered on your first sign-in. Add categories from the Categories page instead.',
                ],
                [
                  '“Amount must be greater than 0”',
                  'Enter a positive amount — the category’s type decides whether it counts as money in or out.',
                ],
                [
                  '“Account is inactive”',
                  'Your account has been deactivated by an administrator. Contact support to reactivate it.',
                ],
              ]}
            />
            <P>
              Still stuck, or have an idea? Email{' '}
              <a
                href="mailto:waqar.mernstackdev@gmail.com"
                className="text-brand-fg underline"
              >
                waqar.mernstackdev@gmail.com
              </a>
              .
            </P>
          </GuideSection>

          {/* Closing CTA */}
          <div className="bg-panel relative mt-4 overflow-hidden rounded-3xl p-8 md:p-10">
            <DarkBackdrop glow="center" />
            <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  Ready to try it?
                </p>
                <p className="inter mt-1 text-sm text-white/55">
                  Free forever. Two minutes to set up.
                </p>
              </div>
              <Link
                href={signedIn ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
                className="inter group inline-flex items-center gap-2 rounded-full bg-[#1a7f5a] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f9468]"
              >
                {signedIn ? 'Open your dashboard' : 'Create free account'}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </article>
      </Container>

      <div className="mt-16">
        <MarketingFooter />
      </div>
    </div>
  );
};

export default GuidePage;
