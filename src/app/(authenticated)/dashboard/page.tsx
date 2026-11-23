import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import { UserService } from '@/backend/modules/user/user.service';
import DashboardWrapper from './Dashboard.wrapper';
import {
  DashboardStatsSection,
  DashboardStatsSkeleton,
  FreeCashSection,
  FreeCashSkeleton,
  RecentTransactionsSection,
  RecentTransactionsSkeleton,
} from './Dashboard.sections';

const userService = new UserService();

/**
 * Renders the shell (greeting, quick actions) right away and streams the
 * free-cash hero figures, stat cards and recent transactions separately.
 */
const Page = async () => {
  const session = await getServerSideSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(PAGE_ROUTES.login);
  }

  // Not awaited: the quick actions read it with use(), so the shell doesn't
  // wait on it. A failed lookup just hides the "Setup Workspace" action.
  const isFirstLogin = userService
    .isFirstLogin(userId)
    .then(Boolean)
    .catch(() => false);

  return (
    <DashboardWrapper
      isFirstLogin={isFirstLogin}
      freeCash={
        <Suspense fallback={<FreeCashSkeleton />}>
          <FreeCashSection userId={userId} />
        </Suspense>
      }
      stats={
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStatsSection userId={userId} />
        </Suspense>
      }
      recent={
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactionsSection userId={userId} />
        </Suspense>
      }
    />
  );
};

export default Page;
