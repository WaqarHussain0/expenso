import Row from '@/components/common/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, UserRoundKey, Users } from 'lucide-react';

export interface IUserStats {
  totalAdmin: number;
  normalUsers: number;
}

interface IUserStatsProps {
  userStats: IUserStats;
}

const UserStats: React.FC<IUserStatsProps> = ({ userStats }) => {
  const currentMonthStats = [
    {
      title: `Admin Users`,
      amount: userStats.totalAdmin,
      icon: UserRoundKey,
      iconClassName: 'text-green-500',
    },

    {
      title: `Normal Users`,
      amount: userStats.normalUsers,
      icon: UserRound,
      iconClassName: 'text-red-500',
    },

    {
      title: `Total Users`,
      amount: userStats.normalUsers + userStats.totalAdmin,
      icon: Users,
      iconClassName: 'text-yellow-500',
    },
  ];
  return (
    <Row className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {currentMonthStats.map(item => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="gap-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`${item.iconClassName}`}>
                  {item.title}
                </CardTitle>
                {<Icon className={`size-5 ${item.iconClassName}`} />}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-bold text-gray-900`}>
                    {item.amount?.toLocaleString()}
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

export default UserStats;
