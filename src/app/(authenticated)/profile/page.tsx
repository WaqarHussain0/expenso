import { getServerSideSession } from '@/lib/next-auth.util';
import ProfileWrapper from './Profile.wrapper';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import mongoose from 'mongoose';

const userProfileService = new UserProfileService();
const Page = async () => {
  const session = await getServerSideSession();
  const user = session?.user;

  if (!user) {
    redirect(PAGE_ROUTES.login);
  }

  const userMonogoObjectId = new mongoose.Types.ObjectId(user?.id);

  console.log({userMonogoObjectId})
  const userData =
    await userProfileService.getProfileByUserId(userMonogoObjectId);

    console.log('userData:',userData)

  return <ProfileWrapper user={userData} />;
};

export default Page;
