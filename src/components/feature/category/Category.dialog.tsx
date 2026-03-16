/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/lib/rtk/services/category.rtk.service';

interface ICategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: ICategory | null;
}

type FormValues = {
  name: string;
  type: CategoryTypeEnum;
};

const categoryTypes = [
  { id: CategoryTypeEnum.INCOME, name: CategoryTypeEnum.INCOME },
  { id: CategoryTypeEnum.EXPENSE, name: CategoryTypeEnum.EXPENSE },
  { id: CategoryTypeEnum.INVESTMENT, name: CategoryTypeEnum.INVESTMENT },
];

const CategoryDialog: React.FC<ICategoryDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      type: CategoryTypeEnum.INCOME,
    },
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const onSubmit = async (data: FormValues) => {
    let response: any;

    if (category && category?._id) {
      response = await updateCategory({
        id: category?._id,
        payload: data,
      }).unwrap();
    } else {
      // For creation, include password if it's in the data
      response = await createCategory(data).unwrap();
    }

    if (response.success) {
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
    if (!open) return;

    if (category) {
      reset({
        name: category.name,
        type: category.type,
      });
    } else {
      reset({
        name: '',
        type: CategoryTypeEnum.EXPENSE,
      });
    }
  }, [category, reset, open]);

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
          <DialogTitle>{category ? 'Edit' : 'Add New'} Category</DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category's information below."
              : 'Create a new category.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Category Name *</Label>

            <Input
              type="text"
              placeholder="Category Name"
              disabled={isSubmitting}
              {...register('name', {
                required: 'Name is required',
                validate: value =>
                  value.trim().length > 0 || 'Name is required',
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Type *</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTypes?.map(type => (
                      <SelectItem
                        className="capitalize"
                        key={type.id}
                        value={type.id}
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
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

export default CategoryDialog;
