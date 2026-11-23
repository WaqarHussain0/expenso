'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useTransition } from 'react';

import { IUser, UserRoleEnum } from '@/types/user.type';
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
import { Eye, ShieldCheck, Trash2, Users } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Switch } from '@/components/ui/switch';
import {
  deleteUserAction,
  toggleUserStatusAction,
} from '@/lib/server-actions/user.server-action';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import RowActions from '@/components/common/RowActions';
import EmptyState from '@/components/common/EmptyState';
import { getInitials } from '@/lib/utils';

interface IUserTableProps {
  users: IUser[];
  className?: string;
}

const UserTable: React.FC<IUserTableProps> = ({ users, className = '' }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleViewClick = (userId: string) =>
    router.push(`${PAGE_ROUTES.user}/${userId}`);

  const getActions = (user: IUser) => [
    {
      label: 'View',
      icon: Eye,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleViewClick(user.id);
      },
    },
    {
      label: 'Delete',
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
        setSelectedUser(user);
      },
    },
  ];

  const handleDelete = async (user: IUser | null) => {
    if (!user || !user.id) return;

    startTransition(async () => {
      const result = await deleteUserAction(user.id);

      if (result.success) {
        toast.success('User deleted successfully');

        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      } else {
        toast.error('Failed to delete user', {
          description: result.error || 'Something went wrong',
        });
      }
    });
  };

  const handleToggleStatus = async (user: IUser, value: boolean) => {
    startTransition(async () => {
      const result = await toggleUserStatusAction(user.id);

      if (result.success) {
        toast.success(`User ${value ? 'activated' : 'deactivated'}`);
      } else {
        toast.error('Failed to update status', {
          description: result.error,
        });
      }
    });
  };

  return (
    <div className={className}>
      {users.length > 0 ? (
        <Table containerClassName="lg:overflow-visible">
          <TableHeader className="bg-surface/85 sticky top-0 z-20 backdrop-blur-md">
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Gender</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, rowIndex) => (
              <TableRow
                key={user.id}
                tabIndex={0}
                onClick={() => handleViewClick(user.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleViewClick(user.id);
                }}
                aria-label={`View ${user.name}`}
                style={{
                  animationDelay: `${Math.min(rowIndex, 12) * 25}ms`,
                  animationFillMode: 'both',
                }}
                className="animate-in fade-in slide-in-from-bottom-1 focus-visible:bg-canvas cursor-pointer duration-300 outline-none hover:shadow-[inset_3px_0_0_#1a7f5a] focus-visible:shadow-[inset_3px_0_0_#1a7f5a]"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="inter bg-gradient-to-br from-[#2ea878] to-[#1a7f5a] text-xs font-semibold text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="inter text-ink flex items-center gap-2 text-sm font-medium capitalize">
                        <span className="truncate">{user.name}</span>
                        {user.role === UserRoleEnum.ADMIN && (
                          <span className="text-brand-fg inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1a7f5a]/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                            <ShieldCheck className="size-3" />
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="inter text-ink-subtle truncate text-xs">
                        {user.email || '—'}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-ink-muted hidden text-sm capitalize md:table-cell">
                  {user.profile?.gender || (
                    <span className="text-ink-faint">—</span>
                  )}
                </TableCell>

                <TableCell className="text-ink-muted hidden text-sm tabular-nums sm:table-cell">
                  {user.profile?.contact || (
                    <span className="text-ink-faint">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <div
                    className="flex items-center gap-2.5"
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => e.stopPropagation()}
                  >
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={value => handleToggleStatus(user, value)}
                      disabled={isPending}
                      aria-label={`${user.isActive ? 'Deactivate' : 'Activate'} ${user.name}`}
                    />
                    <span
                      className={`inter hidden items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium lg:inline-flex ${
                        user.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-ink/[0.05] text-ink-subtle'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          user.isActive ? 'bg-success' : 'bg-ink-subtle'
                        }`}
                      />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>

                <TableCell
                  className="w-12 text-right"
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => e.stopPropagation()}
                >
                  <RowActions actions={getActions(user)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search or filter."
        />
      )}

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.name ? (
                <>
                  <span className="text-ink font-medium capitalize">
                    {selectedUser.name}
                  </span>{' '}
                  will be removed. This can&apos;t be undone.
                </>
              ) : (
                "This user will be removed. This can't be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={() => handleDelete(selectedUser)}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTable;
