import { NextRequest } from 'next/server';
import { authGuard } from './authGuard';
import { UserRoleEnum } from '@/backend/modules/user/entities/user.entity';

export function adminGuard(req: NextRequest) {
  const user = authGuard(req);

  if (user.role !== UserRoleEnum.ADMIN) {
    throw new Error('Admin access required');
  }

  return user;
}
