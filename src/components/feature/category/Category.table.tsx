/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useCallback, useState, useTransition } from 'react';

import { toast } from 'sonner';

import TextElement from '@/components/common/TextElement';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import CategoryDialog, { CATEGORY_ICONS } from './Category.dialog';
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

interface ICategoryTableProps {
  categories: ICategory[];
  className?: string;
}
const CategoryTable: React.FC<ICategoryTableProps> = ({
  categories,
  className,
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

  const getActions = (category: ICategory) => {
    return [
      {
        label: 'Edit',
        onClick: () => {
          setSelectedCategory(category);
          setIsEditModalOpen(true);
        },
        separatorAfter: false,
        show: true,
        icon: Edit,
      },

      {
        label: 'Delete',
        onClick: () => {
          setIsDeleteModalOpen(true);
          setSelectedCategory(category);
        },
        show: true,
        separatorAfter: false,
        icon: Trash,
      },
    ];
  };

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
    <div className={`${className}`}>
      {categories.length > 0 ? (
        <div className="w-full grid grid-cols-2 gap-3 p-3 lg:grid-cols-3 h-fit">
          {categories.map(category => (
            <Card key={category._id} className="gap-0 py-3 ">
              <CardContent className="flex items-center justify-between gap-2 px-3">
                <div className=" flex items-center gap-2 capitalize">
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: category.color + '1A', // 1A is ~10% opacity in hex
                    }}
                  >
                    {category.icon &&
                      (() => {
                        const iconObj = CATEGORY_ICONS.find(
                          item => item.name === category.icon,
                        );
                        if (!iconObj) return null;
                        const IconComponent = iconObj.icon;
                        return (
                          <IconComponent
                            className="size-4"
                            style={{ color: category.color }}
                          />
                        );
                      })()}
                  </div>

                  <div className="flex flex-col gap-1">
                    <TextElement as="h4">{category?.name}</TextElement>

                    <Badge
                      variant={
                        category.type === CategoryTypeEnum.EXPENSE
                          ? 'destructive'
                          : 'default'
                      }
                      className={
                        category.type === CategoryTypeEnum.INVESTMENT
                          ? 'bg-yellow-100 text-yellow-500'
                          : ''
                      }
                    >
                      {category?.type}
                    </Badge>
                  </div>
                </div>

                <DropdownMenu >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {getActions(category)
                      ?.filter(action => action.show)
                      .map(action => (
                        <div key={action.label}>
                          <DropdownMenuItem onClick={action.onClick}>
                            {action.icon && (
                              <action.icon className="mr-2 size-4" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                          {action.separatorAfter && <DropdownMenuSeparator />}
                        </div>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center">
          <TextElement as="p" className="text-center">
            No results.
          </TextElement>
        </div>
      )}

      {isEditModalOpen && (
        <CategoryDialog
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
              Delete {selectedCategory?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this category?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive hover:bg-destructive/90"
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
