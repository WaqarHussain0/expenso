'use client';

import Row from '@/components/common/Row';
import { Coins } from 'lucide-react';

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`border-border flex w-full flex-col items-center justify-center gap-2 border-t py-4 md:flex-row md:gap-4 ${className}`}
    >
      <Row className="gap-1">
        <div className="relative flex size-8 items-center justify-center rounded-md border border-[#1a7f5a]/30 bg-[#1a7f5a] backdrop-blur-md">
          <Coins className="size-4 text-[#F5F5DC]" />
        </div>

        <p className="text-[18px] tracking-tighter">
          expen<em className="text-[#1a7f5a]">so</em>
        </p>
      </Row>

      <div className="text-sm text-[#5a6070]">
        © 2026 Expenso. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
