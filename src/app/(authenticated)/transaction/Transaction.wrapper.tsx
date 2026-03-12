'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Pagination from '@/components/common/Pagination';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import TransactionDialog from '@/components/feature/transaction/Transaction.dialog';
import TransactionTable from '@/components/feature/transaction/Transaction.table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { ITransaction } from '@/types/transaction.type';
import { Filter, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface ITransactionWrapperProps {
  transactions: ITransaction[];
  meta: {
    totalPages: number;
    totalRecords: number;
    page: number;
  };
  currentPage: number;
}

const TransactionWrapper: React.FC<ITransactionWrapperProps> = ({
  currentPage,
  meta,
  transactions,
}) => {
  const router = useRouter();
  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch();

  const [showTransactionDialog, setShowTransactionDialog] =
    useState<boolean>(false);
  const handleCloseDialog = useCallback(
    () => setShowTransactionDialog(prev => !prev),
    [],
  );

  // Function to update URL query params
  const updateQueryParams = useCallback(
    (page: number, search?: string) => {
      const params = new URLSearchParams();
      if (page) params.set('page', page.toString());
      if (search) params.set('search', search);
      router.replace(`${PAGE_ROUTES.category}?${params.toString()}`);
    },
    [router],
  );

  const handleSearch = useCallback(
    (value: string) => {
      handleSearchChange(value);
      updateQueryParams(1, value);
    },
    [handleSearchChange, updateQueryParams],
  );

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, debouncedSearch);
  };

  const handleClearFilter = () => {
    clearSearch();
    router.push(PAGE_ROUTES.transaction);
  };
  return (
    <div className="w-full space-y-3">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            All Transactions
          </TextElement>
          <TextElement as="p" className="sm">
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

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <Filter className="size-4" />
            Filter Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <TransactionTable
            className="h-[45vh] overflow-y-auto"
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
