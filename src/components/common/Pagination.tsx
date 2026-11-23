import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  totalPage: number;
  className?: string;
}

const navButtonClass =
  'flex size-8 cursor-pointer items-center justify-center rounded-lg border border-ink/[0.08] bg-surface text-ink-muted transition-all duration-300 hover:border-[#1a7f5a]/40 hover:text-brand-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/[0.08] disabled:hover:text-ink-muted';

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
      className={`border-ink/[0.06] bg-surface-2 flex w-full items-center justify-between gap-3 border-t px-4 py-3 md:px-5 ${className}`}
    >
      <p className="inter text-ink-subtle text-xs">
        <span className="text-ink font-semibold tabular-nums">
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

        <span className="inter text-ink-muted min-w-[64px] text-center text-xs tabular-nums">
          Page <span className="text-ink font-semibold">{page}</span> of{' '}
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
