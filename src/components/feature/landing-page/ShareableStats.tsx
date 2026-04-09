import Row from '@/components/common/Row';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { View } from 'lucide-react';

interface IShareableStatsProps {
  className?: string;
}

const ShareableStats: React.FC<IShareableStatsProps> = ({ className = '' }) => {
  return (
    <Row
      className={`w-full flex-col justify-between gap-3 bg-slate-100 p-4 md:flex-row lg:p-8 ${className}`}
    >
      <Row className="w-full flex-col items-start gap-2 md:w-[50%]">

        <Row className='gap-2'>

        <div className="border-border flex size-10 items-center justify-center rounded-sm border-2 bg-[#e6f5ef]">
          🔗
        </div>

        <CardTitle className="text-[#0d1117]">Shareable Stats Links</CardTitle>
        </ Row>

        <CardDescription className="max-w-[560px] text-[#5a6070]">
          Generate a public link to your stats page — filtered by month, year,
          or a custom date range — and share it with anyone. Your accountant,
          your partner, or just yourself on another device. No login needed to
          view.
        </CardDescription>

        <div className="space-x-1 md:space-x-2">
          {['By month', 'By year', 'Custom range'].map(item => (
            <Badge
              variant={'outline'}
              className="bg-white p-4 text-[#1a7f5a]"
              key={item}
            >
              {item}
            </Badge>
          ))}
        </div>
      </Row>

      <Row className="w-full flex-col gap-1 md:w-[40%]">
        <Row className="border-border w-full flex-col items-start gap-1 rounded-md border bg-white px-3 py-2">
          <p className="text-xs text-[#9ba3af] uppercase">Share this report</p>

          <div className="flex w-full items-center justify-between rounded-md bg-slate-100 px-2 py-1">
            <p className="text-sm text-[#1a7f5a]">
              expenso-pi.vercel.app/share?m=032026!skndkfsd!2…
            </p>

            <Badge className="rounded-sm bg-white">Copy</Badge>
          </div>
        </Row>

        <Row className="border-border flex w-full gap-2 rounded-md border bg-white px-3 py-2">
          <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
            <View className="shrink-no size-4 text-[#0d1117]" />
          </div>

          <Row className="flex-col items-start">
            <CardTitle className="text-sm text-[#0d1117]">
              Anyone with the link can view
            </CardTitle>

            <CardDescription className="text-xs text-[#5a6070]">
              Read-only · No account required · Revocable anytime
            </CardDescription>
          </Row>
        </Row>
      </Row>
    </Row>
  );
};

export default ShareableStats;
