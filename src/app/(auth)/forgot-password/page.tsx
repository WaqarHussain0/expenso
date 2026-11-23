import { redirect } from 'next/navigation';
import { getServerSideSession } from '@/lib/next-auth.util';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import type { Metadata } from 'next';
import ForgotPasswordWrapper from './ForgotPassword.wrapper';

// Account-recovery screens have nothing worth indexing
export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
};

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(PAGE_ROUTES.dashboard);
  }

  return <ForgotPasswordWrapper />;
};

export default Page;
