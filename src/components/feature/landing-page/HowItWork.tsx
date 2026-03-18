import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

  const stats = {
    title: 'March 2026 — Expense Breakdown',
    breadown: [
      {
        category: 'Shopping',
        bgColor: 'bg-red-400',
        amount: 52095,
        barWidth: 'w-[58%]',
      },
      {
        category: 'Home',
        bgColor: 'bg-orange-400',
        amount: 27843,
        barWidth: 'w-[31%]',
      },

      {
        category: 'Fuel',
        bgColor: 'bg-yellow-400',
        amount: 8980,
        barWidth: 'w-[10%]',
      },

      {
        category: 'Grocery',
        bgColor: 'bg-green-400',
        amount: 900,
        barWidth: 'w-[1%]',
      },
    ],

    total: 89818,
  };
  return (
    <section className="w-full space-y-3 p-4" id="how">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-[12px] font-medium tracking-widest text-[#D47E30] uppercase">
          How it works
        </span>

        <h2 className="section-title max-w-[560px] text-center md:text-left text-[28px] md:text-[36px] tracking-tighter">
          Up and running in
          <br />
          <em className="text-[#D47E30] italic">three steps</em>
        </h2>
      </div>

      <Row className="w-full flex-col justify-between items-start gap-2 md:flex-row">
        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 md:w-[60%]">
          {steps.map(item => (
            <Card key={item.number} className="lg:min-h-[203px]">
              <CardHeader>
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Row className="w-full md:w-[40%]">
          <Card className="w-full lg:min-h-[203px]">
            <CardHeader>
              <CardTitle>{stats.title}</CardTitle>
            </CardHeader>

            <CardContent>
              {stats.breadown.map(item => (
                <Row key={item.category} className="gap-3">
                  <div className={`size-3 rounded-full ${item.bgColor}`} />
                  <TextElement>{item.category}</TextElement>

                  <div className="h-1 flex-2 overflow-hidden rounded-[3px] bg-slate-200">
                    <div
                      className={`h-full rounded-[3px] ${item.bgColor} ${item.barWidth}`}
                    ></div>
                  </div>
                  <TextElement>{item.amount.toLocaleString()}</TextElement>
                </Row>
              ))}
            </CardContent>

            <CardFooter>
              Total Spent : {stats.total.toLocaleString()}
            </CardFooter>
          </Card>
        </Row>
      </Row>
    </section>
  );
};

export default HowItWork;
