import Row from '@/components/common/Row';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Link, View } from 'lucide-react';

const ShareableStats = () => {
  return (
    <Row className="w-full flex-col justify-between gap-3 bg-slate-100 p-4 md:flex-row lg:p-8">
      <Row className="w-full flex-col items-start gap-2 md:w-[50%]">
        <div className="border-border flex size-10 items-center justify-center rounded-sm border-2">
          <Link className="size-5" />
        </div>
        <CardTitle>Shareable Stats Links</CardTitle>
        <CardDescription className="max-w-[560px]">
          Generate a public link to your stats page — filtered by month, year,
          or a custom date range — and share it with anyone. Your accountant,
          your partner, or just yourself on another device. No login needed to
          view.
        </CardDescription>

        <div className="space-x-2">
          {['By month', 'By year', 'Custom range'].map(item => (
            <Badge
              variant={'outline'}
              className="text-primary bg-white p-4"
              key={item}
            >
              {item}
            </Badge>
          ))}
        </div>
      </Row>

      <Row className="w-full flex-col gap-1 md:w-[40%]">
        <Row className="border-border w-full flex-col items-start gap-1 rounded-md border bg-white px-3 py-2">
          <p>Share this report</p>

          <div className="flex w-full items-center justify-between rounded-md bg-slate-100 px-2 py-1">
            <p className="text-sm">
              expenso.app/stats/share?m=03&y=2026&toke!2…
            </p>

            <Badge className="rounded-sm bg-white">Copy</Badge>
          </div>
        </Row>

        <Row className="border-border flex w-full gap-2 rounded-md border bg-white px-3 py-2">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
            <View className="shrink-no size-5" />
          </div>

          <Row className="flex-col items-start">
            <CardTitle>Anyone with the link can view</CardTitle>

            <CardDescription>
              Read-only · No account required · Revocable anytime
            </CardDescription>
          </Row>
        </Row>
      </Row>
    </Row>
  );
};

export default ShareableStats;
