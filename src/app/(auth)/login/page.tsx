import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import LoginWrapper from './Login.wrapper';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to Expenso to track your expenses, income and investments, and see your monthly budget at a glance.',
  alternates: { canonical: '/login' },
};

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
