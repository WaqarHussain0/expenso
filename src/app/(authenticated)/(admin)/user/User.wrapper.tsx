'use client';

import dynamic from 'next/dynamic';
import { useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import SegmentedControl from '@/components/common/SegmentedControl';
import StatWrapper from '@/components/common/Stat.wrapper';
import UserTable from '@/components/feature/user/User.table';
import { Panel, RatioRow, SplitBar } from '@/components/feature/user/admin-ui';
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
import type {
  IAdminOverview,
  IAdminUserRow,
} from '@/backend/modules/user/services/user-insights.service';

// Charts only load when the Insights view is opened
const UserGrowthChart = dynamic(
  () => import('@/components/feature/user/UserGrowthChart'),
  { ssr: false, loading: () => <div className="h-[260px]" /> },
);

interface IUserFilters {
  search: string;
  gender: string;
  status: string;
  sort: string;
}

interface IUserWrapperProps {
  users: IAdminUserRow[];
  meta: { totalPages: number; totalRecords: number; page: number };
  overview: IAdminOverview;
  filters: IUserFilters;
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

const pct = (value: number, total: number) =>
  total ? (value / total) * 100 : 0;

const UserWrapper: React.FC<IUserWrapperProps> = ({
  users,
  meta,
  overview,
  filters,
}) => {
  const router = useRouter();
  const [view, setView] = useState('users');
  const [isNavigating, startTransition] = useTransition();

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

  const { totals, signInMethods, genders, trend } = overview;
  const users$ = totals.users;
  const hint = `of ${users$} ${users$ === 1 ? 'user' : 'users'}`;

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

      <StatWrapper
        stats={[
          {
            label: 'Total users',
            value: users$,
            percent: users$ ? 100 : 0,
            color: '#0ea5e9',
            hint: `+${totals.newThisMonth} new this month`,
          },
          {
            label: `Active · last ${totals.activeWindowDays} days`,
            value: totals.activeRecently,
            percent: pct(totals.activeRecently, users$),
            color: '#1a7f5a',
            hint,
          },
          {
            label: 'Tracking money',
            value: totals.withTransactions,
            percent: pct(totals.withTransactions, users$),
            color: '#6366f1',
            hint: 'Logged a transaction',
          },
          {
            label: 'Deactivated',
            value: totals.deactivated,
            percent: pct(totals.deactivated, users$),
            color: '#f43f5e',
            hint,
          },
        ]}
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      />

      {view === 'insights' ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <Panel
            title="Growth"
            description="New users and transactions logged per month, last 12 months."
            className="lg:col-span-2"
          >
            <UserGrowthChart data={trend} />
          </Panel>

          <Panel
            title="Engagement"
            description="How far users have got with the app."
            bodyClassName="space-y-4"
          >
            <RatioRow
              label="Finished first-time setup"
              value={totals.onboarded}
              total={users$}
            />
            <RatioRow
              label="Logged at least one transaction"
              value={totals.withTransactions}
              total={users$}
              color="#6366f1"
            />
            <RatioRow
              label={`Active in the last ${totals.activeWindowDays} days`}
              value={totals.activeRecently}
              total={users$}
              color="#0ea5e9"
            />
            <RatioRow
              label="Using their own AI keys"
              value={totals.withOwnAiKeys}
              total={users$}
              color="#f59e0b"
            />
            <dl className="border-ink/[0.06] grid grid-cols-3 gap-3 border-t pt-4">
              {[
                { label: 'Transactions', value: totals.transactions },
                { label: 'This month', value: totals.transactionsThisMonth },
                { label: 'Share links', value: totals.shareLinks },
              ].map(item => (
                <div key={item.label}>
                  <dt className="inter text-ink-subtle text-[11px]">
                    {item.label}
                  </dt>
                  <dd className="manrope text-ink text-lg font-bold tabular-nums">
                    {item.value.toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel
            title="Sign-in method"
            description="How each account was created."
          >
            <SplitBar
              segments={[
                {
                  label: 'Email',
                  value: signInMethods.email,
                  color: '#1a7f5a',
                },
                {
                  label: 'Google',
                  value: signInMethods.google,
                  color: '#4285F4',
                },
              ]}
            />
          </Panel>

          <Panel title="Gender" description="From users' profiles.">
            <SplitBar
              segments={[
                { label: 'Male', value: genders.male, color: '#0ea5e9' },
                { label: 'Female', value: genders.female, color: '#ec4899' },
                { label: 'Other', value: genders.other, color: '#a78bfa' },
                { label: 'Not set', value: genders.notSet, color: '#94a3b8' },
              ]}
            />
          </Panel>

          <Panel
            title="Account status"
            description="Deactivated users can't sign in; their data is kept."
          >
            <SplitBar
              segments={[
                { label: 'Active', value: totals.active, color: '#059669' },
                {
                  label: 'Deactivated',
                  value: totals.deactivated,
                  color: '#f43f5e',
                },
              ]}
            />
          </Panel>
        </div>
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

            <p className="inter text-ink-subtle text-xs xl:ml-auto">
              {meta.totalRecords.toLocaleString()}{' '}
              {meta.totalRecords === 1 ? 'user' : 'users'}
            </p>
          </div>

          <UserTable
            className="scroll-area lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            users={users}
            isRefreshing={isNavigating}
          />

          {users.length > 0 && (
            <Pagination
              page={meta.page}
              totalRecords={meta.totalRecords}
              totalPage={meta.totalPages}
              onPageChange={page => applyFilters({}, page)}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default UserWrapper;
