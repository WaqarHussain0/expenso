/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, VenusAndMars } from 'lucide-react';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

interface IUserDetailsWrapperProps {
  userData: any;
}

const UserDetailsWrapper: React.FC<IUserDetailsWrapperProps> = ({
  userData,
}) => {
  const { user, profile } = userData || {};

  const stats = [
    {
      title: 'Gender',
      value: profile?.gender || 'N/A',
      icon: VenusAndMars,
    },
    {
      title: 'Contact',
      value: profile?.contact || 'N/A',
      icon: Phone,
    },
    {
      title: 'Email',
      value: user?.email || '',
      icon: Mail,
    },
  ];

  return (
    <div className="no-scrollbar w-full space-y-2">
      <Row className="flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
        <Row className="flex-col items-start">
          <TextElement as="h3" className="">
            {' '}
            User Details
          </TextElement>
          <TextElement as="p" className="text-[#5a6070]">
            User details here here
          </TextElement>
        </Row>
      </Row>

      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Users', linkTo: PAGE_ROUTES.user },
          { label: user.name || '' },
        ]}
      />

      <Card className="">
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {stats.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <Icon className="text-muted-foreground h-5 w-5" />
                  <div className="flex flex-col">
                    <p className="text-muted-foreground text-sm">
                      {item.title}
                    </p>
                    <p
                      className={`font-medium ${item.title === 'Gender' ? 'capitalize' : ''}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsWrapper;
