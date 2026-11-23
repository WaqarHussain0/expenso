import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { UserInsightsService } from './user-insights.service';

const insightsService = new UserInsightsService();

/** Cache tag for the admin users overview. Expire it on admin user changes. */
export const ADMIN_OVERVIEW_TAG = 'admin-overview';

/**
 * App-wide user/usage overview for the admin users page (about a dozen
 * aggregations).
 *
 * It doesn't depend on the list's search/filters/page, so it's cached: without
 * this, every filter change on the page would re-run all of it and hold up the
 * navigation. Admin status/delete actions expire the tag; anything else
 * (sign-ups, transactions, AI keys) shows up within `revalidate` seconds.
 * `cache()` dedupes the call between the stats row and the insights view.
 */
export const getCachedAdminOverview = cache(() =>
  unstable_cache(() => insightsService.getOverview(), ['admin-overview'], {
    tags: [ADMIN_OVERVIEW_TAG],
    revalidate: 300,
  })(),
);
