/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import 'reflect-metadata';
import { revalidatePath } from 'next/cache';
import { validateDto } from '@/backend/utils/input-validator.util';
import mongoose from 'mongoose';
import { getServerSideSession } from '../next-auth.util';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';

const transactionService = new TransactionService();

interface TransactionPayload {
  categoryId: string;
  amount: number;
  date: Date | string;
  note?: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createTransactionAction(
  payload: TransactionPayload,
): Promise<ActionResult> {
  try {
    const user = await getServerSideSession();
    const userId = new mongoose.Types.ObjectId(user?.user.id);
    const dto = await validateDto(CreateTransactionDto, payload);
    await transactionService.create(dto, userId);
    revalidatePath('/'); // adjust path as needed
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function updateTransactionAction(
  id: string,
  payload: TransactionPayload,
): Promise<ActionResult> {
  try {
    const transactionId = new mongoose.Types.ObjectId(id);

    const dto = await validateDto(CreateTransactionDto, payload);
    await transactionService.update(transactionId, dto); // adjust to your service method
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function deleteTransactionAction(
  id: string,
): Promise<ActionResult> {
  const transactionId = new mongoose.Types.ObjectId(id);

  try {
    await transactionService.delete(transactionId);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}
