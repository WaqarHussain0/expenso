/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { CreateUserProfileDto } from '@/backend/modules/user/dto/create-user-profile.dto';

const userProfileService = new UserProfileService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();

    const profilePayload = {
      contact: body.contact,
      gender: body.gender,
    };

    // Transform to DTO and validate
    const dto = await validateDto(CreateUserProfileDto, profilePayload);

    await userProfileService.CreateOrUpdateUserProfile(userMonogoObjectId, dto);

    return NextResponse.json(
      {
        message: 'Profile saved!',
        success: true,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
});
