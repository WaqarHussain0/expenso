'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo } from 'react';

import TextElement from '@/components/common/TextElement';

import { Badge } from '@/components/ui/badge';
import { IUser, UserRoleEnum } from '@/types/user.type';

interface IUserTableProps {
  users: IUser[];
  className?: string;
}
const UserTable: React.FC<IUserTableProps> = ({ users, className }) => {
  const columns = useMemo(
    () => [
      {
        label: 'Name',
      },
      {
        label: 'Email',
      },
      {
        label: 'Role',
      },
    ],
    [],
  );

  return (
    <div className={className}>
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.label}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="capitalize">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">
                  <Badge
                    variant={
                      user.role === UserRoleEnum.ADMIN ? 'default' : 'outline'
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <TextElement as="p" className="text-center">
                  No results.
                </TextElement>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
