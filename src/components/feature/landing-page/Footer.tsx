'use client';

import Row from '@/components/common/Row';
import { Coins } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-border flex w-full flex-col items-center justify-center gap-2 border-t py-4 md:flex-row md:gap-4">
      <Row className="gap-1">
        <div className="relative flex size-8 items-center justify-center rounded-md border border-[#6F4E37]/30 bg-[#D47E30] backdrop-blur-md">
          <Coins className="size-4 text-[#F5F5DC]" />
        </div>

        <p className="text-[18px] tracking-tighter">
          expen<em className="text-[#D47E30]">so</em>
        </p>
      </Row>

      <div className="">© 2026 Expenso. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
