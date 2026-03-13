import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Dumbbell } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Row className="relative min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950" />

      {/* Radial glow behind logo */}
      <div className="absolute top-32 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]" />

      {/* Floating gradient blobs */}
      <div className="absolute top-[-120px] left-[-120px] size-[320px] animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-120px] size-[320px] animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative flex w-full flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-40 blur-lg" />

            <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
              <Dumbbell className="size-8 text-white" />
            </div>
          </div>

          <TextElement
            as="h1"
            className="font-heading text-4xl font-bold tracking-tight text-white"
          >
            Expenso
          </TextElement>

          <TextElement as="p" className="text-sm tracking-wide text-white/70">
            Expense & Income Management
          </TextElement>
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-30 blur-2xl" />

          {/* Card */}
          <div className="relative rounded-lg border border-white/40 bg-white/95 p-2 shadow-2xl backdrop-blur-lg md:rounded-2xl md:p-4">
            {children}
          </div>
        </div>
      </div>
    </Row>
  );
}
