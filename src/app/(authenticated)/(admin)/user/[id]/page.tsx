import { UserService } from '@/backend/modules/user/user.service';
import UserDetailsWrapper from './UserDetails.wrapper';
import mongoose from 'mongoose';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const userService = new UserService();

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <>Invalid user id</>;
  }

  const data = await userService.getUserData(id);

  return <UserDetailsWrapper userData={data} />;
};

export default Page;
