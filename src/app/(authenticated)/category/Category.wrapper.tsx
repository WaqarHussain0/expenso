'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import CategoryTable from '@/components/feature/category/Category.table';
import { Button } from '@/components/ui/button';
import {
  BanknoteArrowDown,
  Coins,
  Filter,
  PlusIcon,
  Search,
  ShoppingCartIcon,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CategoryDialog from '@/components/feature/category/Category.dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';

import StatWrapper from '@/components/common/Stat.wrapper';

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

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, debouncedSearch);
  };

  const handleSearch = useCallback(
    (value: string) => {
      handleSearchChange(value);
      updateQueryParams(1, value);
    },
    [handleSearchChange, updateQueryParams],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      const type = value === 'all' ? undefined : (value as CategoryTypeEnum);
      updateQueryParams(1, debouncedSearch, type);
    },
    [debouncedSearch, updateQueryParams],
  );

  const categoryTypes = [
    { id: 'all', name: 'all' },
    { id: CategoryTypeEnum.INCOME, name: CategoryTypeEnum.INCOME },
    { id: CategoryTypeEnum.EXPENSE, name: CategoryTypeEnum.EXPENSE },
    { id: CategoryTypeEnum.INVESTMENT, name: CategoryTypeEnum.INVESTMENT },
  ];

  const handleClearFilter = () => {
    setSelectedType('all');
    clearSearch();
    router.push(PAGE_ROUTES.category);
  };

  return (
    <div className="w-full space-y-3">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            All Categories
          </TextElement>
          <TextElement as="p" className="text-[#D47E30]">
            Manage your categories here
          </TextElement>
        </Row>

        <Button className="" onClick={handleCloseDialog}>
          <PlusIcon className="size-4" />
          Add Category
        </Button>
      </Row>

      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Categories' },
        ]}
      />

      {/* Stats  */}
      <StatWrapper
        stats={[
          {
            label: `Income Categories`,
            value: categoryStats.income,
            icon: BanknoteArrowDown,
            iconClassName: 'text-green-400',
          },

          {
            label: `Expense Categories`,
            value: categoryStats.expense,
            icon: ShoppingCartIcon,
            iconClassName: 'text-red-400',
          },

          {
            label: `Investment Categories`,
            value: categoryStats.investment,
            icon: Coins,
            iconClassName: 'text-yellow-400',
          },
        ]}
      />
      
      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="textPrimary flex items-center gap-1">
            <Filter className="size-4" />
            Filter Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
              <form
                onSubmit={e => {
                  e.preventDefault(); // prevent page reload
                }}
              >
                <Input
                  placeholder="Search by name"
                  className="w-44 pl-10 md:w-80"
                  value={searchInput}
                  onChange={e => handleSearch(e.target.value)}
                />
              </form>
            </div>

            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-24 capitalize">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>

              <SelectContent>
                {categoryTypes.map(type => (
                  <SelectItem
                    className="capitalize"
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TextElement
              className={` ${
                !searchInput && selectedType === 'all' ? 'hidden' : ''
              }`}
              as="span"
              onClick={handleClearFilter}
            >
              Clear All
            </TextElement>
          </div>

          <CategoryTable
            className="h-[40vh] overflow-y-auto"
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
        </CardContent>
      </Card>

      <CategoryDialog onClose={handleCloseDialog} open={showCategoryDialog} />
    </div>
  );
};

export default CategoryWrapper;
