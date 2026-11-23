import type { LucideIcon } from 'lucide-react';
import { CATEGORY_ICONS } from '@/app/constants/category-icons.constant';

/** Lucide icon component for each stored category icon name. */
export const CATEGORY_ICON_MAP: Partial<Record<string, LucideIcon>> =
  Object.fromEntries(CATEGORY_ICONS.map(item => [item.name, item.icon]));

interface ICategoryIconProps {
  /** Icon name stored on the category, e.g. "Wallet" */
  name?: string;
  color?: string;
  className?: string;
}

/** Renders a category's lucide icon by name (nothing if it's unknown). */
const CategoryIcon: React.FC<ICategoryIconProps> = ({
  name,
  color,
  className,
}) => {
  const Icon = CATEGORY_ICON_MAP[name ?? ''];
  if (!Icon) return null;

  return <Icon className={className} style={{ color }} />;
};

export default CategoryIcon;
