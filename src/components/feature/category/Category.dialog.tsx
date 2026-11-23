import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { CategoryTypeEnum, ICategory } from '@/types/category.type';

import {
  BanknoteArrowDown,
  Check,
  Coins,
  ShoppingCartIcon,
} from 'lucide-react';
import { CATEGORY_ICONS } from '@/app/constants/category-icons.constant';
import {
  createCategoryAction,
  updateCategoryAction,
} from '@/lib/server-actions/category.server-action';
import CategoryTypeBadge, { CATEGORY_TYPE_COLORS } from './CategoryTypeBadge';
import { CategoryIconTile } from '../transaction/TransactionDisplay';

export { CATEGORY_ICONS };

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
      icon: 'Wallet',
      color: '#22C55E',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = category?._id
        ? await updateCategoryAction(category._id, data)
        : await createCategoryAction(data);

      if (result.success) {
        onClose();
        reset();
        toast.success('Category saved successfully');
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
        icon: 'Wallet',
        color: '#22C55E',
      });
    }
  }, [category, reset, open]);

  const isSubmitting = isPending;

  const [watchedName, watchedType, watchedIcon, watchedColor] = useWatch({
    control,
    name: ['name', 'type', 'icon', 'color'],
  });

  const getTypeIcon = (type: CategoryTypeEnum | undefined) => {
    switch (type) {
      case CategoryTypeEnum.INCOME:
        return <BanknoteArrowDown className="size-4" />;
      case CategoryTypeEnum.EXPENSE:
        return <ShoppingCartIcon className="size-4" />;
      case CategoryTypeEnum.INVESTMENT:
        return <Coins className="size-4" />;
      default:
        return null;
    }
  };

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
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit category' : 'New category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category's details below."
              : 'Give it a name, a type, and a look you will recognise.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Live preview */}
          <div className="border-ink/[0.06] bg-surface-2 flex items-center gap-3 rounded-xl border p-3">
            <CategoryIconTile
              category={{ icon: watchedIcon, color: watchedColor }}
              className="size-11 rounded-xl transition-colors duration-300 [&>svg]:size-5"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`inter truncate text-sm font-semibold capitalize ${
                  watchedName?.trim() ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                {watchedName?.trim() || 'Category name'}
              </p>
              <CategoryTypeBadge type={watchedType} className="mt-1" />
            </div>
            <span className="inter text-ink-faint text-[10px] font-semibold tracking-widest uppercase">
              Preview
            </span>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              type="text"
              placeholder="e.g. Groceries, Salary, SIP"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              className="bg-surface-2 focus-visible:bg-surface h-10 px-3 focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
              {...register('name', {
                required: 'Name is required',
                validate: value =>
                  value.trim().length > 0 || 'Name is required',
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Category type"
                  className="grid grid-cols-3 gap-2"
                >
                  {categoryTypes.map(type => {
                    const isActive = field.value === type.id;
                    const color = CATEGORY_TYPE_COLORS[type.id];

                    return (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        key={type.id}
                        onClick={() => field.onChange(type.id)}
                        className={`inter flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium capitalize transition-all duration-300 ${
                          isActive
                            ? 'shadow-[0_4px_12px_-6px_rgba(13,17,23,0.2)]'
                            : 'border-ink/[0.08] text-ink-muted hover:border-ink/[0.16] hover:text-ink'
                        }`}
                        style={
                          isActive
                            ? {
                                borderColor: color,
                                background: `${color}10`,
                                color,
                              }
                            : undefined
                        }
                      >
                        {getTypeIcon(type.id)}
                        {type.name}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <Controller
              name="icon"
              control={control}
              rules={{ required: 'Icon is required' }}
              render={({ field }) => (
                <div className="border-ink/[0.06] bg-surface-2 grid grid-cols-6 gap-1.5 rounded-xl border p-2 sm:grid-cols-9">
                  {CATEGORY_ICONS.map(item => {
                    const Icon = item.icon;
                    const isActive = field.value === item.name;

                    return (
                      <button
                        type="button"
                        key={item.name}
                        aria-label={item.name}
                        aria-pressed={isActive}
                        onClick={() => field.onChange(item.name)}
                        className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-surface'
                            : 'text-ink-subtle hover:bg-surface hover:text-ink'
                        }`}
                        style={
                          isActive
                            ? {
                                color: watchedColor,
                                boxShadow: `0 0 0 1.5px ${watchedColor}, 0 2px 8px -2px rgba(13,17,23,0.15)`,
                              }
                            : undefined
                        }
                      >
                        <Icon className="size-4" />
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.icon && (
              <p className="text-xs text-red-500">{errors.icon.message}</p>
            )}
          </div>

          {/* Colour */}
          <div className="space-y-2">
            <Label>Colour</Label>
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Color is required' }}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map(color => {
                    const isActive = field.value === color;

                    return (
                      <button
                        type="button"
                        key={color}
                        aria-label={`Colour ${color}`}
                        aria-pressed={isActive}
                        onClick={() => field.onChange(color)}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110"
                        style={{
                          backgroundColor: color,
                          boxShadow: isActive
                            ? `0 0 0 2px var(--surface), 0 0 0 4px ${color}`
                            : undefined,
                        }}
                      >
                        {isActive && (
                          <Check className="size-3.5" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-5">
              {isSubmitting
                ? 'Saving...'
                : category
                  ? 'Save changes'
                  : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
