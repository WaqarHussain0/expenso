/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';
import { CategoryService } from '@/backend/modules/category/category.service';

const categoryService = new CategoryService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();

    // Create transaction using the service
    await categoryService.setPreferences(userMonogoObjectId, body);

    return NextResponse.json(
      {
        message: 'Preferences added!',
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
});
