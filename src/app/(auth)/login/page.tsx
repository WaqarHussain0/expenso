import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import LoginWrapper from './Login.wrapper';

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(PAGE_ROUTES.dashboard);
  }

  return <LoginWrapper />;
};

export default Page;
