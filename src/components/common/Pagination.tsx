import { MoveLeft, MoveRight } from 'lucide-react';
import Row from './Row';
import TextElement from './TextElement';

interface PaginationProps {
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  totalPage: number;
  className?: string;
}

const Pagination = ({
  page = 0,
  totalRecords,
  onPageChange,
  totalPage = 0,
  className,
}: PaginationProps) => {
  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      onPageChange(page + 1);
    }
  };

  return (
    <Row
      className={`w-full flex-col justify-between gap-2 bg-slate-200 px-[20px] py-[6px] md:flex-row md:gap-0 ${className}`}
    >
      <Row className="gap-2">
        <TextElement as="p" className="">
          Total Records:
        </TextElement>
        <TextElement as="h4" className="manropeBold">
          {totalRecords}
        </TextElement>
      </Row>

      <Row className="gap-2">
        {page > 1 && (
          <div
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white"
            onClick={handlePrev}
          >
            <MoveLeft className="size-4" />
          </div>
        )}

        <div className="flex items-center justify-center rounded-md bg-white px-2 py-1">
          <TextElement as="h4" className="manropeBold">
            {page} / {totalPage}
          </TextElement>
        </div>

        {page !== totalPage && (
          <div
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-[#EAEAEA] bg-white"
            onClick={handleNext}
          >
            <MoveRight className="size-4" />
          </div>
        )}
      </Row>
    </Row>
  );
};

export default Pagination;
