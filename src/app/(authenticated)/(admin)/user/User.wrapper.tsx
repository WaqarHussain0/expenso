'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { IUser } from '@/types/user.type';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Search, UserRound, UserRoundKey, Users } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import UserTable from '@/components/feature/user/User.table';
import StatWrapper from '@/components/common/Stat.wrapper';

export interface IUserStats {
  totalAdmin: number;
  normalUsers: number;
}

interface IUserWrapperProps {
  users: IUser[];
  meta: {
    totalPages: number;
    totalRecords: number;
    page: number;
  };
  currentPage: number;
  userStats: IUserStats;
}

const UserWrapper: React.FC<IUserWrapperProps> = ({
  users,
  currentPage,
  meta,
  userStats,
}) => {
  const router = useRouter();

  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch();

  // Function to update URL query params
  const updateQueryParams = useCallback(
    (page: number, search?: string) => {
      const params = new URLSearchParams();
      if (page) params.set('page', page.toString());
      if (search) params.set('search', search);
      router.replace(`${PAGE_ROUTES.user}?${params.toString()}`);
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

  const handleClearFilter = () => {
    clearSearch();
    router.push(PAGE_ROUTES.user);
  };

  return (
    <div className="w-full space-y-3">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            All Users
          </TextElement>
          <TextElement as="p" className="text-[#D47E30]">
            Manage users here
          </TextElement>
        </Row>
      </Row>
      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Users' },
        ]}
      />

      {/* Stats  */}

      <StatWrapper
        stats={[
          {
            label: `Admin Users`,
            value: userStats.normalUsers,
            icon: UserRoundKey,
            iconClassName: 'text-green-400',
          },

          {
            label: `Regular Users`,
            value: userStats.totalAdmin,
            icon: UserRound,
            iconClassName: 'text-red-400',
          },

          {
            label: `Total Users`,
            value: userStats.totalAdmin,
            icon: Users,
            iconClassName: 'text-blue-400',
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
                  placeholder="Search by note"
                  className="w-44 pl-10 md:w-80"
                  value={searchInput}
                  onChange={e => handleSearch(e.target.value)}
                />
              </form>
            </div>

            <TextElement
              className={`flex cursor-pointer items-center gap-1 text-blue-600 transition hover:underline ${
                !searchInput ? 'hidden' : ''
              }`}
              as="span"
              onClick={handleClearFilter}
            >
              Clear All
            </TextElement>
          </div>
          <UserTable className="h-[40vh] overflow-y-auto" users={users || []} />

          {users && users?.length !== 0 && (
            <Pagination
              page={currentPage}
              totalRecords={meta?.totalRecords}
              onPageChange={handlePageChange}
              totalPage={meta?.totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWrapper;
