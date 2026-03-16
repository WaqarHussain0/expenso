import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import { redirect } from 'next/navigation';
import DashboardWrapper from './Dashboard.wrapper';

const Page = async () => {
  const session = await getServerSideSession();
  const user = session?.user;

  if (!user?.id) {
    redirect(PAGE_ROUTES.dashboard);
  }
  return <DashboardWrapper />;
};

export default Page;
