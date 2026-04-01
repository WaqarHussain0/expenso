import { getServerSideSession } from '@/lib/next-auth.util';
import PreferenceWrapper from './Preference.wrapper';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { UserService } from '@/backend/modules/user/user.service';

const userService = new UserService();

const Page = async () => {
  // Get the user session on the server
  const session = await getServerSideSession();

  // If user is already authenticated, redirect to dashboard
  if (!session?.user || !session.user.id) {
    redirect(PAGE_ROUTES.login);
  }

  const isFirstLogin = await userService.isFirstLogin(session.user.id);

  if (!isFirstLogin) {
    redirect(PAGE_ROUTES.dashboard);
  }

  return <PreferenceWrapper userId={session.user.id} />;
};

export default Page;
