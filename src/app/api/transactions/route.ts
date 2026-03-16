/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';

const transactionService = new TransactionService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateTransactionDto, body);

    // Create transaction using the service
    await transactionService.create(dto, userMonogoObjectId);

    return NextResponse.json(
      {
        message: 'Transaction added!',
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
