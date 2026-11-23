'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Pagination from '@/components/common/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface ITransactionPaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
}

/** Pagination that keeps the current search/type/category filters from the URL. */
const TransactionPagination: React.FC<ITransactionPaginationProps> = ({
  page,
  totalPages,
  totalRecords,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.replace(`${PAGE_ROUTES.transaction}?${params.toString()}`);
  };

  return (
    <Pagination
      page={page}
      totalPage={totalPages}
      totalRecords={totalRecords}
      onPageChange={handlePageChange}
    />
  );
};

export default TransactionPagination;
