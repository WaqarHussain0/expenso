import { CategoryService } from '@/backend/modules/category/category.service';
import CategoryWrapper from './Category.wrapper';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CategoryTypeEnum } from '@/types/category.type';
import { getServerSideSession } from '@/lib/next-auth.util';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
}>;

const categoryService = new CategoryService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search, type } = await searchParams;

  const session = await getServerSideSession();
  const user = session?.user;

  if (!user?.id) {
    redirect(PAGE_ROUTES.login);
  }

  const normalizedType =
    type === CategoryTypeEnum.INCOME ||
    type === CategoryTypeEnum.EXPENSE ||
    type === CategoryTypeEnum.INVESTMENT
      ? type
      : undefined;

  const catPayload = {
    page: Number(page),
    limit: 5,
    search: search || '',
    type: normalizedType,
    userId: user.id,
  };

  const [data, stats] = await Promise.all([
    categoryService.findAll(catPayload),
    categoryService.getCategoryStats(user.id),
  ]);

  if (
    data.data.length !== 0 &&
    data?.meta?.totalPages < Number(page) &&
    !search
  ) {
    return redirect(`${PAGE_ROUTES.category}`);
  }

  return (
    <CategoryWrapper
      categories={data.data || []}
      meta={data?.meta || {}}
      currentPage={Number(page)}
      categoryStats={stats}
    />
  );
};

export default Page;
