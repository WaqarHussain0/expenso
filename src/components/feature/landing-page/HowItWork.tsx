import { CardDescription, CardTitle } from '@/components/ui/card';

interface IHowItWorkProps {
  className?: string;
}

const HowItWork: React.FC<IHowItWorkProps> = ({ className = '' }) => {
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
        'Every time money moves, add a transaction. Pick the category, enter the amount, set the date. Takes five seconds.',
    },
    {
      number: '03',
      label: 'Read your dashboard',
      description:
        'Open the dashboard and instantly see where your money went this month — broken down by category, date, and type.',
    },
  ];

  return (
    <section
      className={`flex w-full flex-col items-center justify-center space-y-3 p-4 lg:p-8 ${className}`}
      id="how"
    >
      <div className="flex flex-col items-center">
        <div className="text-[12px] font-medium tracking-widest text-[#1a7f5a] uppercase">
          How it works
        </div>

        <h2 className="max-w-[520px] text-[28px] font-bold tracking-tighter md:text-[36px]">
          Up and running in
          <em className="ml-2 text-[#1a7f5a] italic">three steps</em>
        </h2>

        <CardDescription className="text-center text-[#5a6070]">
          No complicated setup. No onboarding calls. Just open it and go.
        </CardDescription>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map(item => (
          <div
            key={item.number}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="step-num border-primary flex size-12 items-center justify-center rounded-full border-[2px] bg-white text-2xl font-bold">
              {item.number}
            </div>

            <CardTitle>{item.label}</CardTitle>
            <CardDescription className="text-[#5a6070]">
              {item.description}
            </CardDescription>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWork;
