'use client';

import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Coins } from 'lucide-react';
import Link from 'next/link';
import PAGE_ROUTES from '../constants/page-routes.constant';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Row className="h-screen w-full flex-col items-center justify-between overflow-hidden md:flex-row">
      {/* Logo */}
      <div className="flex h-[250px] w-full flex-col items-center justify-center gap-1 bg-[#F5F5DC] md:h-full md:flex-1">
        <div className="bgSecondary relative flex size-16 items-center justify-center rounded-2xl border border-[#6F4E37]/30 backdrop-blur-md">
          <Coins className="size-8 text-[#F5F5DC]" />
        </div>

        <Link href={PAGE_ROUTES.home}>
          <p className="text-[18px] tracking-tighter md:text-[32px]">
            expen<em className="text-[#D47E30]">so</em>
          </p>
        </Link>

        <TextElement as="p" className="textSecondary text-sm tracking-wide">
          Expense & Income Management
        </TextElement>
      </div>

      <div className="flex h-full w-full items-center justify-center bg-[#D47E30] px-4 md:w-[40%] md:p-0">
        {/* Card */}
        {children}
      </div>
    </Row>
  );
}
