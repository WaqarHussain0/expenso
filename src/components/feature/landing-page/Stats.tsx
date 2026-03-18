import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

const Stats = () => {
  const items = [
    {
      id: 1,
      description:
        'Custom categories you can create to match your life exactly',
      title: '∞',
    },
    {
      id: 2,
      description: 'Average time to log a transaction and keep your data fresh',
      title: '5',
      subTitle: 's',
    },
    {
      id: 3,
      description: 'Cost to get started — completely free, no card required',
      title: '0',
      subTitle: 'Rs',
    },
  ];
  return (
    <div className="w-full bg-[#6D3B07] p-4">
      <span className="mb-3 text-[12px] font-medium tracking-widest !text-green-500 uppercase md:text-[14px]">
        Built for clarity
      </span>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {items.map(item => (
          <Card
            className="gap-0 rounded-none border-none bg-transparent p-0 shadow-none"
            key={item.id}
          >
            <CardHeader className="p-0">
              <div className="text-[52px] text-white">
                {item.title}
                {item.subTitle && (
                  <span className="text-[#D47E30]">{item.subTitle}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-[14px] text-[#F5F5DC]">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Stats;
