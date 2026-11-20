'use client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

const fieldClass =
  'h-10 bg-[#fafbfa] px-3 focus-visible:border-[#1a7f5a] focus-visible:bg-white focus-visible:ring-[#1a7f5a]/15';

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

  const handleCancel = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) handleCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit transaction' : 'New transaction'}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Update the transaction's details below."
              : 'Log money in or out — it takes five seconds.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Amount — the hero field */}
          <div className="rounded-xl border border-[#0d1117]/[0.06] bg-[#fafbfa] px-4 pt-3 pb-2 transition-colors focus-within:border-[#1a7f5a] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1a7f5a]/15">
            <Label
              htmlFor="trx-amount"
              className="text-[11px] font-semibold tracking-wider text-[#8b93a1] uppercase"
            >
              Amount
            </Label>
            <input
              id="trx-amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              disabled={isSubmitting}
              aria-invalid={!!errors.amount}
              onFocus={e => e.currentTarget.select()}
              className="manrope w-full [appearance:textfield] bg-transparent py-1 text-3xl font-bold tracking-tight text-[#0d1117] tabular-nums outline-none placeholder:text-[#c4c9d0] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register('amount', {
                required: 'Amount is required',
                min: {
                  value: 1,
                  message: 'Amount must be greater than 0',
                },
              })}
            />
          </div>
          {errors.amount && (
            <p className="-mt-3 text-xs text-red-500">
              {errors.amount.message}
            </p>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Please select a category' }}
              render={({ field }) => (
                <CategorySelect value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[150px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="trx-date">Date</Label>
              <Input
                id="trx-date"
                type="date"
                disabled={isSubmitting}
                className={fieldClass}
                {...register('date', {
                  required: 'Date is required',
                })}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trx-note">
                Note{' '}
                <span className="font-normal text-[#8b93a1]">(optional)</span>
              </Label>
              <Input
                id="trx-note"
                type="text"
                placeholder="e.g. Chai with the team"
                disabled={isSubmitting}
                className={fieldClass}
                {...register('note', {})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-5">
              {isSubmitting
                ? 'Saving...'
                : transaction
                  ? 'Save changes'
                  : 'Add transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
