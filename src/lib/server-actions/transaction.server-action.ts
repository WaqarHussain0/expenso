'use server';

import 'reflect-metadata';
import { revalidatePath } from 'next/cache';
import { validateDto } from '@/backend/utils/input-validator.util';
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { CreateTransactionDto } from '@/backend/modules/transaction/dto/create-transaction.dto';
import { requireUser, toObjectId } from './action-guard';

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

const errorMessage = (error: unknown) =>
  (error as Error)?.message || 'Something went wrong';

export async function createTransactionAction(
  payload: TransactionPayload,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const dto = await validateDto(CreateTransactionDto, payload);
    // Service checks the category belongs to this user
    await transactionService.create(dto, user.objectId);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function updateTransactionAction(
  id: string,
  payload: TransactionPayload,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const transactionId = toObjectId(id, 'transaction id');
    const dto = await validateDto(CreateTransactionDto, payload);
    // Service only matches transactions (and categories) owned by this user
    await transactionService.update(transactionId, dto, user.objectId);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function deleteTransactionAction(
  id: string,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const transactionId = toObjectId(id, 'transaction id');
    await transactionService.delete(transactionId, user.objectId);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
