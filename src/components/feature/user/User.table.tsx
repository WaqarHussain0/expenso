'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, Trash2, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  deleteUserAction,
  toggleUserStatusAction,
} from '@/lib/server-actions/user.server-action';
import RowActions from '@/components/common/RowActions';
import EmptyState from '@/components/common/EmptyState';
import { cn, getInitials } from '@/lib/utils';
import { formatDate, formatRelative } from '@/lib/date.util';
import type { IAdminUserRow } from '@/backend/modules/user/services/user-insights.service';
import { Pill, SignInPill } from './admin-ui';

const ACTIVE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

interface IUserTableProps {
  users: IAdminUserRow[];
  className?: string;
  /** Dim the rows while a filter change is loading */
  isRefreshing?: boolean;
}

/** "Last active" with a green dot when seen within the past week. */
const LastActive: React.FC<{ iso: string | null; now: number }> = ({
  iso,
  now,
}) => {
  const recent = !!iso && now - new Date(iso).getTime() < ACTIVE_WINDOW_MS;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          recent ? 'bg-success' : 'bg-ink-faint',
        )}
      />
      {/* relative text can tick over between server and client render */}
      <span suppressHydrationWarning className={iso ? '' : 'text-ink-faint'}>
        {formatRelative(iso, { now, empty: 'No activity yet' })}
      </span>
    </span>
  );
};

const UserTable: React.FC<IUserTableProps> = ({
  users,
  className = '',
  isRefreshing = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [userToDelete, setUserToDelete] = useState<IAdminUserRow | null>(null);
  // One timestamp per render keeps every "x ago" consistent
  const [now] = useState(() => Date.now());

  const openUser = (id: string) => router.push(`${PAGE_ROUTES.user}/${id}`);

  const handleDelete = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      const result = await deleteUserAction(userToDelete.id);
      if (result.success) {
        toast.success(`${userToDelete.name} was deleted`);
        setUserToDelete(null);
        router.refresh();
      } else {
        toast.error('Failed to delete user', { description: result.error });
      }
    });
  };

  const handleToggleStatus = (user: IAdminUserRow, value: boolean) =>
    startTransition(async () => {
      const result = await toggleUserStatusAction(user.id);
      if (result.success) {
        toast.success(`${user.name} ${value ? 'activated' : 'deactivated'}`);
        router.refresh();
      } else {
        toast.error('Failed to update status', { description: result.error });
      }
    });

  if (users.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search or filter."
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        className,
        'transition-opacity duration-200',
        isRefreshing && 'opacity-60',
      )}
      aria-busy={isRefreshing}
    >
      <Table containerClassName="lg:overflow-visible">
        <TableHeader className="bg-surface/85 sticky top-0 z-20 backdrop-blur-md">
          <TableRow className="hover:bg-transparent">
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Joined</TableHead>
            <TableHead className="hidden sm:table-cell">Last active</TableHead>
            <TableHead className="hidden lg:table-cell">Activity</TableHead>
            <TableHead className="hidden xl:table-cell">Sign-in</TableHead>
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
              onClick={() => openUser(user.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') openUser(user.id);
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
                    <p className="inter text-ink flex items-center gap-2 text-sm font-medium">
                      <span className="truncate capitalize">{user.name}</span>
                      {!user.isOnboarded && (
                        <Pill tone="warning" className="hidden sm:inline-flex">
                          Setup pending
                        </Pill>
                      )}
                    </p>
                    <p className="inter text-ink-subtle truncate text-xs">
                      {user.email || '—'}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-ink-muted hidden text-sm md:table-cell">
                <span className="block">{formatDate(user.createdAt)}</span>
                <span
                  suppressHydrationWarning
                  className="text-ink-subtle block text-xs"
                >
                  {formatRelative(user.createdAt, { now, empty: '' })}
                </span>
              </TableCell>

              <TableCell className="text-ink-muted hidden text-sm sm:table-cell">
                <LastActive iso={user.lastActiveAt} now={now} />
              </TableCell>

              <TableCell className="hidden text-sm lg:table-cell">
                <span className="manrope text-ink font-semibold tabular-nums">
                  {user.transactionCount.toLocaleString()}
                </span>
                <span className="text-ink-subtle">
                  {' '}
                  {user.transactionCount === 1 ? 'transaction' : 'transactions'}
                </span>
                <span className="text-ink-subtle block text-xs">
                  {user.categoryCount}{' '}
                  {user.categoryCount === 1 ? 'category' : 'categories'}
                </span>
              </TableCell>

              <TableCell className="hidden xl:table-cell">
                <SignInPill method={user.signInMethod} />
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
                    className={cn(
                      'inter hidden items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium 2xl:inline-flex',
                      user.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-ink/[0.05] text-ink-subtle',
                    )}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </TableCell>

              <TableCell
                className="w-12 text-right"
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                <RowActions
                  actions={[
                    {
                      label: 'View details',
                      icon: Eye,
                      onClick: () => openUser(user.id),
                    },
                    {
                      label: 'Delete',
                      icon: Trash2,
                      destructive: true,
                      separatorBefore: true,
                      onClick: () => setUserToDelete(user),
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={open => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {userToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the account and all of its categories,
              transactions and share links
              {userToDelete?.transactionCount
                ? ` (${userToDelete.transactionCount.toLocaleString()} transactions)`
                : ''}
              . It can&apos;t be undone — deactivating keeps the data instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={e => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
            >
              {isPending ? 'Deleting…' : 'Delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTable;
