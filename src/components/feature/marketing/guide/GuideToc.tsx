'use client';

import { useEffect, useRef, useState } from 'react';

export interface ITocItem {
  id: string;
  label: string;
}

/**
 * Table of contents with scroll-spy: highlights the section currently being
 * read. Sticky sidebar on desktop, horizontal chip bar on mobile.
 */
const GuideToc: React.FC<{ items: ITocItem[] }> = ({ items }) => {
  const [active, setActive] = useState(items[0]?.id);
  const chipBarRef = useRef<HTMLDivElement>(null);

  // The current section is the last one whose top has passed ~30% of the
  // viewport. Computed from positions on scroll (rAF-throttled) rather than
  // IntersectionObserver, so it's also right after programmatic jumps
  // (e.g. opening /guide#sharing).
  useEffect(() => {
    let frame = 0;
    const pick = () => {
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items]);

  // Keep the active chip centred in the mobile chip bar. Scroll the bar
  // itself, horizontally only — chip.scrollIntoView() would also scroll the
  // page vertically and fight anchor (#section) navigation.
  useEffect(() => {
    const bar = chipBarRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!bar || !chip || bar.offsetParent === null) return; // hidden on desktop
    bar.scrollTo({
      left: chip.offsetLeft - (bar.clientWidth - chip.clientWidth) / 2,
      behavior: 'smooth',
    });
  }, [active]);

  return (
    <>
      {/* Mobile: sticky chip bar */}
      <div className="border-ink/[0.06] bg-surface/90 sticky top-16 z-30 -mx-5 border-b backdrop-blur-lg lg:hidden">
        <nav
          aria-label="Guide sections"
          ref={chipBarRef}
          className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 py-2.5"
        >
          {items.map(item => (
            <a
              key={item.id}
              data-id={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`inter shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                active === item.id
                  ? 'bg-panel text-white'
                  : 'bg-ink/[0.04] text-ink-muted'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Desktop: sticky sidebar */}
      <nav
        aria-label="Guide sections"
        className="sticky top-24 hidden lg:block"
      >
        <p className="inter text-ink-subtle mb-3 px-3 text-[11px] font-semibold tracking-[0.16em] uppercase">
          On this page
        </p>
        <ul className="border-ink/[0.07] space-y-0.5 border-l">
          {items.map(item => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inter -ml-px block border-l-2 py-1.5 pl-4 text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-ink border-[#1a7f5a] font-medium'
                      : 'text-ink-muted hover:border-ink/20 hover:text-ink border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default GuideToc;
