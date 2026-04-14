'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import UserProfileForm from '@/components/feature/user-profile/UserProfile.form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { IUser } from '@/types/user.type';

interface IProfileWrapperProps {
  user?: IUser;
}

const ProfileWrapper: React.FC<IProfileWrapperProps> = ({ user }) => {
  return (
    <div className="no-scrollbar w-full space-y-2">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            Profile Settings
          </TextElement>
          <TextElement as="p" className="text-[#5a6070]">
            Manage your account information
          </TextElement>
        </Row>
      </Row>

      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Profile' },
        ]}
      />

      <Card className="">
        <CardHeader className="">
          <CardTitle className=""> Profile Details</CardTitle>
          <CardDescription>
            This information will be used to personalize your experience and
            manage your account settings.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWrapper;
