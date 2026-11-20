'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import StatWrapper from '@/components/common/Stat.wrapper';
import { LazyCategoryDialog } from '@/components/feature/lazy-dialogs';
import CategoryTable from '@/components/feature/category/Category.table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import { PlusIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export interface ICategoryStats {
  income: number;
  investment: number;
  expense: number;
}

interface ICategoryWrapperProps {
  categories: ICategory[];
  meta: {
    totalPages: number;
    totalRecords: number;
    page: number;
  };
  currentPage: number;

  categoryStats: ICategoryStats;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  {
    value: CategoryTypeEnum.INCOME,
    label: 'Income',
    color: COLOR_CODES.income,
  },
  {
    value: CategoryTypeEnum.EXPENSE,
    label: 'Expense',
    color: COLOR_CODES.expense,
  },
  {
    value: CategoryTypeEnum.INVESTMENT,
    label: 'Investment',
    color: COLOR_CODES.investment,
  },
];

const CategoryWrapper: React.FC<ICategoryWrapperProps> = ({
  categories,
  currentPage,
  meta,
  categoryStats,
}) => {
  const router = useRouter();

  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch();

  const [selectedType, setSelectedType] = useState<string>('all');

  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const handleCloseDialog = useCallback(
    () => setShowCategoryDialog(prev => !prev),
    [],
  );

  // Function to update URL query params
  const updateQueryParams = useCallback(
    (page: number, search?: string, type?: CategoryTypeEnum) => {
      const params = new URLSearchParams();
      if (page) params.set('page', page.toString());
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      router.replace(`${PAGE_ROUTES.category}?${params.toString()}`);
    },
    [router],
  );

  const currentType = () =>
    selectedType === 'all' ? undefined : (selectedType as CategoryTypeEnum);

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, debouncedSearch, currentType());
  };

  const handleSearch = (value: string) => {
    handleSearchChange(value);
    updateQueryParams(1, value, currentType());
  };

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      const type = value === 'all' ? undefined : (value as CategoryTypeEnum);
      updateQueryParams(1, debouncedSearch, type);
    },
    [debouncedSearch, updateQueryParams],
  );

  const handleClearFilter = () => {
    setSelectedType('all');
    clearSearch();
    router.push(PAGE_ROUTES.category);
  };

  const hasFilters = !!searchInput || selectedType !== 'all';

  return (
    <div className="page-fade flex w-full flex-col gap-5 lg:h-[calc(100dvh-7.5rem)]">
      <PageHeader
        title="Categories"
        description="The labels that organise your money — income, expenses, and investments."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Categories' },
        ]}
        actions={
          <Button className="h-9 px-4" onClick={handleCloseDialog}>
            <PlusIcon className="size-4" />
            Add Category
          </Button>
        }
      />

      {/* Stats */}
      <StatWrapper
        stats={(() => {
          const { income, expense, investment } = categoryStats;
          const total = income + expense + investment;
          const pct = (n: number) => (total ? (n / total) * 100 : 0);
          const hint = `of ${total} ${total === 1 ? 'category' : 'categories'}`;
          return [
            {
              label: 'Income',
              value: income,
              percent: pct(income),
              color: COLOR_CODES.income,
              hint,
            },
            {
              label: 'Expense',
              value: expense,
              percent: pct(expense),
              color: COLOR_CODES.expense,
              hint,
            },
            {
              label: 'Investment',
              value: investment,
              percent: pct(investment),
              color: COLOR_CODES.investment,
              hint,
            },
          ];
        })()}
        className="grid-cols-1 sm:grid-cols-3"
      />

      {/* List */}
      <Card className="gap-0 overflow-hidden py-0 lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-3 border-b border-[#0d1117]/[0.06] p-3 md:flex-row md:items-center md:p-4">
          <SearchInput
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search by name"
            className="w-full md:max-w-xs"
          />

          <SegmentedControl
            ariaLabel="Filter by type"
            options={TYPE_OPTIONS}
            value={selectedType}
            onChange={handleTypeChange}
            className="max-w-full"
          />

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="w-fit text-[#5a6070] md:ml-auto"
            >
              <X className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        <CategoryTable
          className="scroll-area bg-[#fbfbfa] lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
          categories={categories || []}
        />

        {categories && categories.length !== 0 && (
          <Pagination
            page={currentPage}
            totalRecords={meta?.totalRecords}
            onPageChange={handlePageChange}
            totalPage={meta?.totalPages}
          />
        )}
      </Card>

      {showCategoryDialog && (
        <LazyCategoryDialog onClose={handleCloseDialog} open />
      )}
    </div>
  );
};

export default CategoryWrapper;
