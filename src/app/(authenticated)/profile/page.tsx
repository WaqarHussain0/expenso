import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '@/lib/next-auth.util';
import ProfileWrapper from './Profile.wrapper';
import {
  AiKeysSection,
  AiKeysSkeleton,
  ProfileFormSection,
  ProfileFormSkeleton,
} from './Profile.sections';

/**
 * Renders the header right away and streams the profile form and the AI keys
 * card separately, each behind its own skeleton.
 */
const Page = async () => {
  const session = await getServerSideSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(PAGE_ROUTES.login);
  }

  return (
    <ProfileWrapper
      profile={
        <Suspense fallback={<ProfileFormSkeleton />}>
          <ProfileFormSection userId={userId} />
        </Suspense>
      }
      aiKeys={
        <Suspense fallback={<AiKeysSkeleton />}>
          <AiKeysSection userId={userId} />
        </Suspense>
      }
    />
  );
};

export default Page;
