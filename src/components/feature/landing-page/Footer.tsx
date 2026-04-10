'use client';
import Image from 'next/image';

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`border-border flex w-full items-center justify-center gap-2 border-t py-4 md:gap-4 ${className}`}
    >
      <div className="relative h-[20px] w-[40px] md:h-[40px] md:w-[80px]">
        <Image
          src={'/dark-logo.png'}
          alt={`Logo`}
          fill
          className="object-contain"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="text-xs text-[#5a6070] md:text-sm">
        © 2026 Expenso. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
