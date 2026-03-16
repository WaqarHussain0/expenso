/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { ITransaction } from '@/types/transaction.type';
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '@/lib/redux/services/transaction.rtk.service';
import { CategorySelect } from '@/components/select/Category.select';

interface ITransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction?: ITransaction | null;
  defaultCategoryId?: string;
}

type FormValues = {
  categoryId: string;
  amount: number;
  date: string;
  note?: string;
};

const TransactionDialog: React.FC<ITransactionDialogProps> = ({
  onClose,
  open,
  transaction,
}) => {
  const formatDateForInput = (date: string | Date) =>
    new Date(date).toISOString().split('T')[0];

  const router = useRouter();

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      date: formatDateForInput(new Date()),
      note: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    let response: any;

    if (transaction && transaction?._id) {
      response = await updateTransaction({
        id: transaction?._id,
        payload: data,
      }).unwrap();
    } else {
      // For creation, include password if it's in the data
      response = await createTransaction(data).unwrap();
    }

    if (response.success) {
      onClose();
      reset();
      toast.success('Transaction saved successfully');
      router.refresh();
    } else {
      const error = await response.json();
      toast.error('Request failed', {
        description: error?.error || 'Something went wrong',
      });
    }
  };

  // Reset when editing
  useEffect(() => {
    if (!open) return;
    if (transaction) {
      reset({
        amount: transaction.amount,
        date: formatDateForInput(transaction.date),
        note: transaction.note,
        categoryId: transaction.categoryId,
      });
    } else {
      reset({
        amount: 0,
        date: formatDateForInput(new Date()),
        note: '',
      });
    }
  }, [transaction, reset, open]);

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit' : 'Add New'} Transaction
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Update the transaction's information below."
              : 'Create a new transaction.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Amount & Date */}

          <div className="grid w-full grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Amount *</Label>

              <Input
                type="number"
                placeholder="Amount"
                disabled={isSubmitting}
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 1,
                    message: 'Amount must be greater than 0',
                  },
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>

              <Input
                type="date"
                placeholder="Date"
                disabled={isSubmitting}
                {...register('date', {
                  required: 'Date is required',
                })}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Please select a category' }}
              render={({ field }) => (
                <CategorySelect value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>

            <Input
              type="text"
              placeholder="Optional note"
              disabled={isSubmitting}
              {...register('note', {})}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {' '}
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
