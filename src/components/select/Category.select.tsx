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
import { ICategory } from '@/types/category.type';
import CategoryIcon from '@/components/common/CategoryIcon';
import { CategoryIconTile } from '../feature/transaction/TransactionDisplay';
import {
  getAllCategoriesAction,
  getCategoryByIdAction,
} from '@/lib/server-actions/category.server-action';

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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [singleCategory, setSingleCategory] = useState<ICategory | null>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // The selected category may not be in the (search-limited) list, so it's
  // fetched separately and shown first
  const options = useMemo(() => {
    const merged =
      singleCategory && singleCategory._id === value
        ? [singleCategory, ...categories]
        : categories;
    const map = new Map<string, ICategory>();
    merged.forEach(c => map.set(c._id, c));
    return Array.from(map.values());
  }, [categories, singleCategory, value]);

  const selectedCategory = options.find(c => c._id === value);

  // Replaces useGetAllCategoriesQuery
  useEffect(() => {
    // Ignore responses that arrive after a newer search has started
    let ignore = false;

    const fetchCategories = async () => {
      setIsFetching(true);
      const result = await getAllCategoriesAction({
        name: debouncedSearch || undefined,
        limit: 3,
      });
      if (ignore) return;
      if (result.success) setCategories(result.data?.data ?? []);
      setIsFetching(false);
    };
    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch]);

  useEffect(() => {
    // Nothing to fetch if it's already in the list
    if (!value || categories.some(c => c._id === value)) return;

    let ignore = false;

    const fetchSelected = async () => {
      const result = await getCategoryByIdAction(value);
      if (!ignore && result.success)
        setSingleCategory((result.data as unknown as ICategory) ?? null);
    };
    fetchSelected();

    return () => {
      ignore = true;
    };
  }, [value, categories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'inter border-ink/[0.08] bg-surface-2 text-ink hover:bg-surface hover:text-ink aria-expanded:bg-surface aria-expanded:text-ink h-10 w-full justify-between bg-none font-normal capitalize hover:border-[#1a7f5a]/40 aria-expanded:border-[#1a7f5a] aria-expanded:ring-3 aria-expanded:ring-[#1a7f5a]/15',
            className,
          )}
        >
          {selectedCategory?.name ? (
            <span className="flex min-w-0 items-center gap-2">
              <CategoryIconTile
                category={selectedCategory}
                className="size-5 rounded-md [&>svg]:size-3"
              />
              <span className="truncate">{selectedCategory.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-56 p-0"
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
          <CommandList className="inter w-full">
            {isFetching ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No categories found</CommandEmpty>
                <CommandGroup className="w-full">
                  {options.map(category => (
                    <CommandItem
                      key={category._id}
                      value={category._id}
                      onSelect={() => {
                        onChange(category._id);
                        setOpen(false);
                        setSearch('');
                      }}
                      className="md:text-md text-xs capitalize"
                    >
                      <CategoryIcon
                        name={category.icon}
                        color={category.color}
                        className="size-3"
                      />

                      {category.name}
                      <Check
                        className={cn(
                          'size-4',
                          value === category._id ? '' : 'hidden',
                        )}
                      />
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
