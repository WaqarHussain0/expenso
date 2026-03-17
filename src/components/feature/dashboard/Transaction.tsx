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

interface ITransactionsProps {
  transactions: any[];
  className?: string;
}
const Transactions: React.FC<ITransactionsProps> = ({
  transactions,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 gap-1 ${className}`}>
      {transactions.map((item: any) => (
        <Card key={item._id} className="">
          <CardHeader>
            <CardTitle className={`flex flex-wrap justify-between capitalize`}>
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
              <TextElement className={`text-red-500`}>
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
