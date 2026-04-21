import Skeleton from 'react-loading-skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const CategoryTableSkeleton = () => (
  <TableBody className='w-full'>
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={120} height={20} />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton width={80} height={20} />
      </TableCell>

      <TableCell>
        <Skeleton width={40} height={20} />
      </TableCell>
    </TableRow>
  </TableBody>
);

export default CategoryTableSkeleton;
