'use client';
import Link from 'next/link';
import Row from './Row';
import TextElement from './TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { ChartPie, HandCoins, LayoutDashboard, LogOut } from 'lucide-react';
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

  const navItems = [
    {
      title: 'Dashboard',
      linkTo: PAGE_ROUTES.dashboard,
      icon: ChartPie,
    },
    {
      title: 'Category',
      icon: LayoutDashboard,
      linkTo: PAGE_ROUTES.category,
    },
    {
      title: 'Transaction',
      icon: HandCoins,
      linkTo: PAGE_ROUTES.transaction,
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  return (
    <Row
      className={`w-full flex-col justify-between pt-4 md:pt-6 ${className}`}
    >
      <Row className={`w-full flex-col gap-1`}>
        {navItems.map(item => {
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
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">Logout</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
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
    </Row>
  );
};

export default Navbar;
