'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { IUser } from '@/types/user.type';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, UserRound, UserRoundKey, Users } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import UserTable from '@/components/feature/user/User.table';
import StatWrapper from '@/components/common/Stat.wrapper';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserGenderEnum } from '@/types/user-profile.type';

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

  const categoryTypes = [
    { id: 'all', name: 'all' },
    { id: UserGenderEnum.MALE, name: UserGenderEnum.MALE },
    { id: UserGenderEnum.FEMALE, name: UserGenderEnum.FEMALE },
    { id: UserGenderEnum.OTHER, name: UserGenderEnum.OTHER },
  ];

  return (
    <div className="w-full space-y-2">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            User Settings
          </TextElement>
          <TextElement as="p" className="text-[#5a6070]">
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
            value: userStats.totalAdmin,
            icon: UserRoundKey,
            iconClassName: 'text-green-400',
          },

          {
            label: `Regular Users`,
            value: userStats.normalUsers,
            icon: UserRound,
            iconClassName: 'text-red-400',
          },

          {
            label: `Total Users`,
            value: userStats.totalAdmin + userStats.normalUsers,
            icon: Users,
            iconClassName: 'text-blue-400',
          },
        ]}
        className="grid-cols-1 gap-2 lg:grid-cols-3"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-56 space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
                <form
                  onSubmit={e => {
                    e.preventDefault(); // prevent page reload
                  }}
                >
                  <Input
                    placeholder="By name or email"
                    className="w-44 pl-10 md:w-80"
                    value={searchInput}
                    onChange={e => handleSearch(e.target.value)}
                  />
                </form>
              </div>
            </div>

            <div className="w-28 space-y-2">
              <Label>Select Gender</Label>
              <Select value={selectedGender} onValueChange={handleGenderChange}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Filter by gender" />
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
              className={`flex cursor-pointer items-center gap-1 text-blue-600 transition hover:underline ${
                !searchInput &&
                (selectedGender === 'all' || selectedGender === '')
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

      <Card className="p-0">
        <CardContent className="p-0">
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
