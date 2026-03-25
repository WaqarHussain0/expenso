import { redirect } from 'next/navigation';
import TransactionWrapper from './Transaction.wrapper';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { CategoryTypeEnum } from '@/types/category.type';
import { getServerSideSession } from '@/lib/next-auth.util';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: CategoryTypeEnum;
}>;

const transactionService = new TransactionService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search = '', type } = await searchParams;

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

  const transactionPayload = {
    page: Number(page),
    limit: 5,
    search: search,
    categoryType: normalizedType,
    userId: user.id,
  };

  const [data, stats] = await Promise.all([
    transactionService.findAll(transactionPayload),
    transactionService.getMonthlyStats(user.id),
  ]);

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
      monthStats={stats}
    />
  );
};

export default Page;
