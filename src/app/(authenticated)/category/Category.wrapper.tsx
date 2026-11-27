'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import {
  LazyCategoryDialog,
  LazyCategoryImportDialog,
} from '@/components/feature/lazy-dialogs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { CategoryTypeEnum } from '@/types/category.type';
import { Download, PlusIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { exportCategoriesAction } from '@/lib/server-actions/category.server-action';
import { downloadCsv } from '@/lib/download.util';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useCallback, useState, useTransition } from 'react';

interface ICategoryWrapperProps {
  /** Streamed stats cards (server component inside Suspense) */
  stats: ReactNode;
  /** Streamed category grid + pagination (server component inside Suspense) */
  list: ReactNode;
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

/**
 * Client shell for the category page: header, add dialog and filter toolbar.
 * Data sections arrive as `stats` / `list` slots so they can stream in
 * independently while this renders immediately.
 */
const CategoryWrapper: React.FC<ICategoryWrapperProps> = ({ stats, list }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Start from whatever filters are already in the URL (e.g. after a refresh)
  const [selectedType, setSelectedType] = useState<string>(
    () => searchParams.get('type') ?? 'all',
  );

  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const handleCloseDialog = useCallback(
    () => setShowCategoryDialog(prev => !prev),
    [],
  );

  const [showImportDialog, setShowImportDialog] = useState(false);

  // Export runs as a server action in a transition, so the page stays
  // responsive while the CSV is built; the file downloads when it's ready
  const [isExporting, startExport] = useTransition();
  const handleExport = () => {
    startExport(async () => {
      const result = await exportCategoriesAction();

      if (result.success && result.csv && result.fileName) {
        downloadCsv(result.csv, result.fileName);
        toast.success('Categories exported');
      } else {
        toast.error(result.error || 'Could not export your categories');
      }
    });
  };

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

  // The URL (and so the server fetch) only updates once typing settles
  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch({
      initialValue: searchParams.get('search') ?? '',
      onDebouncedChange: value => updateQueryParams(1, value, currentType()),
    });

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
          <>
            <Button
              variant="outline"
              className="h-9 px-4"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="size-4" />
              Import
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="size-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button className="h-9 px-4" onClick={handleCloseDialog}>
              <PlusIcon className="size-4" />
              Add Category
            </Button>
          </>
        }
      />

      {/* Stats */}
      {stats}

      {/* List */}
      <Card className="gap-0 overflow-hidden py-0 lg:min-h-0 lg:flex-1">
        <div className="border-ink/[0.06] flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:p-4">
          <SearchInput
            value={searchInput}
            onChange={handleSearchChange}
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
              className="text-ink-muted w-fit md:ml-auto"
            >
              <X className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {list}
      </Card>

      {showCategoryDialog && (
        <LazyCategoryDialog onClose={handleCloseDialog} open />
      )}

      {showImportDialog && (
        <LazyCategoryImportDialog
          open
          onClose={() => setShowImportDialog(false)}
        />
      )}
    </div>
  );
};

export default CategoryWrapper;
