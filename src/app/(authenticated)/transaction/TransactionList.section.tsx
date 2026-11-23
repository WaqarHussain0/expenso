import { redirect } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import TransactionTable from '@/components/feature/transaction/Transaction.table';
import { CategoryTypeEnum } from '@/types/category.type';
import TransactionPagination from './TransactionPagination';

const transactionService = new TransactionService();

export const PAGE_SIZE = 6;

const TABLE_CLASS = 'scroll-area lg:min-h-0 lg:flex-1 lg:overflow-y-auto';

interface ITransactionListSectionProps {
  userId: string;
  page: number;
  search: string;
  type: CategoryTypeEnum | undefined;
  categoryId: string | undefined;
}

/** The filtered, paginated transaction table. Streams in behind its own skeleton. */
const TransactionListSection = async ({
  userId,
  page,
  search,
  type,
  categoryId,
}: ITransactionListSectionProps) => {
  const { data, meta } = await transactionService.findAll({
    page,
    limit: PAGE_SIZE,
    search,
    categoryType: type,
    userId,
    categoryId,
  });

  // Asked for a page past the end (e.g. the last entry on the last page was
  // deleted) — go back to the first page.
  if (meta.totalRecords > 0 && page > meta.totalPages && !search) {
    redirect(PAGE_ROUTES.transaction);
  }

  return (
    <>
      <TransactionTable className={TABLE_CLASS} transactions={data || []} />

      {data.length !== 0 && (
        <TransactionPagination
          page={page}
          totalPages={meta.totalPages}
          totalRecords={meta.totalRecords}
        />
      )}
    </>
  );
};

/** Header + one day group of rows, matching the loaded table's shape. */
export const TransactionListSkeleton = () => (
  <div
    className={TABLE_CLASS}
    aria-busy="true"
    aria-label="Loading transactions"
  >
    <div className="border-ink/[0.06] flex items-center justify-between border-b px-4 py-3">
      <Skeleton width={70} height={12} />
      <Skeleton width={60} height={12} />
    </div>

    <div className="bg-surface-2/95 px-4 py-2">
      <Skeleton width={120} height={12} />
    </div>

    {Array.from({ length: PAGE_SIZE }, (_, i) => (
      <div
        key={i}
        className="border-ink/[0.06] flex items-center gap-3 border-b px-4 py-3"
      >
        <Skeleton width={36} height={36} borderRadius={12} />
        <div className="min-w-0 flex-1">
          <Skeleton width="40%" height={13} />
          <Skeleton width={64} height={16} className="mt-1" />
        </div>
        <div className="hidden flex-1 md:block">
          <Skeleton width="60%" height={13} />
        </div>
        <Skeleton width={70} height={14} />
      </div>
    ))}
  </div>
);

export default TransactionListSection;
