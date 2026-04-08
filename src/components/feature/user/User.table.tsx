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

import { IUser } from '@/types/user.type';

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
        label: 'Gender',
      },

      {
        label: 'Contact ',
      },
      {
        label: 'Email',
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
                <TableCell className="capitalize">
                  {user.profile?.gender || '-'}
                </TableCell>
                <TableCell>{user.profile?.contact || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
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
