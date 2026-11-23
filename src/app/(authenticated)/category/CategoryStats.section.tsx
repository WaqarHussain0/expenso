import StatWrapper from '@/components/common/Stat.wrapper';
import { COLOR_CODES } from '@/app/constants/app.constant';
import { getCachedCategoryStats } from '@/backend/modules/category/category-stats.cache';

const GRID_CLASS = 'grid-cols-1 sm:grid-cols-3';

/** Streams in on its own, so the page shell never waits on the counts. */
const CategoryStatsSection = async ({ userId }: { userId: string }) => {
  const { income, expense, investment } = await getCachedCategoryStats(userId);

  const total = income + expense + investment;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  const hint = `of ${total} ${total === 1 ? 'category' : 'categories'}`;

  return (
    <StatWrapper
      className={GRID_CLASS}
      stats={[
        {
          label: 'Income',
          value: income,
          percent: pct(income),
          color: COLOR_CODES.income,
          hint,
        },
        {
          label: 'Expense',
          value: expense,
          percent: pct(expense),
          color: COLOR_CODES.expense,
          hint,
        },
        {
          label: 'Investment',
          value: investment,
          percent: pct(investment),
          color: COLOR_CODES.investment,
          hint,
        },
      ]}
    />
  );
};

export const CategoryStatsSkeleton = () => (
  <StatWrapper stats={[]} isLoading skeletonCount={3} className={GRID_CLASS} />
);

export default CategoryStatsSection;
