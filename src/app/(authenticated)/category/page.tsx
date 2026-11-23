import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CategoryTypeEnum } from '@/types/category.type';
import { getServerSideSession } from '@/lib/next-auth.util';
import CategoryWrapper from './Category.wrapper';
import CategoryStatsSection, {
  CategoryStatsSkeleton,
} from './CategoryStats.section';
import CategoryListSection, {
  CategoryListSkeleton,
} from './CategoryList.section';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
}>;

const CATEGORY_TYPES = Object.values(CategoryTypeEnum) as string[];

/**
 * Renders the shell (header, filters) right away and streams the stats and
 * the list in separately, each behind its own skeleton.
 */
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page: rawPage, search = '', type } = await searchParams;

  const session = await getServerSideSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(PAGE_ROUTES.login);
  }

  const page = Math.max(Number(rawPage) || 1, 1);
  const normalizedType =
    type && CATEGORY_TYPES.includes(type) ? type : undefined;

  return (
    <CategoryWrapper
      stats={
        <Suspense fallback={<CategoryStatsSkeleton />}>
          <CategoryStatsSection userId={userId} />
        </Suspense>
      }
      list={
        // A new key per filter combination shows the list skeleton while
        // the next page/search/type loads, instead of keeping stale rows.
        <Suspense
          key={`${page}|${search}|${normalizedType ?? 'all'}`}
          fallback={<CategoryListSkeleton />}
        >
          <CategoryListSection
            userId={userId}
            page={page}
            search={search}
            type={normalizedType}
          />
        </Suspense>
      }
    />
  );
};

export default Page;
