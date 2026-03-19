import Row from '@/components/common/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarDays,
  ChartArea,
  LayoutDashboard,
  Lock,
  Target,
  Zap,
} from 'lucide-react';

/* eslint-disable react/no-unescaped-entities */
const Feature = () => {
  const allFeatures = [
    {
      title: 'Smart Categories',
      icon: LayoutDashboard,
      description:
        'Create your own income, expense, and investment categories that match your real life — not generic templates.',
    },
    {
      title: 'Quick Transactions',
      icon: Zap,
      description:
        'Log any transaction in seconds. Add amount, pick a category, set the date, and optionally add a note.',
    },
    {
      title: 'Visual Dashboard',
      icon: ChartArea,
      description:
        'See your income vs expenses vs investments at a glance with pie charts, bar graphs, and daily breakdowns.',
    },
    {
      title: 'Free Cash Tracking',
      icon: Target,
      description:
        'Always know your free cash — what is left after expenses and investments. Your real financial pulse.',
    },
    {
      title: 'Date Range Filters',
      icon: CalendarDays,
      description:
        'Filter any view by month and year. Compare March to February in two clicks. Your history, always accessible.',
    },
    {
      title: 'Secure & Private',
      icon: Lock,
      description:
        'Your financial data is yours alone. Secured with auth, stored privately — never shared, never sold.',
    },
  ];
  return (
    <section
      className="flex w-full flex-col items-center justify-between gap-3 bg-[#6D3B07] p-4 lg:p-8 lg:flex-row"
      id="features"
    >
      <Row className="w-full flex-col lg:w-[30%] lg:items-start">
        <span className="text-[12px] font-medium tracking-widest !text-green-500 uppercase md:text-[14px]">
          Features
        </span>

        <h2 className="section-title max-w-[560px] text-[28px] tracking-tighter text-white md:text-[36px]">
          Everything you need to
          <br />
          <em className="text-green-500 italic">understand your money</em>
        </h2>

        <p className="text-center text-[14px] font-extralight text-[#F5F5DC] md:text-start md:text-[16px]">
          Built around how people actually think about their finances — not how
          accountants do.
        </p>
      </Row>

      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:w-[60%]">
        {allFeatures.map(item => {
          const Icon = item.icon;
          return (
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" key={item.title}>
              <CardHeader>
                <CardTitle className="flex items-center text-[#6D3B07]">
                  <div className="mr-2 flex size-10 items-center justify-center rounded-lg shadow bg-[#F5F5DC]">
                    <Icon className="size-5 text-[#6D3B07]" />
                  </div>
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="">{item.description}</CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Feature;
