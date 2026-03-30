'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { IUser } from '@/types/user.type';
import Link from 'next/link';

interface INavProps {
  className?: string;
  user?: IUser;
}

const Nav: React.FC<INavProps> = ({ className = '', user }) => {
  const naviagtions = [
    { title: 'Features', href: '#features' },
    { title: 'How it works', href: '#how' },
  ];
  return (
    <nav
      className={`border-border z-50 flex h-14 w-full items-center justify-between border-b px-4 md:h-16 md:px-12 ${className}`}
    >
      <p className="text-[18px] tracking-tighter md:text-[22px]">
        expen<em className="text-[#1a7f5a]">so</em>
      </p>

      <div className="flex items-center gap-2 md:gap-4">
        {naviagtions.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-light text-[#5a6070]"
          >
            {item.title}
          </Link>
        ))}

        <Link
          href={user ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
          className="inline-flex w-fit items-center rounded-full bg-[#1a7f5a] px-4 py-1 font-medium text-white no-underline shadow-[0_4px_5px_rgba(13,17,23,0.25)] transition-all duration-200 hover:-translate-y-[1px] md:px-8 md:py-2"

          // className="inline-block rounded-full bg-[#1a7f5a]/90 px-2 py-1 text-[14px] font-medium text-[#F5F5DC] transition-all duration-200 hover:bg-[#1a7f5a] active:scale-95 md:px-5 md:py-2.25"
        >
          {user ? 'My Portfolio' : 'Get Started'}
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
