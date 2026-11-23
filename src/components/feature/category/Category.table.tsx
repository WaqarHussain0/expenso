import { Pencil, Tags, Trash2 } from 'lucide-react';
import { useCallback, useState, useTransition } from 'react';

import { toast } from 'sonner';

import { ICategory } from '@/types/category.type';
import { LazyCategoryDialog } from '../lazy-dialogs';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { deleteCategoryAction } from '@/lib/server-actions/category.server-action';
import RowActions from '@/components/common/RowActions';
import EmptyState from '@/components/common/EmptyState';
import CategoryTypeBadge from './CategoryTypeBadge';
import { CategoryIconTile } from '../transaction/TransactionDisplay';

interface ICategoryTableProps {
  categories: ICategory[];
  className?: string;
}
const CategoryTable: React.FC<ICategoryTableProps> = ({
  categories,
  className = '',
}) => {
  const [isPending, startTransition] = useTransition();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCloseDialog = useCallback(
    () => setIsEditModalOpen(prev => !prev),
    [],
  );

  const openEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const getActions = (category: ICategory) => [
    {
      label: 'Edit',
      icon: Pencil,
      onClick: () => openEdit(category),
    },
    {
      label: 'Delete',
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onClick: () => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleDelete = (category: ICategory | null) => {
    if (!category?._id) return;

    startTransition(async () => {
      const result = await deleteCategoryAction(category._id);

      if (result.success) {
        toast.success('Category deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      } else {
        toast.error('Failed to delete category', {
          description: result.error,
        });
      }
    });
  };

  return (
    <div className={className}>
      {categories.length > 0 ? (
        <div className="grid h-fit w-full grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:p-4 xl:grid-cols-3">
          {categories.map(category => (
            <div
              key={category._id}
              role="button"
              tabIndex={0}
              onClick={() => openEdit(category)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openEdit(category);
                }
              }}
              className="group/row group border-ink/[0.06] bg-surface hover:border-ink/[0.1] relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border p-3.5 transition-all duration-300 outline-none hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(13,17,23,0.18)] focus-visible:ring-3 focus-visible:ring-[#1a7f5a]/20"
            >
              {/* colour accent on the left edge */}
              <span
                className="absolute inset-y-3 left-0 w-[3px] rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: category.color }}
              />

              <CategoryIconTile
                category={category}
                className="size-11 rounded-xl [&>svg]:size-5"
              />

              <div className="min-w-0 flex-1">
                <p className="inter text-ink truncate text-sm font-semibold capitalize">
                  {category?.name}
                </p>
                <CategoryTypeBadge type={category.type} className="mt-1" />
              </div>

              <div onClick={e => e.stopPropagation()}>
                <RowActions actions={getActions(category)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Tags}
          title="No categories found"
          description="Try a different search or type, or create a new category."
        />
      )}

      {isEditModalOpen && (
        <LazyCategoryDialog
          onClose={handleCloseDialog}
          open={isEditModalOpen}
          category={selectedCategory}
        />
      )}

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              Delete {selectedCategory?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the category. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={() => handleDelete(selectedCategory)}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryTable;
