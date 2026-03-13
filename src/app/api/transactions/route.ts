/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';

const transactionService = new TransactionService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateTransactionDto, body);

    // Create transaction using the service
    const transaction = await transactionService.create(dto);

    // Return success response
    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
