/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import 'reflect-metadata';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

import { UserService } from '@/backend/modules/user/user.service';
import { UserGenderEnum } from '@/types/user-profile.type';
import { CreateUserProfileDto } from '@/backend/modules/user/dto/create-user-profile.dto';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { StatsService } from '@/backend/modules/stats/stats.service';
import { getServerSideSession } from '../next-auth.util';

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
  userId: string;
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
    const userId = new mongoose.Types.ObjectId(id);

    await userService.toggleUserStatus(userId);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function setUserProfileAction(
  id: string,
  payload: ISetProfilePayload,
): Promise<ActionResult> {
  try {
    const userId = new mongoose.Types.ObjectId(id);

    const profilePayload = {
      contact: payload.contact,
      gender: payload.gender,
      name: payload.name,
    };

    // Transform to DTO and validate
    const dto = await validateDto(CreateUserProfileDto, profilePayload);

    await userProfileService.CreateOrUpdateUserProfile(userId, dto);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    const userId = new mongoose.Types.ObjectId(id);
    await userService.delete(userId);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function getStatsLinkAction(body: any): Promise<ActionResult> {
  try {
    const user = await getServerSideSession();
    const userId = new mongoose.Types.ObjectId(user?.user.id);

    const { startDate, endDate, year, type } = body;

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
