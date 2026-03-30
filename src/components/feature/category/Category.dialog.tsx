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
import { BanknoteArrowDown, Coins, ShoppingCartIcon } from 'lucide-react';

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

    try {
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
        return;
      }
    } catch (err: any) {
      console.log('err : ', err);
      toast.error('Request failed', {
        description: err?.data?.error || 'Something went wrong',
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

  const getTypeColor = (type: CategoryTypeEnum | undefined) => {
    switch (type) {
      case CategoryTypeEnum.INCOME:
        return 'bg-primary/10 text-primary';
      case CategoryTypeEnum.EXPENSE:
        return 'bg-destructive/10 text-destructive';
      case CategoryTypeEnum.INVESTMENT:
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return null;
    }
  };

  const getTypeIcon = (type: CategoryTypeEnum | undefined) => {
    switch (type) {
      case CategoryTypeEnum.INCOME:
        return <BanknoteArrowDown />;
      case CategoryTypeEnum.EXPENSE:
        return <ShoppingCartIcon />;
      case CategoryTypeEnum.INVESTMENT:
        return <Coins />;
      default:
        return null;
    }
  };

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
                <div className="flex gap-2">
                  {categoryTypes.map(type => {
                    const isActive = field.value === type.id;

                    return (
                      <Button
                        type="button"
                        key={type.id}
                        onClick={() => field.onChange(type.id)}
                        className={`flex items-center gap-2 border px-3 capitalize transition-all ${
                          isActive
                            ? `${getTypeColor(type.id)} shadow-md`
                            : 'text-muted-foreground hover:bg-muted border-gray-300 bg-transparent'
                        } `}
                      >
                        {getTypeIcon(type.id)}
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
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
