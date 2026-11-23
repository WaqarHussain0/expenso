'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  deleteUserAction,
  toggleUserStatusAction,
} from '@/lib/server-actions/user.server-action';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface IUserAdminActionsProps {
  userId: string;
  name: string;
  isActive: boolean;
  /** The admin viewing their own account — actions are disabled */
  disabled?: boolean;
}

/** Activate/deactivate switch + delete button for the user details page. */
const UserAdminActions: React.FC<IUserAdminActionsProps> = ({
  userId,
  name,
  isActive,
  disabled = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleStatus = () =>
    startTransition(async () => {
      const result = await toggleUserStatusAction(userId);
      if (result.success) {
        toast.success(`${name} ${isActive ? 'deactivated' : 'activated'}`);
        router.refresh();
      } else {
        toast.error('Failed to update status', { description: result.error });
      }
    });

  const deleteUser = () =>
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) {
        toast.success(`${name} was deleted`);
        setConfirmOpen(false);
        router.replace(PAGE_ROUTES.user);
      } else {
        toast.error('Failed to delete user', { description: result.error });
      }
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="border-ink/[0.08] bg-surface inline-flex h-9 cursor-pointer items-center gap-2.5 rounded-lg border px-3 has-disabled:cursor-not-allowed has-disabled:opacity-60">
        <Switch
          checked={isActive}
          onCheckedChange={toggleStatus}
          disabled={disabled || isPending}
          aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${name}`}
        />
        <span className="inter text-ink text-sm font-medium">
          {isActive ? 'Account active' : 'Account deactivated'}
        </span>
      </label>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-rose-600 hover:text-rose-700 dark:text-rose-400"
            disabled={disabled || isPending}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the account along with all of its
              categories, transactions, share links and profile. It can&apos;t
              be undone — deactivating keeps the data instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={e => {
                e.preventDefault(); // keep the dialog open while deleting
                deleteUser();
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

export default UserAdminActions;
