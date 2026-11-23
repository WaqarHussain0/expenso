import { unstable_cache } from 'next/cache';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

/** Cache tag for one user's category counts. Expire it whenever their categories change. */
export const categoryStatsTag = (userId: string) => `category-stats:${userId}`;

/**
 * Per-user category counts (income / expense / investment).
 *
 * The counts don't depend on the category page's search, type or page filters,
 * so they're cached instead of re-queried on every filter change. The category
 * server actions expire the tag on create / update / delete / preferences;
 * `revalidate` is only a safety net.
 */
export const getCachedCategoryStats = (userId: string) =>
  unstable_cache(
    () => categoryService.getCategoryStats(userId),
    ['category-stats', userId],
    { tags: [categoryStatsTag(userId)], revalidate: 3600 },
  )();
