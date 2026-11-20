import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import UserProfileForm from '@/components/feature/user-profile/UserProfile.form';
import { IUser } from '@/types/user.type';
import PageHeader from '@/components/common/PageHeader';
import AiKeysCard from '@/components/feature/user-profile/AiKeys.card';
import { IAiKeySummary } from '@/app/constants/ai-providers.constant';

interface IProfileWrapperProps {
  user?: IUser;
  aiKeys: IAiKeySummary[];
}

const ProfileWrapper: React.FC<IProfileWrapperProps> = ({ user, aiKeys }) => {
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

      <AiKeysCard keys={aiKeys} />
    </div>
  );
};

export default ProfileWrapper;
