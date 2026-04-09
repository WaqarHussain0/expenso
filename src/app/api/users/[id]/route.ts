/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { UserService } from '@/backend/modules/user/user.service';
import { withAdmin } from '@/backend/utils/guard/withAdmin';

const userService = new UserService();

export const DELETE = withAdmin(
  async (
    req: NextRequest,
    user,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const monogoObjectId = new mongoose.Types.ObjectId(id);

    try {
      const response = await userService.delete(monogoObjectId);

      return NextResponse.json(response, { status: 200 });
    } catch (err: any) {
      console.error('Error deleting user:', err);

      return NextResponse.json(
        { error: err.message || 'Something went wrong' },
        { status: 400 },
      );
    }
  },
);
