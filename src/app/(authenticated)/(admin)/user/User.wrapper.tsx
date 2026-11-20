'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import StatWrapper from '@/components/common/Stat.wrapper';
import UserTable from '@/components/feature/user/User.table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { UserGenderEnum } from '@/types/user-profile.type';
import { IUser } from '@/types/user.type';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

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

const GENDER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: UserGenderEnum.MALE, label: UserGenderEnum.MALE },
  { value: UserGenderEnum.FEMALE, label: UserGenderEnum.FEMALE },
  { value: UserGenderEnum.OTHER, label: UserGenderEnum.OTHER },
];

const UserWrapper: React.FC<IUserWrapperProps> = ({
  users,
  currentPage,
  meta,
  userStats,
}) => {
  const router = useRouter();

  const { searchInput, debouncedSearch, handleSearchChange, clearSearch } =
    useDebouncedSearch();

  const [selectedGender, setSelectedGender] = useState<string>('all');

  // Function to update URL query params
  const updateQueryParams = useCallback(
    (page: number, search?: string, gender?: UserGenderEnum) => {
      const params = new URLSearchParams();
      if (page) params.set('page', page.toString());
      if (search) params.set('search', search);
      if (gender) params.set('gender', gender);
      router.replace(`${PAGE_ROUTES.user}?${params.toString()}`);
    },
    [router],
  );

  const currentGender = () =>
    selectedGender === 'all' ? undefined : (selectedGender as UserGenderEnum);

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, debouncedSearch, currentGender());
  };

  const handleSearch = (value: string) => {
    handleSearchChange(value);
    updateQueryParams(1, value, currentGender());
  };

  const handleClearFilter = () => {
    clearSearch();
    setSelectedGender('all');
    router.push(PAGE_ROUTES.user);
  };

  const handleGenderChange = useCallback(
    (value: string) => {
      setSelectedGender(value);
      const gender = value === 'all' ? undefined : (value as UserGenderEnum);
      updateQueryParams(1, debouncedSearch, gender);
    },
    [debouncedSearch, updateQueryParams],
  );

  const hasFilters = !!searchInput || selectedGender !== 'all';

  return (
    <div className="page-fade flex w-full flex-col gap-5 lg:h-[calc(100dvh-7.5rem)]">
      <PageHeader
        title="Users"
        description="Everyone with an Expenso account. Activate, deactivate, or review users."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Users' },
        ]}
      />

      {/* Stats */}
      <StatWrapper
        stats={(() => {
          const { totalAdmin, normalUsers } = userStats;
          const total = totalAdmin + normalUsers;
          const pct = (n: number) => (total ? (n / total) * 100 : 0);
          const hint = `of ${total} ${total === 1 ? 'user' : 'users'}`;
          return [
            {
              label: 'Admin Users',
              value: totalAdmin,
              percent: pct(totalAdmin),
              color: '#1a7f5a',
              hint,
            },
            {
              label: 'Regular Users',
              value: normalUsers,
              percent: pct(normalUsers),
              color: '#6366f1',
              hint,
            },
            {
              label: 'Total Users',
              value: total,
              percent: total ? 100 : 0,
              color: '#0ea5e9',
              hint: 'All accounts',
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
            placeholder="Search by name or email"
            className="w-full md:max-w-xs"
          />

          <SegmentedControl
            ariaLabel="Filter by gender"
            options={GENDER_OPTIONS}
            value={selectedGender}
            onChange={handleGenderChange}
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

        <UserTable
          className="scroll-area lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
          users={users || []}
        />

        {users && users?.length !== 0 && (
          <Pagination
            page={currentPage}
            totalRecords={meta?.totalRecords}
            onPageChange={handlePageChange}
            totalPage={meta?.totalPages}
          />
        )}
      </Card>
    </div>
  );
};

export default UserWrapper;
