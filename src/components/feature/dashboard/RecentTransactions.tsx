'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import TextElement from '@/components/common/TextElement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryTypeEnum } from '@/types/category.type';
import { ITransaction } from '@/types/transaction.type';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface IRecentTransactionsProps {
  className?: string;
  transactions: ITransaction[];
}
const RecentTransactions: React.FC<IRecentTransactionsProps> = ({
  className,
  transactions,
}) => {
  const router = useRouter();
  const columns = useMemo(
    () => [
      {
        label: 'Type',
      },
      {
        label: 'Amount',
      },
      {
        label: 'Notes',
      },
    ],
    [],
  );

  return (
    <Card className={`px-4 gap-0 ${className}`}>
      <CardHeader className="flex justify-between p-0 items-center">
        <CardTitle>Recent Transactions</CardTitle>

        <Button
          variant={'link'}
          onClick={() => router.push(PAGE_ROUTES.transaction)}
        >
          View All
        </Button>
      </CardHeader>

      <Table>
        <TableHeader className="">
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
                <TableCell className="capitalize">
                  <Badge
                    variant={
                      trx?.category.type === CategoryTypeEnum.INCOME
                        ? 'default'
                        : 'destructive'
                    }
                    className={
                      trx.category.type === CategoryTypeEnum.INVESTMENT
                        ? 'bg-yellow-100 text-yellow-500'
                        : ''
                    }
                  >
                    {trx?.category.name}
                  </Badge>
                </TableCell>

                <TableCell className="capitalize">
                  {trx?.amount?.toLocaleString()}
                </TableCell>

                <TableCell className="capitalize">{trx?.note}</TableCell>
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
    </Card>
  );
};

export default RecentTransactions;
