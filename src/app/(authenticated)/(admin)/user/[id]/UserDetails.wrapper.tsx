/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { COLOR_CODES } from '@/app/constants/app.constant';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, VenusAndMars } from 'lucide-react';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { CATEGORY_ICONS } from '@/app/constants/category-icons.constant';
import { Badge } from '@/components/ui/badge';
import { CategoryTypeEnum } from '@/types/category.type';
import StatWrapper from '@/components/common/Stat.wrapper';
import PageHeader from '@/components/common/PageHeader';

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
    <div className="page-fade flex w-full flex-col gap-5">
      <PageHeader
        title={
          <span className="capitalize">{user.name || 'User details'}</span>
        }
        description="Profile and activity for this user."
        breadcrumbs={[
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
                    <TextElement as="p" className="text-[#5a6070]">
                      {item.title}
                    </TextElement>

                    <TextElement
                      as="h4"
                      className={`font-medium ${item.title === 'Gender' ? 'capitalize' : ''}`}
                    >
                      {item.value}
                    </TextElement>
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
            stats={(() => {
              const { income, expense, investment } = monthStats;
              const base = income || 1;
              const freeCash = income - (expense + investment);
              return [
                {
                  label: 'Income',
                  value: income,
                  percent: income ? 100 : 0,
                  color: COLOR_CODES.income,
                  hint: 'This month',
                },
                {
                  label: 'Expense',
                  value: expense,
                  percent: (expense / base) * 100,
                  color: COLOR_CODES.expense,
                  hint: 'This month',
                },
                {
                  label: 'Investment',
                  value: investment,
                  percent: (investment / base) * 100,
                  color: COLOR_CODES.investment,
                  hint: 'This month',
                },
                {
                  label: 'Free Cash',
                  value: freeCash,
                  percent: (freeCash / base) * 100,
                  color: COLOR_CODES.freeCash,
                  hint: 'This month',
                },
              ];
            })()}
            className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
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
                      className="flex size-7 shrink-0 items-center justify-center rounded-full md:size-9"
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
                              className="size-3 shrink-0 md:size-4"
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
