import React from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import Skeleton from 'react-loading-skeleton';

interface IStatCardProps {
  isLoading?: boolean;
  stat: {
    label: string;
    color: string;
    value: number | string;
    percent: number;
  };
}
const StatCard: React.FC<IStatCardProps> = ({ isLoading = false, stat }) => {
  const safePercent = Math.max(0, Math.min(100, stat.percent));

  return (
    <>
      {isLoading ? (
        <Card className="flex items-center justify-center gap-1">
          <Skeleton width={80} height={16} />
          <CardContent>
            <Skeleton circle width={90} height={90} />
          </CardContent>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center gap-1 p-3 transition-transform hover:scale-105">
          <CardTitle className="text-muted-foreground text-xs">
            {stat.label}
          </CardTitle>

          {/* Circle */}
          <div
            className="relative mt-2 flex items-center justify-center rounded-full"
            style={{
              width: 90,
              height: 90,
              background: `conic-gradient(${stat.color} ${safePercent}%, #e5e7eb ${safePercent}% 100%)`,
            }}
          >
            {/* Inner circle */}
            <div className="flex size-[75px] flex-col items-center justify-center rounded-full bg-white">
              <span className="manropeBold text-muted-foreground text-xs">
                {safePercent.toFixed(0)}%
              </span>
              <span className="manropeBold text-sm font-semibold">
                {stat.value.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default StatCard;
