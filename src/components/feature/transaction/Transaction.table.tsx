import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Receipt, Trash2 } from 'lucide-react';
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';
import { CategoryTypeEnum } from '@/types/category.type';
import { formatCompactAmount } from '@/lib/utils';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ITransaction } from '@/types/transaction.type';
import { LazyTransactionDialog } from '../lazy-dialogs';
import { deleteTransactionAction } from '@/lib/server-actions/transaction.server-action';
import RowActions from '@/components/common/RowActions';
import EmptyState from '@/components/common/EmptyState';
import {
  TransactionAmount,
  TransactionCategoryCell,
} from './TransactionDisplay';

const noopSubscribe = () => () => {};

interface ITransactionTableProps {
  transactions: ITransaction[];
  className?: string;
}
const TransactionTable: React.FC<ITransactionTableProps> = ({
  transactions,
  className = '',
}) => {
  const [isPending, startTransition] = useTransition();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCloseDialog = useCallback(
    () => setIsEditModalOpen(prev => !prev),
    [],
  );

  const openEdit = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  // Rows arrive sorted newest-first; group consecutive rows by calendar day
  const groups = useMemo(() => {
    const result: {
      key: string;
      date: Date;
      net: number;
      items: ITransaction[];
    }[] = [];

    for (const trx of transactions) {
      const date = new Date(trx.date);
      const key = date.toDateString();
      let group = result[result.length - 1];
      if (!group || group.key !== key) {
        group = { key, date, net: 0, items: [] };
        result.push(group);
      }
      group.items.push(trx);
      group.net +=
        trx.category?.type === CategoryTypeEnum.INCOME
          ? trx.amount
          : -trx.amount;
    }
    return result;
  }, [transactions]);

  // "Today"/"Yesterday" depend on the viewer's clock, so compute them on the
  // client only (server renders the plain date) to avoid hydration mismatches
  const todayKey = useSyncExternalStore(
    noopSubscribe,
    () => new Date().toDateString(),
    () => null,
  );
  const dayLabel = (date: Date) => {
    if (todayKey) {
      const today = new Date(todayKey);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (date.toDateString() === todayKey) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      ...(date.getFullYear() !== new Date().getFullYear() && {
        year: 'numeric',
      }),
    });
  };

  const getActions = (transaction: ITransaction) => [
    {
      label: 'Edit',
      icon: Pencil,
      onClick: () => openEdit(transaction),
    },
    {
      label: 'Delete',
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onClick: () => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleDelete = (transaction: ITransaction | null) => {
    if (!transaction?._id) return;

    startTransition(async () => {
      const result = await deleteTransactionAction(transaction._id);

      if (result.success) {
        toast.success('Transaction deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedTransaction(null);
      } else {
        toast.error('Failed to delete transaction', {
          description: result.error || 'Something went wrong',
        });
      }
    });
  };

  return (
    <div className={className}>
      {transactions.length > 0 ? (
        <Table containerClassName="lg:overflow-visible">
          <TableHeader className="bg-surface/85 sticky top-0 z-20 backdrop-blur-md">
            <TableRow className="hover:bg-transparent">
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* One <tbody> per day keeps the day header and its rows together */}
          {groups.map(group => (
            <TableBody key={group.key}>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="bg-surface-2/95 py-2 shadow-[inset_0_-1px_0_rgba(13,17,23,0.05),inset_0_1px_0_rgba(13,17,23,0.05)] backdrop-blur-sm lg:sticky lg:top-10 lg:z-10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inter text-ink text-xs font-semibold">
                      {dayLabel(group.date)}
                      <span className="text-ink-subtle ml-2 font-normal">
                        {group.items.length}{' '}
                        {group.items.length === 1 ? 'entry' : 'entries'}
                      </span>
                    </span>
                    <span
                      className={`manrope text-xs font-semibold tabular-nums ${
                        group.net >= 0 ? 'text-success' : 'text-ink-muted'
                      }`}
                      title="Net for the day (income − expenses − investments)"
                    >
                      {group.net >= 0 ? '+' : '−'}
                      {formatCompactAmount(Math.abs(group.net))}
                    </span>
                  </div>
                </TableCell>
              </TableRow>

              {group.items.map((trx, rowIndex) => (
                <TableRow
                  key={trx._id}
                  tabIndex={0}
                  onClick={() => openEdit(trx)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') openEdit(trx);
                  }}
                  aria-label={`Edit ${trx.category?.name ?? 'transaction'} ${trx.amount}`}
                  style={
                    {
                      '--row-accent': trx.category?.color || '#1a7f5a',
                      animationDelay: `${Math.min(rowIndex, 12) * 25}ms`,
                      animationFillMode: 'both',
                    } as React.CSSProperties
                  }
                  className="animate-in fade-in slide-in-from-bottom-1 focus-visible:bg-canvas cursor-pointer duration-300 outline-none hover:shadow-[inset_3px_0_0_var(--row-accent)] focus-visible:shadow-[inset_3px_0_0_var(--row-accent)]"
                >
                  <TableCell>
                    <TransactionCategoryCell
                      category={trx.category}
                      showDateOnMobile={false}
                      typeAsBadge
                    />
                  </TableCell>

                  <TableCell className="text-ink-muted hidden max-w-[420px] truncate text-sm capitalize md:table-cell">
                    {trx?.note || <span className="text-ink-faint">—</span>}
                  </TableCell>

                  <TableCell className="text-right text-sm">
                    <TransactionAmount
                      amount={trx.amount}
                      type={trx.category?.type}
                    />
                  </TableCell>

                  <TableCell
                    className="w-12 text-right"
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => e.stopPropagation()}
                  >
                    <RowActions actions={getActions(trx)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
        </Table>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description="Try changing your filters, or record a new transaction."
        />
      )}

      {isEditModalOpen && (
        <LazyTransactionDialog
          onClose={handleCloseDialog}
          open={isEditModalOpen}
          transaction={selectedTransaction}
        />
      )}

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the transaction and updates your totals.
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={() => handleDelete(selectedTransaction)}
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

export default TransactionTable;
