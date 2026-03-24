/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { withAuth } from '@/backend/utils/guard/withAuth';

const transactionService = new TransactionService();

export const PUT = withAuth(
  async (
    req: NextRequest,
    user,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const monogoObjectId = new mongoose.Types.ObjectId(id);

    try {
      const body = await req.json();

      const dto = await validateDto(CreateTransactionDto, body);

      await transactionService.update(monogoObjectId, dto);

      return NextResponse.json(
        {
          message: 'Transaction updated!',
          success: true,
        },
        { status: 200 },
      );
    } catch (err: any) {
      console.error('Error updating transaction:', err);

      return NextResponse.json(
        { error: err.message || 'Something went wrong' },
        { status: 400 },
      );
    }
  },
);

export const DELETE = withAuth(
  async (
    req: NextRequest,
    user,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const monogoObjectId = new mongoose.Types.ObjectId(id);

    try {
      const response = await transactionService.delete(monogoObjectId);


      return NextResponse.json(response, { status: 200 });
    } catch (err: any) {
      console.error('Error deleting transaction:', err);

      return NextResponse.json(
        { error: err.message || 'Something went wrong' },
        { status: 400 },
      );
    }
  },
);
