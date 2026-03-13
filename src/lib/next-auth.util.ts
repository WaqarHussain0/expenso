import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

export async function getServerSideSession() {
  return await getServerSession(authOptions);
}
