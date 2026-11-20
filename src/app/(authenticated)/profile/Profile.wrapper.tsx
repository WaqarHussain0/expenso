import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import UserProfileForm from '@/components/feature/user-profile/UserProfile.form';
import { IUser } from '@/types/user.type';
import PageHeader from '@/components/common/PageHeader';

interface IProfileWrapperProps {
  user?: IUser;
}

const ProfileWrapper: React.FC<IProfileWrapperProps> = ({ user }) => {
  return (
    <div className="page-fade flex w-full flex-col gap-5">
      <PageHeader
        title="Profile"
        description="Your account details and how Expenso knows you."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Profile' },
        ]}
      />

      <UserProfileForm user={user} />
    </div>
  );
};

export default ProfileWrapper;
