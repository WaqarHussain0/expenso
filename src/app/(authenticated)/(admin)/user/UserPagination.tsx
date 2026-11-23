'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Pagination from '@/components/common/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface IUserPaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
}

/** Pagination that keeps the current search/filters/sort from the URL. */
const UserPagination: React.FC<IUserPaginationProps> = ({
  page,
  totalPages,
  totalRecords,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) params.set('page', String(newPage));
    else params.delete('page');

    const query = params.toString();
    router.replace(query ? `${PAGE_ROUTES.user}?${query}` : PAGE_ROUTES.user, {
      scroll: false,
    });
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

export default UserPagination;
