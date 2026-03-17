import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Coins } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Row className="h-screen w-full flex-col md:flex-row items-center justify-between overflow-hidden">
      {/* Logo */}
      <div className="flex h-[250px] md:h-full w-full md:flex-1 flex-col items-center justify-center gap-1 md:gap-3 bg-[#F5F5DC]">
        <div className="bgSecondary relative flex size-16 items-center justify-center rounded-2xl border border-[#6F4E37]/30 backdrop-blur-md">
          <Coins className="size-8 text-[#F5F5DC]" />
        </div>

        <TextElement as="h1" className="text-4xl font-bold tracking-tight">
          Expenso
        </TextElement>

        <TextElement as="p" className="textSecondary text-sm tracking-wide">
          Expense & Income Management
        </TextElement>
      </div>

      <div className="h-full flex w-full md:w-[40%] px-4 md:p-0 items-center justify-center bg-[#D47E30]">
        {/* Card */}
        {children}
      </div>
    </Row>
  );
}
