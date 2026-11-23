import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Who it’s for', href: '/#use-cases' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Guide',
    links: [
      { label: 'Getting started', href: '/guide#getting-started' },
      { label: 'Transactions', href: '/guide#transactions' },
      { label: 'Stats & sharing', href: '/guide#stats' },
      { label: 'AI assistant', href: '/guide#assistant' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Create account', href: PAGE_ROUTES.register },
      { label: 'Sign in', href: PAGE_ROUTES.login },
      { label: 'Forgot password', href: '/forgot-password' },
    ],
  },
];

const MarketingFooter = () => (
  <footer className="border-ink/[0.06] bg-surface-2 border-t">
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
      <div className="col-span-2 md:col-span-1">
        <Link href="/" aria-label="Expenso home" className="inline-block">
          <BrandLogo className="h-[30px] w-[96px]" sizes="96px" />
        </Link>
        <p className="inter text-ink-muted mt-4 max-w-xs text-sm leading-relaxed">
          A free, private tracker for your income, expenses, and investments —
          built by someone who wanted to know where their salary went.
        </p>
      </div>

      {COLUMNS.map(column => (
        <nav key={column.title} aria-label={column.title}>
          <p className="inter text-ink text-xs font-semibold tracking-wider uppercase">
            {column.title}
          </p>
          <ul className="mt-4 space-y-2.5">
            {column.links.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inter text-ink-muted hover:text-brand-fg text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>

    <div className="border-ink/[0.06] border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-center md:flex-row md:px-8 md:text-left">
        <p className="inter text-ink-subtle text-xs">
          © {new Date().getFullYear()} Expenso. All rights reserved.
        </p>
        <p className="inter text-ink-subtle text-xs">
          Your data stays yours — never sold, never shared.
        </p>
      </div>
    </div>
  </footer>
);

export default MarketingFooter;
