import { ReactNode } from 'react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';

interface IProfileWrapperProps {
  /** Streamed profile form (server component inside Suspense) */
  profile: ReactNode;
  /** Streamed AI provider keys card (server component inside Suspense) */
  aiKeys: ReactNode;
}

const ProfileWrapper: React.FC<IProfileWrapperProps> = ({
  profile,
  aiKeys,
}) => {
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

      {profile}

      {aiKeys}
    </div>
  );
};

export default ProfileWrapper;
