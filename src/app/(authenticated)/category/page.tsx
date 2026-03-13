import { CategoryService } from '@/backend/modules/category/category.service';
import CategoryWrapper from './Category.wrapper';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CategoryTypeEnum } from '@/types/category.type';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
}>;

const categoryService = new CategoryService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search, type } = await searchParams;

  const normalizedType =
    type === CategoryTypeEnum.INCOME ||
    type === CategoryTypeEnum.EXPENSE ||
    type === CategoryTypeEnum.INVESTMENT
      ? type
      : undefined;

  const data = await categoryService.findAll({
    page: Number(page),
    limit: 6,
    search: search || '',
    type: normalizedType,
    isServerSide: true,
  });

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
    />
  );
};

export default Page;
