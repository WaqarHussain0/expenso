/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Row from './Row';

interface IStatWrapperProps {
  stats: { label: string; icon: any; value: number; iconClassName?: string }[];
  className?: string;
}

const StatWrapper: React.FC<IStatWrapperProps> = ({ stats, className }) => {
  return (
    <Row className={`grid grid-cols-1 gap-2 md:grid-cols-3 ${className}`}>
      {stats.map(item => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="gap-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`${item.iconClassName}`}>
                  {item.label}
                </CardTitle>
                {<Icon className={`size-5 ${item.iconClassName}`} />}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`manropeBold text-2xl text-gray-900`}>
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
