import { MoveLeft, MoveRight } from "lucide-react";
import Row from "./Row";
import TextElement from "./TextElement";

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
      className={`bg-slate-200 rounded py-[6px] md:py-[10px] px-[20px] w-full justify-between flex-col md:flex-row  gap-2 md:gap-0 ${className}`}
    >
      <Row className="gap-2 ">
        <TextElement as="p">Total Records:</TextElement>
        <TextElement as="h4">{totalRecords}</TextElement>
      </Row>

      <Row className="gap-2">
        {page > 1 && (
          <div
            className="size-[30px] bg-white flex justify-center items-center rounded-[10px] border border-[#EAEAEA] cursor-pointer"
            onClick={handlePrev}
          >
            <MoveLeft className="size-4" />
          </div>
        )}

        <div className=" bg-white flex justify-center items-center rounded-md px-2 py-1">
          <TextElement as="h4" className="">
            {page} / {totalPage}
          </TextElement>
        </div>

        {page !== totalPage && (
          <div
            className="size-[30px] bg-white flex justify-center items-center rounded-[10px] border-[1px] border-[#EAEAEA] cursor-pointer"
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
