import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface IPricingProps {
  className?: string;
}

const Pricing: React.FC<IPricingProps> = ({ className = '' }) => {
  const options = [
    'Unlimited categories — create as many as you need',
    'Unlimited transactions — log every rupee, always',
    'Full dashboard access — no locked charts or features',
    'Your data is private — never sold, never shared',
    'No subscription, no expiry, no hidden costs',
  ];

  const accountOptions = [
    'Unlimited categories',
    'Visual dashboard',
    'Date range filters',
    'Secure private storage',
  ];
  return (
    <Row className={`w-full justify-center bg-[#] ${className}`}>
      <Row className="w-full flex-col justify-between gap-3 p-4 md:flex-row md:gap-0 lg:p-8">
        <div className="flex w-full flex-col items-start gap-3 md:w-[55%]">
          <div className="text-[12px] font-medium tracking-widest text-[#1a7f5a] uppercase">
            Pricing
          </div>

          {/* Heading */}
          <h2
            className="mb-5 text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Completely free
            <br />
            <em className="text-[#2ea878]" style={{ fontStyle: 'italic' }}>
              No tricks.
            </em>
          </h2>

          <CardDescription className="max-w-[520px] text-start text-[#5a6070]">
            No freemium walls. No premium tiers. No credit card required.
            Expenso is free because everyone deserves to understand their
            finances.
          </CardDescription>

          <div className="mt-4 flex flex-col gap-2">
            {options.map(item => (
              <div key={item} className="flex items-center gap-1">
                <Check className="size-4 text-[#1a7f5a]" />

                <CardDescription className="text-[#5a6070]">
                  {item}
                </CardDescription>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full bg-[#f7f8fa] px-2 py-6 md:w-[40%]">
          <CardHeader>
            <div className="w-fit rounded-full bg-[#e6f5ef] px-3 py-1 text-[12px] font-medium tracking-widest text-[#1a7f5a] uppercase">
              ✓ Free forever
            </div>

            <h2 className="text-6xl font-black text-[#0d1117]">0Rs</h2>

            <CardDescription className="text-[#5a6070]">
              Cost to get started — and stay
            </CardDescription>

            <div className="my-2 flex flex-col gap-2 rounded-md bg-[#eef0f4] p-3">
              {accountOptions.map(item => (
                <div key={item} className="flex items-center gap-1">
                  <Check className="size-4 text-[#1a7f5a]" />
                  <CardDescription className="text-[#5a6070]">
                    {item}
                  </CardDescription>
                </div>
              ))}
            </div>

            <Link
              href={PAGE_ROUTES.register}
              className="inline-flex w-fit items-center gap-[8px] rounded-full bg-[#0d1117] px-6 py-3 text-[15px] font-medium text-white no-underline shadow-[0_4px_20px_rgba(13,17,23,0.25)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(13,17,23,0.3)]"
            >
              Create Free Account →
            </Link>
          </CardHeader>
        </Card>
      </Row>
    </Row>
  );
};

export default Pricing;
