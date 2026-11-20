import { getServerSideSession } from '@/lib/next-auth.util';
import ProfileWrapper from './Profile.wrapper';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import mongoose from 'mongoose';
import { AiKeysService } from '@/backend/modules/ai-keys/ai-keys.service';

const userProfileService = new UserProfileService();
const aiKeysService = new AiKeysService();
const Page = async () => {
  const session = await getServerSideSession();
  const user = session?.user;

  if (!user) {
    redirect(PAGE_ROUTES.login);
  }

  const userMonogoObjectId = new mongoose.Types.ObjectId(user?.id);

  const [userData, aiKeys] = await Promise.all([
    userProfileService.getProfileByUserId(userMonogoObjectId),
    aiKeysService.listForUser(user.id),
  ]);

  return <ProfileWrapper user={userData} aiKeys={aiKeys} />;
};

export default Page;
