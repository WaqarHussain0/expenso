'use client';
import Link from 'next/link';
import Row from './Row';
import TextElement from './TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  ChartPie,
  House,
  List,
  LogOut,
  Settings,
  Sparkles,
  Tags,
  Users,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { UserRoleEnum } from '@/types/user.type';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Image from 'next/image';

interface INavbar {
  className?: string;
}

const Navbar: React.FC<INavbar> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const isAdminUser = user?.role === UserRoleEnum.ADMIN || false;

  const navItems = [
    {
      title: 'Dashboard',
      linkTo: PAGE_ROUTES.dashboard,
      icon: House,
      show: true,
    },

    {
      title: 'Stats',
      linkTo: PAGE_ROUTES.stats,
      icon: ChartPie,
      show: true,
    },
    {
      title: 'Category',
      icon: Tags,
      linkTo: PAGE_ROUTES.category,
      show: true,
    },
    {
      title: 'Transaction',
      icon: List,
      linkTo: PAGE_ROUTES.transaction,
      show: true,
    },

    {
      title: 'Assistant',
      icon: Sparkles,
      linkTo: PAGE_ROUTES.assistant,
      show: true,
    },

    {
      title: 'Users',
      linkTo: PAGE_ROUTES.user,
      icon: Users,
      show: isAdminUser,
    },

    {
      title: 'Profile',
      linkTo: PAGE_ROUTES.profile,
      icon: Settings,
      show: true,
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const visibleNavItems = navItems.filter(item => item.show);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden bg-[#0d1117] text-white ${className} h-full flex-col justify-between lg:flex`}
      >
        <Row className="w-full flex-col items-start gap-4">
          <div className="flex w-full items-center gap-3 border-b border-[#e6f5ef] p-2">
            <div className="relative h-[35px] w-[80px]">
              <Image
                src={'/light-logo.png'}
                alt={`Logo`}
                fill
                className="object-contain"
                priority
                fetchPriority="high"
              />
            </div>
          </div>

          <Row className={`gap- w-full flex-col`}>
            {visibleNavItems.map(item => {
              const isActive = pathname === item.linkTo;
              const Icon = item.icon;
              return (
                <Link
                  className={`poppins flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive ? 'bg-[#FFFFFF1A]' : 'hover:bg-[#FFFFFF1A]'
                  }`}
                  key={item.title}
                  href={item.linkTo}
                >
                  <Icon className="size-5" />

                  <TextElement as="h4">{item.title}</TextElement>
                </Link>
              );
            })}
          </Row>
        </Row>

        {/* Logout */}
        <div className="w-full space-y-1 border-t border-[#e6f5ef] px-4 py-4">
          <Row className="gap-2">
            <Avatar>
              <AvatarFallback className="poppins bg-[#1a7f5a] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <TextElement as="h5" className="poppins text-white capitalize">
              {user?.name}
            </TextElement>
          </Row>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-[#FFFFFF1A]"
          >
            <LogOut className="h-5 w-5" />
            <span className="poppins">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#1f2937] bg-[#0d1117] px-1 pt-2 pb-[calc(--spacing(2)+env(safe-area-inset-bottom))] lg:hidden">
        {visibleNavItems.map(item => {
          const isActive = pathname === item.linkTo;
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.linkTo}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-white transition-colors ${
                isActive ? 'text-[#2fbf83]' : 'text-white/50'
              }`}
            >
              <Icon
                className="size-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </nav>

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
    </>
  );
};

export default Navbar;
