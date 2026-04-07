import Row from '@/components/common/Row';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { IUser } from '@/types/user.type';
import React from 'react';

interface IUserProfileProps {
  className?: string;
  user: IUser | undefined;
}

const UserProfile: React.FC<IUserProfileProps> = ({ className, user }) => {
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex items-start md:items-center flex-col md:flex-row justify-between gap-2">
        <CardTitle className="text-primary">Welcome back!</CardTitle>

        <Row className="gap-2">
          <Avatar>
            <AvatarFallback className="uppercase">{initials}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-primary capitalize">
            {user?.name}
          </CardTitle>
        </Row>
      </CardHeader>
    </Card>
  );
};

export default UserProfile;
