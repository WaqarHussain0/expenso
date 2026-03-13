/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const transactionService = new TransactionService();

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
    const dto = await validateDto(CreateTransactionDto, body);

    // Update user using the service
    const data = await transactionService.update(monogoObjectId, dto);

    // Return success response
    return NextResponse.json({ data }, { status: 201 });
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
    const data = await transactionService.delete(monogoObjectId);
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
