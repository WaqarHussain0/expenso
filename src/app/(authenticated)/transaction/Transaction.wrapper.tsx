'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Pagination from '@/components/common/Pagination';
import Row from '@/components/common/Row';
import StatWrapper from '@/components/common/Stat.wrapper';
import TextElement from '@/components/common/TextElement';
import TransactionDialog from '@/components/feature/transaction/Transaction.dialog';

import TransactionTable from '@/components/feature/transaction/Transaction.table';
import { CategorySelect } from '@/components/select/Category.select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { CategoryTypeEnum } from '@/types/category.type';
import { ITransaction } from '@/types/transaction.type';
import {
  Banknote,
  BanknoteArrowDown,
  Coins,
  PlusIcon,
  Search,
  ShoppingCartIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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

const TransactionWrapper: React.FC<ITransactionWrapperProps> = ({
  currentPage,
  meta,
  transactions,
  monthStats,
}) => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch();

  const [selectedType, setSelectedType] = useState<string>('all');

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

  const handleSearch = useCallback(
    (value: string) => {
      handleSearchChange(value);

      const type =
        selectedType === 'all' ? undefined : (selectedType as CategoryTypeEnum);

      updateQueryParams(1, value, type, selectedCategory);
    },
    [handleSearchChange, updateQueryParams, selectedType, selectedCategory],
  );

  const handlePageChange = (newPage: number) => {
    const type =
      selectedType === 'all' ? undefined : (selectedType as CategoryTypeEnum);

    updateQueryParams(newPage, debouncedSearch, type, selectedCategory);
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

  const categoryTypes = [
    { id: 'all', name: 'all' },
    { id: CategoryTypeEnum.INCOME, name: CategoryTypeEnum.INCOME },
    { id: CategoryTypeEnum.EXPENSE, name: CategoryTypeEnum.EXPENSE },
    { id: CategoryTypeEnum.INVESTMENT, name: CategoryTypeEnum.INVESTMENT },
  ];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateQueryParams(1, debouncedSearch, undefined, categoryId);
  };

  return (
    <div className="no-scrollbar w-full space-y-2">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            All Transactions
          </TextElement>
          <TextElement as="p" className="text-[#5a6070]">
            Manage your transactions here
          </TextElement>
        </Row>

        <Button className="" onClick={handleCloseDialog}>
          <PlusIcon className="size-4" />
          Add Transaction
        </Button>
      </Row>

      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Transactions' },
        ]}
      />

      {/* Stats  */}
      <StatWrapper
        stats={[
          {
            label: `Income`,
            value: monthStats.income,
            icon: BanknoteArrowDown,
            iconClassName: 'text-[#4CAF50]',
          },

          {
            label: `Expense`,
            value: monthStats.expense,
            icon: ShoppingCartIcon,
            iconClassName: 'text-[#F44336]',
          },

          {
            label: `Investment`,
            value: monthStats.investment,
            icon: Coins,
            iconClassName: 'text-[#FF9800]',
          },

          {
            label: `Free Cash`,
            value:
              monthStats.income - (monthStats.expense + monthStats.investment),
            icon: Banknote,
            iconClassName: 'text-[#2196F3]',
          },
        ]}
        className="grid-cols-2 gap-2 lg:grid-cols-4"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-72 space-y-2">
              <Label>Select Category</Label>

              <CategorySelect
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Search by Note</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
                <form
                  onSubmit={e => {
                    e.preventDefault(); // prevent page reload
                  }}
                >
                  <Input
                    placeholder="Search by note"
                    className="w-44 pl-10 md:w-80"
                    value={searchInput}
                    onChange={e => handleSearch(e.target.value)}
                  />
                </form>
              </div>
            </div>

            <div className="w-28 space-y-2">
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
                !searchInput && selectedType === 'all' && !selectedCategory
                  ? 'hidden'
                  : ''
              }`}
              as="span"
              onClick={handleClearFilter}
            >
              Clear All
            </TextElement>
          </div>
        </CardHeader>
      </Card>

      <Card className="p-0 ">
        <CardContent className="p-0">
          <TransactionTable
            className="no-scrollbar h-[40vh] overflow-y-auto"
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
        </CardContent>
      </Card>

      <TransactionDialog
        onClose={handleCloseDialog}
        open={showTransactionDialog}
      />
    </div>
  );
};

export default TransactionWrapper;
