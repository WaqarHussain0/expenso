'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSetPreferencesMutation } from '@/lib/rtk/services/category.rtk.service';
import { CategoryTypeEnum } from '@/types/category.type';
import { Check, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface IPreferenceWrapper {
  userId: string;
}

const PreferenceWrapper: React.FC<IPreferenceWrapper> = ({ userId }) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<
    {
      name: string;
      type: CategoryTypeEnum;
    }[]
  >([]);
  const [setPreferences, { isLoading }] = useSetPreferencesMutation();

  const categories = {
    income: [
      { name: 'Salary', type: CategoryTypeEnum.INCOME },
      { name: 'Freelance', type: CategoryTypeEnum.INCOME },
      { name: 'Part Time Work', type: CategoryTypeEnum.INCOME },
      { name: 'Dividends', type: CategoryTypeEnum.INCOME },
      { name: 'Rental Income', type: CategoryTypeEnum.INCOME },
      { name: 'Miscellaneous Income', type: CategoryTypeEnum.INCOME },
    ],
    expense: [
      { name: 'Fuel', type: CategoryTypeEnum.EXPENSE },
      { name: 'Home Rent', type: CategoryTypeEnum.EXPENSE },
      { name: 'Food/Groceries', type: CategoryTypeEnum.EXPENSE },
      { name: 'Utilities', type: CategoryTypeEnum.EXPENSE },
      { name: 'Dining Out', type: CategoryTypeEnum.EXPENSE },
      { name: 'Healthcare', type: CategoryTypeEnum.EXPENSE },
      { name: 'Insurance', type: CategoryTypeEnum.EXPENSE },
      { name: 'Education', type: CategoryTypeEnum.EXPENSE },
      { name: 'Travel', type: CategoryTypeEnum.EXPENSE },
      { name: 'Entertainment', type: CategoryTypeEnum.EXPENSE },
      { name: 'Shopping', type: CategoryTypeEnum.EXPENSE },
      { name: 'Miscellaneous Expense', type: CategoryTypeEnum.EXPENSE },

    ],
    investment: [
      { name: 'Stock Exchange', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Crypto', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Gold', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Property', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Mutual Funds', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Savings Bonds', type: CategoryTypeEnum.INVESTMENT },
      { name: 'Miscellaneous Investment', type: CategoryTypeEnum.INVESTMENT },

    ],
  };

  const toggleCategory = (category: {
    name: string;
    type: CategoryTypeEnum;
  }) => {
    const isSelected = selectedCategories.find(c => c.name === category.name);
    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter(c => c.name !== category.name),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    try {
      await setPreferences({
        payload: selectedCategories,
      }).unwrap();

      toast.success('Request Successfull', {
        description: 'Categories added',
      });
      router.push(PAGE_ROUTES.category);
      // Add success toast here
    } catch (err) {
      console.log('Failed to set references', err);

      toast.error('Request Failed', {
        description: 'Failed to set references',
      });
      // Handle error
    }
  };

  return (
    <div className="w-full space-y-3">
      <Row className="flex-col items-start">
        <TextElement as="h3" className="">
          {' '}
          Financial Preferences
        </TextElement>
        <TextElement as="p" className="text-[#D47E30]">
          Select the categories you want to track in your budget.
        </TextElement>
      </Row>

      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categories).map(([key, list]) => (
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
                    key={cat.name}
                    variant={'outline'}
                    className={`cursor-pointer p-3 ${
                      isSelected?.type === CategoryTypeEnum.INVESTMENT
                        ? 'bg-yellow-100 text-yellow-600'
                        : isSelected?.type === CategoryTypeEnum.INCOME
                          ? 'bg-green-100 text-green-600'
                          : isSelected?.type === CategoryTypeEnum.EXPENSE
                            ? 'bg-red-100 text-red-600'
                            : ''
                    }`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat.name}
                    {isSelected ? (
                      <Check className="ml-2 h-3 w-3" />
                    ) : (
                      <Plus className="ml-2 h-3 w-3" />
                    )}
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
          disabled={selectedCategories.length === 0 || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceWrapper;
