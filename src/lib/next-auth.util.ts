import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { runAsReadOnlySessionRead } from './auth-context';

/**
 * Session for server components / server actions. Runs in "read-only" mode
 * so it never rotates refresh tokens (it couldn't persist the new cookie).
 */
export async function getServerSideSession() {
  return await runAsReadOnlySessionRead(() => getServerSession(authOptions));
}
