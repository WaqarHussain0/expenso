/* eslint-disable @typescript-eslint/no-explicit-any */
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CategoryTypeEnum } from '@/types/category.type';
import Skeleton from 'react-loading-skeleton';

interface ITransactionsProps {
  transactions: any[];
  className?: string;
  category?: CategoryTypeEnum;
  isLoading: boolean;
}

const Transactions: React.FC<ITransactionsProps> = ({
  transactions,
  className = '',
  category,
  isLoading = false,
}) => {
  return (
    <div
      className={`no-scrollbar grid max-h-87.5 grid-cols-1 gap-2 overflow-y-auto p-1 ${className}`}
    >
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <Row className="gap-2">
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={20} />
                  </Row>
                  <Skeleton width={80} height={20} />
                </CardTitle>
                <CardDescription>
                  <Skeleton width="60%" height={16} />
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        : transactions.map((item: any) => (
            <Card key={item._id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap justify-between capitalize">
                  <Row className="gap-2">
                    <TextElement>{item?.category?.name}</TextElement>
                    <Badge
                      variant={
                        item?.category.type === CategoryTypeEnum.INCOME
                          ? 'default'
                          : 'destructive'
                      }
                      className={
                        item.category.type === CategoryTypeEnum.INVESTMENT
                          ? 'bg-yellow-100 text-yellow-500'
                          : ''
                      }
                    >
                      {item?.category?.type}
                    </Badge>
                  </Row>
                  <TextElement
                    className={`${
                      category === CategoryTypeEnum.INVESTMENT
                        ? 'text-yellow-500'
                        : category === CategoryTypeEnum.INCOME
                          ? 'text-green-500'
                          : 'text-red-500'
                    }`}
                  >
                    {item?.amount?.toLocaleString()}
                  </TextElement>
                </CardTitle>
                <CardDescription>
                  {item.note || 'No note available'}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
    </div>
  );
};

export default Transactions;
