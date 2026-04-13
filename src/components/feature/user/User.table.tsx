'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo, useState } from 'react';

import TextElement from '@/components/common/TextElement';

import { IUser } from '@/types/user.type';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDeleteUserMutation } from '@/lib/rtk/services/user.rtk.service';
import { Eye, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

interface IUserTableProps {
  users: IUser[];
  className?: string;
}

const UserTable: React.FC<IUserTableProps> = ({ users, className }) => {
  const [deleteUser] = useDeleteUserMutation();

  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

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
      {
        label: 'Action',
      },
    ],
    [],
  );

  const handleViewClick = (userId: string) =>
    router.push(`${PAGE_ROUTES.user}/${userId}`);

  const getActions = (user: IUser) => {
    return [
      {
        label: 'View',
        onClick: () => handleViewClick(user.id),
        show: true,
        separatorAfter: true,
        icon: Eye,
      },
      {
        label: 'Delete',
        onClick: () => {
          setIsDeleteModalOpen(true);
          setSelectedUser(user);
        },
        show: true,
        separatorAfter: false,
        icon: Trash,
      },
    ];
  };

  const handleDelete = async (user: IUser | null) => {
    if (!user || !user.id) return;
    const res = await deleteUser(user.id).unwrap();

    if (res.success) {
      toast.success('User deleted successfully');
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } else {
      toast.error('Failed to delete user');
    }
  };
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
              <TableRow key={user.id} onClick={() => handleViewClick(user.id)} className='cursor-pointer'>
                <TableCell className="capitalize">{user.name}</TableCell>
                <TableCell className="capitalize">
                  {user.profile?.gender || '-'}
                </TableCell>
                <TableCell>{user.profile?.contact || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getActions(user)
                        ?.filter(action => action.show)
                        .map(action => (
                          <div key={action.label}>
                            <DropdownMenuItem onClick={action.onClick}>
                              {action.icon && (
                                <action.icon className="mr-2 size-4" />
                              )}
                              {action.label}
                            </DropdownMenuItem>
                            {action.separatorAfter && <DropdownMenuSeparator />}
                          </div>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              Delete User
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this user?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedUser)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTable;
