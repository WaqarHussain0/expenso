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

import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/lib/rtk/services/category.rtk.service';

import {
  BanknoteArrowDown,
  Coins,
  Wallet,
  ShoppingCartIcon,
  Fuel,
  Car,
  Home,
  ShoppingCart,
  Heart,
  Plane,
  Gamepad2,
  Coffee,
  Gift,
  Book,
  Music,
  Dumbbell,
  Smartphone,
  Shirt,
  Bike,
  Briefcase,
  TrendingUp,
  Utensils,
  Laptop,
  CardSim,
  Barcode,
} from 'lucide-react';

export const CATEGORY_ICONS = [
  { name: 'Wallet', icon: Wallet },
  { name: 'Barcode', icon: Barcode },
  { name: 'Laptop', icon: Laptop },
  { name: 'CardSim', icon: CardSim },
  { name: 'Fuel', icon: Fuel },
  { name: 'Car', icon: Car },
  { name: 'Home', icon: Home },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Heart', icon: Heart },
  { name: 'Plane', icon: Plane },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Coffee', icon: Coffee },
  { name: 'Gift', icon: Gift },
  { name: 'Book', icon: Book },
  { name: 'Music', icon: Music },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Shirt', icon: Shirt },
  { name: 'Bike', icon: Bike },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Utensils', icon: Utensils },
];

const COLORS = [
  '#FF6B35',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#22C55E',
  '#14B8A6',
  '#84CC16',
  '#6366F1',
  '#06B6D4',
  '#EAB308',
  '#EC4899',
  '#795548',
  '#10B981',
  '#F97316',
];

interface ICategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: ICategory | null;
}

type FormValues = {
  name: string;
  type: CategoryTypeEnum;
  icon: string;
  color: string;
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
      icon: '',
      color: '',
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
        icon: category.icon,
        color: category.color,
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
        return 'bg-primary/20 text-primary border-primary';
      case CategoryTypeEnum.EXPENSE:
        return 'bg-destructive/20 text-destructive border-destructive';
      case CategoryTypeEnum.INVESTMENT:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
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
      <DialogContent className="max-h-[80vh] overflow-y-auto no-scrollbar">
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
                <div className="flex gap-2 flex-wrap">
                  {categoryTypes.map(type => {
                    const isActive = field.value === type.id;

                    return (
                      <Button
                        type="button"
                        key={type.id}
                        onClick={() => field.onChange(type.id)}
                        className={`flex items-center gap-2 border px-3 capitalize transition-all ${
                          isActive
                            ? `${getTypeColor(type.id)} `
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

          <div className="space-y-2">
            <Label>Icon</Label>

            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <div className="grid max-h-40 grid-cols-6 gap-2 overflow-y-auto rounded-md border p-3">
                  {CATEGORY_ICONS.map(item => {
                    const Icon = item.icon;
                    const isActive = field.value === item.name;

                    return (
                      <Button
                        type="button"
                        key={item.name}
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => field.onChange(item.name)}
                      >
                        <Icon className="size-4" />
                      </Button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-5 md:grid-cols-7 gap-2 rounded-md border p-3">
                  {COLORS.map(color => {
                    const isActive = field.value === color;

                    return (
                      <div
                        key={color}
                        className={`flex size-9 items-center justify-center rounded-md ${isActive ? 'ring-primary ring-2 ring-offset-2' : ''}}`}
                      >
                        <button
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={`size-8 cursor-pointer rounded-sm border-2`}
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
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

export default CategoryDialog;
