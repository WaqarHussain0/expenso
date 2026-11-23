'use client';

import { useEffect } from 'react';

/**
 * Scrolls to the URL's #hash once the page content is actually on screen.
 *
 * Needed because these pages render on demand: the browser applies the hash
 * while the streamed loading state is showing, and client-side navigations
 * (e.g. footer link → /guide#assistant) don't re-apply it after render.
 */
const HashScroll = () => {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const scroll = () =>
      document.getElementById(id)?.scrollIntoView({ block: 'start' });

    // Once after paint, again when web fonts settle (text reflow can shift it)
    const frame = requestAnimationFrame(scroll);
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && scroll());

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
};

export default HashScroll;
