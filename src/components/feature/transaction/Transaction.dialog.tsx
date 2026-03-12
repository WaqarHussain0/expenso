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
import { createTransactionService, updateTransactionService } from './service';

interface ITransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction?: ITransaction | null;
}

type FormValues = {
  categoryId: string;
  amount: number;
  date: Date;
  note?: string;
};

const TransactionDialog: React.FC<ITransactionDialogProps> = ({
  onClose,
  open,
  transaction,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      date: new Date(),
      note: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    let response: any;

    if (transaction && transaction?._id) {
      response = await updateTransactionService(transaction?._id, data);
    } else {
      // For creation, include password if it's in the data
      response = await createTransactionService(data);
    }

    if (response.ok) {
      onClose();
      reset();
      toast.success('Category saved successfully');
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
    if (transaction) {
      reset({
        amount: transaction.amount,
        date: transaction.date,
        note: transaction.note,
        categoryId: transaction.categoryId,
      });
    } else {
      reset({
        amount: 0,
        date: new Date(),
        note: '',
      });
    }
  }, [transaction, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        reset();
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
