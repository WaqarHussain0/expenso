/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryService } from '@/backend/modules/category/category.service';
import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';

const categoryService = new CategoryService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Create category using the service
    const category = await categoryService.findAll({
      limit: body.limit || 5,
      page: 1,
      search: body.name,
      type: undefined,
    });

    // Return success response
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
