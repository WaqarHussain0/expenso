'use client';

import { ReactNode, useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch.hook';
import { UserGenderEnum } from '@/types/user-profile.type';

interface IUserFilters {
  search: string;
  gender: string;
  status: string;
  sort: string;
}

interface IUserWrapperProps {
  filters: IUserFilters;
  /** Streamed overview stat cards (server component inside Suspense) */
  stats: ReactNode;
  /** Streamed Insights view panels (server component inside Suspense) */
  insights: ReactNode;
  /** Streamed users table + pagination (server component inside Suspense) */
  list: ReactNode;
}

const VIEW_OPTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'insights', label: 'Insights' },
];

const GENDER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: UserGenderEnum.MALE, label: 'Male' },
  { value: UserGenderEnum.FEMALE, label: 'Female' },
  { value: UserGenderEnum.OTHER, label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Deactivated' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'recent', label: 'Recently active' },
  { value: 'transactions', label: 'Most transactions' },
];

const DEFAULT_FILTERS: IUserFilters = {
  search: '',
  gender: 'all',
  status: 'all',
  sort: 'newest',
};

const toQuery = (filters: IUserFilters, page = 1) => {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (filters.search) params.set('search', filters.search);
  if (filters.gender !== 'all') params.set('gender', filters.gender);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.sort !== 'newest') params.set('sort', filters.sort);
  const query = params.toString();
  return query ? `${PAGE_ROUTES.user}?${query}` : PAGE_ROUTES.user;
};

/**
 * Client shell for the admin users page: header, view switch and filter
 * toolbar. Overview stats, insights and the table arrive as streamed slots.
 */
const UserWrapper: React.FC<IUserWrapperProps> = ({
  filters,
  stats,
  insights,
  list,
}) => {
  const router = useRouter();
  const [view, setView] = useState('users');
  const [, startTransition] = useTransition();

  // The URL is the source of truth; show the new filter instantly while the
  // server renders the matching list.
  const [shownFilters, setShownFilters] = useOptimistic(filters);

  const applyFilters = (next: Partial<IUserFilters>, page = 1) => {
    const merged = { ...shownFilters, ...next };
    startTransition(() => {
      setShownFilters(merged);
      router.replace(toQuery(merged, page), { scroll: false });
    });
  };

  const { searchInput, handleSearchChange, clearSearch } = useDebouncedSearch({
    initialValue: filters.search,
    onDebouncedChange: value => applyFilters({ search: value.trim() }),
  });

  const clearFilters = () => {
    clearSearch();
    applyFilters(DEFAULT_FILTERS);
  };

  const hasFilters =
    !!searchInput ||
    shownFilters.gender !== 'all' ||
    shownFilters.status !== 'all';

  return (
    <div
      className={`page-fade flex w-full flex-col gap-5 ${
        view === 'users' ? 'lg:h-[calc(100dvh-7.5rem)]' : ''
      }`}
    >
      <PageHeader
        title="Users"
        description="Who's using Expenso, how they signed up, and how active they are. Admin accounts aren't counted."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Users' },
        ]}
        actions={
          <SegmentedControl
            ariaLabel="View"
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
          />
        }
      />

      {stats}

      {view === 'insights' ? (
        insights
      ) : (
        <Card className="gap-0 overflow-hidden py-0 lg:min-h-0 lg:flex-1">
          <div className="border-ink/[0.06] flex flex-col gap-3 border-b p-3 md:p-4 xl:flex-row xl:items-center">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by name or email"
              className="w-full xl:max-w-xs"
            />

            <div className="flex flex-wrap items-center gap-2">
              <SegmentedControl
                ariaLabel="Filter by gender"
                options={GENDER_OPTIONS}
                value={shownFilters.gender}
                onChange={gender => applyFilters({ gender })}
                className="max-w-full"
              />

              <Select
                value={shownFilters.status}
                onValueChange={status => applyFilters({ status })}
              >
                <SelectTrigger
                  aria-label="Filter by status"
                  className="h-9 w-[140px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {STATUS_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={shownFilters.sort}
                onValueChange={sort => applyFilters({ sort })}
              >
                <SelectTrigger
                  aria-label="Sort users"
                  className="h-9 w-[170px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {SORT_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-ink-muted"
                >
                  <X className="size-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {list}
        </Card>
      )}
    </div>
  );
};

export default UserWrapper;
