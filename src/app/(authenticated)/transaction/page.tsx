import { redirect } from 'next/navigation';
import TransactionWrapper from './Transaction.wrapper';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { CategoryTypeEnum } from '@/types/category.type';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
}>;

const transactionService = new TransactionService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search = '', type } = await searchParams;

  const normalizedType =
    type === CategoryTypeEnum.INCOME ||
    type === CategoryTypeEnum.EXPENSE ||
    type === CategoryTypeEnum.INVESTMENT
      ? type
      : undefined;

  const transactionPayload = {
    page: Number(page),
    limit: 6,
    search: search,
    categoryType: normalizedType,
  };

  const data = await transactionService.findAll(transactionPayload);

  if (
    data.data.length !== 0 &&
    data?.meta?.totalPages < Number(page) &&
    !search
  ) {
    return redirect(`${PAGE_ROUTES.transaction}`);
  }

  return (
    <TransactionWrapper
      transactions={data.data || []}
      meta={data?.meta || {}}
      currentPage={Number(page)}
    />
  );
};

export default Page;
