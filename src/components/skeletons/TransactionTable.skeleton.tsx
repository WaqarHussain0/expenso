import Skeleton from 'react-loading-skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const TransactionTableSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton width={120} height={20} />
    </TableCell>

    <TableCell>
      <Skeleton width={120} height={20} />
    </TableCell>

    <TableCell>
      <Skeleton width={80} height={20} />
    </TableCell>

    <TableCell>
      <Skeleton width={120} height={20} />
    </TableCell>

    <TableCell>
      <Skeleton width={40} height={20} />
    </TableCell>
  </TableRow>
);

export default TransactionTableSkeleton;
