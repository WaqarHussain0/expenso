import Row from '@/components/common/Row';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pricing = () => {
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
    <Row className="w-full my-3 justify-center bg-[#F5F5DC]">
      <Row className="w-full flex-col gap-3 md:gap-0 md:flex-row justify-between p-4 lg:p-8">
        <div className="flex w-full md:w-[55%] flex-col items-start gap-3">
          <span className="text-[12px] font-medium tracking-widest text-green-500 uppercase">
            Pricing
          </span>

          <h2 className="section-title max-w-[560px] text-center text-[28px] tracking-tighter md:text-[36px]">
            Completely free.
            <em className="ml-2 text-[#D47E30] italic">No tricks</em>
          </h2>

          <CardDescription className="max-w-[70%] text-center text-start">
            No freemium walls. No premium tiers. No credit card required.
            Expenso is free because everyone deserves to understand their
            finances.
          </CardDescription>

          <div className="mt-2 flex flex-col gap-2">
            {options.map(item => (
              <div key={item} className="flex items-center gap-1">
                <Check className="size-4 text-green-500" />

                <CardDescription>{item}</CardDescription>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full md:w-[40%] px-2 py-6">
          <CardHeader>
            <span className="text-[12px] font-medium tracking-widest text-green-500 uppercase">
              Free forever
            </span>

            <h2 className='text-6xl font-black'>0Rs</h2>

            <CardDescription>Cost to get started — and stay</CardDescription>

            <div className="flex flex-col gap-2 my-2 bg-slate-100 p-3 rounded-md">
              {accountOptions.map(item => (
                <div key={item} className="flex items-center gap-1">
                  <Check className="size-4 text-green-500" />
                  <CardDescription>{item}</CardDescription>
                </div>
              ))}
            </div>

            <Button className="">Create Free Account →</Button>
          </CardHeader>
        </Card>
      </Row>
    </Row>
  );
};

export default Pricing;
