import type { Metadata } from 'next';
import { Suspense } from 'react';
import { requireAdminPage } from '@/lib/admin-page-guard';
import type {
  UserSortOption,
  UserStatusFilter,
} from '@/backend/modules/user/services/user-insights.service';
import { UserGenderEnum } from '@/types/user-profile.type';
import UserWrapper from './User.wrapper';
import {
  UserInsightsSection,
  UserInsightsSkeleton,
  UserStatsSection,
  UserStatsSkeleton,
} from './UserOverview.sections';
import UserListSection, { UserListSkeleton } from './UserList.section';

export const metadata: Metadata = { title: 'Users' };

type SearchParams = Promise<{
  page?: string;
  search?: string;
  gender?: string;
  status?: string;
  sort?: string;
}>;

const GENDERS = Object.values(UserGenderEnum) as string[];
const STATUSES: UserStatusFilter[] = ['active', 'inactive'];
const SORTS: UserSortOption[] = ['newest', 'oldest', 'recent', 'transactions'];

// Only accept known values — anything else in the URL is ignored
const pick = <T extends string>(value: string | undefined, allowed: T[]) =>
  allowed.includes(value as T) ? (value as T) : undefined;

/**
 * Renders the shell (header, view switch, filters) right away and streams the
 * overview stats, insights and the users table separately.
 */
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = (params.search ?? '').trim().slice(0, 100);
  const gender = pick(params.gender, GENDERS) as UserGenderEnum | undefined;
  const status = pick(params.status, STATUSES);
  const sort = pick(params.sort, SORTS) ?? 'newest';

  return (
    <UserWrapper
      filters={{
        search,
        gender: gender ?? 'all',
        status: status ?? 'all',
        sort,
      }}
      stats={
        <Suspense fallback={<UserStatsSkeleton />}>
          <UserStatsSection />
        </Suspense>
      }
      insights={
        <Suspense fallback={<UserInsightsSkeleton />}>
          <UserInsightsSection />
        </Suspense>
      }
      list={
        // A new key per filter combination shows the table skeleton while
        // the next page/search/filter/sort loads, instead of stale rows.
        <Suspense
          key={`${page}|${search}|${gender ?? 'all'}|${status ?? 'all'}|${sort}`}
          fallback={<UserListSkeleton />}
        >
          <UserListSection
            page={page}
            search={search}
            gender={gender}
            status={status}
            sort={sort}
          />
        </Suspense>
      }
    />
  );
};

export default Page;
