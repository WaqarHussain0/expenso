'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { signOut, useSession } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';

interface ITopBarProps {
  className?: string;
}
const TopBar: React.FC<ITopBarProps> = ({ className }) => {
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  return (
    <div
      className={`flex w-full items-center justify-end border-b border-[#e6f5ef] px-4 py-2`}
    >
      <div className={`flex w-full items-center justify-end ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="min-h-12">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="">
                <AvatarImage src="" alt={user?.name || 'John Doe'} />

                <AvatarFallback className="poppins bg-[#0d1117] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <span className="hidden capitalize md:inline">
                {user?.name || ''}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(PAGE_ROUTES.profile)}
              className="flex items-center gap-2"
            >
              <Settings className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive flex items-center gap-2"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">Logout</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TopBar;
