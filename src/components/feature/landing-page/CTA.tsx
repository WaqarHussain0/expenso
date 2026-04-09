import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Link from 'next/link';

interface ICTAProps {
  className?: string;
}

const CTA: React.FC<ICTAProps> = ({ className = '' }) => {
  return (
    <section
      id="signup"
      className={`flex w-full flex-col items-center justify-center bg-[#0d1117] px-4 py-12 md:px-8 ${className}`}
    >
      <p className="rounded-full bg-[#FFFFFF1A] px-4 py-1 text-xs font-medium tracking-wider text-[#FFFFFFB3] uppercase">
        Free forever · No card needed
      </p>

      <h2 className="text-center text-[28px] text-white md:text-[36px]">
        Start tracking today.
        <br />
        <em className="text-[#2ea878]">Future you will thank you.</em>
      </h2>

      <p className="mt-3 text-center text-[14px] text-[#FFFFFF80] md:text-[16px]">
        Join Expenso and finally understand where your money goes every month.
        Setup takes 2 minutes.
      </p>

      <Link
        href={PAGE_ROUTES.register}
        className="my-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-[var(--ink)] no-underline shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] active:scale-95"
      >
        Create free account →
      </Link>

      <p className="text-sm text-[#FFFFFF4D]">
        No credit card · Ready in 2 min
      </p>
    </section>
  );
};

export default CTA;
