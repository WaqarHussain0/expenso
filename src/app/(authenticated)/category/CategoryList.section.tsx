import { redirect } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CategoryService } from '@/backend/modules/category/category.service';
import CategoryTable from '@/components/feature/category/Category.table';
import { CategoryTypeEnum } from '@/types/category.type';
import CategoryPagination from './CategoryPagination';

const categoryService = new CategoryService();

export const PAGE_SIZE = 8;

const TABLE_CLASS =
  'scroll-area bg-surface-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto';

interface ICategoryListSectionProps {
  userId: string;
  page: number;
  search: string;
  type: CategoryTypeEnum | undefined;
}

/** The filtered, paginated category grid. Streams in behind its own skeleton. */
const CategoryListSection = async ({
  userId,
  page,
  search,
  type,
}: ICategoryListSectionProps) => {
  const { data, meta } = await categoryService.findAll({
    page,
    limit: PAGE_SIZE,
    search,
    type,
    userId,
  });

  // Asked for a page past the end (e.g. the last item on the last page was
  // deleted) — go back to the first page.
  if (meta.totalRecords > 0 && page > meta.totalPages && !search) {
    redirect(PAGE_ROUTES.category);
  }

  return (
    <>
      <CategoryTable className={TABLE_CLASS} categories={data || []} />

      {data.length !== 0 && (
        <CategoryPagination
          page={page}
          totalPages={meta.totalPages}
          totalRecords={meta.totalRecords}
        />
      )}
    </>
  );
};

/** Same grid shape as the loaded list, so nothing jumps when it arrives. */
export const CategoryListSkeleton = () => (
  <div className={TABLE_CLASS} aria-busy="true" aria-label="Loading categories">
    <div className="grid h-fit w-full grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:p-4 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }, (_, i) => (
        <div
          key={i}
          className="border-ink/[0.06] bg-surface flex items-center gap-3 rounded-xl border p-3.5"
        >
          <Skeleton width={44} height={44} borderRadius={12} />
          <div className="min-w-0 flex-1">
            <Skeleton width="60%" height={14} />
            <Skeleton width={64} height={18} className="mt-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryListSection;
