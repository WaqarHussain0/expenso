'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Link from 'next/link';

const Nav = () => {
  const naviagtions = [
    { title: 'Features', href: '#features' },
    { title: 'How it works', href: '#how' },
  ];
  return (
    <nav className="border-border z-50 flex h-14 w-full items-center justify-between border-b px-4 md:h-16 md:px-12">
      <p className="text-[18px] tracking-tighter md:text-[22px]">
        expen<em className="text-[#D47E30]">so</em>
      </p>

      <div className="flex items-center gap-2 md:gap-4">
        {naviagtions.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[14px] font-light"
          >
            {item.title}
          </Link>
        ))}

        <Link
          href={PAGE_ROUTES.register}
          className="inline-block rounded-[8px] bg-[#6D3B07]/90 px-2 py-1 text-[14px] font-medium text-[#F5F5DC] transition-all duration-200 hover:bg-[#6D3B07] active:scale-95 md:px-5 md:py-2.25"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
