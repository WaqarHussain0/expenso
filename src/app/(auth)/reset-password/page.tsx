import { redirect } from 'next/navigation';
import { getServerSideSession } from '@/lib/next-auth.util';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import type { Metadata } from 'next';
import ResetPasswordWrapper from './ResetPassword.wrapper';

// Account-recovery screens have nothing worth indexing
export const metadata: Metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
};

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
