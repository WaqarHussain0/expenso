import mongoose from 'mongoose';
import { getServerSideSession } from '../next-auth.util';
import { UserService } from '@/backend/modules/user/user.service';
import { UserRoleEnum } from '@/types/user.type';

/**
 * Every exported function in a 'use server' file is a public HTTP endpoint:
 * anyone can call it with any arguments. These helpers derive identity from
 * the session (never from arguments) and must run at the top of each action.
 */

export class ActionAuthError extends Error {
  constructor(message = 'You need to be signed in to do that.') {
    super(message);
    this.name = 'ActionAuthError';
  }
}

const userService = new UserService();

export interface IActionUser {
  id: string;
  objectId: mongoose.Types.ObjectId;
  role?: string;
}

/** The signed-in user, or throws. */
export async function requireUser(): Promise<IActionUser> {
  const session = await getServerSideSession();
  const id = session?.user?.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ActionAuthError();
  }

  return {
    id,
    objectId: new mongoose.Types.ObjectId(id),
    role: session.user.role,
  };
}

/**
 * The signed-in admin, or throws. The role is re-read from the database so a
 * demoted or deactivated admin loses access immediately, not when their
 * session token expires.
 */
export async function requireAdmin(): Promise<IActionUser> {
  const user = await requireUser();
  const dbUser = await userService.findById(user.objectId).catch(() => null);

  if (
    !dbUser ||
    dbUser.isActive === false ||
    dbUser.role !== UserRoleEnum.ADMIN
  ) {
    throw new ActionAuthError('Admin access required.');
  }

  return { ...user, role: dbUser.role };
}

/** Parse an id from client input, rejecting malformed values. */
export function toObjectId(id: unknown, label = 'id'): mongoose.Types.ObjectId {
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${label}.`);
  }
  return new mongoose.Types.ObjectId(id);
}
