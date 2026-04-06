/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import mongoose from 'mongoose';
import UserProfileEntity from '../entities/user-profile.entity';
import { CreateUserProfileDto } from '../dto/create-user-profile.dto';
import { IUser } from '../entities/user.entity';

export class UserProfileService {
  private readonly userProfileEntity = UserProfileEntity;

  async getProfileByUserId(
    userId: string | mongoose.Types.ObjectId,
    throwException = false,
  ) {
    await initDB();

    const profile = await this.userProfileEntity
      .findOne({ userId })
      .populate('userId')
      .lean();

    if (!profile && throwException) {
      throw new Error(`Profile for user with id ${userId} not found`);
    }

    const user = profile?.userId as IUser;

    const data = {
      id: user._id?.toString() || '',
      role: user.role,
      name: user.name,
      email: user.email,
      profile: {
        _id: profile?._id?.toString() || '',
        contact: profile?.contact,
        gender: profile?.gender,
      },
    };

    return data;
  }

  async CreateOrUpdateUserProfile(
    userId: string | mongoose.Types.ObjectId,
    payload: CreateUserProfileDto,
  ) {
    const { contact, gender } = payload;
    await initDB();

    const existingProfile = await this.userProfileEntity.findOne({ userId });

    if (existingProfile) {
      existingProfile.contact = contact || existingProfile.contact;
      existingProfile.gender = gender || existingProfile.gender;
      await existingProfile.save();
    } else {
      const newProfile = new this.userProfileEntity({
        userId,
        contact,
        gender,
      });
      await newProfile.save();
    }

    return await this.getProfileByUserId(userId, true);
  }
}
