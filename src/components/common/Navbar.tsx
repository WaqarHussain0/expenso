'use client';
import Link from 'next/link';
import Row from './Row';
import TextElement from './TextElement';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { ChartPie, HandCoins, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface INavbar {
  className?: string;
}

const Navbar: React.FC<INavbar> = ({ className }) => {
  const pathname = usePathname();

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
  return (
    <Row className={`${className} flex-col gap-1`}>
      {navItems.map(item => {
        const isActive = pathname === item.linkTo;
        const Icon = item.icon;
        return (
          <Link
            className={`font-body flex w-full items-center gap-3 rounded-sm px-4 py-2 text-sm transition-colors ${
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
  );
};

export default Navbar;
