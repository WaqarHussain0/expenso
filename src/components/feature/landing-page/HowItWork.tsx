import { CardDescription } from '@/components/ui/card';
import Reveal from '@/components/common/Reveal';
import CountUp from '@/components/common/CountUp';

interface IHowItWorkProps {
  className?: string;
}

const steps = [
  {
    number: '01',
    label: 'Create your categories',
    description:
      'Set up categories that match your life — Monthly Salary, Rent, Groceries, SIP Investment. Label each as income, expense, or investment.',
  },
  {
    number: '02',
    label: 'Log your transactions',
    description:
      "Got paid? Log it. Paid rent? Log it. The habit takes a week to build. After that, it's automatic.",
  },
  {
    number: '03',
    label: 'Read your dashboard',
    description:
      'Open the dashboard and instantly see where your money went this month — broken down by category, date, and type.',
  },
];

const categories = [
  { name: 'Rent', value: '25,000', percent: 45, color: '#1a7f5a' },
  { name: 'Groceries', value: '14,500', percent: 26, color: '#2ea878' },
  { name: 'Fuel', value: '9,200', percent: 17, color: '#60c99a' },
  { name: 'SIP Investment', value: '6,800', percent: 12, color: '#a7ddc4' },
];

const HowItWork: React.FC<IHowItWorkProps> = ({ className = '' }) => {
  return (
    <section
      className={`flex w-full flex-col items-center justify-center gap-8 p-4 lg:p-8 ${className}`}
      id="how"
    >
      <Reveal className="flex flex-col items-center">
        <div className="text-[12px] font-medium tracking-widest text-[#1a7f5a] uppercase">
          How it works
        </div>

        {/* Heading */}
        <h2
          className="mb-5 text-center text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Up and running in
          <br />
          <em className="text-gradient-green" style={{ fontStyle: 'italic' }}>
            three steps
          </em>
        </h2>

        <CardDescription className="text-center text-[#5a6070]">
          No complicated setup. No onboarding calls. Just open it and go.
        </CardDescription>
      </Reveal>

      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <Reveal delay={80} className="flex flex-col">
          {steps.map(item => (
            <div
              key={item.number}
              className="group border-border flex gap-6 border-b py-7 last:border-none"
            >
              <div
                className="text-border min-w-[52px] text-[42px] leading-none font-bold transition-colors duration-300 group-hover:text-[#1a7f5a]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {item.number}
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <p className="poppins text-[17px] font-semibold text-[#0d1117]">
                  {item.label}
                </p>
                <CardDescription className="text-[#5a6070]">
                  {item.description}
                </CardDescription>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal
          delay={160}
          className="border-border w-full rounded-2xl border bg-white p-6 shadow-[0_16px_48px_rgba(15,20,16,0.08)]"
        >
          <div className="mb-5 text-[11px] font-semibold tracking-widest text-[#9ba3af] uppercase">
            This month&apos;s breakdown
          </div>

          <div className="flex flex-col gap-3.5">
            {categories.map(category => (
              <div key={category.name} className="flex items-center gap-3">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: category.color }}
                />
                <span className="w-[110px] shrink-0 text-[13px] text-[#5a6070]">
                  {category.name}
                </span>
                <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${category.percent}%`,
                      background: category.color,
                    }}
                  />
                </div>
                <span className="w-[64px] shrink-0 text-right text-[13px] font-medium text-[#0d1117]">
                  {category.value}
                </span>
              </div>
            ))}
          </div>

          <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-[12px] text-[#9ba3af]">Total spent</span>
            <CountUp
              to={55500}
              className="text-[26px] text-[#0d1117]"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HowItWork;
