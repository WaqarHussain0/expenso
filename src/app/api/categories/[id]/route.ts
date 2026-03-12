import { CategoryService } from '@/backend/modules/category/category.service';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import 'reflect-metadata';

const categoryService = new CategoryService();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: mongoose.Types.ObjectId }> },
) {
  const { id } = await params;

  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateCategoryDto, body);

    // Update user using the service
    const data = await categoryService.update(id, dto);

    // Return success response
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    // Handle validation errors or service errors
    console.error('Error updating user:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: mongoose.Types.ObjectId }> },
) {
  const { id } = await params;

  try {
    const data = await categoryService.delete(id);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    // Handle validation errors or service errors
    console.error('Error deleting user:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
