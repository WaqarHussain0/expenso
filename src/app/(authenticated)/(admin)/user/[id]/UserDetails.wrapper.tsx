/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, VenusAndMars } from 'lucide-react';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CATEGORY_ICONS } from '@/components/feature/category/Category.dialog';
import { Badge } from '@/components/ui/badge';
import { CategoryTypeEnum } from '@/types/category.type';

interface IUserDetailsWrapperProps {
  userData: any;
}

const UserDetailsWrapper: React.FC<IUserDetailsWrapperProps> = ({
  userData,
}) => {
  const { user, profile, categories } = userData || {};

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
            User details here
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

      <Row className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {categories &&
          categories.length > 0 &&
          categories?.map((item: any) => (
            <Card key={item.id} className="w-full p-3">
              <CardHeader className="flex flex-col items-center gap-2 p-0 md:flex-row">
                <div
                  className="flex size-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: item.color + '1A', // 1A is ~10% opacity in hex
                  }}
                >
                  {item.icon &&
                    (() => {
                      const iconObj = CATEGORY_ICONS.find(
                        c => c.name === item.icon,
                      );
                      if (!iconObj) return null;
                      const IconComponent = iconObj.icon;
                      return (
                        <IconComponent
                          className="size-4"
                          style={{ color: item.color }}
                        />
                      );
                    })()}
                </div>

                <Row className="flex-col gap-1 md:items-start">
                  <CardTitle className="text-sm capitalize">
                    {item.name}
                  </CardTitle>

                  <Badge
                    variant={
                      item.type === CategoryTypeEnum.EXPENSE
                        ? 'destructive'
                        : 'default'
                    }
                    className={
                      item.type === CategoryTypeEnum.INVESTMENT
                        ? 'bg-yellow-100 text-yellow-500'
                        : ''
                    }
                  >
                    {item?.type}
                  </Badge>
                </Row>
              </CardHeader>
            </Card>
          ))}
      </Row>
    </div>
  );
};

export default UserDetailsWrapper;
