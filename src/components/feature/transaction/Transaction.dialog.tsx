'use client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { ITransaction } from '@/types/transaction.type';

import { CategorySelect } from '@/components/select/Category.select';
import {
  createTransactionAction,
  updateTransactionAction,
} from '@/lib/server-actions/transaction.server-action';

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

  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = transaction?._id
        ? await updateTransactionAction(transaction._id, data)
        : await createTransactionAction(data);

      if (result.success) {
        onClose();
        reset();
        toast.success('Transaction saved successfully');
      } else {
        toast.error('Request failed', {
          description: result.error || 'Something went wrong',
        });
      }
    });
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

  const isSubmitting = isPending;

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
