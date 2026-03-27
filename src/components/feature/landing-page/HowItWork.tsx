import Row from '@/components/common/Row';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HowItWork = () => {
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
    <>
      <section className="w-full flex flex-col justify-center items-center space-y-3 p-4 lg:p-8" id="how">
        <div className="flex flex-col items-center">
          <span className="text-[12px] font-medium tracking-widest text-green-500 uppercase">
            How it works
          </span>

          <h2 className="section-title text-center max-w-[560px] text-[28px] tracking-tighter md:text-[36px]">
            Up and running in
            <em className="ml-2 text-[#D47E30] italic">three steps</em>
          </h2>

          <CardDescription className='text-center'>
            No complicated setup. No onboarding calls. Just open it and go.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {steps.map(item => (
            <div
              key={item.number}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="step-num border-primary flex size-12 items-center justify-center rounded-full border-[2px] bg-white text-2xl font-bold">
                {item.number}
              </div>

              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HowItWork;
