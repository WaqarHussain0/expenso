/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';
import { UserService } from '@/backend/modules/user/user.service';

const userService = new UserService();

export const PATCH = withAuth(
  async (
    req: NextRequest,
    user,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      const userMonogoObjectId = new mongoose.Types.ObjectId((await params).id);

      await userService.toggleUserStatus(userMonogoObjectId);

      return NextResponse.json(
        {
          message: 'User status updated!',
          success: true,
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error('Error creating category:', error);

      return NextResponse.json(
        { error: error.message || 'Something went wrong' },
        { status: 400 },
      );
    }
  },
);
