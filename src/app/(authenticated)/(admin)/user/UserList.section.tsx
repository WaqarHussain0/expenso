import { redirect } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  UserInsightsService,
  UserSortOption,
  UserStatusFilter,
} from '@/backend/modules/user/services/user-insights.service';
import UserTable from '@/components/feature/user/User.table';
import { UserGenderEnum } from '@/types/user-profile.type';
import UserPagination from './UserPagination';

const insightsService = new UserInsightsService();

export const PAGE_SIZE = 10;

const TABLE_CLASS = 'scroll-area lg:min-h-0 lg:flex-1 lg:overflow-y-auto';

interface IUserListSectionProps {
  page: number;
  search: string;
  gender: UserGenderEnum | undefined;
  status: UserStatusFilter | undefined;
  sort: UserSortOption;
}

/** The filtered, paginated users table. Streams in behind its own skeleton. */
const UserListSection = async ({
  page,
  search,
  gender,
  status,
  sort,
}: IUserListSectionProps) => {
  const list = await insightsService.listUsers({
    page,
    limit: PAGE_SIZE,
    search,
    gender,
    status,
    sort,
  });

  // Past the last page (e.g. after deleting the last user on it) → first page
  if (list.data.length === 0 && page > 1 && list.meta.totalPages > 0) {
    redirect(PAGE_ROUTES.user);
  }

  return (
    <>
      <UserTable className={TABLE_CLASS} users={list.data} />

      {list.data.length > 0 && (
        <UserPagination
          page={list.meta.page}
          totalPages={list.meta.totalPages}
          totalRecords={list.meta.totalRecords}
        />
      )}
    </>
  );
};

/** Header + rows matching the loaded table's shape. */
export const UserListSkeleton = () => (
  <div className={TABLE_CLASS} aria-busy="true" aria-label="Loading users">
    <div className="border-ink/[0.06] flex items-center gap-4 border-b px-4 py-3">
      <Skeleton width={50} height={12} />
      <div className="flex-1" />
      <Skeleton width={70} height={12} />
    </div>

    {Array.from({ length: PAGE_SIZE }, (_, i) => (
      <div
        key={i}
        className="border-ink/[0.06] flex items-center gap-3 border-b px-4 py-3"
      >
        <Skeleton circle width={36} height={36} />
        <div className="min-w-0 flex-1">
          <Skeleton width="30%" height={13} />
          <Skeleton width="45%" height={11} className="mt-1" />
        </div>
        <div className="hidden flex-1 md:block">
          <Skeleton width="50%" height={13} />
        </div>
        <Skeleton width={80} height={13} />
      </div>
    ))}
  </div>
);

export default UserListSection;
