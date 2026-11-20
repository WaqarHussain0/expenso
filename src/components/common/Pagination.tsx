import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  totalPage: number;
  className?: string;
}

const navButtonClass =
  'flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#0d1117]/[0.08] bg-white text-[#5a6070] transition-all duration-300 hover:border-[#1a7f5a]/40 hover:text-[#1a7f5a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#0d1117]/[0.08] disabled:hover:text-[#5a6070]';

const Pagination = ({
  page = 0,
  totalRecords,
  onPageChange,
  totalPage = 0,
  className = '',
}: PaginationProps) => {
  const canPrev = page > 1;
  const canNext = page < totalPage;

  return (
    <div
      className={`flex w-full items-center justify-between gap-3 border-t border-[#0d1117]/[0.06] bg-[#fbfbfa] px-4 py-3 md:px-5 ${className}`}
    >
      <p className="inter text-xs text-[#8b93a1]">
        <span className="font-semibold text-[#0d1117] tabular-nums">
          {totalRecords}
        </span>{' '}
        {totalRecords === 1 ? 'record' : 'records'}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          className={navButtonClass}
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="inter min-w-[64px] text-center text-xs text-[#5a6070] tabular-nums">
          Page <span className="font-semibold text-[#0d1117]">{page}</span> of{' '}
          {totalPage}
        </span>

        <button
          type="button"
          aria-label="Next page"
          className={navButtonClass}
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
