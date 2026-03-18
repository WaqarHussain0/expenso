'use client';

import Link from 'next/link';

const Nav = () => {
  const naviagtions = [
    { title: 'Features', href: '#features' },
    { title: 'How it works', href: '#how' },
  ];
  return (
    <nav className="border-border w-full z-50 flex h-14 md:h-16 items-center justify-between border-b px-4 md:px-12">
      <a href="#" className="text-[18px] md:text-[22px] tracking-tighter">
        expen<em className="text-[#D47E30]">so</em>
      </a>

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
          href="#signup"
          className="inline-block rounded-[8px] bg-[#6D3B07]/90 hover:bg-[#6D3B07] px-2 md:px-5 py-1 md:py-2.25 text-[14px] font-medium text-[#F5F5DC] transition-all duration-200  active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
