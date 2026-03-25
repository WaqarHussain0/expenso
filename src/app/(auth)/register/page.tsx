import { redirect } from 'next/navigation';
import { getServerSideSession } from '@/lib/next-auth.util';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import RegisterWrapper from './Register.wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Expenso Account',
  description:
    'Sign up for Expenso and start tracking your expenses, income, and investments with powerful financial insights.',
};

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(PAGE_ROUTES.dashboard);
  }

  return <RegisterWrapper />;
};

export default Page;
