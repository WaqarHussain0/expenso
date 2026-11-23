import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CategoryTypeEnum } from '@/types/category.type';
import { getServerSideSession } from '@/lib/next-auth.util';
import TransactionWrapper from './Transaction.wrapper';
import TransactionStatsSection, {
  TransactionStatsSkeleton,
} from './TransactionStats.section';
import TransactionListSection, {
  TransactionListSkeleton,
} from './TransactionList.section';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
  categoryId?: string;
}>;

const CATEGORY_TYPES = Object.values(CategoryTypeEnum) as string[];

/**
 * Renders the shell (header, filters) right away and streams the monthly
 * stats and the table in separately, each behind its own skeleton.
 */
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const {
    page: rawPage,
    search = '',
    type,
    categoryId,
  } = await searchParams;

  const session = await getServerSideSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(PAGE_ROUTES.login);
  }

  const page = Math.max(Number(rawPage) || 1, 1);
  const normalizedType =
    type && CATEGORY_TYPES.includes(type) ? type : undefined;

  return (
    <TransactionWrapper
      stats={
        <Suspense fallback={<TransactionStatsSkeleton />}>
          <TransactionStatsSection userId={userId} />
        </Suspense>
      }
      list={
        // A new key per filter combination shows the table skeleton while
        // the next page/search/type/category loads, instead of stale rows.
        <Suspense
          key={`${page}|${search}|${normalizedType ?? 'all'}|${categoryId ?? ''}`}
          fallback={<TransactionListSkeleton />}
        >
          <TransactionListSection
            userId={userId}
            page={page}
            search={search}
            type={normalizedType}
            categoryId={categoryId}
          />
        </Suspense>
      }
    />
  );
};

export default Page;
