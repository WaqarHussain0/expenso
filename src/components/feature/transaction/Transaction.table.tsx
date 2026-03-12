import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import TextElement from '@/components/common/TextElement';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
import { deleteTransactionService } from './service';
import { ITransaction } from '@/types/transaction.type';

interface ITransactionTableProps {
  transactions: ITransaction[];
  className?: string;
}
const TransactionTable: React.FC<ITransactionTableProps> = ({
  transactions,
  className,
}) => {
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCloseDialog = useCallback(
    () => setIsEditModalOpen(prev => !prev),
    [],
  );

  const columns = useMemo(
    () => [
      {
        label: 'Amount',
      },
      {
        label: 'Type',
      },
      {
        label: 'Date',
      },

      {
        label: 'Actions',
      },
    ],
    [],
  );

  const getActions = (transaction: ITransaction) => {
    return [
      {
        label: 'Edit',
        onClick: () => {
          setSelectedTransaction(transaction);
          setIsEditModalOpen(true);
        },
        separatorAfter: false,
        show: true,
        icon: Edit,
      },

      {
        label: 'Delete',
        onClick: () => {
          setIsDeleteModalOpen(true);
          setSelectedTransaction(transaction);
        },
        show: true,
        separatorAfter: false,
        icon: Trash,
      },
    ];
  };
  const handleDelete = async (transaction: ITransaction | null) => {
    if (!transaction || !transaction._id) return;
    const res = await deleteTransactionService(transaction._id);

    if (res.ok) {
      toast.success('Transaction deleted successfully');
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } else {
      toast.error('Failed to delete transaction');
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
          {transactions.length > 0 ? (
            transactions.map(trx => (
              <TableRow key={trx._id}>
                <TableCell className="capitalize">{trx?.amount}</TableCell>
                <TableCell className="capitalize">
                  {trx?.date.toDateString()}
                </TableCell>
                <TableCell className="capitalize">{trx?.note}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getActions(trx)
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

      {/* <CategoryDialog
        onClose={handleCloseDialog}
        open={isEditModalOpen}
        category={selectedTransaction}
      /> */}

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              Delete Transaction
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedTransaction)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionTable;
