'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { signOut, useSession } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { CalendarDays, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { useState, useSyncExternalStore } from 'react';
import ThemeToggle from './ThemeToggle';
import BrandLogo from '@/components/common/BrandLogo';

const noopSubscribe = () => () => {};
const getToday = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

interface ITopBarProps {
  className?: string;
}
const TopBar: React.FC<ITopBarProps> = ({ className = '' }) => {
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

  // Rendered only on the client so it uses the viewer's local date
  const today = useSyncExternalStore(noopSubscribe, getToday, () => '');

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  return (
    <header
      className={`border-ink/[0.06] bg-canvas/80 sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl md:px-6 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Logo on mobile, where the sidebar is hidden */}
        <Link href={PAGE_ROUTES.dashboard} className="lg:hidden">
          <BrandLogo className="h-[28px] w-[86px]" sizes="86px" priority />
        </Link>

        {today && (
          <span className="inter text-ink-muted hidden items-center gap-2 text-sm lg:inline-flex">
            <CalendarDays className="text-brand-fg size-4" />
            {today}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle className="hidden sm:inline-flex" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group border-ink/[0.06] bg-surface flex cursor-pointer items-center gap-2.5 rounded-full border py-1 pr-3 pl-1 shadow-[0_1px_2px_rgba(13,17,23,0.04)] transition-all duration-300 outline-none hover:border-[#1a7f5a]/30 hover:shadow-[0_4px_12px_-4px_rgba(13,17,23,0.12)] focus-visible:ring-3 focus-visible:ring-[#1a7f5a]/20">
              <Avatar className="size-8">
                <AvatarImage src="" alt={user?.name || ''} />
                <AvatarFallback className="inter bg-gradient-to-br from-[#2ea878] to-[#1a7f5a] text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <span className="inter text-ink hidden max-w-[160px] truncate text-sm font-medium capitalize md:inline">
                {user?.name || ''}
              </span>
              <ChevronDown className="text-ink-subtle size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <p className="inter text-ink truncate text-sm font-medium capitalize">
                {user?.name}
              </p>
              <p className="inter text-ink-subtle truncate text-xs">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(PAGE_ROUTES.profile)}
              className="flex cursor-pointer items-center gap-2"
            >
              <Settings className="size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <LogOut className="size-4" />
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
    </header>
  );
};

export default TopBar;
