import Row from '@/components/common/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ChartArea, Lock, Tags, Target, Zap } from 'lucide-react';

/* eslint-disable react/no-unescaped-entities */

interface IFeatureProps {
  className?: string;
}

const Feature: React.FC<IFeatureProps> = ({ className = '' }) => {
  const allFeatures = [
    {
      title: 'Visual Dashboard',
      icon: ChartArea,
      description:
        'See your income vs expenses vs investments at a glance with pie charts, bar graphs, and daily breakdowns.',
    },
    {
      title: 'Smart Categories',
      icon: Tags,
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
      className={`flex w-full flex-col items-center justify-between gap-3 p-4 lg:flex-row lg:p-8 ${className}`}
      id="features"
    >
      <Row className="w-full flex-col lg:w-[30%] lg:items-start">
        <div className="text-[12px] font-medium tracking-widest text-[#1a7f5a] uppercase">
          Features
        </div>

        {/* Heading */}
        <h2
          className="mb-5 text-[clamp(28px,5vw,52px)] leading-[1.1] font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Everything you need to
          <br />
          <em className="text-[#2ea878]" style={{ fontStyle: 'italic' }}>
            understand your money
          </em>
        </h2>

        <p className="text-center text-[14px] font-extralight text-[#5a6070] md:text-start md:text-[16px]">
          Built around how people actually think about their finances — not how
          accountants do.
        </p>
      </Row>

      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:w-[60%]">
        {allFeatures.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              className={`px-2 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${index === 0 ? 'bg-[#0d1117]' : 'bg-[#f7f8fa]'}`}
              key={item.title}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center ${index === 0 ? 'text-white' : 'text-[#0d1117]'}`}
                >
                  <div className="mr-2 flex size-9 items-center justify-center rounded-md bg-white shadow md:size-10 md:rounded-lg">
                    <Icon className="shrink-no size-4 text-[#1a7f5a] md:size-5" />
                  </div>
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent
                className={` ${index === 0 ? 'text-[#dededf]' : 'text-[#5a6070]'}`}
              >
                {item.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Feature;
