'use client';
import Link from 'next/link';
import Row from './Row';
import TextElement from './TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  ChartPie,
  HandCoins,
  LayoutDashboard,
  LogOut,
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

  return (
    <>
      {/* Mobile Toggle Button (does NOT change styling of sidebar) */}
      {!toggleMenu && (
        <button
          onClick={handleToggleMenu}
          className="text-primary-foreground fixed top-4 right-4 z-50 cursor-pointer rounded-md bg-blue-900 px-2 py-1 hover:bg-blue-800 lg:hidden"
        >
          ☰
        </button>
      )}

      <div
        ref={navbarRef}
        className={`bg-blue-900 text-white ${className} fixed top-0 left-0 z-40 flex h-full flex-col justify-between pt-4 transition-transform duration-300 md:pt-6 lg:static ${toggleMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <Row className={`w-full flex-col gap-1`}>
          {navItems
            .filter(item => item.show)
            .map(item => {
              const isActive = pathname === item.linkTo;
              const Icon = item.icon;
              return (
                <Link
                  className={`font-body flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-blue-100 hover:bg-white/5 hover:text-white'
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

        {/* Logout */}
        <div className="w-full space-y-1 border-t border-blue-800 px-4 py-4">
          <Row className="gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-blue-700 text-white capitalize shadow-sm">
              {user?.name?.slice(0, 1)}
            </div>

            <TextElement as="h5" className="text-white capitalize">
              {user?.name}
            </TextElement>
          </Row>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-blue-100 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
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
              <AlertDialogCancel className="font-body">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 font-body"
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
