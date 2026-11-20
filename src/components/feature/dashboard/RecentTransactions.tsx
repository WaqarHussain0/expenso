'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ITransaction } from '@/types/transaction.type';
import { ArrowRight, Receipt } from 'lucide-react';
import Link from 'next/link';
import {
  TransactionAmount,
  TransactionCategoryCell,
  formatTransactionDate,
} from '../transaction/TransactionDisplay';

interface IRecentTransactionsProps {
  className?: string;
  transactions: ITransaction[];
}

const RecentTransactions: React.FC<IRecentTransactionsProps> = ({
  className = '',
  transactions,
}) => {
  return (
    <Card className={`gap-0 py-0 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <p className="inter text-sm font-semibold text-[#0d1117]">
            Recent transactions
          </p>
          <p className="inter text-xs text-[#8b93a1]">
            Your latest {transactions.length || ''} entries
          </p>
        </div>

        <Link
          href={PAGE_ROUTES.transaction}
          className="inter group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#1a7f5a] transition-colors duration-300 hover:bg-[#1a7f5a]/[0.08]"
        >
          View all
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Note</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length > 0 ? (
            transactions.map(trx => (
              <TableRow key={trx._id}>
                <TableCell>
                  <TransactionCategoryCell
                    category={trx.category}
                    date={trx.date}
                  />
                </TableCell>

                <TableCell className="hidden max-w-[320px] truncate text-sm text-[#5a6070] capitalize md:table-cell">
                  {trx?.note || <span className="text-[#c4c9d0]">—</span>}
                </TableCell>

                <TableCell className="hidden text-sm text-[#5a6070] sm:table-cell">
                  {formatTransactionDate(trx.date)}
                </TableCell>

                <TableCell className="text-right text-sm">
                  <TransactionAmount
                    amount={trx.amount}
                    type={trx.category?.type}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#f6f7f5] text-[#8b93a1]">
                    <Receipt className="size-5" />
                  </span>
                  <p className="inter text-sm text-[#8b93a1]">
                    No transactions yet
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RecentTransactions;
