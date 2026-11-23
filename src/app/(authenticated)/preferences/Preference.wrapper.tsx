'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import CategoryIcon from '@/components/common/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { setPreferencesAction } from '@/lib/server-actions/category.server-action';
import { CategoryTypeEnum } from '@/types/category.type';
import { Check, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';

interface IPresetCategory {
  name: string;
  type: CategoryTypeEnum;
  icon: string;
  color: string;
}

const PRESET_CATEGORIES: Record<string, IPresetCategory[]> = {
  income: [
    {
      name: 'Salary',
      type: CategoryTypeEnum.INCOME,
      icon: 'Wallet',
      color: '#FF6B35',
    },
    {
      name: 'Freelance',
      type: CategoryTypeEnum.INCOME,
      icon: 'Laptop',
      color: '#3B82F6',
    },
    {
      name: 'Part Time Work',
      type: CategoryTypeEnum.INCOME,
      icon: 'Briefcase',
      color: '#8B5CF6',
    },
    {
      name: 'Dividends',
      type: CategoryTypeEnum.INCOME,
      icon: 'TrendingUp',
      color: '#F59E0B',
    },
    {
      name: 'Rental Income',
      type: CategoryTypeEnum.INCOME,
      icon: 'Home',
      color: '#22C55E',
    },
    {
      name: 'Miscellaneous Income',
      type: CategoryTypeEnum.INCOME,
      icon: 'Wallet',
      color: '#14B8A6',
    },
  ],

  expense: [
    {
      name: 'Fuel',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Fuel',
      color: '#EF4444',
    },
    {
      name: 'Home Rent',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Home',
      color: '#F97316',
    },
    {
      name: 'Food/Groceries',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Utensils',
      color: '#84CC16',
    },
    {
      name: 'Utilities',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Smartphone',
      color: '#06B6D4',
    },
    {
      name: 'Dining Out',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Coffee',
      color: '#EAB308',
    },
    {
      name: 'Healthcare',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Heart',
      color: '#EC4899',
    },
    {
      name: 'Insurance',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Briefcase',
      color: '#795548',
    },
    {
      name: 'Education',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Book',
      color: '#6366F1',
    },
    {
      name: 'Travel',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Plane',
      color: '#0EA5E9',
    },
    {
      name: 'Entertainment',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Gamepad2',
      color: '#A855F7',
    },
    {
      name: 'Shopping',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'ShoppingCart',
      color: '#10B981',
    },
    {
      name: 'Miscellaneous Expense',
      type: CategoryTypeEnum.EXPENSE,
      icon: 'Wallet',
      color: '#64748B',
    },
  ],

  investment: [
    {
      name: 'Stock Exchange',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'TrendingUp',
      color: '#22C55E',
    },
    {
      name: 'Crypto',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'TrendingUp',
      color: '#F59E0B',
    },
    {
      name: 'Gold',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'Wallet',
      color: '#EAB308',
    },
    {
      name: 'Property',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'Home',
      color: '#3B82F6',
    },
    {
      name: 'Mutual Funds',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'Briefcase',
      color: '#8B5CF6',
    },
    {
      name: 'Savings Bonds',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'Briefcase',
      color: '#14B8A6',
    },
    {
      name: 'Miscellaneous Investment',
      type: CategoryTypeEnum.INVESTMENT,
      icon: 'Wallet',
      color: '#94A3B8',
    },
  ],
};

const PreferenceWrapper = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [selectedCategories, setSelectedCategories] = useState<
    IPresetCategory[]
  >([]);

  const toggleCategory = (category: IPresetCategory) =>
    setSelectedCategories(prev =>
      prev.some(c => c.name === category.name)
        ? prev.filter(c => c.name !== category.name)
        : [...prev, category],
    );

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await setPreferencesAction(selectedCategories);

      if (result.success) {
        toast.success('Request Successful', {
          description: 'Categories added',
        });
        router.push(PAGE_ROUTES.category);
      } else {
        toast.error('Request Failed', {
          description: result.error ?? 'Failed to set preferences',
        });
      }
    });
  };

  return (
    <div className="page-fade flex w-full flex-col gap-5">
      <PageHeader
        title="Financial Preferences"
        description="Select the categories you want to track in your budget."
      />

      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(PRESET_CATEGORIES).map(([key, list]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="capitalize">{key} Categories</CardTitle>
              <CardDescription>
                Select all that apply to your {key} stream.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {list.map(cat => {
                const isSelected = selectedCategories.find(
                  c => c.name === cat.name,
                );

                return (
                  <Badge
                    asChild
                    key={cat.name}
                    variant={'outline'}
                    className={`cursor-pointer p-3 ${
                      isSelected?.type === CategoryTypeEnum.INVESTMENT
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400'
                        : isSelected?.type === CategoryTypeEnum.INCOME
                          ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400'
                          : isSelected?.type === CategoryTypeEnum.EXPENSE
                            ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                            : ''
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={!!isSelected}
                      onClick={() => toggleCategory(cat)}
                    >
                      <CategoryIcon
                        name={cat.icon}
                        color={cat.color}
                        className="size-4"
                      />
                      {cat.name}
                      {isSelected ? (
                        <Check className="ml-2 h-3 w-3" />
                      ) : (
                        <Plus className="ml-2 h-3 w-3" />
                      )}
                    </button>
                  </Badge>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0 || isPending}
        >
          {isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceWrapper;
