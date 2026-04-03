import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
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
import { useDeleteCategoryMutation } from '@/lib/rtk/services/category.rtk.service';

interface ICategoryTableProps {
  categories: ICategory[];
  className?: string;
}
const CategoryTable: React.FC<ICategoryTableProps> = ({
  categories,
  className,
}) => {
  const router = useRouter();

  const [deleteCategory] = useDeleteCategoryMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCloseDialog = useCallback(
    () => setIsEditModalOpen(prev => !prev),
    [],
  );

  const columns = useMemo(
    () => [
      {
        label: 'Name',
      },
      {
        label: 'Type',
      },

      {
        label: 'Actions',
      },
    ],
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
  const handleDelete = async (category: ICategory | null) => {
    if (!category || !category._id) return;
    const res = await deleteCategory(category._id).unwrap();

    if (res.success) {
      toast.success('Category deleted successfully');
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } else {
      toast.error('Failed to delete category');
    }
  };
  return (
    <div className={className}>
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.label}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length > 0 ? (
            categories.map(category => (
              <TableRow key={category.name} className="">
                <TableCell className="flex items-center gap-1 capitalize">
                  <div
                    className="flex size-8 items-center justify-center rounded-full"
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
                  {category?.name}
                </TableCell>
                <TableCell className="capitalize">
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
                </TableCell>

                <TableCell>
                  <DropdownMenu>
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <TextElement as="p" className="text-center">
                  No results.
                </TextElement>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedCategory)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryTable;
