/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CategoryService } from '@/backend/modules/category/category.service';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const categoryService = new CategoryService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // Update user using the service
    const data = await categoryService.findById(id);

    // Return success response
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    // Handle validation errors or service errors
    console.error('Error getting category:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const monogoObjectId = new mongoose.Types.ObjectId(id);

  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateCategoryDto, body);

    // Update user using the service
    await categoryService.update(monogoObjectId, dto);

    // Return success response
    return NextResponse.json(
      {
        message: 'Category updated!',
        success: true,
      },
      { status: 201 },
    );
  } catch (err: any) {
    // Handle validation errors or service errors
    console.error('Error updating category:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const monogoObjectId = new mongoose.Types.ObjectId(id);

  try {
    const data = await categoryService.delete(monogoObjectId);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    // Handle validation errors or service errors
    console.error('Error deleting category:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
