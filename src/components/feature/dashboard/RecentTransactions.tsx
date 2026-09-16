'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import TextElement from '@/components/common/TextElement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ITransaction } from '@/types/transaction.type';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CATEGORY_ICONS } from '../category/Category.dialog';
import { formatCompactAmount } from '@/lib/utils';
import Row from '@/components/common/Row';

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
        label: 'Transaction',
      },

      {
        label: 'Date',
      },
      {
        label: 'Notes',
      },
    ],
    [],
  );

  return (
    <Card className={`p-0 gap-0 ${className}`}>
      <CardHeader className="flex items-center justify-between py-2 px-4">
        <CardTitle>Recent Transactions</CardTitle>

        <Button
          variant={'link'}
          onClick={() => router.push(PAGE_ROUTES.transaction)}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="px-0">
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
                    <Row className="gap-3">
                      <TextElement as="h4" className="">
                        {trx?.amount != null
                          ? formatCompactAmount(trx.amount)
                          : '-'}
                      </TextElement>

                      <Badge
                        variant={'outline'}
                        style={{
                          borderColor: trx.category.color,
                        }}
                      >
                        {trx.category.icon &&
                          (() => {
                            const iconObj = CATEGORY_ICONS.find(
                              item => item.name === trx.category.icon,
                            );
                            if (!iconObj) return null;
                            const IconComponent = iconObj.icon;
                            return (
                              <IconComponent
                                className="size-4"
                                style={{ color: trx.category.color }}
                              />
                            );
                          })()}
                        {trx?.category.name}
                      </Badge>
                    </Row>
                  </TableCell>

                  <TableCell className="capitalize">
                    {trx?.date.toDateString()}
                  </TableCell>

                  <TableCell className="capitalize">
                    {trx?.note || '-'}{' '}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <TextElement as="p" className="text-center">
                    No results.
                  </TextElement>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
