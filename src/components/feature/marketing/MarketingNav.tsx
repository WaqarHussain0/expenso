'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Guide', href: '/guide' },
  { label: 'FAQ', href: '/#faq' },
];

interface IMarketingNavProps {
  /** Signed-in users get a single "Open dashboard" button instead */
  signedIn?: boolean;
}

/** Sticky top navigation shared by the landing page and the guide. */
const MarketingNav: React.FC<IMarketingNavProps> = ({ signedIn = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-panel/85 border-b border-white/[0.06] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8"
      >
        <Link href="/" aria-label="Expenso home" className="shrink-0">
          <div className="relative h-[30px] w-[96px]">
            <Image
              src="/light-logo.png"
              alt="Expenso"
              fill
              sizes="96px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inter rounded-full px-3.5 py-2 text-sm text-white/65 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle tone="onDark" className="mr-1" />
          {signedIn ? (
            <Link
              href={PAGE_ROUTES.dashboard}
              className="inter group inline-flex items-center gap-1.5 rounded-full bg-[#1a7f5a] px-4 py-2 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgba(26,127,90,0.6)] transition-all duration-300 hover:-translate-y-px hover:bg-[#1f9468]"
            >
              Open dashboard
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href={PAGE_ROUTES.login}
                className="inter rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href={PAGE_ROUTES.register}
                className="inter group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0d1117] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_rgba(255,255,255,0.5)]"
              >
                Start free
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-white/80 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="bg-panel border-t border-white/[0.06] px-5 pt-2 pb-6 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="inter block rounded-lg px-2 py-3 text-[15px] text-white/80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between px-2 py-2">
            <span className="inter text-sm text-white/60">Theme</span>
            <ThemeToggle tone="onDark" />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {signedIn ? (
              <Link
                href={PAGE_ROUTES.dashboard}
                className="inter rounded-full bg-[#1a7f5a] py-3 text-center text-sm font-medium text-white"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={PAGE_ROUTES.register}
                  className="inter rounded-full bg-white py-3 text-center text-sm font-medium text-[#0d1117]"
                >
                  Start free
                </Link>
                <Link
                  href={PAGE_ROUTES.login}
                  className="inter rounded-full border border-white/15 py-3 text-center text-sm text-white/85"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNav;
