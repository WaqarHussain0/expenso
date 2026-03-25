import { redirect } from 'next/navigation';
import { getServerSideSession } from '@/lib/next-auth.util';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import ResetPasswordWrapper from './ResetPassword.wrapper';

type SearchParams = Promise<{
  token: string;
}>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { token } = await searchParams;

  if (!token) {
    redirect(PAGE_ROUTES.login);
  }

  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(PAGE_ROUTES.dashboard);
  }

  return <ResetPasswordWrapper token={token} />;
};

export default Page;
