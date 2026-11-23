'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import StatWrapper from '@/components/common/Stat.wrapper';
import { LazyTransactionDialog } from '@/components/feature/lazy-dialogs';
import TransactionTable from '@/components/feature/transaction/Transaction.table';
import { CategorySelect } from '@/components/select/Category.select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { buildCashflowStats } from '@/lib/stats.util';
import { CategoryTypeEnum } from '@/types/category.type';
import { ITransaction } from '@/types/transaction.type';
import { PlusIcon, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export interface IMonthTransactionStats {
  income: number;
  investment: number;
  expense: number;
}

interface ITransactionWrapperProps {
  transactions: ITransaction[];
  meta: {
    totalPages: number;
    totalRecords: number;
    page: number;
  };
  currentPage: number;
  monthStats: IMonthTransactionStats;
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

const TransactionWrapper: React.FC<ITransactionWrapperProps> = ({
  currentPage,
  meta,
  transactions,
  monthStats,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Start from whatever filters are already in the URL (e.g. after a refresh)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => searchParams.get('categoryId') ?? '',
  );
  const [selectedType, setSelectedType] = useState<string>(
    () => searchParams.get('type') ?? 'all',
  );

  const [showTransactionDialog, setShowTransactionDialog] =
    useState<boolean>(false);
  const handleCloseDialog = useCallback(
    () => setShowTransactionDialog(prev => !prev),
    [],
  );

  // Function to update URL query params
  const updateQueryParams = useCallback(
    (
      page: number,
      search?: string,
      type?: CategoryTypeEnum,
      categoryId?: string,
    ) => {
      const params = new URLSearchParams(window.location.search);

      if (page) params.set('page', page.toString());

      if (search) params.set('search', search);
      else params.delete('search');

      if (type) params.set('type', type);
      else params.delete('type');

      if (categoryId) params.set('categoryId', categoryId);
      else params.delete('categoryId');

      router.replace(`${PAGE_ROUTES.transaction}?${params.toString()}`);
    },
    [router],
  );

  const currentType = () =>
    selectedType === 'all' ? undefined : (selectedType as CategoryTypeEnum);

  // The URL (and so the server fetch) only updates once typing settles
  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch({
      initialValue: searchParams.get('search') ?? '',
      onDebouncedChange: value =>
        updateQueryParams(1, value, currentType(), selectedCategory),
    });

  const handlePageChange = (newPage: number) => {
    updateQueryParams(
      newPage,
      debouncedSearch,
      currentType(),
      selectedCategory,
    );
  };

  const handleClearFilter = () => {
    clearSearch();
    setSelectedType('all');
    setSelectedCategory('');
    router.push(PAGE_ROUTES.transaction);
  };

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      const type = value === 'all' ? undefined : (value as CategoryTypeEnum);
      updateQueryParams(1, debouncedSearch, type, selectedCategory);
    },
    [debouncedSearch, updateQueryParams, selectedCategory],
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateQueryParams(1, debouncedSearch, currentType(), categoryId);
  };

  const hasFilters =
    !!searchInput || selectedType !== 'all' || !!selectedCategory;

  return (
    <div className="page-fade flex w-full flex-col gap-5 lg:h-[calc(100dvh-7.5rem)]">
      <PageHeader
        title="Transactions"
        description="Every rupee in and out — search, filter, and edit your entries."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Transactions' },
        ]}
        actions={
          <Button className="h-9 px-4" onClick={handleCloseDialog}>
            <PlusIcon className="size-4" />
            Add Transaction
          </Button>
        }
      />

      {/* Stats */}
      <StatWrapper
        stats={buildCashflowStats(monthStats, 'This month')}
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      />

      {/* List */}
      <Card className="gap-0 overflow-hidden py-0 lg:min-h-0 lg:flex-1">
        <div className="border-ink/[0.06] flex flex-col gap-3 border-b p-3 md:p-4 xl:flex-row xl:items-center">
          <SearchInput
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by note"
            className="w-full xl:max-w-xs"
          />

          <CategorySelect
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="h-9 w-full xl:w-56"
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
              className="text-ink-muted w-fit xl:ml-auto"
            >
              <X className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        <TransactionTable
          className="scroll-area lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
          transactions={transactions || []}
        />

        {transactions && transactions?.length !== 0 && (
          <Pagination
            page={currentPage}
            totalRecords={meta?.totalRecords}
            onPageChange={handlePageChange}
            totalPage={meta?.totalPages}
          />
        )}
      </Card>

      {showTransactionDialog && (
        <LazyTransactionDialog onClose={handleCloseDialog} open />
      )}
    </div>
  );
};

export default TransactionWrapper;
