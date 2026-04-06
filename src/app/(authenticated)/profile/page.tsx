import { unstable_noStore as noStore } from 'next/cache';

import { getServerSideSession } from '@/lib/next-auth.util';
import ProfileWrapper from './Profile.wrapper';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';

const userProfileService = new UserProfileService();
const Page = async () => {

  noStore(); // 🚀 disables caching for this render
  
  const session = await getServerSideSession();
  const user = session?.user;

  const userData = await userProfileService.getProfileByUserId(user?.id || '');

  return <ProfileWrapper user={userData} />;
};

export default Page;
