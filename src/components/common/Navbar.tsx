'use client';
import Link from 'next/link';
import Row from './Row';
import TextElement from './TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  ChartPie,
  Coins,
  HandCoins,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { useEffect, useRef, useState } from 'react';
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

interface INavbar {
  className?: string;
}

const Navbar: React.FC<INavbar> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [toggleMenu, setToggleMenu] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => setToggleMenu(prev => !prev);

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
      linkTo: PAGE_ROUTES.monthStats,
      icon: ChartPie,
      show: true,
    },
    {
      title: 'Category',
      icon: LayoutDashboard,
      linkTo: PAGE_ROUTES.category,
      show: true,
    },
    {
      title: 'Transaction',
      icon: HandCoins,
      linkTo: PAGE_ROUTES.transaction,
      show: true,
    },

    {
      title: 'Users',
      linkTo: PAGE_ROUTES.user,
      icon: Users,
      show: isAdminUser,
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  // ✅ Close menu on outside click (mobile UX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setToggleMenu(false);
      }
    };

    if (toggleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleMenu]);

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile Toggle Button (does NOT change styling of sidebar) */}

      {!toggleMenu && (
        <div className="text-primary-foreground bg-[#1a7f5a] cursor-pointerss fixed top-2 left-2 z-50 w-[20%] flex justify-center items-center rounded-sm p-2 lg:hidden">
          <Menu onClick={handleToggleMenu} className="size-4 textPrimary" />
        </div>
      )}

      <div
        ref={navbarRef}
        className={`bg-[#0d1117] text-white ${className} fixed top-0 left-0 z-40 flex h-full flex-col justify-between transition-transform duration-300 lg:static ${toggleMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <Row className="w-full flex-col items-start gap-4">
          <div className="flex w-full items-center gap-3 border-b border-[#e6f5ef] px-2 py-3">
            {/* Logo */}
            <div className="relative flex size-10 items-center justify-center rounded-md border border-[#1a7f5a]/30 bg-[#1a7f5a] backdrop-blur-md">
              <Coins className="size-6 text-[#F5F5DC]" />
            </div>

            <TextElement
              as="h1"
              className="text-xl font-semibold !text-[#F5F5DC]"
            >
              Expenso
            </TextElement>
          </div>

          <Row className={`gap- w-full flex-col`}>
            {navItems
              .filter(item => item.show)
              .map(item => {
                const isActive = pathname === item.linkTo;
                const Icon = item.icon;
                return (
                  <Link
                    className={`poppins flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#FFFFFF1A] text-[#F5F5DC]'
                        : 'hover:bg-[#FFFFFF1A] hover:text-[#F5F5DC]'
                    }`}
                    key={item.title}
                    href={item.linkTo}
                    onClick={handleToggleMenu}
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
            className="hover:bg-[#FFFFFF1A] flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:text-[#F5F5DC]"
          >
            <LogOut className="h-5 w-5" />
            <span className="poppins">Logout</span>
          </button>
        </div>

        {/* Logout Modal */}
        <AlertDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
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
    </>
  );
};

export default Navbar;
