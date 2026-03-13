import { redirect } from 'next/navigation';
import PAGE_ROUTES from './constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(PAGE_ROUTES.dashboard);
  }

  redirect(PAGE_ROUTES.login);
};

export default Page;
