/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import 'reflect-metadata';
import { revalidatePath, updateTag } from 'next/cache';

import { UserService } from '@/backend/modules/user/user.service';
import { ADMIN_OVERVIEW_TAG } from '@/backend/modules/user/services/admin-overview.cache';
import { UserGenderEnum } from '@/types/user-profile.type';
import { CreateUserProfileDto } from '@/backend/modules/user/dto/create-user-profile.dto';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { StatsService } from '@/backend/modules/stats/stats.service';
import { requireAdmin, requireUser, toObjectId } from './action-guard';

const userService = new UserService();
const userProfileService = new UserProfileService();
const statsService = new StatsService();

enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

interface ISetProfilePayload {
  name: string;
  gender: UserGenderEnum;
  contact: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
  url?: string;
}

export async function toggleUserStatusAction(
  id: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const userId = toObjectId(id, 'user id');
    if (userId.equals(admin.objectId)) {
      throw new Error("You can't deactivate your own account.");
    }

    await userService.toggleUserStatus(userId);

    updateTag(ADMIN_OVERVIEW_TAG);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

/** Updates the signed-in user's own profile — the id comes from the session. */
export async function setUserProfileAction(
  payload: ISetProfilePayload,
): Promise<ActionResult> {
  try {
    const { objectId: userId } = await requireUser();

    const profilePayload = {
      contact: payload.contact,
      gender: payload.gender,
      name: payload.name,
    };

    // Transform to DTO and validate
    const dto = await validateDto(CreateUserProfileDto, profilePayload);

    await userProfileService.CreateOrUpdateUserProfile(userId, dto);

    updateTag(ADMIN_OVERVIEW_TAG);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const userId = toObjectId(id, 'user id');
    if (userId.equals(admin.objectId)) {
      throw new Error("You can't delete your own account here.");
    }
    await userService.delete(userId);

    updateTag(ADMIN_OVERVIEW_TAG);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function getStatsLinkAction(body: any): Promise<ActionResult> {
  try {
    const { objectId: userId } = await requireUser();

    const { startDate, endDate, year, type } = body ?? {};

    const payload: any = {
      userId,
      filter: { type, startDate, endDate, year },
    };

    switch (type) {
      case FilterOptionEnum.MONTH: {
        if (!startDate || !endDate) {
          throw new Error(
            'startDate and endDate are required for month filter',
          );
        }

        break;
      }

      case FilterOptionEnum.YEAR: {
        if (!year) {
          throw new Error('year is required for year filter');
        }

        break;
      }

      case FilterOptionEnum.CUSTOM: {
        if (!endDate || !startDate) {
          throw new Error('endDate, startDate, are required for custom filter');
        }

        break;
      }

      default:
        throw new Error(`Invalid filterBy value: ${type}`);
    }

    const shareableLink = await statsService.createSharedLink(payload);

    revalidatePath('/');
    return { success: true, url: shareableLink };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}
