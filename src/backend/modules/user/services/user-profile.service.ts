/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import mongoose from 'mongoose';
import UserProfileEntity from '../entities/user-profile.entity';
import { CreateUserProfileDto } from '../dto/create-user-profile.dto';
import { UserService } from '../user.service';

const userService = new UserService();
export class UserProfileService {
  private readonly userProfileEntity = UserProfileEntity;

  async getProfileByUserId(
    userId: string | mongoose.Types.ObjectId,
    throwException = false,
  ) {
    await initDB();

    const [user, profile] = await Promise.all([
      userService.findById(userId),
      this.userProfileEntity.findOne({ userId }).lean(),
    ]);

    if (!profile && throwException) {
      throw new Error(`Profile for user with id ${userId} not found`);
    }

    const data = {
      id: user?._id?.toString() || '',
      role: user?.role,
      name: user?.name,
      email: user?.email,
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
    const { contact, gender, name } = payload;
    await initDB();

    const existingProfile = await this.userProfileEntity.findOne({ userId });

    if (existingProfile) {
      existingProfile.contact = contact || existingProfile.contact;
      existingProfile.gender = gender || existingProfile.gender;
      await existingProfile.save();

      if (name) {
        await userService.updateUser(userId, { name });
      }
    } else {
      const newProfile = new this.userProfileEntity({
        userId,
        contact,
        gender,
      });
      await newProfile.save();

      if (name) {
        await userService.updateUser(userId, { name });
      }
    }

    return await this.getProfileByUserId(userId, true);
  }
}
