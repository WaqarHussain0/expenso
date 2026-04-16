/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Phone,
  VenusAndMars,
  Banknote,
  BanknoteArrowDown,
  Coins,
  PlusIcon,
  Search,
  ShoppingCartIcon,
} from 'lucide-react';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CATEGORY_ICONS } from '@/components/feature/category/Category.dialog';
import { Badge } from '@/components/ui/badge';
import { CategoryTypeEnum } from '@/types/category.type';
import StatWrapper from '@/components/common/Stat.wrapper';

interface IUserDetailsWrapperProps {
  userData: any;
  monthStats: {
    income: number;
    investment: number;
    expense: number;
  };
}

const UserDetailsWrapper: React.FC<IUserDetailsWrapperProps> = ({
  userData,
  monthStats,
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

      <Card>
        <CardHeader>
          <CardTitle>Current Month Stats</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Stats  */}
          <StatWrapper
            stats={[
              {
                label: `Income`,
                value: monthStats.income,
                icon: BanknoteArrowDown,
                iconClassName: 'text-[#4CAF50]',
              },

              {
                label: `Expense`,
                value: monthStats.expense,
                icon: ShoppingCartIcon,
                iconClassName: 'text-[#F44336]',
              },

              {
                label: `Investment`,
                value: monthStats.investment,
                icon: Coins,
                iconClassName: 'text-[#FF9800]',
              },

              {
                label: `Free Cash`,
                value:
                  monthStats.income -
                  (monthStats.expense + monthStats.investment),
                icon: Banknote,
                iconClassName: 'text-[#2196F3]',
              },
            ]}
            className="grid-cols-2 gap-2 lg:grid-cols-4"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Categories</CardTitle>
        </CardHeader>

        <CardContent>
          <Row className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {categories &&
              categories.length > 0 &&
              categories?.map((item: any) => (
                <Card key={item.id} className="w-full p-2">
                  <CardHeader className="flex flex-col items-center gap-2 p-0 md:flex-row">
                    <div
                      className="flex size-7 md:size-9 shrink-0 items-center justify-center rounded-full"
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
                              className="size-3 md:size-4 shrink-0"
                              style={{ color: item.color }}
                            />
                          );
                        })()}
                    </div>

                    <Row className="flex-col gap-1 md:items-start">
                      <CardTitle className="line-clamp-1 text-xs capitalize md:text-sm">
                        {item.name}
                      </CardTitle>

                      <Badge
                        variant={
                          item.type === CategoryTypeEnum.EXPENSE
                            ? 'destructive'
                            : 'default'
                        }
                        className={`capitalize ${
                          item.type === CategoryTypeEnum.INVESTMENT
                            ? 'bg-yellow-100 text-yellow-500'
                            : ''
                        }`}
                      >
                        {item?.type}
                      </Badge>
                    </Row>
                  </CardHeader>
                </Card>
              ))}
          </Row>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsWrapper;
