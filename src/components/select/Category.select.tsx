'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} from '@/lib/redux/services/category.rtk.service';

interface ICategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CategorySelect: React.FC<ICategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select category',
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /**
   * debounce search
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /**
   * fetch categories (default 3)
   */
  const { data, isFetching } = useGetAllCategoriesQuery({
    name: debouncedSearch || undefined,
    limit: 3,
  });

  const categories = data?.data?.data ?? [];

  /**
   * fetch selected category if not in list
   */
  const shouldFetchSingle = !!value && !categories.some(c => c._id === value);

  const { data: singleCategoryResponse } = useGetCategoryByIdQuery(value!, {
    skip: !shouldFetchSingle,
  });

  const singleCategory = singleCategoryResponse?.data;

  /**
   * merge options
   */
  const options = useMemo(() => {
    const merged = [...(singleCategory ? [singleCategory] : []), ...categories];

    const map = new Map();
    merged.forEach(c => map.set(c._id, c));

    return Array.from(map.values());
  }, [categories, singleCategory]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full capitalize ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <div className="p-2">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="mb-2"
            onKeyDown={e => e.stopPropagation()}
          />
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : options.length > 0 ? (
          options.map(category => (
            <SelectItem
              key={category._id}
              value={category._id}
              className="capitalize"
            >
              {category.name}
            </SelectItem>
          ))
        ) : (
          <div className="text-muted-foreground px-2 py-1 text-sm">
            No categories found
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
