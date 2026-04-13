'use client';

import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import Link from 'next/link';
import PAGE_ROUTES from '../constants/page-routes.constant';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Row className="h-screen w-full flex-col items-center justify-between overflow-hidden md:flex-row">
      <div className="flex h-[100px] w-full flex-col items-center justify-center bg-white md:h-full md:flex-1">
        <Link href={PAGE_ROUTES.home}>
          <div className="md-w-[220px] relative h-[50px] w-[100px] md:h-[100px]">
            <Image
              src={'/dark-logo.png'}
              alt={`Logo`}
              fill
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>
        </Link>

        <TextElement
          as="p"
          className="text-xs tracking-tight text-[#5a6070] md:text-sm"
        >
          Expense, Income & Investment Management
        </TextElement>
      </div>

      <div className="flex h-full w-full items-center justify-center bg-[#0d1117] px-4 md:w-[60%] md:p-0 lg:w-[40%]">
        {/* Card */}
        {children}
      </div>
    </Row>
  );
}
