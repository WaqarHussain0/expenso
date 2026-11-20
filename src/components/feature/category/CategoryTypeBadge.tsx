import { COLOR_CODES } from '@/app/constants/app.constant';
import { CategoryTypeEnum } from '@/types/category.type';

export const CATEGORY_TYPE_COLORS: Record<CategoryTypeEnum, string> = {
  [CategoryTypeEnum.INCOME]: COLOR_CODES.income,
  [CategoryTypeEnum.EXPENSE]: COLOR_CODES.expense,
  [CategoryTypeEnum.INVESTMENT]: COLOR_CODES.investment,
};

interface ICategoryTypeBadgeProps {
  type?: CategoryTypeEnum | string;
  className?: string;
}

/** Small coloured pill showing a category's type (income / expense / investment). */
const CategoryTypeBadge: React.FC<ICategoryTypeBadgeProps> = ({
  type,
  className = '',
}) => {
  if (!type) return null;
  const color = CATEGORY_TYPE_COLORS[type as CategoryTypeEnum] ?? '#64748b';

  return (
    <span
      className={`inter inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${className}`}
      style={{ background: `${color}14`, color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: color }} />
      {type}
    </span>
  );
};

export default CategoryTypeBadge;
