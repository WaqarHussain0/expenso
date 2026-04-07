'use client';
import Image from 'next/image';

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`border-border flex w-full flex-col items-center justify-center gap-2 border-t py-4 md:flex-row md:gap-4 ${className}`}
    >
      <div className="relative h-[40px] w-[80px]">
        <Image
          src={'/dark-logo.png'}
          alt={`Logo`}
          fill
          className="object-contain"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="text-sm text-[#5a6070]">
        © 2026 Expenso. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
