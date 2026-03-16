/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryService } from '@/backend/modules/category/category.service';
import { withAuth } from '@/backend/utils/guard/withAuth';
import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';

const categoryService = new CategoryService();

export const POST = withAuth(async (req: NextRequest) => {
  try {
    // Parse JSON body
    const body = await req.json();

    const category = await categoryService.findAll({
      limit: body.limit || 5,
      page: 1,
      search: body.name,
      type: undefined,
    });

    // Return success response
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
});
