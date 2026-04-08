import { UserService } from '@/backend/modules/user/user.service';
import UserWrapper from './User.wrapper';
import { getServerSideSession } from '@/lib/next-auth.util';
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { UserGenderEnum } from '@/types/user-profile.type';

const userService = new UserService();

type SearchParams = Promise<{
  page?: string;
  search?: string;
  gender?: UserGenderEnum;
}>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { page = 1, search = '', gender } = await searchParams;

  const session = await getServerSideSession();
  const user = session?.user;

  if (!user?.id) {
    redirect(PAGE_ROUTES.login);
  }

  const userPayload = {
    page: Number(page),
    limit: 6,
    search: search,
    userId: user.id,
    gender,
  };

  const [data, stats] = await Promise.all([
    userService.findAll(userPayload),
    userService.getUserStats(),
  ]);

  if (
    data.data.length !== 0 &&
    data?.meta?.totalPages < Number(page) &&
    !search
  ) {
    return redirect(`${PAGE_ROUTES.user}`);
  }

  return (
    <UserWrapper
      currentPage={Number(page)}
      meta={data?.meta || {}}
      users={data.data || []}
      userStats={stats}
    />
  );
};

export default Page;
