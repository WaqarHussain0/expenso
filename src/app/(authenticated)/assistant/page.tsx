import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import { redirect } from 'next/navigation';
import AssistantWrapper from './Assistant.wrapper';

const Page = async () => {
  const session = await getServerSideSession();

  if (!session?.user) {
    redirect(PAGE_ROUTES.login);
  }

  return <AssistantWrapper />;
};

export default Page;
