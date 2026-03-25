import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { getServerSideSession } from '@/lib/next-auth.util';
import { redirect } from 'next/navigation';
import DashboardWrapper from './Dashboard.wrapper';

const transactionService = new TransactionService();

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  const activeUser = session?.user;

  // If user is already authenticated, redirect to dashboard
  if (!session?.user) {
    redirect(PAGE_ROUTES.login);
  }

  const transactionPayload = {
    page: 1,
    limit: 3,
    userId: activeUser?.id || '',
  };

  const [data, stats] = await Promise.all([
    transactionService.findAll(transactionPayload),
    transactionService.getUserStats(activeUser?.id || ''),
  ]);

  return (
    <>
      <DashboardWrapper
        user={activeUser}
        transactions={data.data || []}
        totals={stats.totals}
      />
    </>
  );
};

export default Page;
