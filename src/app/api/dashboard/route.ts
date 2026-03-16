/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';

const transactionService = new TransactionService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();
    const { startDate, endDate } = body;

    const response = await transactionService.getDashboardData(
      new Date(startDate),
      new Date(endDate),
      userMonogoObjectId,
    );

    return NextResponse.json(
      {
        response,
        message: 'Dashboard data',
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
