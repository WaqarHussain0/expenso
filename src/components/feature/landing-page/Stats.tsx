import { Card, CardDescription } from '@/components/ui/card';

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
      title: '5',
      subTitle: 's',
    },
    {
      id: 3,
      description: 'Cost to get started',
      title: '0',
      subTitle: 'Rs',
    },

    {
      id: 4,
      description: 'Setup time',
      title: '2',
      subTitle: 'm',
    },
  ];

  return (
    <div
      className={`border-border mt-4 flex w-[92%] flex-col justify-center rounded-full border bg-[#f7f8fa] p-4 lg:w-[70%] ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`items-center gap-0 rounded-none bg-transparent p-0 shadow-none ring-0 ${
              index !== items.length - 1 ? 'md:border-r-2' : 'border-r-0'
            }`}
          >
            <div className="text-[32px] text-[#0d1117] md:text-[52px]">
              {item.title}
              {item.subTitle && (
                <span className="text-[#1a7f5a]">{item.subTitle}</span>
              )}
            </div>
            <CardDescription className="text-center text-[12px] text-[#5a6070] md:text-[14px]">
              {item.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Stats;
