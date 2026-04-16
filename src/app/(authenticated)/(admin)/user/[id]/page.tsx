import { UserService } from '@/backend/modules/user/user.service';
import UserDetailsWrapper from './UserDetails.wrapper';
import mongoose from 'mongoose';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const userService = new UserService();
const transactionService = new TransactionService();

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <>Invalid user id</>;
  }

  const [data, currrentMonthStats] = await Promise.all([
    userService.getUserData(id),
    transactionService.getMonthlyStats(id),
  ]);

  return <UserDetailsWrapper userData={data} monthStats={currrentMonthStats} />;
};

export default Page;
