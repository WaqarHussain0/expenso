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
  PlusIcon,
  Search,
  ShoppingCartIcon,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';

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
    <div className="w-full space-y-2">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            All Categories
          </TextElement>
          <TextElement as="p" className="text-[#5a6070]">
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
            label: `Income`,
            value: categoryStats.income,
            icon: BanknoteArrowDown,
            iconClassName: `text-[#4CAF50]`,
          },

          {
            label: `Expense`,
            value: categoryStats.expense,
            icon: ShoppingCartIcon,
            iconClassName: 'text-[#F44336]',
          },

          {
            label: `Investment`,
            value: categoryStats.investment,
            icon: Coins,
            iconClassName: 'text-[#FF9800]',
          },
        ]}
        className="grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-2">
              <Label>Name</Label>

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
            </div>

            <div className="w-32 space-y-2">
              <Label>Select Type</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full capitalize">
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
            </div>

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
        </CardHeader>
      </Card>

      <Card className="p-0">
        <CardContent className="p-0">
          <CategoryTable
            className="no-scrollbar h-[40vh] overflow-y-auto"
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
