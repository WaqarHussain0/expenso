import { redirect } from 'next/navigation';
import TransactionWrapper from './Transaction.wrapper';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';

type SearchParams = Promise<{
  page?: string;
  search?: string;
}>;

const transactionService = new TransactionService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search } = await searchParams;

  const data = await transactionService.findAll({
    page: Number(page),
    limit: 6,
    search: search || '',
    isServerSide: true,
  });

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
