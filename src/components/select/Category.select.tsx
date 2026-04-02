'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} from '@/lib/rtk/services/category.rtk.service';
import { ICategory } from '@/types/category.type';

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching } = useGetAllCategoriesQuery({
    name: debouncedSearch || undefined,
    limit: 3,
  });

  const categories = data?.data?.data ?? [];

  const shouldFetchSingle =
    !!value && !categories.some((c: ICategory) => c._id === value);

  const { data: singleCategoryResponse } = useGetCategoryByIdQuery(value!, {
    skip: !shouldFetchSingle,
  });

  const singleCategory = singleCategoryResponse?.data;

  const options = useMemo(() => {
    const merged = [...(singleCategory ? [singleCategory] : []), ...categories];
    const map = new Map();
    merged.forEach(c => map.set(c._id, c));
    return Array.from(map.values());
  }, [categories, singleCategory]);

  const selectedLabel = options.find(c => c._id === value)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal capitalize',
            className,
          )}
        >
          {selectedLabel ?? (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        side="bottom"
        align="start"
        // Keeps popover open when virtual keyboard pushes layout on mobile
        onInteractOutside={e => {
          // Only close if the click is truly outside (not the keyboard appearing)
          const target = e.target as HTMLElement;
          if (target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false}>
          {/* CommandInput handles mobile keyboard correctly unlike Input in Select */}
          <CommandInput
            placeholder="Search categories..."
            value={search}
            onValueChange={setSearch}
            className="inter text-xs"
          />
          <CommandList className="inter">
            {isFetching ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No categories found</CommandEmpty>
                <CommandGroup>
                  {options.map(category => (
                    <CommandItem
                      key={category._id}
                      value={category._id}
                      onSelect={() => {
                        onChange(category._id);
                        setOpen(false);
                        setSearch('');
                      }}
                      className="capitalize text-xs"
                    >
                      <Check
                        className={cn(
                          'size-4',
                          value === category._id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
