import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { requireAdminPage } from '@/lib/admin-page-guard';
import {
  UserInsightsService,
  UserSortOption,
  UserStatusFilter,
} from '@/backend/modules/user/services/user-insights.service';
import { UserGenderEnum } from '@/types/user-profile.type';
import UserWrapper from './User.wrapper';

export const metadata: Metadata = { title: 'Users' };

const insightsService = new UserInsightsService();

const PAGE_SIZE = 10;

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

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = (params.search ?? '').trim().slice(0, 100);
  const gender = pick(params.gender, GENDERS) as UserGenderEnum | undefined;
  const status = pick(params.status, STATUSES);
  const sort = pick(params.sort, SORTS) ?? 'newest';

  const [list, overview] = await Promise.all([
    insightsService.listUsers({
      page,
      limit: PAGE_SIZE,
      search,
      gender,
      status,
      sort,
    }),
    insightsService.getOverview(),
  ]);

  // Past the last page (e.g. after deleting the last user on it) → first page
  if (list.data.length === 0 && page > 1 && list.meta.totalPages > 0) {
    redirect(PAGE_ROUTES.user);
  }

  return (
    <UserWrapper
      users={list.data}
      meta={list.meta}
      overview={overview}
      filters={{
        search,
        gender: gender ?? 'all',
        status: status ?? 'all',
        sort,
      }}
    />
  );
};

export default Page;
