'use client';

import dynamic from 'next/dynamic';

/**
 * Add/edit dialogs are only needed after a click, so their code (forms,
 * icon grid, category search) is split out of the page bundle and fetched
 * on first open. Render these conditionally (`{open && <LazyX … />}`) so the
 * chunk isn't requested until it's actually needed.
 */
export const LazyCategoryDialog = dynamic(
  () => import('./category/Category.dialog'),
  { ssr: false },
);

export const LazyTransactionDialog = dynamic(
  () => import('./transaction/Transaction.dialog'),
  { ssr: false },
);
