/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Row from './Row';
import Skeleton from 'react-loading-skeleton';

interface IStatWrapperProps {
  stats: { label: string; icon: any; value: number; iconClassName?: string }[];
  className?: string;
  isLoading?: boolean;
}

const StatWrapper: React.FC<IStatWrapperProps> = ({
  stats,
  className,
  isLoading = false,
}) => {
  return (
    <Row className={`grid grid-cols-1 gap-2 md:grid-cols-3 ${className}`}>
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton width={80} height={16} />
                  <Skeleton circle width={25} height={25} />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton width={120} height={28} />
              </CardContent>
            </Card>
          ))
        : stats.map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="gap-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${item.iconClassName}`}>
                      {item.label}
                    </CardTitle>
                    <Icon className={`size-4 md:size-5 ${item.iconClassName}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="manropeBold text-lg text-gray-900 md:text-2xl">
                        {item.value?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
    </Row>
  );
};

export default StatWrapper;