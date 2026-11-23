import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import { formatCompactAmount } from '@/lib/utils';
import { Receipt } from 'lucide-react';
import { CATEGORY_ICONS } from '@/app/constants/category-icons.constant';
import CategoryTypeBadge from '../category/CategoryTypeBadge';

const FALLBACK_COLOR = '#64748b';

const AMOUNT_STYLES: Record<string, { sign: string; className: string }> = {
  [CategoryTypeEnum.INCOME]: { sign: '+', className: 'text-success' },
  [CategoryTypeEnum.EXPENSE]: { sign: '−', className: 'text-ink' },
  [CategoryTypeEnum.INVESTMENT]: {
    sign: '',
    className: 'text-[#b45309] dark:text-[#fbbf24]',
  },
};

export const formatTransactionDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/** Tinted rounded tile with the category's icon. */
export const CategoryIconTile: React.FC<{
  category?: Pick<ICategory, 'icon' | 'color'> | null;
  className?: string;
}> = ({ category, className = 'size-9 rounded-xl' }) => {
  const color = category?.color || FALLBACK_COLOR;
  const IconComponent =
    CATEGORY_ICONS.find(item => item.name === category?.icon)?.icon ?? Receipt;

  return (
    <span
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ background: `${color}1a`, color }}
    >
      <IconComponent className="size-4" />
    </span>
  );
};

/** Icon tile + category name, with type (and optionally the date) underneath. */
export const TransactionCategoryCell: React.FC<{
  category?: ICategory | null;
  date?: Date | string;
  /** Show the date under the name on small screens (when the date column is hidden) */
  showDateOnMobile?: boolean;
  /** Render the type as a coloured pill instead of plain text */
  typeAsBadge?: boolean;
}> = ({ category, date, showDateOnMobile = true, typeAsBadge = false }) => (
  <div className="flex items-center gap-3">
    <CategoryIconTile category={category} />
    <div className="min-w-0">
      <p className="inter text-ink truncate text-sm font-medium capitalize">
        {category?.name ?? '—'}
      </p>
      {typeAsBadge ? (
        <CategoryTypeBadge type={category?.type} className="mt-1" />
      ) : (
        <p className="inter text-ink-subtle text-[11px] capitalize">
          {category?.type}
          {showDateOnMobile && date && (
            <span className="sm:hidden">
              {' · '}
              {formatTransactionDate(date)}
            </span>
          )}
        </p>
      )}
    </div>
  </div>
);

/** Signed, colour-coded amount. */
export const TransactionAmount: React.FC<{
  amount?: number | null;
  type?: CategoryTypeEnum | string;
  className?: string;
}> = ({ amount, type, className = '' }) => {
  const style =
    AMOUNT_STYLES[type ?? ''] ?? AMOUNT_STYLES[CategoryTypeEnum.EXPENSE];
  return (
    <span
      className={`manrope font-bold whitespace-nowrap tabular-nums ${style.className} ${className}`}
    >
      {amount != null ? `${style.sign}${formatCompactAmount(amount)}` : '—'}
    </span>
  );
};
