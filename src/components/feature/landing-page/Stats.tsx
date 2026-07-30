import { Card, CardDescription } from '@/components/ui/card';
import Reveal from '@/components/common/Reveal';
import CountUp from '@/components/common/CountUp';

interface IStatsProps {
  className?: string;
}

const Stats: React.FC<IStatsProps> = ({ className = '' }) => {
  const items = [
    {
      id: 1,
      description: 'Custom categories',
      title: '∞',
    },
    {
      id: 2,
      description: 'Average time to log a transaction',
      value: 5,
      suffix: 's',
    },
    {
      id: 3,
      description: 'Cost to get started',
      value: 0,
      suffix: 'Rs',
    },

    {
      id: 4,
      description: 'Setup time',
      value: 2,
      suffix: 'm',
    },
  ];

  return (
    <Reveal
      className={`border-border mt-4 flex w-[92%] flex-col justify-center rounded-2xl border bg-[#f7f8fa] p-4 lg:w-[70%] ${className}`}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-0">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`items-center gap-0 rounded-none bg-transparent p-0 shadow-none ring-0 transition-transform duration-300 hover:-translate-y-1 ${
              index !== items.length - 1 ? 'md:border-r-2' : 'border-r-0'
            }`}
          >
            <div className="text-[32px] text-[#0d1117] md:text-[52px]">
              {item.value !== undefined ? (
                <CountUp to={item.value} />
              ) : (
                item.title
              )}
              {item.suffix && (
                <span className="text-[#1a7f5a]">{item.suffix}</span>
              )}
            </div>
            <CardDescription className="text-center text-[12px] text-[#5a6070] md:text-[14px]">
              {item.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </Reveal>
  );
};
export default Stats;
