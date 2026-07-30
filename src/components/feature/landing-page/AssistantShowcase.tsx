import Row from '@/components/common/Row';
import Reveal from '@/components/common/Reveal';
import AuroraGlow from '@/components/feature/landing-page/AuroraGlow';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Lock, Sparkles } from 'lucide-react';

interface IAssistantShowcaseProps {
  className?: string;
}

const AssistantShowcase: React.FC<IAssistantShowcaseProps> = ({
  className = '',
}) => {
  return (
    <Row
      className={`relative w-full flex-col justify-between gap-3 bg-[#0d1117] px-4 py-16 md:flex-row md:px-8 md:py-12 ${className}`}
    >
      {/* Grid texture */}
      <div className="fr-grid-bg pointer-events-none absolute inset-0" />

      {/* Glow orbs */}
      <AuroraGlow variant="warm" />

      <Reveal className="w-full md:w-[50%]">
        <Row className="w-full flex-col items-start gap-2">
          <Row className="gap-2">
            <div className="border-border flex size-9 items-center justify-center rounded-sm border-2 bg-[#f4f4f4]">
              ✨
            </div>

            {/* Heading */}
            <h2
              className="text-[clamp(22px,5vw,22px)] leading-[1.1] font-bold text-[#f4f4f4]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Financial
              <em
                className="text-gradient-green ml-2"
                style={{ fontStyle: 'italic' }}
              >
                Assistant
              </em>
            </h2>
          </Row>

          {/* Subtext */}
          <p className="inter my-2 max-w-[560px] text-[14px] leading-relaxed text-[#888]">
            Skip the filters and date pickers. Just ask — &quot;how much did I
            spend on food this month?&quot; — and get a straight answer, pulled
            from your own transactions.
          </p>

          <div className="space-x-1 md:space-x-2">
            {['Read-only', 'No manual filters', 'Instant answers'].map(item => (
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
      </Reveal>

      <Reveal delay={120} className="w-full md:w-[40%]">
        <Row className="w-full flex-col gap-1">
          <div className="border-border w-full space-y-2 rounded-md border bg-white p-3">
            <Row className="items-start justify-end gap-2">
              <div className="bg-primary/5 max-w-[75%] rounded-md px-3 py-2 text-sm text-[#0d1117]">
                Give me a breakdown of my expenses this month
              </div>
            </Row>

            <Row className="items-start gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Sparkles className="size-3" />
                </AvatarFallback>
              </Avatar>

              <div className="max-w-[80%] rounded-md bg-slate-100 px-3 py-2 text-sm text-[#0d1117]">
                <p className="mb-2">
                  Your total expenses for the current month are{' '}
                  <strong>71,957</strong>.
                </p>

                <table className="w-full overflow-hidden rounded-md border text-xs">
                  <thead>
                    <tr>
                      <th className="border-b p-1.5 text-left font-medium">
                        Category
                      </th>
                      <th className="border-b p-1.5 text-left font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Fuel', '33,143'],
                      ['Food', '11,000'],
                      ['Home', '5,000'],
                    ].map(([category, amount]) => (
                      <tr key={category}>
                        <td className="border-b p-1.5 last:border-0">
                          {category}
                        </td>
                        <td className="border-b p-1.5 last:border-0">
                          {amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>
          </div>

          <Row className="border-border flex w-full gap-2 rounded-md border bg-white px-3 py-2">
            <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
              <Lock className="shrink-no size-4 text-[#0d1117]" />
            </div>

            <Row className="flex-col items-start">
              <CardTitle className="text-sm text-[#0d1117]">
                Can&apos;t add, edit, or delete anything
              </CardTitle>

              <CardDescription className="text-xs text-[#5a6070]">
                Scoped to your data only · Refuses write requests, always
              </CardDescription>
            </Row>
          </Row>
        </Row>
      </Reveal>
    </Row>
  );
};

export default AssistantShowcase;
