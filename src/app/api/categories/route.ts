/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CategoryService } from '@/backend/modules/category/category.service';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';

const categoryService = new CategoryService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateCategoryDto, body);

    // Create category
    await categoryService.create(dto, userMonogoObjectId);

    return NextResponse.json(
      {
        message: 'Category added!',
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
